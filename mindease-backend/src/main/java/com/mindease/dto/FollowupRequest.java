package com.mindease.dto;

public class FollowupRequest {

    private String bodyFeel;
    private String mindText;

    public FollowupRequest() {
    }

    public FollowupRequest(String bodyFeel, String mindText) {
        this.bodyFeel = bodyFeel;
        this.mindText = mindText;
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
}
