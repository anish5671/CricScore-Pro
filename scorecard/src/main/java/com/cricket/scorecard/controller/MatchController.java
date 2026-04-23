package com.cricket.scorecard.controller;

import com.cricket.scorecard.dto.request.MatchRequest;
import com.cricket.scorecard.dto.response.MatchResponse;
import com.cricket.scorecard.enums.MatchStatus;
import com.cricket.scorecard.service.MatchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    @GetMapping
    public ResponseEntity<List<MatchResponse>> getAllMatches() {
        return ResponseEntity.ok(matchService.getAllMatches());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MatchResponse> getMatchById(@PathVariable Long id) {
        return ResponseEntity.ok(matchService.getMatchById(id));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<MatchResponse>> getByStatus(@PathVariable MatchStatus status) {
        return ResponseEntity.ok(matchService.getMatchesByStatus(status));
    }

    @PostMapping
    public ResponseEntity<MatchResponse> createMatch(@Valid @RequestBody MatchRequest request) {
        return ResponseEntity.ok(matchService.createMatch(request));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<MatchResponse> updateStatus(@PathVariable Long id,
                                                      @RequestParam MatchStatus status) {
        return ResponseEntity.ok(matchService.updateMatchStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMatch(@PathVariable Long id) {
        matchService.deleteMatch(id);
        return ResponseEntity.ok("Match deleted");
    }
}