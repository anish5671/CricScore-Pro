CREATE TABLE innings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    match_id BIGINT,
    batting_team_id BIGINT,
    bowling_team_id BIGINT,
    innings_number INT,
    total_runs INT DEFAULT 0,
    total_wickets INT DEFAULT 0,
    total_balls INT DEFAULT 0,
    extras INT DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (match_id) REFERENCES matches(id),
    FOREIGN KEY (batting_team_id) REFERENCES teams(id),
    FOREIGN KEY (bowling_team_id) REFERENCES teams(id)
);

CREATE TABLE deliveries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    innings_id BIGINT,
    batsman_id BIGINT,
    bowler_id BIGINT,
    over_number INT,
    ball_number INT,
    runs INT DEFAULT 0,
    is_wicket BOOLEAN DEFAULT FALSE,
    dismissal_type VARCHAR(20),
    dismissed_player_id BIGINT,
    is_extra BOOLEAN DEFAULT FALSE,
    extra_type VARCHAR(20),
    extra_runs INT DEFAULT 0,
    is_no_ball BOOLEAN DEFAULT FALSE,
    is_wide BOOLEAN DEFAULT FALSE,
    is_free_hit BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (innings_id) REFERENCES innings(id),
    FOREIGN KEY (batsman_id) REFERENCES players(id),
    FOREIGN KEY (bowler_id) REFERENCES players(id),
    FOREIGN KEY (dismissed_player_id) REFERENCES players(id)
);