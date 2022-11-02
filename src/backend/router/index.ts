import { initTRPC } from '@trpc/server';
import { z } from 'zod';

import { PokemonClient } from 'pokenode-ts';
import { prisma } from "@/backend/utils/prisma"

export const t = initTRPC.create();

export const appRouter = t.router({
    "get-pokemon-by-id": t.procedure
        .input(
            z.object({
                id: z.number()
            })
        )
        .query(async ({ input }) => {
            const api = new PokemonClient();
            const pokemon = await api.getPokemonById(input.id);
            return { name: pokemon.name, sprites: pokemon.sprites };
        }),
    "cast-vote": t.procedure
        .input(
            z.object({
                votedFor: z.number(),
                votedAgainst: z.number()
            }),
        ).mutation(async ({ input }) => {
            const voteInDb = await prisma.vote.create({
                data: {
                    ...input
                }
            })
            return { success: true, vote: voteInDb }
        })
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