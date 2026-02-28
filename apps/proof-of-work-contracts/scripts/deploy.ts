const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("════════════════════════════════════════");
  console.log("  ProofOfWork — Deployment Script");
  console.log("════════════════════════════════════════");
  console.log("Deployer :", deployer.address);
  console.log("Network  :", hre.network.name);
  console.log("Balance  :", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), "ETH\n");

  // ── 1. Deploy ProofOfWorkNFT ──────────────────
  console.log("1/3  Deploying ProofOfWorkNFT...");
  const NFT = await hre.ethers.getContractFactory("ProofOfWorkNFT");
  const nft = await NFT.deploy();
  await nft.waitForDeployment();
  console.log("     ✅ ProofOfWorkNFT:", await nft.getAddress());

  // ── 2. Deploy BountyEscrow ────────────────────
  console.log("2/3  Deploying BountyEscrow...");
  const Escrow = await hre.ethers.getContractFactory("BountyEscrow");
  const escrow = await Escrow.deploy(deployer.address); // deployer = fee recipient for now
  await escrow.waitForDeployment();
  console.log("     ✅ BountyEscrow:", await escrow.getAddress());

  // ── 3. Deploy AIOracle ────────────────────────
  console.log("3/3  Deploying AIOracle...");
  const Oracle = await hre.ethers.getContractFactory("AIOracle");
  const oracle = await Oracle.deploy(await escrow.getAddress());
  await oracle.waitForDeployment();
  console.log("     ✅ AIOracle:", await oracle.getAddress());

  // ── Wire contracts together ───────────────────
  console.log("\nWiring contracts...");

  // Tell NFT which escrow can mint
  let tx = await nft.setBountyEscrow(await escrow.getAddress());
  await tx.wait();
  console.log("  ✅ NFT.setBountyEscrow()");

  // Tell escrow about the NFT
  tx = await escrow.setNFTContract(await nft.getAddress());
  await tx.wait();
  console.log("  ✅ Escrow.setNFTContract()");

  // Register AIOracle as an authorised oracle in BountyEscrow
  tx = await escrow.setOracle(await oracle.getAddress(), true);
  await tx.wait();
  console.log("  ✅ Escrow.setOracle(AIOracle)");

  // ── Summary ───────────────────────────────────
  console.log("\n════════════════════════════════════════");
  console.log("  ✅  All contracts deployed & wired!");
  console.log("════════════════════════════════════════");
  console.log("ProofOfWorkNFT :", await nft.getAddress());
  console.log("BountyEscrow   :", await escrow.getAddress());
  console.log("AIOracle       :", await oracle.getAddress());

  // Save addresses for frontend / backend
  const { writeFileSync } = require("fs");
  const addresses = {
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
    ProofOfWorkNFT: await nft.getAddress(),
    BountyEscrow: await escrow.getAddress(),
    AIOracle: await oracle.getAddress(),
    deployedAt: new Date().toISOString(),
  };
  writeFileSync("deployed-addresses.json", JSON.stringify(addresses, null, 2));
  console.log("\nAddresses saved → deployed-addresses.json");

  // Verify on Etherscan (only on live networks)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\nWaiting 10s then verifying on Etherscan...");
    await new Promise(r => setTimeout(r, 10_000));

    await verifyContract(await nft.getAddress(), []);
    await verifyContract(await escrow.getAddress(), [deployer.address]);
    await verifyContract(await oracle.getAddress(), [await escrow.getAddress()]);
  }
}

//@ts-ignore
async function verifyContract(address, constructorArgs) {
  try {
    await hre.run("verify:verify", {
      address,
      constructorArguments: constructorArgs,
    });
    console.log("  ✅ Verified:", address);
  } catch (e: any) {
    if (e.message.includes("Already Verified")) {
      console.log("  ℹ️  Already verified:", address);
    } else {
      console.log("  ⚠️  Verification failed:", e.message);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});