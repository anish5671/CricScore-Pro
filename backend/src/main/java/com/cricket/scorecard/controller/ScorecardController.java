package com.cricket.scorecard.controller;

import com.cricket.scorecard.dto.response.ScorecardResponse;
import com.cricket.scorecard.service.ScorecardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class ScorecardController {

    private final ScorecardService scorecardService;

    @GetMapping("/{matchId}/scorecard")
    public ResponseEntity<ScorecardResponse> getScorecard(@PathVariable Long matchId) {
        return ResponseEntity.ok(scorecardService.getScorecard(matchId));
    }
}