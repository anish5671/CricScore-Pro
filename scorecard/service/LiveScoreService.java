package com.cricket.scorecard.service;

import com.cricket.scorecard.dto.response.LiveScoreResponse;
import com.cricket.scorecard.entity.Delivery;
import com.cricket.scorecard.entity.Innings;
import com.cricket.scorecard.exception.ResourceNotFoundException;
import com.cricket.scorecard.repository.DeliveryRepository;
import com.cricket.scorecard.repository.InningsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LiveScoreService {

    private final InningsRepository inningsRepository;
    private final DeliveryRepository deliveryRepository;

    public LiveScoreResponse getLiveScore(Long matchId) {
        List<Innings> inningsList = inningsRepository.findByMatchId(matchId);

        if (inningsList.isEmpty()) {
            throw new ResourceNotFoundException("No innings found for match: " + matchId);
        }

        Innings currentInnings = inningsList.stream()
                .filter(i -> !i.isCompleted())
                .findFirst()
                .orElse(inningsList.get(inningsList.size() - 1));

        int currentOverNumber = currentInnings.getTotalBalls() / 6;

        List<Delivery> currentOverDeliveries = deliveryRepository
                .findByInningsIdAndOverNumber(currentInnings.getId(), currentOverNumber);

        List<Object> currentOver = currentOverDeliveries.stream()
                .map(d -> {
                    if (d.isWide())   return (Object) "Wd";
                    if (d.isNoBall()) return (Object) "Nb";
                    if (d.isWicket()) return (Object) "W";
                    return (Object) d.getRuns();
                })
                .collect(Collectors.toList());

        double crr = currentInnings.getTotalBalls() > 0
                ? Math.round(((double) currentInnings.getTotalRuns()
                / currentInnings.getTotalBalls() * 6) * 100.0) / 100.0
                : 0.0;

        LiveScoreResponse response = new LiveScoreResponse();
        response.setMatchId(matchId);
        response.setBattingTeam(currentInnings.getBattingTeam().getName());
        response.setBowlingTeam(currentInnings.getBowlingTeam().getName());
        response.setTotalRuns(currentInnings.getTotalRuns());
        response.setTotalWickets(currentInnings.getTotalWickets());
        response.setTotalBalls(currentInnings.getTotalBalls());
        response.setCurrentRunRate(crr);
        response.setCurrentOver(currentOver);

        return response;
    }
}