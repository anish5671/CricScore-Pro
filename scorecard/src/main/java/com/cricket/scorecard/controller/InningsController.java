package com.cricket.scorecard.controller;

import com.cricket.scorecard.dto.request.DeliveryRequest;
import com.cricket.scorecard.entity.*;
import com.cricket.scorecard.service.InningsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/matches/{matchId}")
@RequiredArgsConstructor
public class InningsController {

    private final InningsService inningsService;

    @PostMapping("/innings/start")
    public ResponseEntity<Innings> startInnings(
            @PathVariable Long matchId,
            @RequestParam Long battingTeamId,
            @RequestParam Long bowlingTeamId,
            @RequestParam Integer inningsNumber) {

        return ResponseEntity.ok(
                inningsService.startInnings(matchId, battingTeamId, bowlingTeamId, inningsNumber)
        );
    }

    @GetMapping("/innings/{number}")
    public ResponseEntity<?> getInnings(
            @PathVariable Long matchId,
            @PathVariable Integer number) {
        try {
            return ResponseEntity.ok(
                    inningsService.getInningsByMatchAndNumber(matchId, number)
            );
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/innings/{inningsId}/delivery")
    public ResponseEntity<Delivery> addDelivery(
            @PathVariable Long matchId,
            @PathVariable Long inningsId,
            @RequestBody DeliveryRequest request) {

        return ResponseEntity.ok(
                inningsService.addDelivery(inningsId, request)
        );
    }
}