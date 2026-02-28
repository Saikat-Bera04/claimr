import { BrowserProvider, Contract, parseEther } from "ethers";

// 1. You only need the ABI for the functions you intend to call
const bountyEscrowABI = [
  "function submitSolution(uint256 bountyId, string calldata ipfsHash) external",
  "function postBounty(string calldata ipfsHash, uint256 deadline, uint8 category) external payable returns (uint256)"
];

const CONTRACT_ADDRESS = "0xYourBountyEscrowContractAddressHere";

export async function submitBountySolution(bountyId: number, ipfsHash: string) {
  try {
    // 2. Ensure the user has a wallet connected (e.g., MetaMask)
    //@ts-ignore
    if (!window.ethereum) {
      throw new Error("No crypto wallet found. Please install MetaMask.");
    }

    // 3. Setup the Provider and Signer
    //@ts-ignore
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // 4. Create the Contract instance attached to the signer
    const bountyEscrowContract = new Contract(
      CONTRACT_ADDRESS,
      bountyEscrowABI,
      signer
    );

    console.log("Submitting solution...");

    // 5. Call the smart contract function
    const tx = await bountyEscrowContract.submitSolution(bountyId, ipfsHash);
    
    console.log("Transaction sent! Hash:", tx.hash);

    // 6. Wait for the transaction to be mined
    const receipt = await tx.wait();
    console.log("Transaction confirmed in block:", receipt.blockNumber);
    
    return receipt;

  } catch (error) {
    console.error("Error calling submitSolution:", error);
    throw error;
  }
}