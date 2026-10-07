package com.mindease.dto;

public class FollowupResponse {

    private String question;
    private String source; // "ai" | "rule"

    public FollowupResponse() {
    }

    public FollowupResponse(String question, String source) {
        this.question = question;
        this.source = source;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }
}
