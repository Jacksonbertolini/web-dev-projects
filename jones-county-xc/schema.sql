-- Cross Country Database Schema

-- Athletes table
CREATE TABLE athletes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    grade TINYINT NOT NULL CHECK (grade BETWEEN 9 AND 12),
    personal_record VARCHAR(10),
    events VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Meets table
CREATE TABLE meets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    location VARCHAR(200),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Results table (links athletes to meets with their performance)
CREATE TABLE results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    athlete_id INT NOT NULL,
    meet_id INT NOT NULL,
    time VARCHAR(10) NOT NULL,
    place INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (athlete_id) REFERENCES athletes(id) ON DELETE CASCADE,
    FOREIGN KEY (meet_id) REFERENCES meets(id) ON DELETE CASCADE,
    UNIQUE KEY unique_athlete_meet (athlete_id, meet_id)
);

-- Indexes for better query performance
CREATE INDEX idx_athletes_grade ON athletes(grade);
CREATE INDEX idx_meets_date ON meets(date);
CREATE INDEX idx_results_athlete ON results(athlete_id);
CREATE INDEX idx_results_meet ON results(meet_id);
