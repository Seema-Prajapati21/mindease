package com.moodtracker.model;

import java.util.List;

public class Question {
    private String id;
    private String category;
    private String question;
    private List<String> ageGroups;
    private List<Option> options;

    public Question() {}

    public Question(String id, String category, String question, List<String> ageGroups, List<Option> options) {
        this.id = id;
        this.category = category;
        this.question = question;
        this.ageGroups = ageGroups;
        this.options = options;
    }

    public String getId() {
        return id;
    }

    public String getCategory() {
        return category;
    }

    public String getQuestion() {
        return question;
    }

    public List<String> getAgeGroups() {
        return ageGroups;
    }

    public List<Option> getOptions() {
        return options;
    }
}
