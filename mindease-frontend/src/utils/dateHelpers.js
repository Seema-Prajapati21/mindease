export const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDateDisplay = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  const date = new Date(year, parseInt(month, 10) - 1, day);
  return date.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  });
};

export const getGreeting = (name = '') => {
  const hour = new Date().getHours();
  let timeStr = 'evening';
  if (hour < 12) {
    timeStr = 'morning';
  } else if (hour < 17) {
    timeStr = 'afternoon';
  }
  return name ? `Good ${timeStr}, ${name}.` : `Good ${timeStr}.`;
};

export const getLastNDays = (n = 30) => {
  const dates = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
  }
  return dates;
};
