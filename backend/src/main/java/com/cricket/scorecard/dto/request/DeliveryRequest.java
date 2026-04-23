package com.cricket.scorecard.dto.request;

import com.cricket.scorecard.enums.DismissalType;
import com.cricket.scorecard.enums.ExtraType;
import lombok.Data;

@Data
public class DeliveryRequest {
    private Long batsmanId;
    private Long bowlerId;
    private Integer runs;
    private boolean isWicket;
    private DismissalType dismissalType;
    private Long dismissedPlayerId;
    private boolean isExtra;
    private ExtraType extraType;
    private Integer extraRuns;
    private boolean isNoBall;
    private boolean isWide;
}