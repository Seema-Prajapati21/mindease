import React from 'react';
import { CONTEXT_TAGS } from '../constants/contextTags';

const ContextTagPills = ({ selectedTags = [], onToggleTag, onSkip }) => {
  return (
    <div className="my-3">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <label className="form-label small text-muted mb-0">
          Any context tags you want to link to this feeling? (Optional)
        </label>
        {onSkip && (
          <button
            type="button"
            className="btn btn-link text-muted small p-0 text-decoration-none"
            onClick={onSkip}
          >
            Skip →
          </button>
        )}
      </div>

      <div className="d-flex flex-wrap gap-2">
        {CONTEXT_TAGS.map((tag) => {
          const isActive = selectedTags.includes(tag.id);
          return (
            <button
              key={tag.id}
              type="button"
              className={`context-pill ${isActive ? 'active' : ''}`}
              onClick={() => onToggleTag(tag.id)}
            >
              <span className="me-1">{tag.emoji}</span>
              {tag.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ContextTagPills;
