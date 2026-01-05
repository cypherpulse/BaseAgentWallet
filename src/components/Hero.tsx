import { Bot, Sparkles, Zap, Wallet } from "lucide-react";
import { useAccount, useConnect } from "wagmi";
import { injected } from "wagmi/connectors";

export const Hero = () => {
  const { isConnected } = useAccount();
  const { connect } = useConnect();

  if (isConnected) return null;

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 badge-primary mb-6 animate-fade-in"><Sparkles className="w-3.5 h-3.5" /><span>Built on Base • 0.5% Protocol Fee</span></div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-up">Let AI Agents <span className="gradient-text">Trade For You</span><br />on Base</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up">Deposit ETH, grant permissions to AI agents, and watch them execute trades autonomously. Every action supports Base builders.</p>
        <div className="flex justify-center animate-slide-up">
          <button onClick={() => connect({ connector: injected() })} className="btn-primary text-lg px-8 py-4 flex items-center gap-3 shadow-glow animate-pulse-glow">
            <Wallet className="w-5 h-5" />Connect Wallet to Start
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {[{ icon: Bot, title: "AI-Powered Trading", description: "Grant agents permission to trade on your behalf" },
            { icon: Zap, title: "Instant Execution", description: "Agents execute swaps via Uniswap V3 on Base" },
            { icon: Sparkles, title: "Earn Points", description: "Every trade = on-chain tx = leaderboard points" }
          ].map((feature, i) => (
            <div key={i} className="card-base p-6 text-left animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4"><feature.icon className="w-6 h-6 text-primary-foreground" /></div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
