"use server";
import { createClient } from "@libsql/client";
import { getUser } from "@workos-inc/authkit-nextjs";
import { revalidatePath } from "next/cache";

const client = createClient({
  url: "file:local.db",
});

export type Pokemon = {
  name: string;
  pokemonId: number;
  image: string;
};

export type StoredCard = Pokemon & {
  id: number;
  deckId: number;
};

export type Deck = {
  id: number;
  name: string;
  userId: string;
};

export type DeckWithCards = Deck & { cards: StoredCard[] };

export async function addPokemon(
  deckId: number,
  pokemon: Pokemon
): Promise<void> {
  const deck = await getDeck(deckId);
  await updateDeck(deckId, [...deck.cards, pokemon]);
}

export async function removePokemon(
  deckId: number,
  pokemon: Pokemon
): Promise<void> {
  const deck = await getDeck(deckId);
  await updateDeck(
    deckId,
    deck.cards.filter((card) => card.pokemonId !== pokemon.pokemonId)
  );
}

export async function createDeck(name: string): Promise<number> {
  const { user } = await getUser();

  if (!user) {
    throw new Error("User not logged in, can't create a deck.");
  }

  await client.execute({
    sql: "INSERT INTO decks (name, userId) VALUES (?, ?)",
    args: [name, user.id],
  });

  const { rows } = await client.execute({
    sql: "SELECT last_insert_rowid() AS id",
    args: [],
  });

  revalidatePath(`/`);

  return +(rows[0]["id"]?.toString() ?? "");
}

async function updateDeck(deckId: number, cards: Pokemon[]): Promise<void> {
  await client.execute({
    sql: "DELETE FROM cards WHERE deckId = ?",
    args: [deckId],
  });
  for (const card of cards) {
    await client.execute({
      sql: "INSERT INTO cards (deckId, pokemonId, name, image) VALUES (?, ?, ?, ?)",
      args: [deckId, card.pokemonId, card.name, card.image],
    });
  }
  revalidatePath(`/deck/${deckId}`);
}

export async function getDeck(deckId: number): Promise<DeckWithCards> {
  const { rows } = await client.execute({
    sql: "SELECT * FROM decks WHERE id = ?",
    args: [deckId],
  });

  if (rows.length === 0) {
    throw new Error("Deck not found");
  }

  const deck = {
    id: +(rows[0].id?.toString() ?? ""),
    name: rows[0].name?.toString() ?? "",
    userId: rows[0].userId?.toString() ?? "",
    cards: await getCards(deckId),
  };
  return deck;
}

export async function getCards(deckId: number): Promise<StoredCard[]> {
  const { rows } = await client.execute({
    sql: "SELECT * FROM cards WHERE deckId = ?",
    args: [deckId],
  });

  return rows.map((row) => ({
    id: +(row.id?.toString() ?? ""),
    deckId: +(row.deckId?.toString() ?? ""),
    pokemonId: +(row.pokemonId?.toString() ?? ""),
    name: row.name?.toString() ?? "",
    image: row.image?.toString() ?? "",
  }));
}

export async function getDecks(): Promise<DeckWithCards[]> {
  const { user } = await getUser();

  if (!user) {
    return [];
  }

  const deckRows = await client.execute({
    sql: "SELECT * FROM decks WHERE userId = ?",
    args: [user.id],
  });

  const decks: DeckWithCards[] = [];

  for (const row of deckRows.rows) {
    decks.push({
      id: +(row.id?.toString() ?? ""),
      name: row.name?.toString() ?? "",
      userId: row.userId?.toString() ?? "",
      cards: await getCards(+(row.id?.toString() ?? "")),
    });
  }
  return decks;
}
