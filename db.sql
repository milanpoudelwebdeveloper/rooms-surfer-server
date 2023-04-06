CREATE TABLE users(
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email  VARCHAR(255) NOT NULL,
    password VARCHAR(255),
   
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


 ALTER TABLE users ADD COLUMN photoUrl VARCHAR(255);


 CREATE TABLE room(
    id SERIAL NOT NULL PRIMARY KEY,
    longitude INTEGER NOT NULL,
    latitude INTEGER NOT NULL,
    price INTEGER NOT NULL,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    images TEXT[] 
    CONSTRAINT images_length CHECK (array_length(images, 1) >= 2),
 );