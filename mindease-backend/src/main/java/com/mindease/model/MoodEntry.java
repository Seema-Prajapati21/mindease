package com.mindease.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "mood_entries")
@CompoundIndex(name = "user_date_idx", def = "{'userId': 1, 'date': 1}")
public class MoodEntry {

    @Id
    private String id;

    @Indexed
    private String userId;

    private String date; // "YYYY-MM-DD"

    private Instant createdAt = Instant.now();

    private String bodyFeel; // heavy | restless | light | tense | numb

    private String mindText; // max 300 chars

    private String branchId;

    private String branchAnswer;

    private String aiAnswer;

    private String emotion; // happy | hopeful | calm | grateful | neutral | sad | anxious | angry | overwhelmed

    private int intensity; // 1-10

    private List<String> tags = new ArrayList<>();

    private String journalNote;

    private String suggestedEmotion;

    private boolean wasOverridden;

    public MoodEntry() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
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

    public boolean isWasOverridden() {
        return wasOverridden;
    }

    public void setWasOverridden(boolean wasOverridden) {
        this.wasOverridden = wasOverridden;
    }
}
