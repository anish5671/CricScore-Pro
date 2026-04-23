package com.cricket.scorecard.service;

import com.cricket.scorecard.dto.request.DeliveryRequest;
import com.cricket.scorecard.entity.*;
import com.cricket.scorecard.exception.ResourceNotFoundException;
import com.cricket.scorecard.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InningsService {

    private final InningsRepository inningsRepository;
    private final DeliveryRepository deliveryRepository;
    private final MatchRepository matchRepository;
    private final PlayerRepository playerRepository;

    public Innings startInnings(Long matchId, Long battingTeamId,
                                Long bowlingTeamId, Integer inningsNumber) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Match not found"));

        Innings innings = Innings.builder()
                .match(match)
                .battingTeam(match.getTeam1().getId().equals(battingTeamId)
                        ? match.getTeam1() : match.getTeam2())
                .bowlingTeam(match.getTeam1().getId().equals(bowlingTeamId)
                        ? match.getTeam1() : match.getTeam2())
                .inningsNumber(inningsNumber)
                .totalRuns(0)
                .totalWickets(0)
                .totalBalls(0)
                .extras(0)
                .isCompleted(false)
                .build();

        return inningsRepository.save(innings);
    }

    public Delivery addDelivery(Long inningsId, DeliveryRequest request) {
        Innings innings = inningsRepository.findById(inningsId)
                .orElseThrow(() -> new ResourceNotFoundException("Innings not found"));

        Player batsman = playerRepository.findById(request.getBatsmanId())
                .orElseThrow(() -> new ResourceNotFoundException("Batsman not found"));
        Player bowler = playerRepository.findById(request.getBowlerId())
                .orElseThrow(() -> new ResourceNotFoundException("Bowler not found"));

        boolean isLegalDelivery = !request.isWide() && !request.isNoBall();

        int overNumber = innings.getTotalBalls() / 6;
        int ballNumber = innings.getTotalBalls() % 6 + 1;

        int runsScored = request.getRuns() != null ? request.getRuns() : 0;
        int extraRuns  = request.getExtraRuns() != null ? request.getExtraRuns() : 0;

        Delivery delivery = Delivery.builder()
                .innings(innings)
                .batsman(batsman)
                .bowler(bowler)
                .overNumber(overNumber)
                .ballNumber(ballNumber)
                .runs(runsScored)
                .isWicket(request.isWicket())
                .dismissalType(request.isWicket() ? request.getDismissalType() : null)
                .isExtra(request.isExtra() || request.isWide() || request.isNoBall())
                .extraType(request.getExtraType())
                .extraRuns(extraRuns)
                .isNoBall(request.isNoBall())
                .isWide(request.isWide())
                .isFreeHit(false)
                .build();

        deliveryRepository.save(delivery);

        if (request.isWide()) {
            innings.setTotalRuns(innings.getTotalRuns() + 1 + extraRuns);
            innings.setExtras(innings.getExtras() + 1 + extraRuns);
            // Wide = NOT legal delivery — ball count nahi badhega
        } else if (request.isNoBall()) {
            innings.setTotalRuns(innings.getTotalRuns() + runsScored + 1 + extraRuns);
            innings.setExtras(innings.getExtras() + 1 + extraRuns);
            // No Ball = NOT legal delivery — ball count nahi badhega
        } else {
            innings.setTotalRuns(innings.getTotalRuns() + runsScored + extraRuns);
            innings.setTotalBalls(innings.getTotalBalls() + 1); // Only legal balls
            if (request.isExtra()) {
                innings.setExtras(innings.getExtras() + extraRuns);
            }
        }

        if (request.isWicket()) {
            innings.setTotalWickets(innings.getTotalWickets() + 1);
        }

        inningsRepository.save(innings);
        return delivery;
    }

    public Innings getInningsByMatchAndNumber(Long matchId, Integer number) {
        return inningsRepository.findByMatchIdAndInningsNumber(matchId, number)
                .orElseThrow(() -> new ResourceNotFoundException("Innings not found"));
    }
}