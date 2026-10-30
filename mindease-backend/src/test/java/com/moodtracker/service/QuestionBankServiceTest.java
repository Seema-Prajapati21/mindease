package com.moodtracker.service;

import com.mindease.dto.SignupRequest;
import com.moodtracker.model.Option;
import com.moodtracker.model.Question;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

public class QuestionBankServiceTest {

    private final QuestionBankService questionBankService = new QuestionBankService();
    private static Validator validator;

    @BeforeAll
    static void setUpValidator() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void testQuestionPoolHas63QuestionsAcross9Categories() throws Exception {
        Field poolField = QuestionBankService.class.getDeclaredField("questionBank");
        poolField.setAccessible(true);
        @SuppressWarnings("unchecked")
        List<Question> pool = (List<Question>) poolField.get(questionBankService);

        assertEquals(63, pool.size(), "Question pool must contain exactly 63 questions");

        Map<String, Integer> categoryCounts = new HashMap<>();
        for (Question q : pool) {
            categoryCounts.put(q.getCategory(), categoryCounts.getOrDefault(q.getCategory(), 0) + 1);
            assertEquals(4, q.getOptions().size(), "Question " + q.getId() + " must have 4 options in pool");
        }

        Set<String> expectedCategories = Set.of("body", "mind", "metaphor", "social", "needs", "self", "sensory", "coping", "outlook");
        assertEquals(expectedCategories, categoryCounts.keySet(), "Categories must match exactly the 9 expected categories");
        
        System.out.println("Category breakdown in pool: " + categoryCounts);
    }

    @Test
    void testDailyQuestionsReturnsExactly6QuestionsWithProperComposition() {
        List<String> lastSeen = new ArrayList<>();
        Set<String> secondaryAllowed = Set.of("metaphor", "social", "needs", "self", "sensory", "coping", "outlook");

        for (int i = 0; i < 10; i++) {
            List<Question> questions = questionBankService.getDailyQuestions("adult", lastSeen);
            assertEquals(6, questions.size(), "Must return exactly 6 questions");

            assertEquals("body", questions.get(0).getCategory(), "First question must be 'body'");
            assertEquals("mind", questions.get(1).getCategory(), "Second question must be 'mind'");

            Set<String> secondarySeen = new HashSet<>();
            for (int j = 2; j < 6; j++) {
                String cat = questions.get(j).getCategory();
                assertTrue(secondaryAllowed.contains(cat), "Question " + (j + 1) + " must be from secondary categories: " + cat);
                assertFalse(secondarySeen.contains(cat), "Secondary categories must be distinct: " + cat);
                secondarySeen.add(cat);
            }
            assertEquals(4, secondarySeen.size(), "Must have 4 distinct secondary categories");

            // Check that every question has "Skip / Not sure" option
            for (Question q : questions) {
                assertTrue(q.getOptions().stream().anyMatch(o -> "Skip / Not sure".equalsIgnoreCase(o.getLabel())),
                        "Question " + q.getId() + " must contain 'Skip / Not sure'");
            }

            // Update lastSeen for subsequent runs
            lastSeen.clear();
            for (Question q : questions) {
                lastSeen.add(q.getId());
            }
        }
    }

    @Test
    void testAgeValidationBoundaries() {
        // Test age 12 (rejected)
        SignupRequest req12 = new SignupRequest("user12", "user12@example.com", "Password123!", 12, null, null);
        Set<ConstraintViolation<SignupRequest>> violations12 = validator.validate(req12);
        assertFalse(violations12.isEmpty(), "Age 12 must be rejected");
        assertTrue(violations12.stream().anyMatch(v -> v.getPropertyPath().toString().equals("age")), "Age 12 violation on age property");

        // Test age 13 (accepted)
        SignupRequest req13 = new SignupRequest("user13", "user13@example.com", "Password123!", 13, null, null);
        Set<ConstraintViolation<SignupRequest>> violations13 = validator.validate(req13);
        assertTrue(violations13.stream().noneMatch(v -> v.getPropertyPath().toString().equals("age")), "Age 13 must be accepted");

        // Test age 80 (accepted)
        SignupRequest req80 = new SignupRequest("user80", "user80@example.com", "Password123!", 80, null, null);
        Set<ConstraintViolation<SignupRequest>> violations80 = validator.validate(req80);
        assertTrue(violations80.stream().noneMatch(v -> v.getPropertyPath().toString().equals("age")), "Age 80 must be accepted");

        // Test age 81 (rejected)
        SignupRequest req81 = new SignupRequest("user81", "user81@example.com", "Password123!", 81, null, null);
        Set<ConstraintViolation<SignupRequest>> violations81 = validator.validate(req81);
        assertFalse(violations81.isEmpty(), "Age 81 must be rejected");
        assertTrue(violations81.stream().anyMatch(v -> v.getPropertyPath().toString().equals("age")), "Age 81 violation on age property");
    }
}
