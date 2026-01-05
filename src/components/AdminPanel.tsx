import { useState } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { isAddress, formatEther } from "viem";
import { Shield, AlertTriangle, Loader2, Download, Coins, Lock } from "lucide-react";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/config/contract";
import { useToast } from "@/hooks/use-toast";

export const AdminPanel = () => {
  const { address } = useAccount();
  const { toast } = useToast();
  const [withdrawToken, setWithdrawToken] = useState("");

  const { data: owner } = useReadContract({ address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: "owner" });
  const { data: treasury } = useReadContract({ address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: "treasury" });
  const { data: contractBalance } = useReadContract({ address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: "getBalance" });

  const { writeContract: emergencyWithdrawETH, data: withdrawEthHash, isPending: isWithdrawingETH } = useWriteContract();
  const { isLoading: isConfirmingETH } = useWaitForTransactionReceipt({ hash: withdrawEthHash });

  const { writeContract: emergencyWithdrawToken, data: withdrawTokenHash, isPending: isWithdrawingToken } = useWriteContract();
  const { isLoading: isConfirmingToken } = useWaitForTransactionReceipt({ hash: withdrawTokenHash });

  const isOwner = address && owner && address.toLowerCase() === owner.toLowerCase();
  const formattedBalance = contractBalance ? parseFloat(formatEther(contractBalance)).toFixed(4) : "0.0000";

  const handleEmergencyWithdrawETH = () => {
    emergencyWithdrawETH({ address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: "emergencyWithdrawETH" } as any);
    toast({ title: "Emergency Withdraw Submitted" });
  };

  const handleEmergencyWithdrawToken = () => {
    if (!isAddress(withdrawToken)) { toast({ title: "Invalid Address", variant: "destructive" }); return; }
    emergencyWithdrawToken({ address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: "emergencyWithdrawToken", args: [withdrawToken as `0x${string}`] } as any);
    toast({ title: "Emergency Withdraw Submitted" });
    setTimeout(() => setWithdrawToken(""), 3000);
  };

  if (!isOwner) {
    return (
      <div className="card-base p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4"><Lock className="w-8 h-8 text-muted-foreground" /></div>
        <h3 className="text-lg font-semibold mb-2">Owner Access Only</h3>
        <p className="text-sm text-muted-foreground">Admin functions are restricted to the contract owner.</p>
        {owner && <p className="text-xs text-muted-foreground mt-4 font-mono bg-muted px-3 py-2 rounded-lg">Owner: {owner.slice(0, 6)}...{owner.slice(-4)}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card-base p-4 bg-destructive/10 border-destructive/20">
        <div className="flex items-start gap-3"><AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
          <div><p className="text-sm font-medium text-destructive">Emergency Controls</p><p className="text-xs text-muted-foreground mt-1">These actions are irreversible.</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="stat-card"><div className="flex items-center gap-2 text-muted-foreground"><Shield className="w-4 h-4" /><span className="text-xs">Treasury</span></div><p className="text-sm font-mono truncate">{treasury ? `${treasury.slice(0, 10)}...${treasury.slice(-8)}` : "Loading..."}</p></div>
        <div className="stat-card"><div className="flex items-center gap-2 text-muted-foreground"><Coins className="w-4 h-4" /><span className="text-xs">Contract Balance</span></div><p className="text-lg font-bold">{formattedBalance} ETH</p></div>
      </div>

      <div className="card-base p-6 border-destructive/20">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Download className="w-5 h-5 text-destructive" />Emergency Withdraw ETH</h3>
        <button onClick={handleEmergencyWithdrawETH} disabled={isWithdrawingETH || isConfirmingETH} className="w-full py-3 px-6 rounded-xl font-semibold bg-destructive text-destructive-foreground hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {isWithdrawingETH || isConfirmingETH ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}Withdraw All ETH
        </button>
      </div>

      <div className="card-base p-6 border-destructive/20">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Coins className="w-5 h-5 text-destructive" />Emergency Withdraw Token</h3>
        <div className="space-y-4">
          <input type="text" placeholder="Token Address (0x...)" value={withdrawToken} onChange={(e) => setWithdrawToken(e.target.value)} className="input-base" />
          <button onClick={handleEmergencyWithdrawToken} disabled={isWithdrawingToken || isConfirmingToken} className="w-full py-3 px-6 rounded-xl font-semibold bg-destructive text-destructive-foreground hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {isWithdrawingToken || isConfirmingToken ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}Withdraw Token
          </button>
        </div>
      </div>
    </div>
  );
};
