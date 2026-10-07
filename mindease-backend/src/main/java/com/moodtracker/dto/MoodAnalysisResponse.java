package com.moodtracker.dto;

import java.util.List;

public class MoodAnalysisResponse {
    private String detectedMood;
    private String summary;
    private List<String> suggestions;

    public MoodAnalysisResponse() {}

    public MoodAnalysisResponse(String detectedMood, String summary, List<String> suggestions) {
        this.detectedMood = detectedMood;
        this.summary = summary;
        this.suggestions = suggestions;
    }

    public String getDetectedMood() {
        return detectedMood;
    }

    public void setDetectedMood(String detectedMood) {
        this.detectedMood = detectedMood;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public List<String> getSuggestions() {
        return suggestions;
    }

    public void setSuggestions(List<String> suggestions) {
        this.suggestions = suggestions;
    }
}
