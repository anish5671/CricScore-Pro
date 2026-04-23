package com.cricket.scorecard.dto.response;

import com.cricket.scorecard.enums.MatchFormat;
import com.cricket.scorecard.enums.MatchStatus;
import lombok.Data;
import java.time.LocalDate;

@Data
public class MatchResponse {
    private Long id;
    private Long team1Id;
    private Long team2Id;
    private String team1Name;
    private String team2Name;
    private MatchFormat format;
    private Integer customOvers;
    private String venue;
    private LocalDate matchDate;
    private MatchStatus status;
    private String winner;
    private String resultText;
}