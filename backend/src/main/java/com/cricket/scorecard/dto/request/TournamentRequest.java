package com.cricket.scorecard.dto.request;

import com.cricket.scorecard.enums.MatchFormat;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;

@Data
public class TournamentRequest {
    @NotBlank
    private String name;
    private MatchFormat format;
    private Integer customOvers;
    private LocalDate startDate;
    private LocalDate endDate;
}