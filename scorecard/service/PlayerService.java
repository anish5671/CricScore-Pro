package com.cricket.scorecard.service;

import com.cricket.scorecard.dto.request.PlayerRequest;
import com.cricket.scorecard.entity.Player;
import com.cricket.scorecard.exception.ResourceNotFoundException;
import com.cricket.scorecard.repository.PlayerRepository;
import com.cricket.scorecard.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PlayerService {

    private final PlayerRepository playerRepository;
    private final TeamRepository teamRepository;

    public List<Player> getAllPlayers() {
        return playerRepository.findAll();
    }

    public Player getPlayerById(Long id) {
        return playerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Player not found: " + id));
    }

    public List<Player> getPlayersByTeam(Long teamId) {
        return playerRepository.findByTeamId(teamId);
    }

    public Player createPlayer(PlayerRequest request) {
        Player player = Player.builder()
                .name(request.getName())
                .role(request.getRole())
                .battingStyle(request.getBattingStyle())
                .bowlingStyle(request.getBowlingStyle())
                .age(request.getAge())
                .nationality(request.getNationality())
                .jerseyNumber(request.getJerseyNumber())
                .team(request.getTeamId() != null
                        ? teamRepository.findById(request.getTeamId()).orElse(null)
                        : null)
                .build();
        return playerRepository.save(player);
    }

    public Player updatePlayer(Long id, PlayerRequest request) {
        Player player = getPlayerById(id);
        player.setName(request.getName());
        player.setRole(request.getRole());
        player.setBattingStyle(request.getBattingStyle());
        player.setBowlingStyle(request.getBowlingStyle());
        player.setAge(request.getAge());
        player.setNationality(request.getNationality());
        player.setJerseyNumber(request.getJerseyNumber());
        if (request.getTeamId() != null) {
            player.setTeam(teamRepository.findById(request.getTeamId()).orElse(null));
        }
        return playerRepository.save(player);
    }

    public void deletePlayer(Long id) {
        playerRepository.deleteById(id);
    }
}