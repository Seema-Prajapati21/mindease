package com.mindease.engine;

import org.springframework.stereotype.Component;

@Component
public class BodyFeelAnalyzer implements EmotionAnalyzer {

    @Override
    public EmotionScore analyze(MoodInput input) {
        EmotionScore score = new EmotionScore();
        if (input == null || input.getBodyFeel() == null) {
            score.addScore("neutral", 1.0);
            return score;
        }

        String feel = input.getBodyFeel().toLowerCase().trim();
        switch (feel) {
            case "heavy":
                score.addScore("sad", 3.0);
                score.addScore("overwhelmed", 2.0);
                score.addScore("neutral", 1.0);
                break;
            case "restless":
                score.addScore("anxious", 3.0);
                score.addScore("angry", 2.0);
                score.addScore("overwhelmed", 1.0);
                break;
            case "light":
                score.addScore("happy", 3.0);
                score.addScore("calm", 3.0);
                score.addScore("hopeful", 2.0);
                score.addScore("grateful", 2.0);
                break;
            case "tense":
                score.addScore("anxious", 3.0);
                score.addScore("angry", 3.0);
                score.addScore("overwhelmed", 1.0);
                break;
            case "numb":
                score.addScore("neutral", 3.0);
                score.addScore("sad", 2.0);
                score.addScore("overwhelmed", 1.0);
                break;
            default:
                score.addScore("neutral", 1.0);
        }
        return score;
    }
}
