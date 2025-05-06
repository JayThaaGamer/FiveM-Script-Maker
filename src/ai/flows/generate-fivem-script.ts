// src/ai/flows/generate-fivem-script.ts
'use server';

/**
 * @fileOverview Generates a FiveM script based on a prompt.
 *
 * - generateFiveMScript - A function that generates the FiveM script.
 * - GenerateFiveMScriptInput - The input type for the generateFiveMScript function.
 * - GenerateFiveMScriptOutput - The return type for the generateFiveMScript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFiveMScriptInputSchema = z.object({
  prompt: z.string().describe('The prompt describing the FiveM script to generate.'),
});
export type GenerateFiveMScriptInput = z.infer<typeof GenerateFiveMScriptInputSchema>;

const GenerateFiveMScriptOutputSchema = z.object({
  code: z.string().describe('The generated FiveM script code.'),
});
export type GenerateFiveMScriptOutput = z.infer<typeof GenerateFiveMScriptOutputSchema>;

export async function generateFiveMScript(input: GenerateFiveMScriptInput): Promise<GenerateFiveMScriptOutput> {
  return generateFiveMScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFiveMScriptPrompt',
  input: {schema: GenerateFiveMScriptInputSchema},
  output: {schema: GenerateFiveMScriptOutputSchema},
  prompt: `You are an expert FiveM script developer.

  Generate the FiveM script based on the following prompt:

  Prompt: {{{prompt}}}
  `,
});

const generateFiveMScriptFlow = ai.defineFlow(
  {
    name: 'generateFiveMScriptFlow',
    inputSchema: GenerateFiveMScriptInputSchema,
    outputSchema: GenerateFiveMScriptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
