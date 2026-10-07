import React, { useState, useEffect, useRef } from 'react';

// Stages:
// 'idle' -> 'inhale' (4s) -> 'hold' (7s) -> 'exhale' (8s) -> repeat 4 cycles -> 'done'
const BreathingCircle = () => {
  const [phase, setPhase] = useState('idle'); // 'idle' | 'inhale' | 'hold' | 'exhale' | 'done'
  const [timeLeft, setTimeLeft] = useState(0);
  const [cycle, setCycle] = useState(1);
  const timerRef = useRef(null);

  // Configuration for 4-7-8
  const phaseDurations = {
    inhale: 4,
    hold: 7,
    exhale: 8,
  };

  const getVisualState = () => {
    switch (phase) {
      case 'inhale':
        return { scale: 1.0, color: '#8FA68E', label: 'Breathe In…' }; // Sage green
      case 'hold':
        return { scale: 1.0, color: '#D9A5A0', label: 'Hold…' }; // Dusty rose
      case 'exhale':
        return { scale: 0.6, color: '#8ECAE6', label: 'Breathe Out…' }; // Sky blue
      case 'done':
        return { scale: 0.65, color: '#8FA68E', label: 'Well done.' };
      default:
        return { scale: 0.6, color: '#8FA68E', label: 'Tap Begin' };
    }
  };

  // Timer loop
  useEffect(() => {
    if (phase === 'idle' || phase === 'done') return;

    if (timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else {
      // Transition to next phase
      if (phase === 'inhale') {
        setPhase('hold');
        setTimeLeft(phaseDurations.hold);
      } else if (phase === 'hold') {
        setPhase('exhale');
        setTimeLeft(phaseDurations.exhale);
      } else if (phase === 'exhale') {
        if (cycle < 4) {
          setCycle((prev) => prev + 1);
          setPhase('inhale');
          setTimeLeft(phaseDurations.inhale);
        } else {
          setPhase('done');
        }
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase, timeLeft, cycle]);

  const startSession = () => {
    setCycle(1);
    setPhase('inhale');
    setTimeLeft(phaseDurations.inhale);
  };

  const stopSession = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase('idle');
    setTimeLeft(0);
    setCycle(1);
  };

  const { scale, color, label } = getVisualState();

  return (
    <div className="breathing-container text-center my-3">
      <div className="position-relative d-inline-block">
        <svg
          viewBox="0 0 200 200"
          className="breathing-svg"
          style={{ overflow: 'visible' }}
        >
          {/* Subtle outer guide ring */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="#E8E2D8"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          {/* Transforming breathing circle */}
          <circle
            cx="100"
            cy="100"
            r="80"
            className="breathing-circle-shape"
            fill={color}
            opacity="0.88"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: '100px 100px',
            }}
          />
        </svg>

        {/* Text overlay in center of SVG */}
        <div
          className="position-absolute top-50 start-50 translate-middle text-white text-center"
          style={{ pointerEvents: 'none', width: '160px' }}
        >
          <div className="serif fw-medium fs-5">{label}</div>
          {phase !== 'idle' && phase !== 'done' && (
            <div className="fs-3 fw-bold mt-1">{timeLeft}s</div>
          )}
          {phase === 'done' && (
            <div className="small mt-1 opacity-90">Notice how you feel.</div>
          )}
        </div>
      </div>

      {phase !== 'idle' && phase !== 'done' && (
        <div className="text-muted small mt-2 mb-3">
          Cycle {cycle} of 4
        </div>
      )}

      <div className="mt-3">
        {phase === 'idle' && (
          <button
            type="button"
            className="btn btn-me-primary px-4"
            onClick={startSession}
          >
            Begin 4-7-8 Breathing
          </button>
        )}
        {(phase === 'inhale' || phase === 'hold' || phase === 'exhale') && (
          <button
            type="button"
            className="btn btn-outline-secondary px-3 py-1 btn-sm"
            onClick={stopSession}
          >
            Stop Session
          </button>
        )}
        {phase === 'done' && (
          <button
            type="button"
            className="btn btn-me-subtle px-3"
            onClick={startSession}
          >
            Start Again
          </button>
        )}
      </div>
    </div>
  );
};

export default BreathingCircle;
