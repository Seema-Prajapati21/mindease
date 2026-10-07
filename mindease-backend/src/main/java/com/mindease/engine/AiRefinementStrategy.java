package com.mindease.engine;

import com.mindease.dto.FollowupResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class AiRefinementStrategy {

    @Value("${mindease.ai.enabled:false}")
    private boolean aiEnabled;

    @Value("${mindease.ai.api-key:}")
    private String apiKey;

    public FollowupResponse generateFollowupQuestion(String bodyFeel, String mindText, boolean userConsented) {
        int wordCount = (mindText != null && !mindText.trim().isEmpty())
                ? mindText.trim().split("\\s+").length
                : 0;

        // Condition check: user.settings.aiConsent && apiKey present && wordCount >= 15
        if (userConsented && aiEnabled && apiKey != null && !apiKey.trim().isEmpty() && wordCount >= 15) {
            try {
                // If integrated with live LLM client, invoke it here.
                // In base template, return thoughtful companion reflection.
                return new FollowupResponse(
                        "Looking back at what you described from a gentle distance, what is one small thing you need right now?",
                        "ai"
                );
            } catch (Exception e) {
                // On failure: silently fallback to rule-based. Never error.
                return fallbackRuleQuestion(bodyFeel, mindText);
            }
        }

        return fallbackRuleQuestion(bodyFeel, mindText);
    }

    private FollowupResponse fallbackRuleQuestion(String bodyFeel, String mindText) {
        String text = mindText != null ? mindText.toLowerCase() : "";
        String feel = bodyFeel != null ? bodyFeel.toLowerCase() : "";

        if ("heavy".equals(feel)) {
            if (text.contains("tired") || text.contains("empty") || text.contains("drained")) {
                return new FollowupResponse("Is this more a tired-heavy, or a sad-heavy?", "rule");
            }
            if (text.contains("miss") || text.contains("alone") || text.contains("lonely")) {
                return new FollowupResponse("That heaviness sounds tied to someone. Is it missing them, or loneliness?", "rule");
            }
        } else if ("restless".equals(feel)) {
            if (text.contains("work") || text.contains("study") || text.contains("exam")) {
                return new FollowupResponse("Is the restlessness about pressure, or something unresolved?", "rule");
            }
            if (text.contains("fight") || text.contains("argument")) {
                return new FollowupResponse("Does the restlessness feel like anger that hasn't found a place?", "rule");
            }
        } else if ("numb".equals(feel)) {
            return new FollowupResponse("If the numbness had a colour, what would it be?", "rule");
        } else if ("light".equals(feel)) {
            return new FollowupResponse("What made today feel lighter than usual?", "rule");
        } else if ("tense".equals(feel)) {
            return new FollowupResponse("Is the tension from something said, or something unsaid?", "rule");
        }

        return new FollowupResponse("If today were weather, what would it be?", "rule");
    }
}
