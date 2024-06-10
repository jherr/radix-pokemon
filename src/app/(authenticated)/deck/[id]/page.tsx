import { Heading } from "@radix-ui/themes";
import { getUser } from "@workos-inc/authkit-nextjs";
import { notFound } from "next/navigation";

import PokemonGrid from "@/components/pokemon-grid";
import SearchList from "./search-list";

import { getDeck } from "@/db";
import { getFullPokemon } from "@/pokemon";

export default async function DeckPage({ params }: { params: { id: string } }) {
  const { user } = await getUser();

  const pokemon = await getFullPokemon(10, "");

  const deck = await getDeck(+params.id);

  if (user?.id !== deck.userId) {
    return notFound();
  }

  return (
    <main className="mt-5 flex flex-col">
      <Heading my="5">Your Current Deck: {deck.name}</Heading>

      <Heading my="5">Add Some More Cards</Heading>

      <PokemonGrid pokemon={deck.cards} showRemove />

      <SearchList
        pokemon={pokemon}
        existingPokemon={deck.cards.map((card) => card.pokemonId)}
      />
    </main>
  );
}
