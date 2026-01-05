import { useState } from "react";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { isAddress } from "viem";
import { Bot, UserPlus, UserMinus, Shield, ShieldCheck, Loader2, Check, X } from "lucide-react";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/config/contract";
import { useToast } from "@/hooks/use-toast";
import { useConfetti } from "@/hooks/useConfetti";

export const AgentManager = () => {
  const { toast } = useToast();
  const { fireConfetti } = useConfetti();
  const [agentAddress, setAgentAddress] = useState("");
  const [checkAddress, setCheckAddress] = useState("");

  const { writeContract: grantAgent, data: grantHash, isPending: isGranting } = useWriteContract();
  const { isLoading: isConfirmingGrant } = useWaitForTransactionReceipt({ hash: grantHash });

  const { writeContract: revokeAgent, data: revokeHash, isPending: isRevoking } = useWriteContract();
  const { isLoading: isConfirmingRevoke } = useWaitForTransactionReceipt({ hash: revokeHash });

  const { data: isAgentResult, refetch: checkIsAgent } = useReadContract({
    address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: "isAgent",
    args: checkAddress && isAddress(checkAddress) ? [checkAddress as `0x${string}`] : undefined,
    query: { enabled: !!checkAddress && isAddress(checkAddress) },
  });

  const handleGrantAgent = () => {
    if (!isAddress(agentAddress)) { toast({ title: "Invalid Address", variant: "destructive" }); return; }
    grantAgent({ address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: "grantAgent", args: [agentAddress as `0x${string}`] } as any);
    toast({ title: "Transaction Submitted" });
    setTimeout(() => { setAgentAddress(""); fireConfetti(); toast({ title: "Agent Granted! 🤖" }); }, 3000);
  };

  const handleRevokeAgent = () => {
    if (!isAddress(agentAddress)) { toast({ title: "Invalid Address", variant: "destructive" }); return; }
    revokeAgent({ address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: "revokeAgent", args: [agentAddress as `0x${string}`] } as any);
    toast({ title: "Transaction Submitted" });
    setTimeout(() => { setAgentAddress(""); toast({ title: "Agent Revoked" }); }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="card-base p-4 bg-primary/5 border-primary/20">
        <div className="flex items-start gap-3"><Bot className="w-5 h-5 text-primary mt-0.5" />
          <div><p className="text-sm font-medium">AI Agent Permissions</p><p className="text-xs text-muted-foreground mt-1">Grant or revoke trading permissions. 0.5% protocol fee on agent actions.</p></div>
        </div>
      </div>

      <div className="card-base p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-primary" />Manage Agent Permissions</h3>
        <div className="space-y-4">
          <input type="text" placeholder="Agent Address (0x...)" value={agentAddress} onChange={(e) => setAgentAddress(e.target.value)} className="input-base" />
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={handleGrantAgent} disabled={isGranting || isConfirmingGrant} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {isGranting || isConfirmingGrant ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}Grant Agent
            </button>
            <button onClick={handleRevokeAgent} disabled={isRevoking || isConfirmingRevoke} className="flex-1 flex items-center justify-center gap-2 border-2 border-destructive text-destructive font-semibold rounded-xl px-6 py-3 transition-all hover:bg-destructive hover:text-destructive-foreground disabled:opacity-50">
              {isRevoking || isConfirmingRevoke ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserMinus className="w-4 h-4" />}Revoke Agent
            </button>
          </div>
        </div>
      </div>

      <div className="card-base p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-primary" />Check Agent Status</h3>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input type="text" placeholder="Check Address (0x...)" value={checkAddress} onChange={(e) => setCheckAddress(e.target.value)} className="input-base flex-1" />
            <button onClick={() => checkIsAgent()} className="btn-secondary">Check</button>
          </div>
          {checkAddress && isAddress(checkAddress) && isAgentResult !== undefined && (
            <div className={`p-4 rounded-xl flex items-center gap-3 ${isAgentResult ? "bg-success/10 border border-success/20" : "bg-muted border border-border"}`}>
              {isAgentResult ? (<><div className="w-8 h-8 rounded-full bg-success flex items-center justify-center"><Check className="w-4 h-4 text-success-foreground" /></div><div><p className="font-medium text-success">Active Agent</p></div></>) 
              : (<><div className="w-8 h-8 rounded-full bg-muted-foreground/20 flex items-center justify-center"><X className="w-4 h-4 text-muted-foreground" /></div><div><p className="font-medium">Not an Agent</p></div></>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
