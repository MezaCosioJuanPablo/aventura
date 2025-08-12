package com.aca.userservice.service.impl;

import com.aca.userservice.dto.LoginRequest;
import com.aca.userservice.dto.RegisterRequest;
import com.aca.userservice.dto.UserDto;
import com.aca.userservice.model.User;
import com.aca.userservice.repository.UserRepository;
import com.aca.userservice.service.UserService;
// import com.aca.userservice.config.JwtService; // Temporalmente deshabilitado
import lombok.RequiredArgsConstructor;
// import org.springframework.security.crypto.password.PasswordEncoder; // Temporalmente deshabilitado
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    // private final PasswordEncoder passwordEncoder; // Temporalmente deshabilitado
    // private final JwtService jwtService; // Temporalmente deshabilitado

    @Override
    public String register(RegisterRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        // user.setPassword(passwordEncoder.encode(request.getPassword())); // Temporalmente deshabilitado
        user.setPassword(request.getPassword()); // Contraseña sin encriptar temporalmente
        userRepository.save(user);
        // return jwtService.generateToken(user.getEmail()); // Temporalmente deshabilitado
        return "Usuario registrado exitosamente: " + user.getUsername();
    }

    @Override
    public String login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        // if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) { // Temporalmente deshabilitado
        if (!request.getPassword().equals(user.getPassword())) { // Comparación simple temporalmente
            throw new RuntimeException("Contraseña incorrecta");
        }
        // return jwtService.generateToken(user.getEmail()); // Temporalmente deshabilitado
        return "Login exitoso para: " + user.getUsername();
    }

    @Override
    public String follow(Long userId, Long targetId) {
        User user = userRepository.findById(userId).orElseThrow();
        User target = userRepository.findById(targetId).orElseThrow();
        user.getFollowing().add(target);
        userRepository.save(user);
        return "Ahora sigues a " + target.getUsername();
    }

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream().map(user -> {
            UserDto dto = new UserDto();
            dto.setId(user.getId());
            dto.setUsername(user.getUsername());
            dto.setEmail(user.getEmail());
            return dto;
        }).collect(Collectors.toList());
    }
}
