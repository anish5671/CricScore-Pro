package com.cricket.scorecard.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TeamRequest {
    @NotBlank
    private String name;
    private String shortName;
    private String logoUrl;
    private String homeGround;
}