package com.cricket.scorecard.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "innings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Innings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "match_id")
    private Match match;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "batting_team_id")
    private Team battingTeam;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "bowling_team_id")
    private Team bowlingTeam;


    private Integer inningsNumber;
    private Integer totalRuns;
    private Integer totalWickets;
    private Integer totalBalls;
    private Integer extras;
    private boolean isCompleted;

    @JsonIgnore
    @OneToMany(mappedBy = "innings", cascade = CascadeType.ALL)
    private List<Delivery> deliveries;
}