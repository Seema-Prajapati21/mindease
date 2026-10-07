package com.mindease.engine;

import org.springframework.stereotype.Component;

@Component
public class BranchRuleEvaluator implements EmotionAnalyzer {

    @Override
    public EmotionScore analyze(MoodInput input) {
        EmotionScore score = new EmotionScore();
        if (input == null || input.getBranchAnswer() == null) {
            return score;
        }

        String answer = input.getBranchAnswer().toLowerCase();
        if (answer.contains("tired-heavy")) {
            score.addScore("sad", 1.0);
            score.addScore("overwhelmed", 1.0);
        } else if (answer.contains("sad-heavy") || answer.contains("loneliness") || answer.contains("missing")) {
            score.addScore("sad", 3.0);
        } else if (answer.contains("pressure")) {
            score.addScore("anxious", 2.5);
            score.addScore("overwhelmed", 1.5);
        } else if (answer.contains("anger") || answer.contains("frustrated")) {
            score.addScore("angry", 3.0);
        } else if (answer.contains("relief") || answer.contains("peace") || answer.contains("finished")) {
            score.addScore("calm", 2.0);
            score.addScore("hopeful", 2.0);
        }

        return score;
    }
}
