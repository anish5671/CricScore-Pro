package com.cricket.scorecard.service;

import com.cricket.scorecard.dto.request.MatchRequest;
import com.cricket.scorecard.dto.response.MatchResponse;
import com.cricket.scorecard.entity.Match;
import com.cricket.scorecard.enums.MatchStatus;
import com.cricket.scorecard.exception.ResourceNotFoundException;
import com.cricket.scorecard.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final MatchRepository matchRepository;
    private final TeamRepository teamRepository;
    private final TournamentRepository tournamentRepository;

    public List<MatchResponse> getAllMatches() {
        return matchRepository.findAll()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public MatchResponse getMatchById(Long id) {
        return toResponse(matchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Match not found: " + id)));
    }

    public List<MatchResponse> getMatchesByStatus(MatchStatus status) {
        return matchRepository.findByStatus(status)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public MatchResponse createMatch(MatchRequest request) {
        Match match = Match.builder()
                .team1(teamRepository.findById(request.getTeam1Id())
                        .orElseThrow(() -> new ResourceNotFoundException("Team1 not found")))
                .team2(teamRepository.findById(request.getTeam2Id())
                        .orElseThrow(() -> new ResourceNotFoundException("Team2 not found")))
                .format(request.getFormat())
                .customOvers(request.getCustomOvers())
                .venue(request.getVenue())
                .matchDate(request.getMatchDate())
                .tossWinner(request.getTossWinner())
                .tossDecision(request.getTossDecision())
                .status(MatchStatus.UPCOMING)
                .tournament(request.getTournamentId() != null
                        ? tournamentRepository.findById(request.getTournamentId()).orElse(null)
                        : null)
                .build();
        return toResponse(matchRepository.save(match));
    }

    public MatchResponse updateMatchStatus(Long id, MatchStatus status) {
        Match match = matchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Match not found"));
        match.setStatus(status);
        return toResponse(matchRepository.save(match));
    }

    public void deleteMatch(Long id) {
        matchRepository.deleteById(id);
    }

    private MatchResponse toResponse(Match match) {
        MatchResponse response = new MatchResponse();
        response.setId(match.getId());
        response.setTeam1Id(match.getTeam1().getId());
        response.setTeam2Id(match.getTeam2().getId());
        response.setTeam1Name(match.getTeam1().getName());
        response.setTeam2Name(match.getTeam2().getName());
        response.setFormat(match.getFormat());
        response.setCustomOvers(match.getCustomOvers());
        response.setVenue(match.getVenue());
        response.setMatchDate(match.getMatchDate());
        response.setStatus(match.getStatus());
        response.setWinner(match.getWinner());
        response.setResultText(match.getResultText());
        return response;
    }
}