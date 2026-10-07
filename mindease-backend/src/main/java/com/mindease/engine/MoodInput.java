package com.mindease.engine;

public class MoodInput {

    private String bodyFeel;
    private String mindText;
    private String branchAnswer;
    private String aiAnswer;

    public MoodInput() {
    }

    public MoodInput(String bodyFeel, String mindText, String branchAnswer, String aiAnswer) {
        this.bodyFeel = bodyFeel;
        this.mindText = mindText;
        this.branchAnswer = branchAnswer;
        this.aiAnswer = aiAnswer;
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
}
