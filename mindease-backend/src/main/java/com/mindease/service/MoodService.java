package com.mindease.service;

import com.mindease.dto.FollowupRequest;
import com.mindease.dto.FollowupResponse;
import com.mindease.dto.MoodLogRequest;
import com.mindease.engine.AiRefinementStrategy;
import com.mindease.model.MoodEntry;
import com.mindease.model.User;
import com.mindease.repository.MoodEntryRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class MoodService {

    private final MoodEntryRepository moodEntryRepository;
    private final AuthService authService;
    private final AiRefinementStrategy aiRefinementStrategy;

    public MoodService(MoodEntryRepository moodEntryRepository,
                       AuthService authService,
                       AiRefinementStrategy aiRefinementStrategy) {
        this.moodEntryRepository = moodEntryRepository;
        this.authService = authService;
        this.aiRefinementStrategy = aiRefinementStrategy;
    }

    public MoodEntry logMood(String userEmail, MoodLogRequest request) {
        User user = authService.getMe(userEmail);

        String entryDate = request.getDate() != null && !request.getDate().trim().isEmpty()
                ? request.getDate()
                : LocalDate.now().toString();

        Optional<MoodEntry> existingOpt = moodEntryRepository.findByUserIdAndDate(user.getId(), entryDate);
        MoodEntry entry = existingOpt.orElseGet(MoodEntry::new);

        entry.setUserId(user.getId());
        entry.setDate(entryDate);
        entry.setCreatedAt(Instant.now());
        entry.setBodyFeel(request.getBodyFeel());
        entry.setMindText(request.getMindText());
        entry.setBranchId(request.getBranchId());
        entry.setBranchAnswer(request.getBranchAnswer());
        entry.setAiAnswer(request.getAiAnswer());
        entry.setEmotion(request.getEmotion());
        entry.setIntensity(request.getIntensity());
        entry.setTags(request.getTags());
        entry.setJournalNote(request.getJournalNote());
        entry.setSuggestedEmotion(request.getSuggestedEmotion());
        if (request.getWasOverridden() != null) {
            entry.setWasOverridden(request.getWasOverridden());
        } else {
            entry.setWasOverridden(!request.getEmotion().equalsIgnoreCase(request.getSuggestedEmotion()));
        }

        return moodEntryRepository.save(entry);
    }

    public FollowupResponse getFollowupQuestion(String userEmail, FollowupRequest request) {
        User user = authService.getMe(userEmail);
        boolean aiConsent = user.getSettings() != null && user.getSettings().isAiConsent();
        return aiRefinementStrategy.generateFollowupQuestion(
                request.getBodyFeel(),
                request.getMindText(),
                aiConsent
        );
    }

    public List<MoodEntry> getUserEntries(String userId) {
        return moodEntryRepository.findByUserIdOrderByDateDesc(userId);
    }

    public List<MoodEntry> getUserEntriesBetween(String userId, String startDate, String endDate) {
        return moodEntryRepository.findByUserIdAndDateBetweenOrderByDateAsc(userId, startDate, endDate);
    }
}
