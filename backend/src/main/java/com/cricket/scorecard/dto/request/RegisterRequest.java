package com.cricket.scorecard.dto.request;

import com.cricket.scorecard.enums.Role;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    private String name;
    @NotBlank @Email
    private String email;
    @NotBlank @Size(min = 6)
    private String password;
    private Role role = Role.ROLE_VIEWER;
}