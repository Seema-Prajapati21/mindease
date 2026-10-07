package com.mindease.repository;

import com.mindease.model.MoodEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MoodEntryRepository extends MongoRepository<MoodEntry, String> {
    List<MoodEntry> findByUserIdOrderByDateDesc(String userId);

    List<MoodEntry> findByUserIdAndDateBetweenOrderByDateAsc(String userId, String startDate, String endDate);

    Optional<MoodEntry> findByUserIdAndDate(String userId, String date);

    void deleteByUserId(String userId);

    void deleteByUserIdAndBranchId(String userId, String branchId);
}
