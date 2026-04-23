package com.cricket.scorecard.dto.request;

import com.cricket.scorecard.enums.MatchFormat;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class MatchRequest {
    @NotNull
    private Long team1Id;
    @NotNull
    private Long team2Id;
    @NotNull
    private MatchFormat format;
    private Integer customOvers;
    private String venue;
    private LocalDate matchDate;
    private String tossWinner;
    private String tossDecision;
    private Long tournamentId;
}