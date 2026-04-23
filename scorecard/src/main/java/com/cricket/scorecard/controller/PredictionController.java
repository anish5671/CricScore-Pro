package com.cricket.scorecard.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/predict")
@RequiredArgsConstructor
public class PredictionController {

    @PostMapping("/score")
    public ResponseEntity<?> predictScore(@RequestBody Map<String, Object> request) {
        int currentRuns    = (int) request.get("currentRuns");
        int currentBalls   = (int) request.get("currentBalls");
        int totalOvers     = (int) request.get("totalOvers");
        int wicketsLeft    = (int) request.get("wicketsLeft");

        int totalBalls     = totalOvers * 6;
        int ballsRemaining = totalBalls - currentBalls;

        double currentRR   = currentBalls > 0
                ? (double) currentRuns / currentBalls * 6 : 0;

        double wicketFactor = 1.0 + (wicketsLeft * 0.05);
        int projectedScore  = (int) (currentRuns + (currentRR * wicketFactor
                * ballsRemaining / 6));

        return ResponseEntity.ok(Map.of(
                "projectedScore", projectedScore,
                "currentRunRate", Math.round(currentRR * 100.0) / 100.0,
                "ballsRemaining", ballsRemaining
        ));
    }
}