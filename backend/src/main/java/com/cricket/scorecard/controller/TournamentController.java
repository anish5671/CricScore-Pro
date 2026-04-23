package com.cricket.scorecard.controller;

import com.cricket.scorecard.dto.request.TournamentRequest;
import com.cricket.scorecard.entity.Tournament;
import com.cricket.scorecard.service.TournamentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tournaments")
@RequiredArgsConstructor
public class TournamentController {

    private final TournamentService tournamentService;

    @GetMapping
    public ResponseEntity<List<Tournament>> getAllTournaments() {
        return ResponseEntity.ok(tournamentService.getAllTournaments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tournament> getTournamentById(@PathVariable Long id) {
        return ResponseEntity.ok(tournamentService.getTournamentById(id));
    }

    @PostMapping
    public ResponseEntity<Tournament> createTournament(
            @Valid @RequestBody TournamentRequest request) {
        return ResponseEntity.ok(tournamentService.createTournament(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tournament> updateTournament(
            @PathVariable Long id,
            @Valid @RequestBody TournamentRequest request) {
        return ResponseEntity.ok(tournamentService.updateTournament(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTournament(@PathVariable Long id) {
        tournamentService.deleteTournament(id);
        return ResponseEntity.ok("Tournament deleted");
    }
}