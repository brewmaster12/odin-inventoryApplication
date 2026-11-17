// db/populate.js
const { Client } = require("pg");

const SQL = `
    DROP TABLE IF EXISTS games_genres;
    DROP TABLE IF EXISTS games;
    DROP TABLE IF EXISTS genres;
    DROP TABLE IF EXISTS developers;

    CREATE TABLE developers (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR(255) NOT NULL UNIQUE
    );

    CREATE TABLE genres (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR(255) NOT NULL UNIQUE
    );

    CREATE TABLE games (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        title VARCHAR(255) NOT NULL,
        release_year INTEGER,
        developer_id INTEGER REFERENCES developers(id) ON DELETE RESTRICT
    );

    CREATE TABLE games_genres (
        game_id INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
        genre_id INTEGER NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
        PRIMARY KEY (game_id, genre_id)
    );

    INSERT INTO developers (name) VALUES ('Nintendo'), ('CD Projekt Red'), ('FromSoftware');
    INSERT INTO genres (name) VALUES ('Action'), ('RPG'), ('Adventure');
    INSERT INTO games (title, release_year, developer_id) VALUES
        ('The Witcher 3', 2015, 2),
        ('Elden Ring', 2022, 3);
    INSERT INTO games_genres (game_id, genre_id) VALUES (1, 2), (2, 1), (2, 2);
`;

async function main() {
    console.log("seeding...");
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log("done");
}

main();