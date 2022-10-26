import { getOptionsForVote } from "@/utils/getRandomPokemon";
import { trpc } from "@/utils/trpc";
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
				<div className="flex h-64 w-64 flex-col items-center">
					<img
						src={firstPokemon.data?.sprites.front_default!}
						className="w-full"
					/>
					<div className="mt-[-2rem] text-center text-xl capitalize">
						{firstPokemon.data?.name}
					</div>
					<button
						className={buttonClass}
						onClick={() => voteForRoundest(first)}
					>
						Rounder
					</button>
				</div>
				<div className="p-8">VS</div>
				<div className="flex h-64 w-64 flex-col items-center">
					<img
						src={secondPokemon.data?.sprites.front_default!}
						className="w-full"
					/>
					<div className="mt-[-2rem] text-center text-xl capitalize">
						{secondPokemon.data?.name}
					</div>
					<button
						className={buttonClass}
						onClick={() => voteForRoundest(first)}
					>
						Rounder
					</button>
				</div>
				<div className="p-2" />
			</div>
		</div>
	);
}
