package com.cricket.scorecard.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PlayerRequest {
    @NotBlank
    private String name;
    private String role;
    private String battingStyle;
    private String bowlingStyle;
    private Integer age;
    private String nationality;
    private String jerseyNumber;
    private Long teamId;
}