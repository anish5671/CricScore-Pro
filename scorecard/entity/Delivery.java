package com.cricket.scorecard.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.cricket.scorecard.enums.DismissalType;
import com.cricket.scorecard.enums.ExtraType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "deliveries")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "innings_id")
    private Innings innings;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "batsman_id")
    private Player batsman;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "bowler_id")
    private Player bowler;

    private Integer overNumber;
    private Integer ballNumber;
    private Integer runs;
    private boolean isWicket;

    @Enumerated(EnumType.STRING)
    private DismissalType dismissalType;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "dismissed_player_id")
    private Player dismissedPlayer;

    private boolean isExtra;

    @Enumerated(EnumType.STRING)
    private ExtraType extraType;

    private Integer extraRuns;
    private boolean isNoBall;
    private boolean isWide;
    private boolean isFreeHit;
}