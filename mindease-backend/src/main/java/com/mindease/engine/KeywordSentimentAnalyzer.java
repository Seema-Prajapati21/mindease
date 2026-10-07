package com.mindease.engine;

import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class KeywordSentimentAnalyzer implements EmotionAnalyzer {

    private final Map<String, List<String>> keywordDictionary = new HashMap<>();

    public KeywordSentimentAnalyzer() {
        keywordDictionary.put("happy", Arrays.asList(
                "happy", "joy", "smile", "laugh", "excited", "wonderful", "delighted", "celebrate",
                "good", "great", "content", "cheerful", "fun", "love", "blessed"
        ));
        keywordDictionary.put("hopeful", Arrays.asList(
                "hope", "forward", "optimistic", "better", "future", "promising", "improving",
                "progress", "potential", "opportunity", "believing"
        ));
        keywordDictionary.put("calm", Arrays.asList(
                "calm", "peaceful", "quiet", "serene", "tranquil", "relaxed", "still", "rested",
                "breathe", "gentle", "settled", "composed", "soothing"
        ));
        keywordDictionary.put("grateful", Arrays.asList(
                "grateful", "thankful", "blessed", "appreciate", "kindness", "warmth", "grace",
                "lucky", "generous", "supported", "cherish"
        ));
        keywordDictionary.put("neutral", Arrays.asList(
                "fine", "okay", "average", "normal", "routine", "usual", "regular", "alright", "meh"
        ));
        keywordDictionary.put("sad", Arrays.asList(
                "sad", "unhappy", "crying", "down", "blue", "tears", "heartbroken", "loss", "grief",
                "lonely", "miss", "gloomy", "disappointed", "hurting"
        ));
        keywordDictionary.put("anxious", Arrays.asList(
                "anxious", "nervous", "worried", "panic", "fear", "dread", "restless", "shaky",
                "deadline", "exam", "uncertain", "scared", "jittery"
        ));
        keywordDictionary.put("angry", Arrays.asList(
                "angry", "furious", "mad", "frustrated", "irritated", "annoyed", "fight", "rage",
                "argument", "unfair", "resentful", "bitter", "hostile"
        ));
        keywordDictionary.put("overwhelmed", Arrays.asList(
                "overwhelmed", "too much", "drowning", "exhausted", "drained", "burned out", "burnout",
                "suffocating", "swamped", "spinning", "shattered", "overloaded"
        ));
    }

    @Override
    public EmotionScore analyze(MoodInput input) {
        EmotionScore score = new EmotionScore();
        if (input == null || input.getMindText() == null) {
            return score;
        }

        String text = input.getMindText().toLowerCase();
        keywordDictionary.forEach((emotion, words) -> {
            for (String word : words) {
                if (text.contains(word)) {
                    score.addScore(emotion, 2.0);
                }
            }
        });

        return score;
    }
}
