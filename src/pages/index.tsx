import { AppRouter } from "@/backend/router";
import { getOptionsForVote } from "@/utils/getRandomPokemon";
import { trpc } from "@/utils/trpc";
import { inferProcedureOutput } from "@trpc/server";
import { useState } from "react";

const buttonClass =
	"inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

export default function Home() {
	const [ids, setIds] = useState(() => getOptionsForVote());
	const [first, second] = ids;

	const firstPokemon = trpc["get-pokemon-by-id"].useQuery({ id: first });
	const secondPokemon = trpc["get-pokemon-by-id"].useQuery({ id: second });

	if (firstPokemon.isLoading || secondPokemon.isLoading) return null;

	const voteForRoundest = (selected: number) => {
		// todo: fire mutation to persist changes
		setIds(getOptionsForVote());
	};

	return (
		<div className="flex h-screen w-screen flex-col items-center justify-center">
			<div className="text-center text-2xl">Which Pokemon is rounder?</div>
			<div className="p-2" />
			<div className="flex max-w-2xl items-center justify-between rounded border p-8">
				{!firstPokemon.isLoading &&
					firstPokemon.data &&
					!secondPokemon.isLoading &&
					secondPokemon.data && (
						<>
							<PokemonListing
								pokemon={firstPokemon.data}
								vote={() => voteForRoundest(first)}
							/>
							<div className="p-8">VS</div>

							<PokemonListing
								pokemon={secondPokemon.data}
								vote={() => voteForRoundest(second)}
							/>
						</>
					)}
				<div className="p-2" />
			</div>
		</div>
	);
}

export type PokemonGetOutput = inferProcedureOutput<
	AppRouter["get-pokemon-by-id"]
>;

const PokemonListing: React.FC<{
	pokemon: PokemonGetOutput;
	vote: () => void;
}> = (props) => {
	return (
		<div className="flex flex-col items-center">
			<img src={props.pokemon.sprites.front_default!} className="h-64 w-64" />
			<div className="mt-[-2rem] text-center text-xl capitalize">
				{props.pokemon.name}
			</div>
			<button className={buttonClass} onClick={() => props.vote()}>
				Rounder
			</button>
		</div>
	);
};

/*
	You left off at 1:13:50
	You need to create a local instance of a database for shadow db and then proceed
*/
