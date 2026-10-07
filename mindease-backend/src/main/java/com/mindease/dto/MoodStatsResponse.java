package com.mindease.dto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MoodStatsResponse {

    private DateRange range;
    private int totalEntries;
    private int streak;
    private double avg7;
    private double avg30;
    private int bestScore;
    private String todayEmotion;
    private Integer todayIntensity;
    private List<DailyScore> dailyScores = new ArrayList<>();
    private Map<String, Integer> emotionCounts = new HashMap<>();
    private List<TagCorrelation> correlations = new ArrayList<>();

    public MoodStatsResponse() {
    }

    public static class DateRange {
        private String from;
        private String to;

        public DateRange() {
        }

        public DateRange(String from, String to) {
            this.from = from;
            this.to = to;
        }

        public String getFrom() {
            return from;
        }

        public void setFrom(String from) {
            this.from = from;
        }

        public String getTo() {
            return to;
        }

        public void setTo(String to) {
            this.to = to;
        }
    }

    public static class DailyScore {
        private String date;
        private Double score;
        private String emotion;

        public DailyScore() {
        }

        public DailyScore(String date, Double score, String emotion) {
            this.date = date;
            this.score = score;
            this.emotion = emotion;
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public Double getScore() {
            return score;
        }

        public void setScore(Double score) {
            this.score = score;
        }

        public String getEmotion() {
            return emotion;
        }

        public void setEmotion(String emotion) {
            this.emotion = emotion;
        }
    }

    public static class TagCorrelation {
        private String tag;
        private double avgTagged;
        private double avgUntagged;
        private int deltaPct;
        private int sampleSize;

        public TagCorrelation() {
        }

        public TagCorrelation(String tag, double avgTagged, double avgUntagged, int deltaPct, int sampleSize) {
            this.tag = tag;
            this.avgTagged = avgTagged;
            this.avgUntagged = avgUntagged;
            this.deltaPct = deltaPct;
            this.sampleSize = sampleSize;
        }

        public String getTag() {
            return tag;
        }

        public void setTag(String tag) {
            this.tag = tag;
        }

        public double getAvgTagged() {
            return avgTagged;
        }

        public void setAvgTagged(double avgTagged) {
            this.avgTagged = avgTagged;
        }

        public double getAvgUntagged() {
            return avgUntagged;
        }

        public void setAvgUntagged(double avgUntagged) {
            this.avgUntagged = avgUntagged;
        }

        public int getDeltaPct() {
            return deltaPct;
        }

        public void setDeltaPct(int deltaPct) {
            this.deltaPct = deltaPct;
        }

        public int getSampleSize() {
            return sampleSize;
        }

        public void setSampleSize(int sampleSize) {
            this.sampleSize = sampleSize;
        }
    }

    public DateRange getRange() {
        return range;
    }

    public void setRange(DateRange range) {
        this.range = range;
    }

    public int getTotalEntries() {
        return totalEntries;
    }

    public void setTotalEntries(int totalEntries) {
        this.totalEntries = totalEntries;
    }

    public int getStreak() {
        return streak;
    }

    public void setStreak(int streak) {
        this.streak = streak;
    }

    public double getAvg7() {
        return avg7;
    }

    public void setAvg7(double avg7) {
        this.avg7 = avg7;
    }

    public double getAvg30() {
        return avg30;
    }

    public void setAvg30(double avg30) {
        this.avg30 = avg30;
    }

    public int getBestScore() {
        return bestScore;
    }

    public void setBestScore(int bestScore) {
        this.bestScore = bestScore;
    }

    public String getTodayEmotion() {
        return todayEmotion;
    }

    public void setTodayEmotion(String todayEmotion) {
        this.todayEmotion = todayEmotion;
    }

    public Integer getTodayIntensity() {
        return todayIntensity;
    }

    public void setTodayIntensity(Integer todayIntensity) {
        this.todayIntensity = todayIntensity;
    }

    public List<DailyScore> getDailyScores() {
        return dailyScores;
    }

    public void setDailyScores(List<DailyScore> dailyScores) {
        this.dailyScores = dailyScores;
    }

    public Map<String, Integer> getEmotionCounts() {
        return emotionCounts;
    }

    public void setEmotionCounts(Map<String, Integer> emotionCounts) {
        this.emotionCounts = emotionCounts;
    }

    public List<TagCorrelation> getCorrelations() {
        return correlations;
    }

    public void setCorrelations(List<TagCorrelation> correlations) {
        this.correlations = correlations;
    }
}
