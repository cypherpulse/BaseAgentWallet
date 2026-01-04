# PowerShell script to add and commit BaseAgentWallet contract files
# This script commits the implemented BaseAgentWallet contract, built on Base Blockchain using Solidity, OpenZeppelin, and Foundry

# Get the list of untracked files
$untrackedFiles = (git ls-files --others --exclude-standard) -split '\r\n|\n|\r' | Where-Object { $_ -ne "" }

# Get the list of modified files (staged and unstaged)
$modifiedUnstaged = (git diff --name-only) -split '\r\n|\n|\r' | Where-Object { $_ -ne "" }
$modifiedStaged = (git diff --cached --name-only) -split '\r\n|\n|\r' | Where-Object { $_ -ne "" }
$modifiedFiles = ($modifiedUnstaged + $modifiedStaged) | Select-Object -Unique

# Combine all files to commit
$allFiles = ($untrackedFiles + $modifiedFiles) | Select-Object -Unique

# Comprehensive commit message for BaseAgentWallet contract on Base blockchain
$commitMessage = "Implemented BaseAgentWallet an AI Agent-controlled wallet on Base blockchain with secure smart contract for automated trading with 0.5% protocol fees using Solidity ^0.8.24, OpenZeppelin, and Foundry"

# Commit each file individually
foreach ($file in $allFiles) {
    if ($file -ne "") {
        git add $file
        git commit --only $file -m "$commitMessage - $file"
    }
}

# Push all commits
git push --set-upstream origin contract