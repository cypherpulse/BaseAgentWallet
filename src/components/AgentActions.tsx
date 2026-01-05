import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, isAddress } from "viem";
import { Send, ArrowRightLeft, Loader2, Zap, AlertTriangle } from "lucide-react";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/config/contract";
import { useToast } from "@/hooks/use-toast";
import { useConfetti } from "@/hooks/useConfetti";

export const AgentActions = () => {
  const { toast } = useToast();
  const { fireConfetti } = useConfetti();
  const [sendTo, setSendTo] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [swapAmount, setSwapAmount] = useState("");
  const [tokenOut, setTokenOut] = useState("");
  const [amountOutMin, setAmountOutMin] = useState("0");

  const { writeContract: agentSendETH, data: sendHash, isPending: isSending } = useWriteContract();
  const { isLoading: isConfirmingSend } = useWaitForTransactionReceipt({ hash: sendHash });

  const { writeContract: agentSwap, data: swapHash, isPending: isSwapping } = useWriteContract();
  const { isLoading: isConfirmingSwap } = useWaitForTransactionReceipt({ hash: swapHash });

  const handleAgentSendETH = () => {
    if (!isAddress(sendTo) || !sendAmount || parseFloat(sendAmount) <= 0) { toast({ title: "Invalid input", variant: "destructive" }); return; }
    agentSendETH({ address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: "agentSendETH", args: [sendTo as `0x${string}`, parseEther(sendAmount)] } as any);
    toast({ title: "Agent Action Submitted" });
    setTimeout(() => { setSendTo(""); setSendAmount(""); fireConfetti(); toast({ title: "ETH Sent! 🚀" }); }, 3000);
  };

  const handleAgentSwap = () => {
    if (!isAddress(tokenOut) || !swapAmount || parseFloat(swapAmount) <= 0) { toast({ title: "Invalid input", variant: "destructive" }); return; }
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600);
    agentSwap({ address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: "agentSwapETHForTokens", args: [parseEther(amountOutMin || "0"), tokenOut as `0x${string}`, 500, deadline], value: parseEther(swapAmount) } as any);
    toast({ title: "Swap Submitted" });
    setTimeout(() => { setSwapAmount(""); setTokenOut(""); setAmountOutMin("0"); fireConfetti(); toast({ title: "Swap Successful! 🔄" }); }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="card-base p-4 bg-warning/10 border-warning/20">
        <div className="flex items-start gap-3"><AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
          <div><p className="text-sm font-medium">Agent Actions (Testing)</p><p className="text-xs text-muted-foreground mt-1">0.5% protocol fee applied to all agent actions.</p></div>
        </div>
      </div>

      <div className="card-base p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Send className="w-5 h-5 text-primary" />Agent: Send ETH</h3>
        <div className="space-y-4">
          <input type="text" placeholder="Recipient Address (0x...)" value={sendTo} onChange={(e) => setSendTo(e.target.value)} className="input-base" />
          <div className="flex flex-col sm:flex-row gap-3">
            <input type="number" placeholder="Amount in ETH" value={sendAmount} onChange={(e) => setSendAmount(e.target.value)} className="input-base flex-1" step="0.001" min="0" />
            <button onClick={handleAgentSendETH} disabled={isSending || isConfirmingSend} className="btn-primary flex items-center justify-center gap-2">
              {isSending || isConfirmingSend ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}Execute Send
            </button>
          </div>
          <p className="text-xs text-muted-foreground">Fee: 0.5% • Recipient receives {sendAmount ? (parseFloat(sendAmount) * 0.995).toFixed(6) : "0"} ETH</p>
        </div>
      </div>

      <div className="card-base p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><ArrowRightLeft className="w-5 h-5 text-primary" />Agent: Swap ETH → Token</h3>
        <div className="space-y-4">
          <input type="text" placeholder="Token Out Address (0x...)" value={tokenOut} onChange={(e) => setTokenOut(e.target.value)} className="input-base" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="number" placeholder="ETH Amount" value={swapAmount} onChange={(e) => setSwapAmount(e.target.value)} className="input-base" step="0.001" min="0" />
            <input type="number" placeholder="Min Tokens Out" value={amountOutMin} onChange={(e) => setAmountOutMin(e.target.value)} className="input-base" step="0.001" min="0" />
          </div>
          <button onClick={handleAgentSwap} disabled={isSwapping || isConfirmingSwap} className="btn-primary w-full flex items-center justify-center gap-2">
            {isSwapping || isConfirmingSwap ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRightLeft className="w-4 h-4" />}Execute Swap
          </button>
          <p className="text-xs text-muted-foreground">Swaps via Uniswap V3 on Base • 0.5% protocol fee</p>
        </div>
      </div>
    </div>
  );
};
