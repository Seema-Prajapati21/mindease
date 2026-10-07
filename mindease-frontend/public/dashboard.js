let trendChartInstance = null;
let doughnutChartInstance = null;

function loadDashboardData() {
  const user = JSON.parse(localStorage.getItem("currentUser") || "null");
  if (!user || !user.email) return;

  fetch(`/api/mood/history?email=${encodeURIComponent(user.email)}`)
    .then((res) => res.json())
    .then((logs) => {
      renderDashboard(logs);
    })
    .catch((err) => console.error("Error loading dashboard logs:", err));
}

function renderDashboard(logs) {
  // Destroy old charts to prevent 'Canvas already in use' errors
  if (trendChartInstance) {
    trendChartInstance.destroy();
    trendChartInstance = null;
  }
  if (doughnutChartInstance) {
    doughnutChartInstance.destroy();
    doughnutChartInstance = null;
  }

  const container = document.getElementById("charts-container");
  const emptyState = document.getElementById("empty-state-card");

  if (!logs || logs.length === 0) {
    if (container) container.classList.add("hidden");
    if (emptyState) emptyState.classList.remove("hidden");
    updateMetricCards(0, "None", "0.0");
    return;
  }

  if (container) container.classList.remove("hidden");
  if (emptyState) emptyState.classList.add("hidden");

  // Sort logs chronologically
  const sortedLogs = [...logs].sort((a, b) => (a.loggedDate || "").localeCompare(b.loggedDate || ""));

  // Compute Metrics
  const streak = calculateStreak(logs);
  const avgIntensity = (logs.reduce((acc, l) => acc + (l.intensity || 5), 0) / logs.length).toFixed(1);
  const dominantMood = calculateDominantMood(logs);
  updateMetricCards(streak, dominantMood, avgIntensity);

  // 7-Day Trend Chart
  const recent7 = sortedLogs.slice(-7);
  const chartData = recent7.map((log) => ({
    x: log.loggedDate || "Today",
    y: log.intensity || 5,
    mood: log.confirmedMood || "Neutral",
  }));

  const moodColors = {
    Happy: "#f59e0b",
    Calm: "#3b82f6",
    Anxious: "#f97316",
    Overwhelmed: "#8b5cf6",
    Sad: "#64748b",
    Exhausted: "#6b7280",
    Angry: "#ef4444",
    Neutral: "#94a3b8",
  };

  const trendCanvas = document.getElementById("trendChart");
  if (trendCanvas) {
    trendChartInstance = new Chart(trendCanvas.getContext("2d"), {
      type: "line",
      data: {
        labels: chartData.map((d) => d.x),
        datasets: [
          {
            label: "Intensity (1-10)",
            data: chartData,
            borderColor: "#6366f1",
            borderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBackgroundColor: chartData.map((d) => moodColors[d.mood] || "#6366f1"),
            parsing: { xAxisKey: "x", yAxisKey: "y" },
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { min: 1, max: 10, ticks: { stepSize: 1 } },
          x: { type: "category" },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.raw.mood} • Intensity: ${ctx.raw.y}/10`,
            },
          },
        },
      },
    });
  }

  // Doughnut Chart
  const counts = {};
  logs.forEach((l) => {
    const m = l.confirmedMood || "Neutral";
    counts[m] = (counts[m] || 0) + 1;
  });

  const doughnutCanvas = document.getElementById("doughnutChart");
  if (doughnutCanvas) {
    doughnutChartInstance = new Chart(doughnutCanvas.getContext("2d"), {
      type: "doughnut",
      data: {
        labels: Object.keys(counts),
        datasets: [
          {
            data: Object.values(counts),
            backgroundColor: Object.keys(counts).map((m) => moodColors[m] || "#94a3b8"),
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });
  }

  // Render Timeline Cards
  renderTimeline(logs);
}

function updateMetricCards(streak, dominant, avg) {
  const elStreak = document.getElementById("metric-streak");
  if (elStreak) elStreak.textContent = `${streak} Days 🔥`;
  const elDom = document.getElementById("metric-dominant");
  if (elDom) elDom.textContent = dominant;
  const elAvg = document.getElementById("metric-avg");
  if (elAvg) elAvg.textContent = `${avg} / 10`;
}

function calculateDominantMood(logs) {
  const counts = {};
  logs.forEach((l) => {
    const m = l.confirmedMood || "Neutral";
    counts[m] = (counts[m] || 0) + 1;
  });
  return Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0] || "None";
}

function calculateStreak(logs) {
  if (!logs || logs.length === 0) return 0;
  const dateSet = new Set(logs.map((l) => l.loggedDate));
  let streak = 0;
  let curr = new Date();
  const toYMD = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  let checkStr = toYMD(curr);
  if (!dateSet.has(checkStr)) {
    curr.setDate(curr.getDate() - 1);
    checkStr = toYMD(curr);
    if (!dateSet.has(checkStr)) return 0;
  }
  while (dateSet.has(checkStr)) {
    streak++;
    curr.setDate(curr.getDate() - 1);
    checkStr = toYMD(curr);
  }
  return streak;
}

function renderTimeline(logs) {
  const timeline = document.getElementById("history-timeline");
  if (!timeline) return;
  timeline.innerHTML = "";
  logs.forEach((log) => {
    const card = document.createElement("div");
    card.className = "history-card";
    card.innerHTML = `
      <div class="card-header">
        <span class="date-badge">${log.loggedDate || "Today"}</span>
        <span class="mood-badge">${log.confirmedMood || "Logged"} • ${log.intensity || 5}/10</span>
      </div>
      <p class="ai-summary">${log.aiSummary || "Check-in completed."}</p>
      ${log.journalNote ? `<p class="journal-quote">"${log.journalNote}"</p>` : ""}
    `;
    timeline.appendChild(card);
  });
}

// Demo seeder caller
function seedDemoData() {
  const user = JSON.parse(localStorage.getItem("currentUser") || "null");
  if (!user || !user.email) return;

  fetch(`/api/mood/demo-seed?email=${encodeURIComponent(user.email)}`, { method: "POST" })
    .then((res) => res.json())
    .then(() => {
      loadDashboardData();
    })
    .catch((err) => console.error("Error seeding:", err));
}

// On document load
document.addEventListener("DOMContentLoaded", () => {
  loadDashboardData();
});
