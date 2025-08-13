package com.aca.userservice.dto;

import lombok.Data;

@Data
public class AuthResponse {
    private String message;
    private UserDto user;
    
    public AuthResponse(String message, UserDto user) {
        this.message = message;
        this.user = user;
    }
    
    public AuthResponse(String message) {
        this.message = message;
    }
}
