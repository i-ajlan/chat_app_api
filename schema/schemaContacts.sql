CREATE TABLE contacts (
	user_id INT NOT NULL,
    name_contact VARCHAR(55) NOT NULL,
    contact_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    modified_at TIMESTAMP DEFAULT NOW() ON UPDATE NOW(),
    FOREIGN KEY(user_id) REFERENCES user(id),
    FOREIGN KEY(contact_id) REFERENCES user(id))