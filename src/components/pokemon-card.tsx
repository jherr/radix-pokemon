"use client";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Box, Card, Inset, Heading, Button } from "@radix-ui/themes";

import { Pokemon, addPokemon, removePokemon } from "@/db";

export default function PokemonCard({
  pokemon,
  showAdd,
  showRemove,
}: {
  pokemon: Pokemon;
  showAdd?: boolean;
  showRemove?: boolean;
}) {
  const { id: deckId } = useParams();
  return (
    <Box>
      <Card size="2">
        <Inset clip="padding-box" side="top" pb="current">
          <Image
            src={pokemon.image}
            alt={pokemon.name}
            width={1200}
            height={1200}
            style={{
              width: "100%",
              height: "auto",
            }}
          />
        </Inset>
        <Heading as="h6" size="3" mb="5">
          {pokemon.name}
        </Heading>
        {showAdd && (
          <Button
            onClick={() => {
              addPokemon(+deckId, pokemon);
            }}
            size="3"
          >
            Add
          </Button>
        )}
        {showRemove && (
          <Button
            onClick={() => {
              removePokemon(+deckId, pokemon);
            }}
            size="3"
            color="red"
          >
            Remove
          </Button>
        )}
      </Card>
    </Box>
  );
}
