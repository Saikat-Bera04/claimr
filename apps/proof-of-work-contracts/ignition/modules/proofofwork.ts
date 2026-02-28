import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * Hardhat Ignition module — alternative to the deploy script.
 * Run with: npx hardhat ignition deploy ignition/modules/ProofOfWork.ts --network sepolia
 *
 * Note: The deploy script (scripts/deploy.ts) is recommended for the hackathon
 * because it wires the contracts together automatically and saves addresses.
 * This Ignition module is here for completeness.
 */
const ProofOfWorkModule = buildModule("ProofOfWorkModule", (m) => {
  const deployer = m.getAccount(0);

  // Deploy all three contracts
  const nft = m.contract("ProofOfWorkNFT");
  const escrow = m.contract("BountyEscrow", [deployer]);
  const oracle = m.contract("AIOracle", [escrow]);

  // Wire: tell NFT which escrow can mint
  m.call(nft, "setBountyEscrow", [escrow]);

  // Wire: tell escrow about the NFT
  m.call(escrow, "setNFTContract", [nft]);

  // Wire: register oracle as authorised in escrow
  m.call(escrow, "setOracle", [oracle, true]);

  return { nft, escrow, oracle };
});

export default ProofOfWorkModule;