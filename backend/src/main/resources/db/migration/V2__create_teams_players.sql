CREATE TABLE teams (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    short_name VARCHAR(10),
    logo_url VARCHAR(255),
    home_ground VARCHAR(100)
);

CREATE TABLE players (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50),
    batting_style VARCHAR(50),
    bowling_style VARCHAR(50),
    age INT,
    nationality VARCHAR(50),
    jersey_number VARCHAR(10),
    team_id BIGINT,
    FOREIGN KEY (team_id) REFERENCES teams(id)
);