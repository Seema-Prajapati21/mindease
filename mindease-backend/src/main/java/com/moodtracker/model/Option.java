package com.moodtracker.model;

public class Option {
    private String id;
    private String label;

    public Option() {}

    public Option(String id, String label) {
        this.id = id;
        this.label = label;
    }

    public String getId() {
        return id;
    }

    public String getLabel() {
        return label;
    }
}
