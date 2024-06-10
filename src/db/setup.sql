DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS decks;

CREATE TABLE decks (
  id INTEGER PRIMARY KEY,
  name TEXT,
  userId TEXT
);

CREATE TABLE cards (
  id INTEGER PRIMARY KEY,
  deckId INTEGER,
  pokemonId INTEGER,
  name TEXT,
  image TEXT
);
