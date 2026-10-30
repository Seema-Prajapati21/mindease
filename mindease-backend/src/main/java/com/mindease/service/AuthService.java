package com.mindease.service;

import com.mindease.dto.AuthResponse;
import com.mindease.dto.LoginRequest;
import com.mindease.dto.SignupRequest;
import com.mindease.model.User;
import com.mindease.repository.MoodEntryRepository;
import com.mindease.repository.UserRepository;
import com.mindease.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final MoodEntryRepository moodEntryRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       MoodEntryRepository moodEntryRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.moodEntryRepository = moodEntryRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse signup(SignupRequest request) {
        if (request.getAge() == null || request.getAge() < 13 || request.getAge() > 80) {
            throw new IllegalArgumentException("Age must be between 13 and 80");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("EMAIL_EXISTS");
        }

        String ageGroup = request.getAgeGroup();
        if (ageGroup == null || ageGroup.isBlank()) {
            ageGroup = deriveAgeGroup(request.getAge());
        }

        User user = new User(
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword())
        );
        user.setAge(request.getAge());
        user.setAgeGroup(ageGroup);
        user.setProfession(request.getProfession());

        User savedUser = userRepository.save(user);

        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                savedUser.getEmail(),
                savedUser.getPasswordHash(),
                Collections.emptyList()
        );

        String token = jwtService.generateToken(userDetails);
        return new AuthResponse(token, savedUser);
    }

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (Exception ex) {
            throw new BadCredentialsException("INVALID_CREDENTIALS");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("INVALID_CREDENTIALS"));

        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPasswordHash(),
                Collections.emptyList()
        );

        String token = jwtService.generateToken(userDetails);
        return new AuthResponse(token, user);
    }

    public User getMe(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public User updateSettings(String email, Map<String, Object> settingsUpdate) {
        User user = getMe(email);
        User.UserSettings settings = user.getSettings();
        if (settings == null) {
            settings = new User.UserSettings();
        }

        if (settingsUpdate.containsKey("aiConsent")) {
            settings.setAiConsent((Boolean) settingsUpdate.get("aiConsent"));
        }
        if (settingsUpdate.containsKey("showCrisisCard")) {
            settings.setShowCrisisCard((Boolean) settingsUpdate.get("showCrisisCard"));
        }

        user.setSettings(settings);
        return userRepository.save(user);
    }

    public void deleteAccount(String email) {
        User user = getMe(email);
        moodEntryRepository.deleteByUserId(user.getId());
        userRepository.delete(user);
    }

    private String deriveAgeGroup(int age) {
        if (age < 13) return "child";
        if (age <= 17) return "teen";
        if (age <= 25) return "young_adult";
        if (age <= 59) return "adult";
        return "senior";
    }
}
