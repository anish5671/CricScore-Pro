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

        // Calculate over and ball number based on LEGAL balls only
        int legalBalls = innings.getTotalBalls();
        int overNumber  = legalBalls / 6;
        int ballNumber  = legalBalls % 6 + 1;

        // Build delivery
        Delivery delivery = Delivery.builder()
                .innings(innings)
                .batsman(batsman)
                .bowler(bowler)
                .overNumber(overNumber)
                .ballNumber(ballNumber)
                .runs(request.getRuns() != null ? request.getRuns() : 0)
                .isWicket(request.isWicket())
                .dismissalType(request.isWicket() ? request.getDismissalType() : null)
                .isExtra(request.isExtra() || request.isWide() || request.isNoBall())
                .extraType(request.getExtraType())
                .extraRuns(request.getExtraRuns() != null ? request.getExtraRuns() : 0)
                .isNoBall(request.isNoBall())
                .isWide(request.isWide())
                .isFreeHit(false)
                .build();

        deliveryRepository.save(delivery);

        // ── Update innings totals ──

        int runsScored   = request.getRuns() != null ? request.getRuns() : 0;
        int extraRuns    = request.getExtraRuns() != null ? request.getExtraRuns() : 0;

        // Wide: +1 extra run + extra runs, ball NOT counted
        if (request.isWide()) {
            innings.setTotalRuns(innings.getTotalRuns() + 1 + extraRuns);
            innings.setExtras(innings.getExtras() + 1 + extraRuns);
            // Ball NOT counted for wide
        }
        // No Ball: +1 extra run + runs scored, ball NOT counted
        else if (request.isNoBall()) {
            innings.setTotalRuns(innings.getTotalRuns() + runsScored + 1 + extraRuns);
            innings.setExtras(innings.getExtras() + 1 + extraRuns);
            // Ball NOT counted for no ball
        }
        // Normal delivery
        else {
            innings.setTotalRuns(innings.getTotalRuns() + runsScored + extraRuns);
            innings.setTotalBalls(innings.getTotalBalls() + 1); // Only legal balls counted
            if (request.isExtra()) {
                innings.setExtras(innings.getExtras() + extraRuns);
            }
        }

        // Wicket
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