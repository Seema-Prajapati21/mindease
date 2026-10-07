package com.mindease.service;

import com.mindease.dto.MoodStatsResponse;
import com.mindease.model.MoodEntry;
import com.mindease.model.User;
import com.mindease.repository.MoodEntryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StatsService {

    private final MoodEntryRepository moodEntryRepository;
    private final AuthService authService;

    private static final Map<String, Integer> SCORE_HINTS = Map.of(
            "happy", 9,
            "hopeful", 8,
            "calm", 8,
            "grateful", 8,
            "neutral", 5,
            "sad", 3,
            "anxious", 3,
            "angry", 3,
            "overwhelmed", 2
    );

    public StatsService(MoodEntryRepository moodEntryRepository, AuthService authService) {
        this.moodEntryRepository = moodEntryRepository;
        this.authService = authService;
    }

    public MoodStatsResponse calculateStats(String userEmail, int days) {
        User user = authService.getMe(userEmail);
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(days - 1);

        List<MoodEntry> entries = moodEntryRepository.findByUserIdOrderByDateDesc(user.getId());
        Map<String, MoodEntry> entryDateMap = entries.stream()
                .collect(Collectors.toMap(MoodEntry::getDate, e -> e, (e1, e2) -> e1));

        MoodStatsResponse response = new MoodStatsResponse();
        response.setRange(new MoodStatsResponse.DateRange(startDate.toString(), today.toString()));
        response.setTotalEntries(entries.size());

        // Streak calculation
        int streak = 0;
        LocalDate checkDate = today;
        if (!entryDateMap.containsKey(checkDate.toString())) {
            checkDate = checkDate.minusDays(1);
        }
        while (entryDateMap.containsKey(checkDate.toString())) {
            streak++;
            checkDate = checkDate.minusDays(1);
        }
        response.setStreak(streak);

        // Today's entry
        MoodEntry todayEntry = entryDateMap.get(today.toString());
        if (todayEntry != null) {
            response.setTodayEmotion(todayEntry.getEmotion());
            response.setTodayIntensity(todayEntry.getIntensity());
        }

        // Daily scores for the window
        List<MoodStatsResponse.DailyScore> dailyScores = new ArrayList<>();
        List<Double> scores7 = new ArrayList<>();
        List<Double> scores30 = new ArrayList<>();
        Map<String, Integer> emotionCounts = new HashMap<>();

        for (int i = days - 1; i >= 0; i--) {
            LocalDate d = today.minusDays(i);
            String dStr = d.toString();
            MoodEntry entry = entryDateMap.get(dStr);

            if (entry != null) {
                double score = computeBlendedScore(entry);
                dailyScores.add(new MoodStatsResponse.DailyScore(dStr, Math.round(score * 10.0) / 10.0, entry.getEmotion()));
                scores30.add(score);
                if (i < 7) {
                    scores7.add(score);
                }
                emotionCounts.put(entry.getEmotion(), emotionCounts.getOrDefault(entry.getEmotion(), 0) + 1);
            } else {
                dailyScores.add(new MoodStatsResponse.DailyScore(dStr, null, null));
            }
        }
        response.setDailyScores(dailyScores);
        response.setEmotionCounts(emotionCounts);

        double avg7 = scores7.isEmpty() ? 0.0 : scores7.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
        double avg30 = scores30.isEmpty() ? 0.0 : scores30.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
        response.setAvg7(Math.round(avg7 * 10.0) / 10.0);
        response.setAvg30(Math.round(avg30 * 10.0) / 10.0);

        int bestScore = scores30.isEmpty() ? 0 : (int) Math.round(scores30.stream().mapToDouble(Double::doubleValue).max().orElse(0.0));
        response.setBestScore(bestScore);

        // Tag correlations
        List<String> commonTags = Arrays.asList("restful_sleep", "poor_sleep", "academics", "family", "friends", "health");
        List<MoodStatsResponse.TagCorrelation> correlations = new ArrayList<>();

        for (String tag : commonTags) {
            List<MoodEntry> tagged = entries.stream()
                    .filter(e -> e.getTags() != null && e.getTags().contains(tag))
                    .collect(Collectors.toList());
            List<MoodEntry> untagged = entries.stream()
                    .filter(e -> e.getTags() == null || !e.getTags().contains(tag))
                    .collect(Collectors.toList());

            if (tagged.size() >= 2 && untagged.size() >= 2) {
                double avgT = tagged.stream().mapToDouble(this::computeBlendedScore).average().orElse(0.0);
                double avgU = untagged.stream().mapToDouble(this::computeBlendedScore).average().orElse(0.0);
                int deltaPct = avgU > 0 ? (int) Math.round(((avgT - avgU) / avgU) * 100.0) : 0;

                correlations.add(new MoodStatsResponse.TagCorrelation(
                        tag,
                        Math.round(avgT * 10.0) / 10.0,
                        Math.round(avgU * 10.0) / 10.0,
                        deltaPct,
                        tagged.size()
                ));
            }
        }

        correlations.sort((a, b) -> Integer.compare(Math.abs(b.getDeltaPct()), Math.abs(a.getDeltaPct())));
        response.setCorrelations(correlations);

        return response;
    }

    private double computeBlendedScore(MoodEntry entry) {
        int base = SCORE_HINTS.getOrDefault(entry.getEmotion().toLowerCase(), 5);
        if (entry.getIntensity() > 0) {
            return (base * 0.7) + (entry.getIntensity() * 0.3);
        }
        return base;
    }
}
