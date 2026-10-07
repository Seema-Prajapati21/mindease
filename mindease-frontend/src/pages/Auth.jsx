import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const getAgeGroup = (age) => {
  const num = parseInt(age, 10);
  if (isNaN(num)) return 'young_adult';
  if (num < 13) return 'child';
  if (num <= 17) return 'teen';
  if (num <= 25) return 'young_adult';
  if (num <= 59) return 'adult';
  return 'senior';
};

const Auth = () => {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    profession: '',
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Gentle client-side validation
    if (!formData.email || !formData.email.includes('@')) {
      setErrorMsg('Please share a valid email address.');
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setErrorMsg('A password of at least 6 characters helps keep your space safe.');
      return;
    }
    if (!isLoginTab) {
      if (!formData.name.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      const ageNum = parseInt(formData.age, 10);
      if (isNaN(ageNum) || ageNum < 13 || ageNum > 120) {
        setErrorMsg('Age must be between 13 and 120.');
        return;
      }
      if (!formData.profession.trim()) {
        setErrorMsg('Please share your occupation or profession (e.g. Student, Teacher, Engineer).');
        return;
      }
    }

    setSubmitting(true);
    try {
      if (isLoginTab) {
        const res = await login(formData.email, formData.password);
        if (res.success) {
          // If currentUser doesn't exist, seed it from login
          const existing = localStorage.getItem('currentUser');
          if (!existing) {
            const userObj = {
              email: formData.email.trim(),
              name: formData.email.split('@')[0],
              age: 22,
              ageGroup: 'young_adult',
              profession: 'Student',
            };
            localStorage.setItem('currentUser', JSON.stringify(userObj));
          }
          navigate(from, { replace: true });
        } else {
          setErrorMsg(res.error || 'We could not match those details. Please check and try again.');
        }
      } else {
        const ageNum = parseInt(formData.age, 10);
        const ageGroup = getAgeGroup(ageNum);

        const currentUserObj = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          age: ageNum,
          profession: formData.profession.trim(),
          ageGroup,
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUserObj));

        const res = await signup({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          age: ageNum,
          ageGroup,
          profession: formData.profession.trim(),
        });

        if (res.success) {
          navigate(from, { replace: true });
        } else {
          setErrorMsg(res.error || 'That email might already have a space here. Try logging in?');
        }
      }
    } catch (err) {
      setErrorMsg('Something quiet paused our connection. You may continue in offline demo mode.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5 fade-in">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="text-center mb-4">
            <span style={{ fontSize: '2.5rem' }}>🍃</span>
            <h2 className="serif h3 mt-2" style={{ color: 'var(--me-text)' }}>
              {isLoginTab ? 'Welcome back to your space' : 'Begin your journey'}
            </h2>
            <p className="text-muted small">
              {isLoginTab
                ? 'Take a slow breath before checking in.'
                : 'A calm, private place that listens before it charts.'}
            </p>
          </div>

          <div className="me-card p-4 p-md-5">
            {/* Tabs */}
            <div className="d-flex border-bottom mb-4" style={{ borderColor: 'var(--me-border)' }}>
              <button
                type="button"
                className={`btn flex-fill pb-2 rounded-0 border-0 ${
                  isLoginTab ? 'fw-bold border-bottom' : 'text-muted'
                }`}
                style={{
                  borderBottom: isLoginTab ? '2.5px solid var(--me-primary) !important' : 'none',
                  color: isLoginTab ? 'var(--me-primary)' : '#8A8A8A',
                }}
                onClick={() => {
                  setIsLoginTab(true);
                  setErrorMsg('');
                }}
              >
                Log In
              </button>
              <button
                type="button"
                className={`btn flex-fill pb-2 rounded-0 border-0 ${
                  !isLoginTab ? 'fw-bold border-bottom' : 'text-muted'
                }`}
                style={{
                  borderBottom: !isLoginTab ? '2.5px solid var(--me-primary) !important' : 'none',
                  color: !isLoginTab ? 'var(--me-primary)' : '#8A8A8A',
                }}
                onClick={() => {
                  setIsLoginTab(false);
                  setErrorMsg('');
                }}
              >
                Sign Up
              </button>
            </div>

            {errorMsg && (
              <div
                className="alert p-3 mb-4 rounded-3 small fade-in"
                style={{ backgroundColor: '#FAF0ED', color: '#9E4A3F', border: '1px solid #EED4CF' }}
              >
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {!isLoginTab && (
                <>
                  <div className="mb-3">
                    <label className="form-label small text-muted">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control py-2"
                      placeholder="e.g. Alex Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-5">
                      <label className="form-label small text-muted">Age (13–120)</label>
                      <input
                        type="number"
                        name="age"
                        min="13"
                        max="120"
                        className="form-control py-2"
                        placeholder="e.g. 19"
                        value={formData.age}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-7">
                      <label className="form-label small text-muted">Occupation / Profession</label>
                      <input
                        type="text"
                        name="profession"
                        className="form-control py-2"
                        placeholder="e.g. College Student"
                        value={formData.profession}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="mb-3">
                <label className="form-label small text-muted">Email ID</label>
                <input
                  type="email"
                  name="email"
                  className="form-control py-2"
                  placeholder="alex@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label small text-muted">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control py-2"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-me-primary w-100 py-2 mb-3"
                disabled={submitting}
              >
                {submitting ? 'Just a moment…' : isLoginTab ? 'Enter your space' : 'Create your space'}
              </button>

              <div className="text-center text-muted small mt-3">
                <span>All features free. No credit card, no subscription.</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
