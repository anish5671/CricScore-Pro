package com.cricket.scorecard.controller;

import com.cricket.scorecard.dto.response.LiveScoreResponse;
import com.cricket.scorecard.service.LiveScoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class LiveScoreController {

    private final LiveScoreService liveScoreService;

    @GetMapping("/{matchId}/live")
    public ResponseEntity<LiveScoreResponse> getLiveScore(@PathVariable Long matchId) {
        return ResponseEntity.ok(liveScoreService.getLiveScore(matchId));
    }
}