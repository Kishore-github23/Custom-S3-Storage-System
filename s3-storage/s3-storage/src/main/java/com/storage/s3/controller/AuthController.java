package com.storage.s3.controller;

import com.storage.s3.dto.AuthResponse;
import com.storage.s3.dto.LoginRequest;
import com.storage.s3.dto.RegisterRequest;
import com.storage.s3.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        System.out.println("🔐 Register request for: " + request.getEmail()); // Add logging
        return ResponseEntity.ok(authService.register(request));
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        System.out.println("🔐 Login request for: " + request.getEmail()); // Add logging
        return ResponseEntity.ok(authService.login(request));
    }
}