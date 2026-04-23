CREATE TABLE tournaments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    format VARCHAR(20),
    custom_overs INT,
    start_date DATE,
    end_date DATE,
    status VARCHAR(20),
    winner VARCHAR(100)
);