package com.cricket.scorecard.dto.response;

import lombok.Data;
import java.util.List;

@Data
public class ScorecardResponse {
    private Long matchId;
    private String team1;
    private String team2;
    private String result;
    private List<InningsData> innings;

    @Data
    public static class InningsData {
        private String battingTeam;
        private Integer totalRuns;
        private Integer totalWickets;
        private Integer totalBalls;
        private Integer extras;
    }
}