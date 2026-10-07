import React from 'react';

const HelplineCard = ({ helpline }) => {
  const { name, phone, altPhone, timing, languages, description, isPrimary } = helpline;

  return (
    <div className={`me-card p-4 h-100 d-flex flex-column justify-content-between ${isPrimary ? 'border-primary' : ''}`}>
      <div>
        <div className="d-flex align-items-center justify-content-between mb-2">
          <h4 className="serif h5 mb-0" style={{ color: 'var(--me-text)' }}>
            {name}
          </h4>
          {isPrimary && (
            <span className="badge" style={{ backgroundColor: 'var(--me-primary-light)', color: '#3b523a' }}>
              National 24×7
            </span>
          )}
        </div>
        <p className="text-muted small mb-3">{description}</p>
        <div className="small mb-2">
          <span className="text-muted">Hours: </span>
          <span className="fw-medium">{timing}</span>
        </div>
        <div className="small mb-3">
          <span className="text-muted">Languages: </span>
          <span>{languages}</span>
        </div>
      </div>

      <div className="pt-2 border-top d-flex flex-wrap gap-2 align-items-center justify-content-between">
        <span className="fw-semibold fs-6" style={{ color: 'var(--me-text)' }}>
          {phone}
        </span>
        <a
          href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
          className="btn btn-sm btn-me-primary d-inline-flex align-items-center gap-1"
        >
          <span>📞</span> Call Now
        </a>
      </div>
    </div>
  );
};

export default HelplineCard;
