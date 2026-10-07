package com.moodtracker.controller;

import com.mindease.repository.MoodEntryRepository;
import com.mindease.repository.UserRepository;
import com.moodtracker.dto.MoodAnalysisRequest;
import com.moodtracker.dto.MoodAnalysisResponse;
import com.moodtracker.model.MoodEntry;
import com.moodtracker.model.Question;
import com.moodtracker.repository.MoodRepository;
import com.moodtracker.service.AiMoodAnalysisService;
import com.moodtracker.service.QuestionBankService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController("moodTrackerController")
@RequestMapping("/api/mood")
@CrossOrigin(origins = "*")
public class MoodController {

    private final QuestionBankService questionBankService;
    private final AiMoodAnalysisService aiService;
    private final MoodRepository moodRepository;
    private final UserRepository userRepository;
    private final MoodEntryRepository mindeaseMoodRepository;

    public MoodController(QuestionBankService questionBankService,
                          AiMoodAnalysisService aiService,
                          MoodRepository moodRepository,
                          UserRepository userRepository,
                          MoodEntryRepository mindeaseMoodRepository) {
        this.questionBankService = questionBankService;
        this.aiService = aiService;
        this.moodRepository = moodRepository;
        this.userRepository = userRepository;
        this.mindeaseMoodRepository = mindeaseMoodRepository;
    }

    @GetMapping("/questions")
    public ResponseEntity<List<Question>> getQuestions(
            @RequestParam(required = false, defaultValue = "young_adult") String ageGroup,
            @RequestParam(required = false) List<String> lastSeen) {
        return ResponseEntity.ok(questionBankService.getDailyQuestions(ageGroup, lastSeen));
    }

    @PostMapping("/analyze")
    public ResponseEntity<MoodAnalysisResponse> analyzeMood(@Valid @RequestBody MoodAnalysisRequest request) {
        return ResponseEntity.ok(aiService.analyzeMood(request));
    }

    @PostMapping("/save")
    public ResponseEntity<MoodEntry> saveEntry(@Valid @RequestBody MoodEntry entry) {
        if (entry.getLoggedDate() == null) entry.setLoggedDate(LocalDate.now());
        if (entry.getTimestamp() == null) entry.setTimestamp(LocalDateTime.now());
        entry.setDemo(false);
        if (entry.getAiSummary() == null && entry.getConfirmedMood() != null) {
            entry.setAiSummary("You logged feeling " + entry.getConfirmedMood() + ".");
        }
        MoodEntry saved = moodRepository.save(entry);

        // Sync to com.mindease.model.MoodEntry in MongoDB if user registered
        syncLiveEntryToMindease(entry);

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PostMapping("/demo-seed")
    public ResponseEntity<Map<String, Object>> seedDemoData(@RequestParam String email) {
        // Clear previous demo rows cleanly (idempotent)
        moodRepository.deleteDemoEntries(email);

        List<MoodEntry> demoEntries = new ArrayList<>();
        LocalDate today = LocalDate.now();
        Object[][] sampleData = {
            {-6, "Calm", 6, "You had a balanced, peaceful start to the week.", "Slept well and meditated."},
            {-5, "Happy", 8, "Vibrant energy and strong focus today!", "Aced my presentation."},
            {-4, "Anxious", 7, "Noticeable mental tempo and tight shoulders.", "Exam deadline approaching."},
            {-3, "Overwhelmed", 8, "High cognitive pace with scattered focus.", "Multiple assignment submissions."},
            {-2, "Exhausted", 6, "Energy battery ran low; body needed deep rest.", "Pulled an all-nighter, rest needed."},
            {-1, "Calm", 7, "Recharged and holding a steady rhythm.", "Took a long walk in the park."},
            {0,  "Happy", 9, "Extremely uplifted and accomplished!", "Finished our semester mini-project!"}
        };

        for (Object[] row : sampleData) {
            MoodEntry entry = new MoodEntry();
            entry.setUserEmail(email);
            entry.setLoggedDate(today.plusDays((int) row[0]));
            entry.setTimestamp(today.plusDays((int) row[0]).atTime(18, 30));
            entry.setDetectedMood((String) row[1]);
            entry.setConfirmedMood((String) row[1]);
            entry.setWasDetectionAccurate(true);
            entry.setIntensity((int) row[2]);
            entry.setAiSummary((String) row[3]);
            entry.setJournalNote((String) row[4]);
            entry.setAnswers(new ArrayList<>(List.of("Energy: Steady", "Tempo: Balanced", "Weather: Breeze")));
            entry.setDemo(true);
            demoEntries.add(entry);
        }
        moodRepository.saveAll(demoEntries);

        // Also sync to com.mindease.model.MoodEntry so stats and PDF service have the data in MongoDB
        syncDemoEntriesToMindease(email, sampleData, today);

        return ResponseEntity.ok(Map.of("status", "SUCCESS", "message", "7 days of demo data seeded successfully!"));
    }

    @GetMapping("/history")
    public ResponseEntity<List<MoodEntry>> getHistory(@RequestParam String email) {
        return ResponseEntity.ok(moodRepository.findByUserEmailOrderByTimestampDesc(email));
    }

    private void syncLiveEntryToMindease(MoodEntry entry) {
        try {
            userRepository.findByEmail(entry.getUserEmail()).ifPresent(user -> {
                com.mindease.model.MoodEntry mEntry = new com.mindease.model.MoodEntry();
                mEntry.setUserId(user.getId());
                mEntry.setDate(entry.getLoggedDate().toString());
                mEntry.setEmotion(entry.getConfirmedMood() != null ? entry.getConfirmedMood().toLowerCase() : "calm");
                mEntry.setIntensity(entry.getIntensity());
                mEntry.setJournalNote(entry.getJournalNote());
                mEntry.setAiAnswer(entry.getAiSummary());
                mEntry.setCreatedAt(entry.getTimestamp().atZone(ZoneId.systemDefault()).toInstant());
                mEntry.setWasOverridden(!entry.isWasDetectionAccurate());
                mEntry.setBranchId("checkin_live");
                mindeaseMoodRepository.save(mEntry);
            });
        } catch (Exception ignored) {}
    }

    private void syncDemoEntriesToMindease(String email, Object[][] sampleData, LocalDate today) {
        try {
            userRepository.findByEmail(email).ifPresent(user -> {
                mindeaseMoodRepository.deleteByUserIdAndBranchId(user.getId(), "demo_seed");
                List<com.mindease.model.MoodEntry> mindeaseEntries = new ArrayList<>();
                for (Object[] row : sampleData) {
                    com.mindease.model.MoodEntry mEntry = new com.mindease.model.MoodEntry();
                    mEntry.setUserId(user.getId());
                    mEntry.setDate(today.plusDays((int) row[0]).toString());
                    mEntry.setEmotion(((String) row[1]).toLowerCase());
                    mEntry.setIntensity((int) row[2]);
                    mEntry.setAiAnswer((String) row[3]);
                    mEntry.setJournalNote((String) row[4]);
                    mEntry.setCreatedAt(today.plusDays((int) row[0]).atTime(18, 30).atZone(ZoneId.systemDefault()).toInstant());
                    mEntry.setBranchId("demo_seed");
                    mindeaseEntries.add(mEntry);
                }
                mindeaseMoodRepository.saveAll(mindeaseEntries);
            });
        } catch (Exception ignored) {}
    }
}
