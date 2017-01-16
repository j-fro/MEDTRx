CREATE TABLE useres (
    id SERIAL PRIMARY KEY,
    email VARCHAR(200) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL
);

CREATE TABLE devices (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    device_id INTEGER NOT NULL
);

CREATE TABLE statuses (
    id SERIAL PRIMARY KEY,
    device_name VARCHAR(200) NOT NULL,
    status BOOLEAN NOT NULL,
    created TIMESTAMP NOT NULL
);
