package com.moodtracker.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "tracker_mood_entries")
public class MoodEntry {

    @Id
    private String id;

    private String userEmail;
    private String detectedMood;
    private String confirmedMood;
    private boolean wasDetectionAccurate = true;
    private String aiSummary;

    @Min(1)
    @Max(10)
    private int intensity = 5;

    private List<String> answers = new ArrayList<>();
    private String journalNote;
    private LocalDate loggedDate;
    private boolean demo = false;
    private LocalDateTime timestamp = LocalDateTime.now();

    public MoodEntry() {
    }

    public void prePersist() {
        if (this.timestamp == null) this.timestamp = LocalDateTime.now();
        if (this.loggedDate == null) this.loggedDate = this.timestamp.toLocalDate();
    }

    // Null-safe getter
    public LocalDate getLoggedDate() {
        if (this.loggedDate != null) return this.loggedDate;
        if (this.timestamp != null) return this.timestamp.toLocalDate();
        return LocalDate.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getDetectedMood() {
        return detectedMood;
    }

    public void setDetectedMood(String detectedMood) {
        this.detectedMood = detectedMood;
    }

    public String getConfirmedMood() {
        return confirmedMood;
    }

    public void setConfirmedMood(String confirmedMood) {
        this.confirmedMood = confirmedMood;
    }

    public boolean isWasDetectionAccurate() {
        return wasDetectionAccurate;
    }

    public void setWasDetectionAccurate(boolean wasDetectionAccurate) {
        this.wasDetectionAccurate = wasDetectionAccurate;
    }

    public String getAiSummary() {
        return aiSummary;
    }

    public void setAiSummary(String aiSummary) {
        this.aiSummary = aiSummary;
    }

    public int getIntensity() {
        return intensity;
    }

    public void setIntensity(int intensity) {
        this.intensity = intensity;
    }

    public List<String> getAnswers() {
        return answers;
    }

    public void setAnswers(List<String> answers) {
        this.answers = answers;
    }

    public String getJournalNote() {
        return journalNote;
    }

    public void setJournalNote(String journalNote) {
        this.journalNote = journalNote;
    }

    public void setLoggedDate(LocalDate loggedDate) {
        this.loggedDate = loggedDate;
    }

    public boolean isDemo() {
        return demo;
    }

    public void setDemo(boolean demo) {
        this.demo = demo;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
