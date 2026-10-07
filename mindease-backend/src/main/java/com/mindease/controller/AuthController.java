package com.mindease.controller;

import com.mindease.dto.AuthResponse;
import com.mindease.dto.LoginRequest;
import com.mindease.dto.SignupRequest;
import com.mindease.model.User;
import com.mindease.service.AuthService;
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
@RequestMapping("/api/auth")
@Tag(name = "Authentication & Settings", description = "Endpoints for user registration, authentication, preferences, and account deletion.")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    @Operation(summary = "Register a new user", description = "Creates a private space for the user and returns access JWT.")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        AuthResponse response = authService.signup(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user", description = "Validates credentials and returns JWT bearer token.")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile")
    public ResponseEntity<Map<String, Object>> getMe(@AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getMe(userDetails.getUsername());
        return ResponseEntity.ok(Map.of("user", new AuthResponse.UserDto(user.getId(), user.getName(), user.getEmail(), user.getAge(), user.getAgeGroup(), user.getProfession(), user.getSettings())));
    }

    @PatchMapping("/settings")
    @Operation(summary = "Update user settings and privacy consent")
    public ResponseEntity<Map<String, Object>> updateSettings(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Object> settings) {
        User updated = authService.updateSettings(userDetails.getUsername(), settings);
        return ResponseEntity.ok(Map.of("user", new AuthResponse.UserDto(updated.getId(), updated.getName(), updated.getEmail(), updated.getAge(), updated.getAgeGroup(), updated.getProfession(), updated.getSettings())));
    }

    @DeleteMapping("/account")
    @Operation(summary = "Permanently delete user account and mood data")
    public ResponseEntity<Void> deleteAccount(@AuthenticationPrincipal UserDetails userDetails) {
        authService.deleteAccount(userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
