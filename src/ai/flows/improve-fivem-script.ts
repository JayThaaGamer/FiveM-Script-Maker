// src/ai/flows/improve-fivem-script.ts
'use server';
/**
 * @fileOverview A FiveM script improvement AI agent.
 *
 * - improveFiveMScript - A function that handles the FiveM script improvement process.
 * - ImproveFiveMScriptInput - The input type for the improveFiveMScript function.
 * - ImproveFiveMScriptOutput - The return type for the improveFiveMScript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveFiveMScriptInputSchema = z.object({
  existingScript: z.string().describe('The existing FiveM script to improve.'),
  improvementDescription: z.string().describe('The description of how to improve the script.'),
});
export type ImproveFiveMScriptInput = z.infer<typeof ImproveFiveMScriptInputSchema>;

const ImproveFiveMScriptOutputSchema = z.object({
  improvedScript: z.string().describe('The improved FiveM script.'),
});
export type ImproveFiveMScriptOutput = z.infer<typeof ImproveFiveMScriptOutputSchema>;

export async function improveFiveMScript(input: ImproveFiveMScriptInput): Promise<ImproveFiveMScriptOutput> {
  return improveFiveMScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveFiveMScriptPrompt',
  input: {schema: ImproveFiveMScriptInputSchema},
  output: {schema: ImproveFiveMScriptOutputSchema},
  prompt: `You are an expert FiveM script developer. You will take an existing FiveM script and improve it based on a description of the desired improvements.

Existing Script:
{{{existingScript}}}

Improvement Description:
{{{improvementDescription}}}

Improved Script:`, // Crucially, tell the LLM how to improve the script, and specify the output format.
});

const improveFiveMScriptFlow = ai.defineFlow(
  {
    name: 'improveFiveMScriptFlow',
    inputSchema: ImproveFiveMScriptInputSchema,
    outputSchema: ImproveFiveMScriptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
