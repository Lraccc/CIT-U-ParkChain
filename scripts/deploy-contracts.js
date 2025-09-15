const { ethers } = require("hardhat")

async function main() {
  console.log("Deploying CIT-U ParkChain contracts...")

  // Get the deployer account
  const [deployer] = await ethers.getSigners()
  console.log("Deploying contracts with account:", deployer.address)

  // Deploy ParkingToken first
  console.log("Deploying ParkingToken...")
  const ParkingToken = await ethers.getContractFactory("ParkingToken")
  const parkingToken = await ParkingToken.deploy()
  await parkingToken.waitForDeployment()

  const parkingTokenAddress = await parkingToken.getAddress()
  console.log("ParkingToken deployed to:", parkingTokenAddress)

  // Deploy CITUParkingSystem
  console.log("Deploying CITUParkingSystem...")
  const CITUParkingSystem = await ethers.getContractFactory("CITUParkingSystem")
  const parkingSystem = await CITUParkingSystem.deploy(parkingTokenAddress)
  await parkingSystem.waitForDeployment()

  const parkingSystemAddress = await parkingSystem.getAddress()
  console.log("CITUParkingSystem deployed to:", parkingSystemAddress)

  // Mint some initial tokens for testing
  console.log("Minting initial tokens for testing...")
  const mintAmount = ethers.parseUnits("10000", 2) // 10,000 PARK tokens
  await parkingToken.mint(deployer.address, mintAmount)
  console.log("Minted 10,000 PARK tokens to deployer")

  // Transfer some tokens to the parking system for rewards/refunds
  const transferAmount = ethers.parseUnits("5000", 2) // 5,000 PARK tokens
  await parkingToken.transfer(parkingSystemAddress, transferAmount)
  console.log("Transferred 5,000 PARK tokens to parking system")

  console.log("\n=== Deployment Summary ===")
  console.log("ParkingToken Address:", parkingTokenAddress)
  console.log("CITUParkingSystem Address:", parkingSystemAddress)
  console.log("Deployer Address:", deployer.address)

  console.log("\n=== Environment Variables ===")
  console.log(`NEXT_PUBLIC_PARKING_TOKEN_ADDRESS=${parkingTokenAddress}`)
  console.log(`NEXT_PUBLIC_PARKING_SYSTEM_ADDRESS=${parkingSystemAddress}`)

  console.log("\n=== Verification Commands ===")
  console.log(`npx hardhat verify --network <network> ${parkingTokenAddress}`)
  console.log(`npx hardhat verify --network <network> ${parkingSystemAddress} ${parkingTokenAddress}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
