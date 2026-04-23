package com.cricket.scorecard.dto.response;

import lombok.Data;
import java.util.List;

@Data
public class LiveScoreResponse {
    private Long matchId;
    private String battingTeam;
    private String bowlingTeam;
    private Integer totalRuns;
    private Integer totalWickets;
    private Integer totalBalls;
    private Double currentRunRate;
    private List<Object> currentOver;
}