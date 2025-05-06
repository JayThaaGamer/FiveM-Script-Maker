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
  code: z.string().describe('The generated FiveM script code, including fxmanifest.lua and the Lua script file(s).'),
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

  Generate a complete FiveM script, including the fxmanifest.lua file, based on the following prompt. Consider the specified framework if mentioned (e.g., ESX, Qbox, QBCORE). If no framework is specified, assume it's a standalone script (no specific framework).

  Prompt: {{{prompt}}}

  Ensure the script is well-structured, efficient, and includes necessary comments. The response should be a single string containing both the fxmanifest.lua content and the .lua script content.
  
  The fxmanifest.lua should be clearly delimited from the Lua script code, for example:

  -- fxmanifest.lua --
  fx_version 'cerulean'
  game 'gta5'
  author 'Jay Mods'
  description 'Description of the script'
  version '1.0.0'

  client_scripts {
    'client.lua'
  }

  server_scripts {
    'server.lua'
  }
  -- end fxmanifest.lua --

  -- client.lua -- 
  -- Client-side Lua code here
  -- end client.lua --

  -- server.lua --
  -- Server-side Lua code here
  -- end server.lua --

  (Ensure the generated code is relevant to the user's prompt and not just this example structure.)
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

