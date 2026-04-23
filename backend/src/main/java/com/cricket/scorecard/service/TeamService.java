package com.cricket.scorecard.service;

import com.cricket.scorecard.dto.request.TeamRequest;
import com.cricket.scorecard.entity.Team;
import com.cricket.scorecard.exception.ResourceNotFoundException;
import com.cricket.scorecard.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;

    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    public Team getTeamById(Long id) {
        return teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found: " + id));
    }

    public Team createTeam(TeamRequest request) {
        Team team = Team.builder()
                .name(request.getName())
                .shortName(request.getShortName())
                .logoUrl(request.getLogoUrl())
                .homeGround(request.getHomeGround())
                .build();
        return teamRepository.save(team);
    }

    public Team updateTeam(Long id, TeamRequest request) {
        Team team = getTeamById(id);
        team.setName(request.getName());
        team.setShortName(request.getShortName());
        team.setLogoUrl(request.getLogoUrl());
        team.setHomeGround(request.getHomeGround());
        return teamRepository.save(team);
    }

    public void deleteTeam(Long id) {
        teamRepository.deleteById(id);
    }
}