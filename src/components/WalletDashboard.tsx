import { useState } from "react";
import { useAccount, useBalance, useReadContract, useWriteContract, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, formatEther, isAddress } from "viem";
import { Wallet, ArrowDownToLine, Coins, Send, Loader2 } from "lucide-react";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/config/contract";
import { useToast } from "@/hooks/use-toast";
import { useConfetti } from "@/hooks/useConfetti";

export const WalletDashboard = () => {
  const { address } = useAccount();
  const { toast } = useToast();
  const { fireConfetti } = useConfetti();

  const [depositAmount, setDepositAmount] = useState("");
  const [erc20Token, setErc20Token] = useState("");
  const [erc20Amount, setErc20Amount] = useState("");

  const { data: contractBalance, refetch: refetchBalance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getBalance",
  });

  const { data: walletBalance } = useBalance({ address });

  const { sendTransaction, data: depositHash, isPending: isDepositing } = useSendTransaction();
  const { isLoading: isConfirmingDeposit } = useWaitForTransactionReceipt({ hash: depositHash });

  const { writeContract, data: erc20Hash, isPending: isDepositingERC20 } = useWriteContract();
  const { isLoading: isConfirmingERC20 } = useWaitForTransactionReceipt({ hash: erc20Hash });

  const handleDepositETH = () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast({ title: "Invalid amount", description: "Please enter a valid ETH amount", variant: "destructive" });
      return;
    }
    sendTransaction({ to: CONTRACT_ADDRESS, value: parseEther(depositAmount) });
    toast({ title: "Transaction Submitted", description: "Depositing ETH..." });
    setTimeout(() => { refetchBalance(); setDepositAmount(""); fireConfetti(); toast({ title: "Deposit Successful! 🎉" }); }, 3000);
  };

  const handleDepositERC20 = () => {
    if (!isAddress(erc20Token) || !erc20Amount || parseFloat(erc20Amount) <= 0) {
      toast({ title: "Invalid input", variant: "destructive" });
      return;
    }
    writeContract({ address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: "depositERC20", args: [erc20Token as `0x${string}`, parseEther(erc20Amount)] } as any);
    toast({ title: "Transaction Submitted" });
    setTimeout(() => { setErc20Token(""); setErc20Amount(""); fireConfetti(); toast({ title: "Token Deposit Successful! 🎉" }); }, 3000);
  };

  const formattedContractBalance = contractBalance ? parseFloat(formatEther(contractBalance)).toFixed(4) : "0.0000";
  const formattedWalletBalance = walletBalance ? parseFloat(formatEther(walletBalance.value)).toFixed(4) : "0.0000";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3 text-muted-foreground"><Wallet className="w-5 h-5" /><span className="text-sm font-medium">Your Wallet</span></div>
          <div className="flex items-baseline gap-2"><span className="text-3xl font-bold">{formattedWalletBalance}</span><span className="text-muted-foreground">ETH</span></div>
        </div>
        <div className="stat-card border-primary/20">
          <div className="flex items-center gap-3 text-muted-foreground"><Coins className="w-5 h-5 text-primary" /><span className="text-sm font-medium">Agent Wallet Balance</span></div>
          <div className="flex items-baseline gap-2"><span className="text-3xl font-bold gradient-text">{formattedContractBalance}</span><span className="text-muted-foreground">ETH</span></div>
        </div>
      </div>

      <div className="card-base p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><ArrowDownToLine className="w-5 h-5 text-primary" />Deposit ETH</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input type="number" placeholder="Amount in ETH" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} className="input-base flex-1" step="0.001" min="0" />
          <button onClick={handleDepositETH} disabled={isDepositing || isConfirmingDeposit} className="btn-primary flex items-center justify-center gap-2">
            {isDepositing || isConfirmingDeposit ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}Deposit
          </button>
        </div>
      </div>

      <div className="card-base p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Coins className="w-5 h-5 text-primary" />Deposit ERC20 Token</h3>
        <div className="space-y-3">
          <input type="text" placeholder="Token Contract Address (0x...)" value={erc20Token} onChange={(e) => setErc20Token(e.target.value)} className="input-base" />
          <div className="flex flex-col sm:flex-row gap-3">
            <input type="number" placeholder="Amount" value={erc20Amount} onChange={(e) => setErc20Amount(e.target.value)} className="input-base flex-1" step="0.001" min="0" />
            <button onClick={handleDepositERC20} disabled={isDepositingERC20 || isConfirmingERC20} className="btn-primary flex items-center justify-center gap-2">
              {isDepositingERC20 || isConfirmingERC20 ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}Deposit Token
            </button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">Note: Approve the contract first</p>
      </div>
    </div>
  );
};
