package com.cricket.scorecard.repository;

import com.cricket.scorecard.entity.Match;
import com.cricket.scorecard.enums.MatchStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MatchRepository extends JpaRepository<Match, Long> {
    List<Match> findByStatus(MatchStatus status);
    List<Match> findByTournamentId(Long tournamentId);
    List<Match> findByTeam1IdOrTeam2Id(Long team1Id, Long team2Id);
}