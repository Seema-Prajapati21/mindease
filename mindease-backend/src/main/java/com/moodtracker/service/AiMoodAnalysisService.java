package com.moodtracker.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.moodtracker.dto.AnswerDTO;
import com.moodtracker.dto.MoodAnalysisRequest;
import com.moodtracker.dto.MoodAnalysisResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.*;

@Service
public class AiMoodAnalysisService {

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();

    public MoodAnalysisResponse analyzeMood(MoodAnalysisRequest request) {
        if (request.getAnswers() == null || request.getAnswers().isEmpty()) {
            return new MoodAnalysisResponse("Neutral",
                    "We didn't receive enough answers to detect a specific mood.",
                    List.of("Try checking in with a few questions.", "Take a gentle pause."));
        }

        if (geminiApiKey != null && !geminiApiKey.isBlank()) {
            try {
                return callGeminiApi(request);
            } catch (Exception e) {
                System.err.println("Gemini API call failed, switching to fallback: " + e.getMessage());
            }
        }

        return generateHeuristicFallback(request);
    }

    private MoodAnalysisResponse callGeminiApi(MoodAnalysisRequest req) throws Exception {
        StringBuilder userAnswers = new StringBuilder();
        for (AnswerDTO ans : req.getAnswers()) {
            userAnswers.append("- ")
                    .append(ans.getQuestionText() != null ? ans.getQuestionText() : "")
                    .append(": ")
                    .append(ans.getSelectedOptionLabel() != null ? ans.getSelectedOptionLabel() : "")
                    .append("\n");
        }

        String prompt = String.format("""
            You are an empathetic, non-clinical mood analyzer for a wellness website.
            User Profile: %d years old, profession: %s (age group: %s).
            Answers:
            %s
            Optional Journal Note: %s

            IMPORTANT RULES:
            1. If an answer is 'Skip / Not sure' or missing, ignore it — DO NOT treat it as negative.
            2. Match your tone to the user's age group: casual and warm for teens, practical for adults, gentle and respectful for seniors.
            3. Do NOT diagnose medical conditions.
            4. Respond in STRICT JSON only, matching this structure:
            {
              "detectedMood": "Happy | Calm | Anxious | Sad | Overwhelmed | Angry | Exhausted | Neutral",
              "summary": "2-3 kind sentences summarizing how they feel.",
              "suggestions": ["Suggestion 1", "Suggestion 2"]
            }
            """,
                req.getAge(),
                req.getProfession() != null ? req.getProfession() : "Not specified",
                req.getAgeGroup() != null ? req.getAgeGroup() : "young_adult",
                userAnswers,
                req.getNote() != null ? req.getNote() : "None"
        );

        String requestBody = objectMapper.writeValueAsString(Map.of(
                "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt))))
        ));

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey;

        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        HttpResponse<String> httpResponse = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

        if (httpResponse.statusCode() == 200) {
            JsonNode root = objectMapper.readTree(httpResponse.body());
            String rawAiText = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
            String cleanedJson = rawAiText.replaceAll("```json", "").replaceAll("```", "").trim();
            return objectMapper.readValue(cleanedJson, MoodAnalysisResponse.class);
        } else {
            throw new RuntimeException("Gemini returned HTTP " + httpResponse.statusCode());
        }
    }

    private MoodAnalysisResponse generateHeuristicFallback(MoodAnalysisRequest req) {
        String answersText = req.getAnswers().stream()
                .map(a -> a.getSelectedOptionLabel() != null ? a.getSelectedOptionLabel() : "")
                .reduce("", (a, b) -> a + " " + b).toLowerCase();

        String mood = "Calm";
        String summary = "You seem to be holding a steady, calm rhythm today.";
        List<String> tips = List.of("Take a moment to enjoy this calm.", "Stay hydrated.");

        if (answersText.contains("racing") || answersText.contains("looping") || answersText.contains("tense") || answersText.contains("nervous")) {
            mood = "Anxious";
            summary = "Your thoughts seem to be moving quickly today with noticeable tension.";
            tips = List.of("Try a 4-7-8 deep breathing exercise.", "Focus only on the single task right in front of you.");
        } else if (answersText.contains("heavy &") || answersText.contains("foggy") || answersText.contains("red") || answersText.contains("drained") || answersText.contains("exhausting")) {
            mood = "Exhausted";
            summary = "Your energy battery is running very low right now.";
            tips = List.of("Step away from screens and rest your eyes.", "Give yourself permission to pause today.");
        } else if (answersText.contains("sunshine") || answersText.contains("energized") || answersText.contains("charged") || answersText.contains("flow") || answersText.contains("upbeat")) {
            mood = "Happy";
            summary = "You have vibrant, uplifting energy today!";
            tips = List.of("Channel this good energy into something you love.", "Share a smile with someone.");
        } else if (answersText.contains("overwhelmed") || answersText.contains("pulled in") || answersText.contains("crashed")) {
            mood = "Overwhelmed";
            summary = "There seems to be a lot demanding your attention at once.";
            tips = List.of("Write down everything and pick just one thing.", "Take a gentle step outside.");
        } else if (answersText.contains("frustrating") || answersText.contains("irritated") || answersText.contains("blaring")) {
            mood = "Angry";
            summary = "Things seem frustrating or grating on your patience today.";
            tips = List.of("Step back before reacting to give your nervous system space.", "A brisk walk can help release tension.");
        } else if (answersText.contains("melancholic") || answersText.contains("grey") || answersText.contains("lonely") || answersText.contains("drained")) {
            mood = "Sad";
            summary = "Things feel a bit heavy and tender right now.";
            tips = List.of("Be kind and gentle with yourself.", "Reach out to a close friend or trusted person.");
        }

        return new MoodAnalysisResponse(mood, summary, tips);
    }
}
