CREATE TABLE matches (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    team1_id BIGINT,
    team2_id BIGINT,
    format VARCHAR(20),
    custom_overs INT,
    venue VARCHAR(100),
    match_date DATE,
    toss_winner VARCHAR(100),
    toss_decision VARCHAR(10),
    status VARCHAR(20),
    winner VARCHAR(100),
    result_text VARCHAR(255),
    tournament_id BIGINT,
    FOREIGN KEY (team1_id) REFERENCES teams(id),
    FOREIGN KEY (team2_id) REFERENCES teams(id),
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id)
);