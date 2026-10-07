import React from 'react';
import CrisisBanner from '../components/CrisisBanner';
import HelplineCard from '../components/HelplineCard';
import { HELPLINES } from '../constants/helplines';
import { THERAPIST_DIRECTORIES, THERAPY_GUIDELINES } from '../constants/therapistFinder';

const GetHelp = () => {
  return (
    <div className="fade-in">
      <CrisisBanner />

      <div className="container py-4">
        {/* Header */}
        <div className="mb-4 pb-2 border-bottom">
          <h1 className="serif h2 mb-1" style={{ color: 'var(--me-text)' }}>
            Support & Indian Helplines
          </h1>
          <p className="text-muted small mb-0">
            Real, verified channels of compassionate support across India. Free, confidential, and human.
          </p>
        </div>

        {/* Section 1: Helplines for India */}
        <section className="mb-5">
          <div className="d-flex align-items-center gap-2 mb-3">
            <span style={{ fontSize: '1.3rem' }}>📞</span>
            <h2 className="serif h4 mb-0" style={{ color: 'var(--me-text)' }}>
              Helplines for India
            </h2>
          </div>
          <div className="row g-4">
            {HELPLINES.map((helpline) => (
              <div key={helpline.id} className="col-12 col-md-6 col-lg-4">
                <HelplineCard helpline={helpline} />
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Finding a Therapist in India */}
        <section className="mb-5 pt-3 border-top">
          <div className="d-flex align-items-center gap-2 mb-3">
            <span style={{ fontSize: '1.3rem' }}>🌱</span>
            <h2 className="serif h4 mb-0" style={{ color: 'var(--me-text)' }}>
              Therapist Directories & Ethical Care
            </h2>
          </div>
          <p className="text-muted small mb-4" style={{ maxWidth: '720px' }}>
            Looking for longer-term therapy? These curated Indian directories help you find licensed, queer-affirmative, and sliding-scale mental health practitioners.
          </p>

          <div className="row g-3 mb-4">
            {THERAPIST_DIRECTORIES.map((dir, idx) => (
              <div key={idx} className="col-12 col-md-6">
                <div className="me-card p-4 h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <h3 className="serif h5 mb-0">{dir.name}</h3>
                      <span className="badge" style={{ backgroundColor: '#f0ece3', color: '#555' }}>
                        {dir.type}
                      </span>
                    </div>
                    <p className="text-muted small mt-2 mb-3">{dir.description}</p>
                  </div>
                  <div>
                    <a
                      href={dir.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-me-outline"
                    >
                      Visit Directory ↗
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Therapy Guidelines / What to ask */}
          <div className="me-card-soft p-4">
            <h3 className="serif h5 mb-3" style={{ color: '#2b3d2a' }}>
              How to navigate finding a therapist in India
            </h3>
            <div className="row g-3">
              {THERAPY_GUIDELINES.map((guide, idx) => (
                <div key={idx} className="col-12 col-md-4">
                  <h4 className="fw-semibold fs-6 mb-1">{guide.title}</h4>
                  <p className="small text-muted mb-0" style={{ lineHeight: 1.6 }}>
                    {guide.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default GetHelp;
