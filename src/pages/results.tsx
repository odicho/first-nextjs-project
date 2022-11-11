import type { GetServerSideProps } from "next";
import { prisma } from "@/backend/utils/prisma";
import { AsyncReturnType } from "@/utils/ts-bs";
import Image from "next/image";

const getPokemonInOrder = async () => {
	return await prisma.pokemon.findMany({
		orderBy: {
			VoteFor: { _count: "desc" },
		},
		select: {
			id: true,
			name: true,
			spriteUrl: true,
			_count: {
				select: {
					VoteFor: true,
					VoteAgainst: true,
				},
			},
		},
	});
};

type PokemonQueryResult = AsyncReturnType<typeof getPokemonInOrder>;

const generateCountPercent = (pokemon: PokemonQueryResult[number]) => {
	const { VoteFor, VoteAgainst } = pokemon._count;
	if (VoteFor + VoteAgainst === 0) {
		return 0;
	}
	return (VoteFor / (VoteFor + VoteAgainst)) * 100;
};

const PokemonListing: React.FC<{ pokemon: PokemonQueryResult[number] }> = ({
	pokemon,
}) => {
	return (
		<div className="flex items-center justify-between border-b p-2">
			<div className="flex items-center">
				<Image src={pokemon.spriteUrl} width={64} height={64} layout="fixed" />
				<div className="capitalize">{pokemon.name}</div>
			</div>
			<div className="pr-4">{generateCountPercent(pokemon) + " %"}</div>
		</div>
	);
};

const ResultsPage: React.FC<{
	pokemon: AsyncReturnType<typeof getPokemonInOrder>;
}> = (props) => {
	return (
		<div className="flex flex-col items-center">
			<h2 className="p-4 text-2xl">Results</h2>
			<div className="p-2" />
			<div className="flex w-full  max-w-2xl flex-col border">
				{props.pokemon.map((currentPokemon, index) => {
					return <PokemonListing pokemon={currentPokemon} key={index} />;
				})}
			</div>
		</div>
	);
};

export default ResultsPage;

export const getStaticProps: GetServerSideProps = async () => {
	const pokemonOrdered = await getPokemonInOrder();
	return { props: { pokemon: pokemonOrdered }, revalidate: 60 };
};
