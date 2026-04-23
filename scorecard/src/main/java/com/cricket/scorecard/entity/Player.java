package com.cricket.scorecard.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "players")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String role;
    private String battingStyle;
    private String bowlingStyle;
    private Integer age;
    private String nationality;
    private String jerseyNumber;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;
}