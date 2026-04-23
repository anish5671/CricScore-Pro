package com.cricket.scorecard.service;

import com.cricket.scorecard.dto.request.TournamentRequest;
import com.cricket.scorecard.entity.Tournament;
import com.cricket.scorecard.enums.MatchStatus;
import com.cricket.scorecard.exception.ResourceNotFoundException;
import com.cricket.scorecard.repository.TournamentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TournamentService {

    private final TournamentRepository tournamentRepository;

    public List<Tournament> getAllTournaments() {
        return tournamentRepository.findAll();
    }

    public Tournament getTournamentById(Long id) {
        return tournamentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tournament not found: " + id));
    }

    public Tournament createTournament(TournamentRequest request) {
        Tournament tournament = Tournament.builder()
                .name(request.getName())
                .format(request.getFormat())
                .customOvers(request.getCustomOvers())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .status(MatchStatus.UPCOMING)
                .build();
        return tournamentRepository.save(tournament);
    }

    public Tournament updateTournament(Long id, TournamentRequest request) {
        Tournament tournament = getTournamentById(id);
        tournament.setName(request.getName());
        tournament.setFormat(request.getFormat());
        tournament.setCustomOvers(request.getCustomOvers());
        tournament.setStartDate(request.getStartDate());
        tournament.setEndDate(request.getEndDate());
        return tournamentRepository.save(tournament);
    }

    public void deleteTournament(Long id) {
        tournamentRepository.deleteById(id);
    }
}