import { initTRPC } from "@trpc/server";
import { z } from "zod";

import { prisma } from "@/backend/utils/prisma";

export const t = initTRPC.create();

export const appRouter = t.router({
	"get-pokemon-by-id": t.procedure
		.input(
			z.object({
				id: z.number(),
			})
		)
		.query(async ({ input }) => {
			const pokemon = await prisma.pokemon.findFirst({
				where: { id: input.id },
			});

			if (!pokemon) throw new Error("Pokemon doesn't exist with this id");
			return pokemon;
		}),
	"cast-vote": t.procedure
		.input(
			z.object({
				votedFor: z.number(),
				votedAgainst: z.number(),
			})
		)
		.mutation(async ({ input }) => {
			const voteInDb = await prisma.vote.create({
				data: {
					votedForId: input.votedFor,
					votedAgainstId: input.votedAgainst,
				},
			});
			return { success: true, vote: voteInDb };
		}),
});

// .mutation("cast-vote", {
//     input: z.object({
//         votedFor: z.number(),
//         votedAgainst: z.number()
//     }),
//     async resolve() {
//         return {success: true}
//     }

// export type definition of API
export type AppRouter = typeof appRouter;
