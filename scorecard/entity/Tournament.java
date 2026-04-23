package com.cricket.scorecard.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.cricket.scorecard.enums.MatchFormat;
import com.cricket.scorecard.enums.MatchStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "tournaments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tournament {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    private MatchFormat format;

    private Integer customOvers;
    private LocalDate startDate;
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    private MatchStatus status;

    private String winner;

    @JsonIgnore
    @OneToMany(mappedBy = "tournament", cascade = CascadeType.ALL)
    private List<Match> matches;
}