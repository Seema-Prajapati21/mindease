package com.mindease.engine;

import com.mindease.dto.EmotionSuggestion;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class EmotionEngine {

    private final List<EmotionAnalyzer> analyzers;

    public EmotionEngine(List<EmotionAnalyzer> analyzers) {
        this.analyzers = analyzers;
    }

    public EmotionSuggestion suggestEmotion(MoodInput input) {
        EmotionScore totalScore = new EmotionScore();

        for (EmotionAnalyzer analyzer : analyzers) {
            EmotionScore part = analyzer.analyze(input);
            totalScore.merge(part);
        }

        Map<String, Double> allScores = totalScore.getAllScores();
        String bestEmotion = "neutral";
        double maxScore = -1.0;

        for (Map.Entry<String, Double> entry : allScores.entrySet()) {
            if (entry.getValue() > maxScore) {
                maxScore = entry.getValue();
                bestEmotion = entry.getKey();
            }
        }

        String confidence = "low";
        if (maxScore >= 6.0) {
            confidence = "high";
        } else if (maxScore >= 3.0) {
            confidence = "medium";
        }

        int intensityHint = 5;
        if ("happy".equals(bestEmotion) || "grateful".equals(bestEmotion) || "hopeful".equals(bestEmotion)) {
            intensityHint = 7;
        } else if ("overwhelmed".equals(bestEmotion) || "angry".equals(bestEmotion) || "anxious".equals(bestEmotion)) {
            intensityHint = 7;
        } else if ("sad".equals(bestEmotion)) {
            intensityHint = 6;
        } else if ("calm".equals(bestEmotion)) {
            intensityHint = 8;
        }

        return new EmotionSuggestion(bestEmotion, confidence, intensityHint);
    }
}
