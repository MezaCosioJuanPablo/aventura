// UserService.java
package com.aca.userservice.service;

import com.aca.userservice.dto.*;
import java.util.List;

public interface UserService {
    String register(RegisterRequest request);
    String login(LoginRequest request);
    String follow(Long userId, Long targetId);
    List<UserDto> getAllUsers();
}
