// UserService.java
package com.aca.userservice.service;

import com.aca.userservice.dto.*;
import com.aca.userservice.model.User;
import java.util.List;

public interface UserService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    String followUser(Long userId, Long targetId);
    List<User> getAllUsers();
}
