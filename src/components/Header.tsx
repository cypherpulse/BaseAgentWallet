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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl gradient-bg flex items-center justify-center">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-base sm:text-lg leading-tight truncate">Base Agent Wallet</h1>
              <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                <span className="hidden sm:inline">View Contract</span>
                <span className="sm:hidden">Contract</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          {isConnected ? (
            <button onClick={() => disconnect()} className="btn-secondary flex items-center gap-1 sm:gap-2 text-sm px-3 py-2">
              <Wallet className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
              <span className="sm:hidden">{address?.slice(0, 4)}...{address?.slice(-2)}</span>
            </button>
          ) : (
            <button onClick={() => connect({ connector: injected() })} className="btn-primary flex items-center gap-1 sm:gap-2 text-sm px-3 py-2">
              <Wallet className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Connect Wallet</span>
              <span className="sm:hidden">Connect</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
