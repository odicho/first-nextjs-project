import { getOptionsForVote } from "@/utils/getRandomPokemon";
import { trpc } from "@/utils/trpc";
import { useState } from "react";

export default function Home() {
	const [ids, setIds] = useState(() => getOptionsForVote());
	const [first, second] = ids;

	const firstPokemon = trpc["get-pokemon-by-id"].useQuery({ id: first });
	const secondPokemon = trpc["get-pokemon-by-id"].useQuery({ id: second });

	if (firstPokemon.isLoading || secondPokemon.isLoading) return null;

	return (
		<div className="flex h-screen w-screen flex-col items-center justify-center">
			<div className="text-center text-2xl">Which Pokemon is rounder?</div>
			<div className="p-2" />
			<div className="flex max-w-2xl items-center justify-between rounded border p-4">
				<div className="flex h-64 w-64 flex-col">
					<img
						src={firstPokemon.data?.sprites.front_default!}
						className="w-full"
					/>
					<div className="mt-[-2rem] text-center text-xl capitalize">
						{firstPokemon.data?.name}
					</div>
				</div>
				<div className="p-8">VS</div>
				<div className="flex h-64 w-64 flex-col">
					<img
						src={secondPokemon.data?.sprites.front_default!}
						className="w-full"
					/>
					<div className="mt-[-2rem] text-center text-xl capitalize">
						{secondPokemon.data?.name}
					</div>
				</div>
				<div className="p-2" />
			</div>
		</div>
	);
}
