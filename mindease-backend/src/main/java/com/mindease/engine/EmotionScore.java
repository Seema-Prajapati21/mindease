package com.mindease.engine;

import java.util.HashMap;
import java.util.Map;

public class EmotionScore {

    private final Map<String, Double> scores = new HashMap<>();

    public EmotionScore() {
        scores.put("happy", 0.0);
        scores.put("hopeful", 0.0);
        scores.put("calm", 0.0);
        scores.put("grateful", 0.0);
        scores.put("neutral", 0.0);
        scores.put("sad", 0.0);
        scores.put("anxious", 0.0);
        scores.put("angry", 0.0);
        scores.put("overwhelmed", 0.0);
    }

    public void addScore(String emotion, double weight) {
        if (scores.containsKey(emotion)) {
            scores.put(emotion, scores.get(emotion) + weight);
        }
    }

    public double getScore(String emotion) {
        return scores.getOrDefault(emotion, 0.0);
    }

    public Map<String, Double> getAllScores() {
        return new HashMap<>(scores);
    }

    public void merge(EmotionScore other) {
        if (other == null) return;
        other.scores.forEach((emo, val) -> addScore(emo, val));
    }
}
