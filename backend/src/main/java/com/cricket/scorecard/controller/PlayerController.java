package com.cricket.scorecard.controller;

import com.cricket.scorecard.dto.request.PlayerRequest;
import com.cricket.scorecard.entity.Player;
import com.cricket.scorecard.service.PlayerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/players")
@RequiredArgsConstructor
public class PlayerController {

    private final PlayerService playerService;

    @GetMapping
    public ResponseEntity<List<Player>> getAllPlayers() {
        return ResponseEntity.ok(playerService.getAllPlayers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Player> getPlayerById(@PathVariable Long id) {
        return ResponseEntity.ok(playerService.getPlayerById(id));
    }

    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<Player>> getPlayersByTeam(@PathVariable Long teamId) {
        return ResponseEntity.ok(playerService.getPlayersByTeam(teamId));
    }

    @PostMapping
    public ResponseEntity<Player> createPlayer(@Valid @RequestBody PlayerRequest request) {
        return ResponseEntity.ok(playerService.createPlayer(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Player> updatePlayer(@PathVariable Long id,
                                               @Valid @RequestBody PlayerRequest request) {
        return ResponseEntity.ok(playerService.updatePlayer(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePlayer(@PathVariable Long id) {
        playerService.deletePlayer(id);
        return ResponseEntity.ok("Player deleted");
    }
}