package com.cricket.scorecard.service;

import com.cricket.scorecard.dto.response.ScorecardResponse;
import com.cricket.scorecard.entity.Innings;
import com.cricket.scorecard.exception.ResourceNotFoundException;
import com.cricket.scorecard.repository.InningsRepository;
import com.cricket.scorecard.repository.MatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScorecardService {

    private final MatchRepository matchRepository;
    private final InningsRepository inningsRepository;

    public ScorecardResponse getScorecard(Long matchId) {
        var match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Match not found"));

        List<Innings> inningsList = inningsRepository.findByMatchId(matchId);

        ScorecardResponse response = new ScorecardResponse();
        response.setMatchId(matchId);
        response.setTeam1(match.getTeam1().getName());
        response.setTeam2(match.getTeam2().getName());
        response.setResult(match.getResultText());

        List<ScorecardResponse.InningsData> inningsData = inningsList.stream().map(innings -> {
            ScorecardResponse.InningsData data = new ScorecardResponse.InningsData();
            data.setBattingTeam(innings.getBattingTeam().getName());
            data.setTotalRuns(innings.getTotalRuns());
            data.setTotalWickets(innings.getTotalWickets());
            data.setTotalBalls(innings.getTotalBalls());
            data.setExtras(innings.getExtras());
            return data;
        }).collect(Collectors.toList());

        response.setInnings(inningsData);
        return response;
    }
}