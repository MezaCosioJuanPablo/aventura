package com.aca.userservice.controller;

import com.aca.userservice.dto.LoginRequest;
import com.aca.userservice.dto.RegisterRequest;
import com.aca.userservice.dto.UserDto;
import com.aca.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        System.out.println("Register request: " + request.getEmail());
        return userService.register(request);
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {
        System.out.println("Login request: " + request.getEmail());
        return userService.login(request);
    }

    @PostMapping("/{userId}/follow/{targetId}")
    public String follow(@PathVariable Long userId, @PathVariable Long targetId) {
        return userService.follow(userId, targetId);
    }

    @GetMapping
    public List<UserDto> allUsers() {
        return userService.getAllUsers();
    }
}
