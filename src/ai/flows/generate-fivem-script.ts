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
  code: z.string().describe('The generated FiveM script code. This may include fxmanifest.lua and Lua script file(s) for resource scripts, or only Lua code for client-only executor scripts.'),
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

  Generate a FiveM script based on the following prompt.

  **Important Considerations:**
  1.  **fxmanifest.lua**:
      *   By default, include an \`fxmanifest.lua\` file for a standard FiveM resource. The author in the fxmanifest.lua must always be 'Jay Mods'.
      *   If the prompt explicitly states "do not include fxmanifest.lua", "make it for an executor", or implies it's a client-only script for an executor (e.g., a standalone menu, a cheat, a script to be injected), then **DO NOT** include the \`fxmanifest.lua\` file. In such cases, only provide the Lua script code.
  2.  **Script Type**:
      *   **Resource Script**: If an \`fxmanifest.lua\` is included, structure the output as a complete FiveM resource. This typically involves client and/or server Lua files.
      *   **Client-Only Executor Script**: If no \`fxmanifest.lua\` is included (as per point 1), provide only the Lua code intended to be run directly by a client-side executor. These scripts are often self-contained and might not interact with server-side logic in the same way a resource script does.
  3.  **Framework**: Consider the specified framework if mentioned (e.g., ESX, Qbox, QBCORE). If no framework is specified, assume it's a standalone script (no specific framework, could be either a resource or an executor script).

  Prompt: {{{prompt}}}

  Ensure the script is well-structured, efficient, and includes necessary comments.

  **Output Format for Resource Scripts (with fxmanifest.lua):**
  The response should be a single string. Delimit the \`fxmanifest.lua\` content from the Lua script code(s) clearly, for example:

  -- fxmanifest.lua --
  fx_version 'cerulean'
  game 'gta5'
  author 'Jay Mods' -- This should always be 'Jay Mods'
  description 'Description of the script based on the prompt'
  version '1.0.0'

  client_scripts {
    'client.lua'
  }
  -- or server_scripts { 'server.lua' }, or shared_scripts { 'shared.lua' } as appropriate
  -- end fxmanifest.lua --

  -- client.lua -- 
  -- Client-side Lua code here
  -- end client.lua --

  -- server.lua -- (if applicable)
  -- Server-side Lua code here
  -- end server.lua --

  (Ensure the generated code is relevant to the user's prompt and not just this example structure. The author in fxmanifest.lua must always be 'Jay Mods'.)

  **Output Format for Client-Only Executor Scripts (without fxmanifest.lua):**
  Provide only the Lua script code, clearly delimited. For example:

  -- executor_script.lua --
  -- Lua code for client-side execution
  -- end executor_script.lua --
  
  (The script name like 'executor_script.lua' is just an example comment delimiter; the actual content should be the Lua code.)
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

