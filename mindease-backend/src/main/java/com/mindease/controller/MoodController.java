package com.mindease.controller;

import com.mindease.dto.FollowupRequest;
import com.mindease.dto.FollowupResponse;
import com.mindease.dto.MoodLogRequest;
import com.mindease.dto.MoodStatsResponse;
import com.mindease.model.MoodEntry;
import com.mindease.service.MoodService;
import com.mindease.service.StatsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/mood")
@Tag(name = "Mood Check-Ins & Stats", description = "Endpoints for logging mood, generating followups, and calculating statistics.")
public class MoodController {

    private final MoodService moodService;
    private final StatsService statsService;

    public MoodController(MoodService moodService, StatsService statsService) {
        this.moodService = moodService;
        this.statsService = statsService;
    }

    @PostMapping("/log")
    @Operation(summary = "Log or update daily mood check-in", description = "Persists emotional entry with somatic feel, intensity, tags, and notes.")
    public ResponseEntity<Map<String, Object>> logMood(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody MoodLogRequest request) {
        MoodEntry entry = moodService.logMood(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("entry", entry));
    }

    @PostMapping("/followup-question")
    @Operation(summary = "Generate reflective follow-up question", description = "Provides rule-based or opt-in AI reflection question.")
    public ResponseEntity<FollowupResponse> followupQuestion(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody FollowupRequest request) {
        FollowupResponse response = moodService.getFollowupQuestion(userDetails.getUsername(), request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats")
    @Operation(summary = "Get aggregated mood metrics, streaks, and correlations", description = "Calculates averages, daily scores, and tag impact over specified days.")
    public ResponseEntity<MoodStatsResponse> getStats(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "30") int days) {
        MoodStatsResponse response = statsService.calculateStats(userDetails.getUsername(), days);
        return ResponseEntity.ok(response);
    }
}
