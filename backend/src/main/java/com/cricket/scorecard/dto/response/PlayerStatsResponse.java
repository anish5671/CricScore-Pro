package com.cricket.scorecard.dto.response;

import lombok.Data;

@Data
public class PlayerStatsResponse {
    private Long playerId;
    private String playerName;
    private String team;
    private Integer matches;
    private Integer runs;
    private Double average;
    private Double strikeRate;
    private Integer highest;
    private Integer wickets;
    private Double economy;
}