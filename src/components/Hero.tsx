import { Bot, Sparkles, Zap, Wallet } from "lucide-react";
import { useAccount, useConnect } from "wagmi";
import { injected } from "wagmi/connectors";

export const Hero = () => {
  const { isConnected } = useAccount();
  const { connect } = useConnect();

  if (isConnected) return null;

  return (
    <section className="relative py-12 sm:py-16 lg:py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 badge-primary mb-4 sm:mb-6 animate-fade-in">
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span className="text-xs sm:text-sm">Built on Base • 0.5% Protocol Fee</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 animate-slide-up px-2">
          Let AI Agents <span className="gradient-text">Trade For You</span>
          <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>on Base
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10 animate-slide-up px-2">
          Deposit ETH, grant permissions to AI agents, and watch them execute trades autonomously. Every action supports Base builders.
        </p>
        <div className="flex justify-center animate-slide-up px-4">
          <button onClick={() => connect({ connector: injected() })} className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 flex items-center gap-2 sm:gap-3 shadow-glow animate-pulse-glow w-full sm:w-auto max-w-xs sm:max-w-none">
            <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Connect Wallet to Start</span>
            <span className="sm:hidden">Connect Wallet</span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-16 px-2">
          {[{ icon: Bot, title: "AI-Powered Trading", description: "Grant agents permission to trade on your behalf" },
            { icon: Zap, title: "Instant Execution", description: "Agents execute swaps via Uniswap V3 on Base" },
            { icon: Sparkles, title: "Earn Points", description: "Every trade = on-chain tx = leaderboard points" }
          ].map((feature, i) => (
            <div key={i} className="card-base p-4 sm:p-6 text-left animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl gradient-bg flex items-center justify-center mb-3 sm:mb-4">
                <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-base sm:text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
