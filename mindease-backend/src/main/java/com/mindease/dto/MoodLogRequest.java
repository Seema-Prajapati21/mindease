package com.mindease.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

import java.util.ArrayList;
import java.util.List;

public class MoodLogRequest {

    private String date; // "YYYY-MM-DD"

    @NotBlank(message = "Body feel is required")
    private String bodyFeel;

    private String mindText;

    private String branchId;

    private String branchAnswer;

    private String aiAnswer;

    @NotBlank(message = "Emotion is required")
    private String emotion;

    @Min(value = 1, message = "Intensity must be between 1 and 10")
    @Max(value = 10, message = "Intensity must be between 1 and 10")
    private int intensity;

    private List<String> tags = new ArrayList<>();

    private String journalNote;

    private String suggestedEmotion;

    private Boolean wasOverridden;

    public MoodLogRequest() {
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getBodyFeel() {
        return bodyFeel;
    }

    public void setBodyFeel(String bodyFeel) {
        this.bodyFeel = bodyFeel;
    }

    public String getMindText() {
        return mindText;
    }

    public void setMindText(String mindText) {
        this.mindText = mindText;
    }

    public String getBranchId() {
        return branchId;
    }

    public void setBranchId(String branchId) {
        this.branchId = branchId;
    }

    public String getBranchAnswer() {
        return branchAnswer;
    }

    public void setBranchAnswer(String branchAnswer) {
        this.branchAnswer = branchAnswer;
    }

    public String getAiAnswer() {
        return aiAnswer;
    }

    public void setAiAnswer(String aiAnswer) {
        this.aiAnswer = aiAnswer;
    }

    public String getEmotion() {
        return emotion;
    }

    public void setEmotion(String emotion) {
        this.emotion = emotion;
    }

    public int getIntensity() {
        return intensity;
    }

    public void setIntensity(int intensity) {
        this.intensity = intensity;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags != null ? tags : new ArrayList<>();
    }

    public String getJournalNote() {
        return journalNote;
    }

    public void setJournalNote(String journalNote) {
        this.journalNote = journalNote;
    }

    public String getSuggestedEmotion() {
        return suggestedEmotion;
    }

    public void setSuggestedEmotion(String suggestedEmotion) {
        this.suggestedEmotion = suggestedEmotion;
    }

    public Boolean getWasOverridden() {
        return wasOverridden;
    }

    public void setWasOverridden(Boolean wasOverridden) {
        this.wasOverridden = wasOverridden;
    }
}
