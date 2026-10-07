import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { authApi } from '../api/authApi';

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const { user, updateUserSettings } = useAuth();

  const [aiConsent, setAiConsent] = useState(
    user?.settings?.aiConsent !== undefined ? user.settings.aiConsent : false
  );
  const [showCrisisCard, setShowCrisisCard] = useState(
    user?.settings?.showCrisisCard !== undefined ? user.settings.showCrisisCard : true
  );

  useEffect(() => {
    if (user?.settings) {
      if (user.settings.aiConsent !== undefined) setAiConsent(user.settings.aiConsent);
      if (user.settings.showCrisisCard !== undefined) setShowCrisisCard(user.settings.showCrisisCard);
    }
  }, [user]);

  const updateConsent = async (val) => {
    setAiConsent(val);
    updateUserSettings({ aiConsent: val });
    try {
      await authApi.updateSettings({ aiConsent: val });
    } catch (err) {
      console.warn('Settings updated locally.');
    }
  };

  const updateCrisisCardVisibility = async (val) => {
    setShowCrisisCard(val);
    updateUserSettings({ showCrisisCard: val });
    try {
      await authApi.updateSettings({ showCrisisCard: val });
    } catch (err) {
      console.warn('Settings updated locally.');
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        aiConsent,
        showCrisisCard,
        updateConsent,
        updateCrisisCardVisibility,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within a SettingsProvider');
  return ctx;
};
