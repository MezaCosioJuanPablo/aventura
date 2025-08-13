package com.aca.userservice.controller;

import com.aca.userservice.dto.LoginRequest;
import com.aca.userservice.dto.RegisterRequest;
import com.aca.userservice.dto.AuthResponse;
import com.aca.userservice.model.User;
import com.aca.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
// CORS manejado por TomcatCorsFilter
public class UserController {

    private final UserService userService;

    @PostMapping(value = "/register", produces = "application/json")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse result = userService.register(request);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new AuthResponse("Error en el registro: " + e.getMessage()));
        }
    }

    @PostMapping(value = "/login", produces = "application/json")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse result = userService.login(request);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new AuthResponse("Error en el login: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PostMapping("/{userId}/follow/{targetId}")
    public ResponseEntity<String> followUser(@PathVariable Long userId, @PathVariable Long targetId) {
        try {
            String result = userService.followUser(userId, targetId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al seguir usuario: " + e.getMessage());
        }
    }
}
