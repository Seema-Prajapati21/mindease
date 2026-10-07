import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { moodApi } from '../api/moodApi';
import { getStoredEntries } from '../data/mockMoodEntries';
import { calculateStats } from '../utils/statsHelpers';
import { COPING_TOOLS } from '../constants/copingTools';
import CopingToolCard from '../components/CopingToolCard';

const CopingTools = () => {
  const { user } = useAuth();
  const [avg7, setAvg7] = useState(6.0);

  useEffect(() => {
    const fetchAvg = async () => {
      try {
        const stats = await moodApi.getStats(7);
        if (stats?.avg7) setAvg7(stats.avg7);
      } catch (err) {
        const entries = getStoredEntries(user?.id);
        const stats = calculateStats(entries);
        setAvg7(stats.avg7);
      }
    };

    fetchAvg();
  }, [user]);

  const isLowMood = avg7 <= 5.0;

  // If low mood, sort tools with 'low' tag first
  const displayTools = [...COPING_TOOLS].sort((a, b) => {
    if (isLowMood) {
      const aHasLow = a.tags.includes('low');
      const bHasLow = b.tags.includes('low');
      if (aHasLow && !bHasLow) return -1;
      if (!aHasLow && bHasLow) return 1;
    }
    return 0;
  });

  return (
    <div className="container py-4 fade-in">
      <div className="mb-4 pb-2 border-bottom">
        <h1 className="serif h2 mb-1" style={{ color: 'var(--me-text)' }}>
          Coping Tools — small things that help.
        </h1>
        <p className="text-muted small mb-0">
          Evidence-based strategies you can try in the moment.
        </p>
      </div>

      {/* Recommended for you banner */}
      {isLowMood && (
        <div
          className="p-3 mb-4 rounded-3 d-flex align-items-center gap-2 fade-in"
          style={{
            backgroundColor: '#F7EBE9',
            border: '1px solid #EED4CF',
            color: '#844238',
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>🌿</span>
          <span className="small fw-medium">
            These tools tend to help when you're feeling low. Start anywhere.
          </span>
        </div>
      )}

      {/* 12 Coping Tools Grid */}
      <div className="row g-4">
        {displayTools.map((tool) => (
          <div key={tool.id} className="col-12 col-md-6 col-lg-4">
            <CopingToolCard tool={tool} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CopingTools;
