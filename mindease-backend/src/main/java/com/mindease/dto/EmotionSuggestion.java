package com.mindease.dto;

public class EmotionSuggestion {

    private String emotion;
    private String confidence; // high | medium | low
    private int intensityHint;

    public EmotionSuggestion() {
    }

    public EmotionSuggestion(String emotion, String confidence, int intensityHint) {
        this.emotion = emotion;
        this.confidence = confidence;
        this.intensityHint = intensityHint;
    }

    public String getEmotion() {
        return emotion;
    }

    public void setEmotion(String emotion) {
        this.emotion = emotion;
    }

    public String getConfidence() {
        return confidence;
    }

    public void setConfidence(String confidence) {
        this.confidence = confidence;
    }

    public int getIntensityHint() {
        return intensityHint;
    }

    public void setIntensityHint(int intensityHint) {
        this.intensityHint = intensityHint;
    }
}
