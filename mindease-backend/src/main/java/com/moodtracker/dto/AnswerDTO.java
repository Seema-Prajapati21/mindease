package com.moodtracker.dto;

public class AnswerDTO {
    private String questionId;
    private String questionText;
    private String selectedOptionId;
    private String selectedOptionLabel;

    public AnswerDTO() {}

    public AnswerDTO(String questionId, String questionText, String selectedOptionId, String selectedOptionLabel) {
        this.questionId = questionId;
        this.questionText = questionText;
        this.selectedOptionId = selectedOptionId;
        this.selectedOptionLabel = selectedOptionLabel;
    }

    public String getQuestionId() {
        return questionId;
    }

    public void setQuestionId(String questionId) {
        this.questionId = questionId;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public String getSelectedOptionId() {
        return selectedOptionId;
    }

    public void setSelectedOptionId(String selectedOptionId) {
        this.selectedOptionId = selectedOptionId;
    }

    public String getSelectedOptionLabel() {
        return selectedOptionLabel;
    }

    public void setSelectedOptionLabel(String selectedOptionLabel) {
        this.selectedOptionLabel = selectedOptionLabel;
    }
}
