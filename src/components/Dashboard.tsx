import { useState } from "react";
import { useAccount } from "wagmi";
import { Wallet, Users, Zap, Shield, Info } from "lucide-react";
import { WalletDashboard } from "./WalletDashboard";
import { AgentManager } from "./AgentManager";
import { AgentActions } from "./AgentActions";
import { AdminPanel } from "./AdminPanel";

type TabType = "wallet" | "agents" | "actions" | "admin";

const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: "wallet", label: "Wallet", icon: Wallet },
  { id: "agents", label: "Agents", icon: Users },
  { id: "actions", label: "Actions", icon: Zap },
  { id: "admin", label: "Admin", icon: Shield },
];

export const Dashboard = () => {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<TabType>("wallet");

  if (!isConnected) return null;

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      {/* Protocol Fee Info */}
      <div className="card-base p-4 mb-6 bg-primary/5 border-primary/10">
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5 text-primary flex-shrink-0" />
          <p className="text-sm">
            <span className="font-medium">0.5% protocol fee</span> on agent actions supports Base builders.
            Every trade = on-chain tx = leaderboard points! 🏆
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "gradient-bg text-primary-foreground shadow-md"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-slide-up">
        {activeTab === "wallet" && <WalletDashboard />}
        {activeTab === "agents" && <AgentManager />}
        {activeTab === "actions" && <AgentActions />}
        {activeTab === "admin" && <AdminPanel />}
      </div>
    </div>
  );
};
