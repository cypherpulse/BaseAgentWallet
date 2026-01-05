import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Dashboard } from "@/components/Dashboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Dashboard />
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Built on Base Sepolia • Contract:{" "}
            <a
              href="https://sepolia.basescan.org/address/0x387E59Ac9888DA71180fA7d55B0A9EdB4377dCf0"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-primary hover:underline"
            >
              0x387E...dCf0
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
