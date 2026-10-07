package com.mindease.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String email;

    @JsonIgnore
    private String passwordHash;

    private Instant createdAt = Instant.now();

    private Integer age;
    private String ageGroup;
    private String profession;

    private UserSettings settings = new UserSettings();

    public User() {
    }

    public User(String name, String email, String passwordHash) {
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.createdAt = Instant.now();
        this.settings = new UserSettings();
    }

    public static class UserSettings {
        private boolean aiConsent = false;
        private boolean showCrisisCard = true;

        public UserSettings() {
        }

        public UserSettings(boolean aiConsent, boolean showCrisisCard) {
            this.aiConsent = aiConsent;
            this.showCrisisCard = showCrisisCard;
        }

        public boolean isAiConsent() {
            return aiConsent;
        }

        public void setAiConsent(boolean aiConsent) {
            this.aiConsent = aiConsent;
        }

        public boolean isShowCrisisCard() {
            return showCrisisCard;
        }

        public void setShowCrisisCard(boolean showCrisisCard) {
            this.showCrisisCard = showCrisisCard;
        }
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public UserSettings getSettings() {
        return settings;
    }

    public void setSettings(UserSettings settings) {
        this.settings = settings;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getAgeGroup() {
        return ageGroup;
    }

    public void setAgeGroup(String ageGroup) {
        this.ageGroup = ageGroup;
    }

    public String getProfession() {
        return profession;
    }

    public void setProfession(String profession) {
        this.profession = profession;
    }
}
