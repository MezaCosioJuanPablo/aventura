// RegisterRequest.java
package com.aca.userservice.dto;
import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
}
