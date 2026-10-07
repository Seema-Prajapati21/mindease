package com.mindease;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"com.mindease", "com.moodtracker"})
@EnableMongoRepositories(basePackages = {"com.mindease.repository", "com.moodtracker.repository"})
public class MindEaseApplication {
    public static void main(String[] args) {
        SpringApplication.run(MindEaseApplication.class, args);
    }
}
