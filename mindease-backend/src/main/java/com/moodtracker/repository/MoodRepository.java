package com.moodtracker.repository;

import com.moodtracker.model.MoodEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MoodRepository extends MongoRepository<MoodEntry, String> {
    List<MoodEntry> findByUserEmailOrderByTimestampDesc(String userEmail);

    void deleteByUserEmailAndDemo(String userEmail, boolean demo);

    default void deleteDemoEntries(String email) {
        deleteByUserEmailAndDemo(email, true);
    }
}
