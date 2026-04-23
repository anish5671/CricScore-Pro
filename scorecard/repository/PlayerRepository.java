package com.cricket.scorecard.repository;

import com.cricket.scorecard.entity.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PlayerRepository extends JpaRepository<Player, Long> {
    List<Player> findByTeamId(Long teamId);
    List<Player> findByNameContainingIgnoreCase(String name);
}