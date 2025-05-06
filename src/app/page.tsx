
import CodeCrafterClient from '@/components/code-crafter-client';

export default function CodeCrafterPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="py-6 px-4 sm:px-6 lg:px-8 shadow-md bg-primary text-primary-foreground">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">CodeCrafter</h1>
          <p className="text-sm text-primary-foreground/80">Your FiveM Scripting Assistant</p>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <CodeCrafterClient />
      </main>
      <footer className="py-6 px-4 sm:px-6 lg:px-8 mt-auto border-t">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} CodeCrafter. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
