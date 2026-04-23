package com.cricket.scorecard.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.cricket.scorecard.enums.MatchFormat;
import com.cricket.scorecard.enums.MatchStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "matches")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "team1_id")
    private Team team1;

    @ManyToOne
    @JoinColumn(name = "team2_id")
    private Team team2;

    @Enumerated(EnumType.STRING)
    private MatchFormat format;

    private Integer customOvers;
    private String venue;
    private LocalDate matchDate;
    private String tossWinner;
    private String tossDecision;

    @Enumerated(EnumType.STRING)
    private MatchStatus status;

    private String winner;
    private String resultText;

    @ManyToOne
    @JoinColumn(name = "tournament_id")
    private Tournament tournament;

    @JsonIgnore
    @OneToMany(mappedBy = "match", cascade = CascadeType.ALL)
    private List<Innings> innings;
}