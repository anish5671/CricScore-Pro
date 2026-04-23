package com.cricket.scorecard.service;

import com.cricket.scorecard.dto.request.LoginRequest;
import com.cricket.scorecard.dto.request.RegisterRequest;
import com.cricket.scorecard.dto.response.JwtResponse;
import com.cricket.scorecard.entity.User;
import com.cricket.scorecard.exception.ResourceNotFoundException;
import com.cricket.scorecard.repository.UserRepository;
import com.cricket.scorecard.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    public JwtResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(), request.getPassword()
                )
        );
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String token = jwtTokenProvider.generateToken(
                user.getEmail(), user.getRole().name()
        );
        return new JwtResponse(token, user.getEmail(), user.getName(), user.getRole().name());
    }

    public JwtResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .active(true)
                .build();
        userRepository.save(user);
        String token = jwtTokenProvider.generateToken(
                user.getEmail(), user.getRole().name()
        );
        return new JwtResponse(token, user.getEmail(), user.getName(), user.getRole().name());
    }
}