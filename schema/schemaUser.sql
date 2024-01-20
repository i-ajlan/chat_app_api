CREATE TABLE chat_db;

USE chat_db;

CREATE TABLE public.user(
	id INT PRIMARY KEY NOT NULL,
    username VARCHAR(25) UNIQUE NOT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
    modified_at TIMESTAMP DEFAULT NOW() ON UPDATE NOW());


DELIMITER $$
CREATE PROCEDURE getAllUsers()
BEGIN 
	SELECT id, username FROM user;
END $$
DELIMITER ; 


DELIMITER $$
CREATE PROCEDURE findUser(IN user_id INT, IN name varchar(25))
BEGIN
select id, username from user where
id=user_id AND username=name;
END $$
DELIMITER ;