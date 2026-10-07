import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { moodApi } from '../api/moodApi';
import { addMockEntry } from '../data/mockMoodEntries';
import { getTodayDateString } from '../utils/dateHelpers';

// Default baseline questions for instant preview / offline fallback
const DEFAULT_QUESTIONS = [
  {
    id: 'q_body_01',
    category: 'body',
    categoryLabel: 'Body Category',
    question: 'What’s your energy battery at right now?',
    options: [
      { id: 'q_body_01_opt1', label: '80–100% — fully charged' },
      { id: 'q_body_01_opt2', label: '50–70% — steady pace' },
      { id: 'q_body_01_opt3', label: '20–40% — running on low' },
      { id: 'q_body_01_opt4', label: 'Red — about to shut down' },
      { id: 'skip', label: 'Skip / Not sure' },
    ],
  },
  {
    id: 'q_mind_01',
    category: 'mind',
    categoryLabel: 'Mind Category',
    question: 'What’s the tempo of your thoughts?',
    options: [
      { id: 'q_mind_01_opt1', label: 'Smooth, quiet, and clear' },
      { id: 'q_mind_01_opt2', label: 'Racing at 100 mph' },
      { id: 'q_mind_01_opt3', label: 'Looping over the same worry' },
      { id: 'q_mind_01_opt4', label: 'Foggy, blank, and slow' },
      { id: 'skip', label: 'Skip / Not sure' },
    ],
  },
  {
    id: 'q_met_01',
    category: 'metaphor',
    categoryLabel: 'Metaphor / Social / Needs / Self Category',
    question: 'If today were weather, what would it be?',
    options: [
      { id: 'q_met_01_opt1', label: 'Clear bright sunshine' },
      { id: 'q_met_01_opt2', label: 'Gentle autumn breeze' },
      { id: 'q_met_01_opt3', label: 'Overcast and foggy' },
      { id: 'q_met_01_opt4', label: 'Passing thunderstorm' },
      { id: 'skip', label: 'Skip / Not sure' },
    ],
  },
];

// Manual emotion grid: Happy, Calm, Anxious, Sad, Overwhelmed, Angry, Exhausted
const MANUAL_EMOTIONS = [
  { label: 'Happy', emoji: '😊', color: '#F4C95D' },
  { label: 'Calm', emoji: '🌊', color: '#8ECAE6' },
  { label: 'Anxious', emoji: '😰', color: '#B8A4C9' },
  { label: 'Sad', emoji: '😔', color: '#7B8DB0' },
  { label: 'Overwhelmed', emoji: '😵', color: '#8B5E83' },
  { label: 'Angry', emoji: '😠', color: '#C97B6E' },
  { label: 'Exhausted', emoji: '🥱', color: '#8A8A8A' },
];

const LogMood = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Load currentUser from localStorage or AuthContext
  const getCurrentUser = () => {
    try {
      const stored = localStorage.getItem('currentUser');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // Ignore JSON parse error
    }
    return user || {
      name: 'Friend',
      email: 'user@example.com',
      age: 22,
      ageGroup: 'young_adult',
      profession: 'Student',
    };
  };

  const [currentUser, setCurrentUser] = useState(getCurrentUser);
  const [questions, setQuestions] = useState(DEFAULT_QUESTIONS);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  // Wizard steps:
  // 1: Q1 (Body)
  // 2: Q2 (Mind)
  // 3: Q3 (Metaphor/Social/Needs/Self)
  // 4: Micro-Journal Note
  // 5: AI Mood Detection & Confirmation
  // 6: Intensity Slider (1–10)
  // 7: Completion Screen
  const [currentStep, setCurrentStep] = useState(1);

  // Selected options: stores { optionId, label } for index 0, 1, 2
  const [answers, setAnswers] = useState({
    0: null,
    1: null,
    2: null,
  });

  // Micro-journal text (max 200 chars)
  const [journalText, setJournalText] = useState('');

  // AI Detection State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedMood, setDetectedMood] = useState('Calm');
  const [detectedSummary, setDetectedSummary] = useState('');
  const [detectedSuggestions, setDetectedSuggestions] = useState([]);

  // Confirmation & Overrides
  const [wasDetectionAccurate, setWasDetectionAccurate] = useState(true);
  const [isManualSelecting, setIsManualSelecting] = useState(false);
  const [finalMood, setFinalMood] = useState('Calm');
  const [customMoodInput, setCustomMoodInput] = useState('');

  // Intensity (1 to 10)
  const [intensity, setIntensity] = useState(5);

  // Fetch daily 3 questions on load
  const abortControllerRef = React.useRef(null);

  const fetchQuestions = async () => {
    setLoadingQuestions(true);
    const userProfile = getCurrentUser();
    setCurrentUser(userProfile);

    let lastSeenIds = [];
    try {
      const raw = localStorage.getItem('lastSeenQuestionIds');
      if (raw) lastSeenIds = JSON.parse(raw);
    } catch (e) {}

    try {
      const fetched = await moodApi.getQuestions(userProfile.ageGroup || 'young_adult', lastSeenIds);
      if (Array.isArray(fetched) && fetched.length === 3) {
        // Format questions with category labels and ensure skip option is present
        const formatted = fetched.map((q) => {
          let catLabel = 'Question Category';
          if (q.category === 'body') catLabel = 'Body Category';
          else if (q.category === 'mind') catLabel = 'Mind Category';
          else catLabel = 'Metaphor / Social / Needs / Self Category';

          let opts = [...(q.options || [])];
          if (!opts.some((o) => o.id === 'skip')) {
            opts.push({ id: 'skip', label: 'Skip / Not sure' });
          }
          return {
            ...q,
            categoryLabel: catLabel,
            options: opts,
          };
        });
        setQuestions(formatted);
      } else {
        setQuestions(DEFAULT_QUESTIONS);
      }
    } catch (err) {
      console.warn('Using baseline question pool:', err.message);
      setQuestions(DEFAULT_QUESTIONS);
    } finally {
      setLoadingQuestions(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Intensity labels:
  // 1–3: "Mild / Subtle"
  // 4–7: "Moderate / Noticeable"
  // 8–10: "Intense / Deeply felt"
  const getIntensityLabel = (val) => {
    if (val <= 3) return 'Mild / Subtle';
    if (val <= 7) return 'Moderate / Noticeable';
    return 'Intense / Deeply felt';
  };

  const getIntensityColor = (val) => {
    if (val <= 3) return '#8FA68E'; // soft sage
    if (val <= 7) return '#E0A96D'; // warm amber
    return '#C97B6E'; // terracotta
  };

  // Step 4 -> 5: Trigger AI Mood Detection
  const triggerAiDetection = async () => {
    setCurrentStep(5);
    setIsAnalyzing(true);

    const answersDtoList = questions.map((q, idx) => {
      const selected = answers[idx];
      return {
        questionId: q.id,
        questionText: q.question,
        selectedOptionId: selected?.id || 'skip',
        selectedOptionLabel: selected?.label || 'Skip / Not sure',
      };
    });

    const payload = {
      age: currentUser.age || 22,
      profession: currentUser.profession || 'Student',
      ageGroup: currentUser.ageGroup || 'young_adult',
      answers: answersDtoList,
      note: journalText,
    };

    try {
      const result = await moodApi.analyzeMood(payload);
      const mood = result.detectedMood || 'Calm';
      const summary = result.summary || 'You seem to be holding a steady, calm rhythm today.';
      const suggestions = result.suggestions && result.suggestions.length > 0
        ? result.suggestions
        : ['Take a slow pause to breathe.', 'Stay hydrated and listen to your body.'];

      setDetectedMood(mood);
      setFinalMood(mood);
      setDetectedSummary(summary);
      setDetectedSuggestions(suggestions);
      setWasDetectionAccurate(true);
    } catch (err) {
      console.warn('API analysis fallback triggered:', err.message);
      // Local heuristic fallback
      const q0 = answers[0]?.label || '';
      const q1 = answers[1]?.label || '';
      const q2 = answers[2]?.label || '';
      const text = journalText.toLowerCase();

      let mood = 'Calm';
      let summary = 'There is a steady stillness in your rhythm right now. Moments like this offer space to ground and recharge.';
      let suggestions = [
        'Soak in this quiet ease for a few mindful moments.',
        'Enjoy a cup of warm tea or a favorite gentle song.',
      ];

      if (
        q0.includes('shut down') ||
        q0.includes('running on low') ||
        q1.includes('Racing') ||
        q2.includes('thunderstorm') ||
        text.includes('overwhelmed') ||
        text.includes('too much')
      ) {
        if (q1.includes('Racing') || q2.includes('thunderstorm') || text.includes('stress')) {
          mood = 'Overwhelmed';
          summary = 'It looks like your thoughts are running faster than your energy can keep up today. Giving yourself permission to pause can bring some quiet relief.';
          suggestions = [
            'Step away from screens for 10 minutes and take a short walk.',
            'Pick just one small priority for today; let the rest wait.',
          ];
        } else {
          mood = 'Exhausted';
          summary = 'Your system is gently signaling that it has carried a heavy load today. Deep rest without guilt is what you deserve tonight.';
          suggestions = [
            'Dim the lights and sip some warm water or soothing tea.',
            'Allow non-urgent tasks to roll over into tomorrow.',
          ];
        }
      } else if (q1.includes('Looping') || q1.includes('Racing') || text.includes('worry') || text.includes('anxious')) {
        mood = 'Anxious';
        summary = 'Your mind seems to be holding tight to worries that want your attention. A few slow, extended exhales can signal safety to your nervous system.';
        suggestions = [
          'Try the 4-7-8 breathing circle for 2 minutes to calm physical tension.',
          'Write down the worries on paper to get them out of your head.',
        ];
      } else if (q1.includes('Foggy') || q2.includes('Overcast') || text.includes('sad') || text.includes('lonely')) {
        mood = 'Sad';
        summary = 'Today carried some gray skies and quiet weight. It is completely okay to move at a slower tempo and treat yourself with extra gentleness.';
        suggestions = [
          'Wrap yourself in a comfortable blanket and allow yourself to simply be.',
          'Reach out to someone who makes you feel safe, or listen to familiar music.',
        ];
      } else if (q0.includes('80–100%') || q2.includes('sunshine') || text.includes('happy') || text.includes('great')) {
        mood = 'Happy';
        summary = 'A vibrant lightness is present in your day today. Celebrate the warmth and carry this buoyant energy forward.';
        suggestions = [
          'Take a moment to savor what went well today in your mental scrapbook.',
          'Share a kind word or smile with a friend or colleague.',
        ];
      }

      setDetectedMood(mood);
      setFinalMood(mood);
      setDetectedSummary(summary);
      setDetectedSuggestions(suggestions);
      setWasDetectionAccurate(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Step 5: User confirms detected mood
  const handleConfirmDetected = () => {
    setWasDetectionAccurate(true);
    setIsManualSelecting(false);
    setCurrentStep(6);
  };

  // Step 5: User overrides detected mood
  const handleSelectManualMood = (moodLabel) => {
    setFinalMood(moodLabel);
    setWasDetectionAccurate(false);
    setIsManualSelecting(false);
    setCurrentStep(6);
  };

  const handleCustomMoodSubmit = (e) => {
    e.preventDefault();
    if (customMoodInput.trim()) {
      setFinalMood(customMoodInput.trim());
      setWasDetectionAccurate(false);
      setIsManualSelecting(false);
      setCurrentStep(6);
    }
  };

  // Step 6 -> Step 7: Persist Check-In
  const handleFinishCheckin = async () => {
    setCurrentStep(7);

    // Save the 3 question IDs to localStorage
    const questionIds = questions.map((q) => q.id);
    localStorage.setItem('lastSeenQuestionIds', JSON.stringify(questionIds));

    const answerLabels = [
      answers[0]?.label || 'Skip / Not sure',
      answers[1]?.label || 'Skip / Not sure',
      answers[2]?.label || 'Skip / Not sure',
    ];

    const userEmail = currentUser.email || user?.email || 'user@example.com';

    // Build payload matching com.moodtracker.model.MoodEntry
    const savePayload = {
      userEmail,
      detectedMood,
      confirmedMood: finalMood,
      wasDetectionAccurate,
      intensity,
      answers: answerLabels,
      journalNote: journalText,
    };

    // Also build local history entry
    const localEntry = {
      ...savePayload,
      date: getTodayDateString(),
      timestamp: new Date().toISOString(),
      emotion: finalMood.toLowerCase(),
      bodyFeel: answerLabels[0],
      mindText: journalText || answerLabels[1],
    };

    // Save to user's local history in localStorage
    try {
      const historyKey = `mood_history_${userEmail}`;
      const existingHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
      existingHistory.unshift(localEntry);
      localStorage.setItem(historyKey, JSON.stringify(existingHistory));
    } catch (e) {
      console.warn('Could not cache local history:', e);
    }

    // Save to mock entries for instant dashboard preview
    addMockEntry(user?.id, {
      date: getTodayDateString(),
      bodyFeel: answerLabels[0],
      mindText: journalText || answerLabels[1],
      branchId: '3q_wizard',
      branchAnswer: answerLabels[2],
      aiAnswer: detectedSummary,
      emotion: finalMood.toLowerCase(),
      intensity,
      tags: [],
      journalNote: journalText,
      suggestedEmotion: detectedMood.toLowerCase(),
      wasOverridden: !wasDetectionAccurate,
    });

    // Call POST /api/mood/save
    try {
      await moodApi.saveMood(savePayload);
    } catch (err) {
      console.info('Entry saved locally in workspace.');
    }
  };

  // Restart wizard safely
  const handleRestart = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setAnswers({ 0: null, 1: null, 2: null });
    setJournalText('');
    setCustomMoodInput('');
    setIsManualSelecting(false);
    setIntensity(5);
    setConfirmedMood('Calm');
    setDetectedMood('Calm');
    setWasDetectionAccurate(true);
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchQuestions();
  };

  const currentQ = questions[currentStep - 1] || DEFAULT_QUESTIONS[0];

  return (
    <div className="container py-4 fade-in">
      <div className="row justify-content-center">
        <div className="col-12 col-md-9 col-lg-7">

          {/* Progress Indicator (Steps 1 to 6) */}
          {currentStep < 7 && (
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="small text-muted">
                  {currentStep <= 3 && `Question ${currentStep} of 3`}
                  {currentStep === 4 && 'Reflect (Optional)'}
                  {currentStep === 5 && 'Mood Discovery'}
                  {currentStep === 6 && 'Intensity'}
                </span>
                <span className="small text-muted">Check-In Wizard</span>
              </div>
              <div className="progress" style={{ height: '6px', backgroundColor: '#EDE7DD' }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: `${(currentStep / 6) * 100}%`,
                    backgroundColor: 'var(--me-primary)',
                    transition: 'width 0.4s ease',
                  }}
                  aria-valuenow={(currentStep / 6) * 100}
                  aria-valuemin="0"
                  aria-valuemax="100"
                />
              </div>
            </div>
          )}

          {/* =========================================================================
              PART B.1: Exactly 3 Questions per Check-In (Steps 1, 2, 3)
             ========================================================================= */}
          {currentStep >= 1 && currentStep <= 3 && (
            <div className="me-card p-4 p-md-5 fade-in">
              <span
                className="badge mb-2 px-3 py-1"
                style={{ backgroundColor: 'var(--me-primary-light)', color: '#3b523a', fontSize: '0.8rem' }}
              >
                {currentQ.categoryLabel}
              </span>

              <h2 className="serif h3 mb-4" style={{ color: 'var(--me-text)' }}>
                {currentQ.question}
              </h2>

              <div className="d-flex flex-column gap-2 mb-4">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = answers[currentStep - 1]?.label === opt.label;
                  const isSkipOption = opt.id === 'skip' || opt.label.includes('Skip');

                  return (
                    <button
                      key={opt.id || idx}
                      type="button"
                      className={`btn text-start p-3 rounded-3 d-flex align-items-center justify-content-between transition ${
                        isSelected ? 'border-2' : ''
                      }`}
                      style={{
                        backgroundColor: isSelected
                          ? 'var(--me-primary-light)'
                          : isSkipOption
                          ? '#fbf9f5'
                          : '#ffffff',
                        borderColor: isSelected
                          ? 'var(--me-primary)'
                          : isSkipOption
                          ? '#e2ded5'
                          : 'var(--me-border)',
                        color: isSkipOption ? 'var(--me-muted)' : 'var(--me-text)',
                        fontStyle: isSkipOption ? 'italic' : 'normal',
                      }}
                      onClick={() =>
                        setAnswers((prev) => ({
                          ...prev,
                          [currentStep - 1]: { id: opt.id, label: opt.label },
                        }))
                      }
                    >
                      <span className="fw-medium">{opt.label}</span>
                      {isSelected && (
                        <span className="badge rounded-pill bg-success ms-2">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    className="btn btn-link text-muted text-decoration-none px-0"
                    onClick={() => setCurrentStep((prev) => prev - 1)}
                  >
                    ← Back
                  </button>
                ) : (
                  <div />
                )}

                <button
                  type="button"
                  className="btn btn-me-primary px-4"
                  disabled={!answers[currentStep - 1]}
                  onClick={() => {
                    if (currentStep < 3) {
                      setCurrentStep((prev) => prev + 1);
                    } else {
                      setCurrentStep(4);
                    }
                  }}
                >
                  {currentStep === 3 ? 'Continue to Note →' : 'Next Question →'}
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              PART B.2: Optional Micro-Journal Box (Step 4, max 200 characters)
             ========================================================================= */}
          {currentStep === 4 && (
            <div className="me-card p-4 p-md-5 fade-in">
              <span
                className="badge mb-2 px-3 py-1"
                style={{ backgroundColor: 'var(--me-primary-light)', color: '#3b523a', fontSize: '0.8rem' }}
              >
                Micro-Journal
              </span>

              <h2 className="serif h3 mb-2" style={{ color: 'var(--me-text)' }}>
                Anything else on your mind today?
              </h2>
              <p className="text-muted small mb-4">
                Optional, maximum 200 characters.
              </p>

              <div className="mb-4">
                <textarea
                  className="form-control p-3"
                  rows="4"
                  maxLength={200}
                  placeholder="Just a few words about what is resting on your chest or mind..."
                  value={journalText}
                  onChange={(e) => setJournalText(e.target.value)}
                  style={{ borderRadius: '12px', resize: 'none' }}
                />
                <div className="d-flex justify-content-between align-items-center mt-2 small text-muted">
                  <span>🔒 Private & confidential</span>
                  <span className={journalText.length >= 190 ? 'text-warning fw-bold' : ''}>
                    {journalText.length}/200
                  </span>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                <button
                  type="button"
                  className="btn btn-link text-muted text-decoration-none px-0"
                  onClick={() => setCurrentStep(3)}
                >
                  ← Back
                </button>

                <div className="d-flex gap-2">
                  {!journalText && (
                    <button
                      type="button"
                      className="btn btn-me-subtle px-3"
                      onClick={triggerAiDetection}
                    >
                      Skip Note
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-me-primary px-4"
                    onClick={triggerAiDetection}
                  >
                    Analyze Mood →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              PART B.3: AI Mood Detection & Confirmation Screen (Step 5)
             ========================================================================= */}
          {currentStep === 5 && (
            <div className="me-card p-4 p-md-5 fade-in">
              {isAnalyzing ? (
                <div className="py-5 text-center fade-in">
                  <div
                    className="spinner-border mb-3"
                    role="status"
                    style={{ color: 'var(--me-primary)', width: '3rem', height: '3rem' }}
                  >
                    <span className="visually-hidden">Analyzing...</span>
                  </div>
                  <h3 className="serif h4 text-muted mb-1">Analyzing your vibe...</h3>
                  <p className="small text-muted">Listening gently to your body and thoughts.</p>
                </div>
              ) : (
                <div className="fade-in">
                  {!isManualSelecting ? (
                    <>
                      <div className="text-center mb-4">
                        <span style={{ fontSize: '3rem' }}>🌿</span>
                        <h2 className="serif h4 mt-2 mb-3" style={{ color: 'var(--me-text)' }}>
                          Based on your check-in, you seem to be feeling:
                        </h2>
                        <div
                          className="display-6 serif fw-bold mb-3 px-4 py-2 d-inline-block rounded-pill"
                          style={{
                            backgroundColor: 'var(--me-primary-light)',
                            color: '#2b3d2a',
                            border: '1.5px solid var(--me-primary)',
                          }}
                        >
                          {detectedMood}
                        </div>
                      </div>

                      <div
                        className="p-3 mb-4 rounded-3 text-center"
                        style={{ backgroundColor: '#FAF6EE', border: '1px solid var(--me-border)' }}
                      >
                        <p className="serif fs-5 mb-0" style={{ color: '#444', lineHeight: 1.6 }}>
                          "{detectedSummary}"
                        </p>
                      </div>

                      <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 pt-3 border-top">
                        <button
                          type="button"
                          className="btn btn-me-primary px-4 py-2 shadow-sm"
                          onClick={handleConfirmDetected}
                        >
                          Yes, that's right →
                        </button>
                        <button
                          type="button"
                          className="btn btn-me-outline px-4 py-2"
                          onClick={() => setIsManualSelecting(true)}
                        >
                          Not quite, let me choose
                        </button>
                      </div>
                    </>
                  ) : (
                    /* Manual emotion selection grid + custom mood input */
                    <div className="fade-in">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <h3 className="serif h4 mb-0" style={{ color: 'var(--me-text)' }}>
                          Choose what fits you best:
                        </h3>
                        <button
                          type="button"
                          className="btn btn-sm btn-link text-muted text-decoration-none"
                          onClick={() => setIsManualSelecting(false)}
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="row g-2 mb-4">
                        {MANUAL_EMOTIONS.map((emo, idx) => (
                          <div key={idx} className="col-6 col-sm-4">
                            <button
                              type="button"
                              className="w-100 p-3 text-center border rounded-3 emotion-tile"
                              style={{ backgroundColor: '#ffffff' }}
                              onClick={() => handleSelectManualMood(emo.label)}
                            >
                              <div style={{ fontSize: '1.8rem' }}>{emo.emoji}</div>
                              <div className="fw-medium mt-1">{emo.label}</div>
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Custom mood typing */}
                      <form onSubmit={handleCustomMoodSubmit} className="pt-3 border-top">
                        <label className="form-label small text-muted">
                          Or type your own emotion:
                        </label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="e.g. Hopeful, Numb, Nostalgic..."
                            value={customMoodInput}
                            onChange={(e) => setCustomMoodInput(e.target.value)}
                          />
                          <button
                            className="btn btn-me-primary"
                            type="submit"
                            disabled={!customMoodInput.trim()}
                          >
                            Set Mood →
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              PART B.4: Dynamic 1–10 Intensity Slider (Step 6)
             ========================================================================= */}
          {currentStep === 6 && (
            <div className="me-card p-4 p-md-5 fade-in">
              <span
                className="badge mb-2 px-3 py-1"
                style={{ backgroundColor: 'var(--me-primary-light)', color: '#3b523a', fontSize: '0.8rem' }}
              >
                Intensity Level
              </span>

              <h2 className="serif h3 mb-2 text-center" style={{ color: 'var(--me-text)' }}>
                How intensely are you feeling {finalMood}?
              </h2>
              <p className="text-muted small text-center mb-4">
                Slide from 1 to 10 to calibrate the depth of this feeling today.
              </p>

              <div className="d-flex flex-column align-items-center my-4">
                {/* Dynamic colored badge with intensity value */}
                <div
                  className="d-flex align-items-center justify-content-center text-white fw-bold mb-2 shadow-sm"
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    backgroundColor: getIntensityColor(intensity),
                    fontSize: '2rem',
                    transition: 'background-color 0.3s ease',
                  }}
                >
                  {intensity}
                </div>

                {/* Dynamic labels: 1–3: "Mild / Subtle", 4–7: "Moderate / Noticeable", 8–10: "Intense / Deeply felt" */}
                <div
                  className="fw-bold fs-5 mt-1"
                  style={{ color: getIntensityColor(intensity) }}
                >
                  {getIntensityLabel(intensity)}
                </div>
                <div className="small text-muted">{intensity} of 10</div>
              </div>

              <div className="px-2 mb-4">
                <input
                  type="range"
                  className="form-range me-slider"
                  min="1"
                  max="10"
                  step="1"
                  value={intensity}
                  onChange={(e) => setIntensity(parseInt(e.target.value, 10))}
                  style={{ height: '10px' }}
                />
                <div className="d-flex justify-content-between text-muted small mt-2">
                  <span>1 (Mild / Subtle)</span>
                  <span>5 (Moderate / Noticeable)</span>
                  <span>10 (Intense / Deeply felt)</span>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                <button
                  type="button"
                  className="btn btn-link text-muted text-decoration-none px-0"
                  onClick={() => setCurrentStep(5)}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  className="btn btn-me-primary px-4 py-2"
                  onClick={handleFinishCheckin}
                >
                  Save Check-In ✓
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              PART B.5: Completion Screen (Step 7)
             ========================================================================= */}
          {currentStep === 7 && (
            <div className="me-card p-4 p-md-5 text-center fade-in">
              <div style={{ fontSize: '3.5rem' }} className="mb-3">
                🌿
              </div>

              <h2 className="serif display-6 mb-2" style={{ color: 'var(--me-text)' }}>
                Thank you for checking in. See you tomorrow!
              </h2>

              <p className="lead text-muted mb-4" style={{ maxWidth: '480px', margin: '0 auto' }}>
                You logged <strong style={{ color: 'var(--me-primary)' }}>{finalMood}</strong> at level{' '}
                <strong>{intensity}/10</strong> ({getIntensityLabel(intensity).toLowerCase()}).
              </p>

              {/* 1-2 Gentle, Actionable Suggestions */}
              <div
                className="p-4 my-4 rounded-3 text-start mx-auto"
                style={{
                  backgroundColor: '#FAF6EE',
                  border: '1px solid var(--me-border)',
                  maxWidth: '520px',
                }}
              >
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span style={{ fontSize: '1.2rem' }}>💡</span>
                  <span className="fw-bold small text-uppercase tracking-wider" style={{ color: '#444' }}>
                    Gentle suggestions for your moment:
                  </span>
                </div>
                <ul className="mb-0 ps-3 small text-muted" style={{ lineHeight: 1.7 }}>
                  {detectedSuggestions.map((sug, idx) => (
                    <li key={idx}>{sug}</li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons: [Back to Dashboard] and [View Mood History] */}
              <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
                <Link to="/dashboard" className="btn btn-me-primary px-4 py-2 shadow-sm">
                  Back to Dashboard
                </Link>
                <Link to="/journey" className="btn btn-me-outline px-4 py-2">
                  View Mood History
                </Link>
                <button
                  type="button"
                  className="btn btn-me-subtle px-3 py-2"
                  onClick={handleRestart}
                >
                  Log Another
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default LogMood;
