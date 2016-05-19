-- CREATE FOLLOWING TABLES TO RUN APP
CREATE TABLE Views (`venueName` VARCHAR(255), `views` int, PRIMARY KEY (`venueName`));

CREATE TABLE Comments (`id` int AUTO_INCREMENT, `venueName` VARCHAR(255), `name` VARCHAR(100),
                        `comment` VARCHAR(1000), `time` int,  PRIMARY KEY (`id`));
