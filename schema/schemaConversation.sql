CREATE TABLE messages (
	sender INT NOT NULL,
    content VARCHAR(255) NOT NULL,
    receiver INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    modified_at TIMESTAMP DEFAULT NOW() ON UPDATE NOW(),
    FOREIGN KEY (sender) REFERENCES user(id),
    FOREIGN KEY (receiver) REFERENCES user(id)
    )

ALTER TABLE contacts
ADD CONSTRAINT 
UNIQUE(user_id, contact_id)