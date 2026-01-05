import { Bot, ExternalLink, Wallet } from "lucide-react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { CONTRACT_ADDRESS } from "@/config/contract";

export const Header = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const explorerUrl = `https://sepolia.basescan.org/address/${CONTRACT_ADDRESS}`;

  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Base Agent Wallet</h1>
              <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                View Contract<ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          {isConnected ? (
            <button onClick={() => disconnect()} className="btn-secondary flex items-center gap-2">
              <Wallet className="w-4 h-4" />{address?.slice(0, 6)}...{address?.slice(-4)}
            </button>
          ) : (
            <button onClick={() => connect({ connector: injected() })} className="btn-primary flex items-center gap-2">
              <Wallet className="w-4 h-4" />Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
