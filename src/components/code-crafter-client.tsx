'use client';

import type { GenerateFiveMScriptInput, GenerateFiveMScriptOutput } from '@/ai/flows/generate-fivem-script';
import { generateFiveMScript } from '@/ai/flows/generate-fivem-script';
import { zodResolver } from '@hookform/resolvers/zod';
import { Download, Loader2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  prompt: z.string().min(10, { message: 'Prompt must be at least 10 characters long.' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function CodeCrafterClient() {
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setGeneratedCode(null);
    try {
      const input: GenerateFiveMScriptInput = { prompt: data.prompt };
      const output: GenerateFiveMScriptOutput = await generateFiveMScript(input);
      setGeneratedCode(output.code);
      toast({
        title: "Script Generated!",
        description: "Your FiveM script has been successfully generated.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error generating script:', error);
      toast({
        title: "Error Generating Script",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setGeneratedCode('// An error occurred while generating the script. Please check the console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedCode) {
      toast({
        title: "No Code to Download",
        description: "Please generate a script first.",
        variant: "destructive",
      });
      return;
    }
    const blob = new Blob([generatedCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fivem_script.lua'; // Default filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({
      title: "Download Started",
      description: "Your script is being downloaded.",
    });
  };

  return (
    <>
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Generate FiveM Script</CardTitle>
            <CardDescription>Describe the script you want to create. Be as specific as possible for the best results.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Script Prompt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Create a script for a simple car spawner with a command /spawncar [carname]"
                          className="min-h-[200px] resize-none bg-secondary text-foreground placeholder:text-muted-foreground"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Script
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl">Generated Code</CardTitle>
                <CardDescription>Review the generated Lua script below. You can copy or download it.</CardDescription>
              </div>
              <Button variant="outline" size="icon" onClick={handleDownload} disabled={!generatedCode || isLoading} aria-label="Download script">
                <Download className="h-5 w-5 text-accent" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] w-full rounded-md border bg-secondary p-4">
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-full">
                  <Loader2 className="h-12 w-12 animate-spin text-accent" />
                  <p className="mt-4 text-muted-foreground">Generating your script, please wait...</p>
                </div>
              )}
              {!isLoading && generatedCode && (
                <pre className="text-sm whitespace-pre-wrap break-all text-foreground">
                  <code>{generatedCode}</code>
                </pre>
              )}
              {!isLoading && !generatedCode && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Sparkles className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground">Your generated script will appear here.</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </>
  );
}
