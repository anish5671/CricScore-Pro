package com.cricket.scorecard.repository;

import com.cricket.scorecard.entity.Tournament;
import com.cricket.scorecard.enums.MatchStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TournamentRepository extends JpaRepository<Tournament, Long> {
    List<Tournament> findByStatus(MatchStatus status);
}