# CIT-U ParkChain - Blockchain-Based Campus Parking System

A decentralized application (DApp) that manages campus parking through blockchain technology. It provides secure user authentication, digital parking wallets, smart contract–based reservations, automated payments, real-time slot monitoring, and transparent transaction history to prevent fraud and ensure fair parking allocation.

## 🚀 Key Features

- **User Authentication & Vehicle Registration** – Secure login and vehicle identity verification
- **Digital Parking Wallet** – Parking credits/tokens for seamless transactions
- **Smart Parking Contracts** – Automated slot reservations and cancellations
- **Automated Parking Payments** – Token-based payments stored immutably on-chain
- **Parking History & Transparency** – Clear logs for users and administrators
- **Real-Time Slot Monitoring** – Check slot availability with IoT integration or live updates

## 🎯 Objective

To create a secure and efficient parking system that reduces congestion, prevents fraud, and provides fair access to parking facilities within the campus through blockchain technology.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Blockchain**: Solidity, Hardhat, Ethers.js
- **Smart Contracts**: OpenZeppelin contracts
- **Wallet Integration**: MetaMask
- **Package Manager**: pnpm

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) package manager
- [MetaMask](https://metamask.io/) browser extension
- [Git](https://git-scm.com/)

## 🚀 Quick Start Guide

### Step 1: Clone and Install Dependencies (Windows PowerShell)

Open Windows PowerShell and run:

```powershell
# Clone the repository
git clone <repository-url>
Set-Location CIT-U-ParkChain

# Install dependencies
pnpm install
```

### Step 2: Set Up Environment Variables

```powershell
# Copy the environment template (Windows PowerShell)
Copy-Item env.template .env.local

# Then edit .env.local and add your contract addresses after deployment
# (You'll get these addresses after running the deployment script)
```

### Step 3: Compile Smart Contracts

```powershell
# Compile the Solidity contracts
pnpm run blockchain:compile
```

### Step 4: Start Local Blockchain Network

Open a NEW Windows PowerShell window and start the local Hardhat network:

```powershell
# Start local blockchain node (keep this window open)
pnpm run blockchain:node
```

This will start a local blockchain network on `http://127.0.0.1:8545` with 20 test accounts, each with 10,000 ETH.

### Step 5: Deploy Smart Contracts

Open ANOTHER Windows PowerShell window (with the repo directory as the current path) and deploy the contracts to your local network:

```powershell
# In a separate PowerShell window
# Deploy contracts to local network
pnpm run blockchain:deploy
```

After deployment, you'll see output like this:
```
=== Deployment Summary ===
ParkingToken Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
CITUParkingSystem Address: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
Deployer Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

=== Environment Variables ===
NEXT_PUBLIC_PARKING_TOKEN_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_PARKING_SYSTEM_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

### Step 6: Configure Environment Variables

Copy the contract addresses from the deployment output and add them to your `.env.local` file:

```powershell
# .env.local (example values)
NEXT_PUBLIC_PARKING_TOKEN_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_PARKING_SYSTEM_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
NEXT_PUBLIC_NETWORK_NAME=localhost
NEXT_PUBLIC_CHAIN_ID=1337
```

### Step 7: Start the Frontend Application

```powershell
# Start the Next.js development server
pnpm run dev
```

The application will be available at `http://localhost:3000`.

### Step 8: Connect MetaMask

1. Open MetaMask in your browser
2. Click on the network dropdown and select "Add Network"
3. Add a new local network with these settings:
   - **Network Name**: Localhost 8545
   - **RPC URL**: http://127.0.0.1:8545
   - **Chain ID**: 1337
   - **Currency Symbol**: ETH
4. Import one of the test accounts from the Hardhat node output (use the private key)
5. Connect MetaMask to the application

## 🔧 Available Scripts

### Frontend Scripts
- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server
- `pnpm run lint` - Run ESLint

### Blockchain Scripts
- `pnpm run blockchain:compile` - Compile smart contracts
- `pnpm run blockchain:node` - Start local blockchain node
- `pnpm run blockchain:deploy` - Deploy contracts to localhost
- `pnpm run blockchain:deploy-local` - Deploy contracts to hardhat network
- `pnpm run blockchain:test` - Run smart contract tests
- `pnpm run blockchain:clean` - Clean build artifacts

## 🏗️ Project Structure

```
CIT-U-ParkChain/
├── app/                    # Next.js app directory
├── components/             # React components
├── contracts/              # Solidity smart contracts
├── hooks/                  # Custom React hooks
├── lib/                    # Utility libraries
├── scripts/                # Deployment scripts
├── public/                 # Static assets
└── styles/                 # Global styles
```

## 🔐 Smart Contracts

The project includes two main smart contracts:

1. **ParkingToken (PARK)** - ERC20 token for parking payments
2. **CITUParkingSystem** - Main parking management contract

### Key Features:
- User registration and vehicle management
- Parking zone creation and management
- Reservation system with automated payments
- Refund system for cancellations
- Transparent transaction history

## 🌐 Network Configuration

### Local Development
- **Network**: Localhost
- **Chain ID**: 1337
- **RPC URL**: http://127.0.0.1:8545

### Test Accounts
The local Hardhat network provides 20 test accounts with 10,000 ETH each. Use these for testing the application.

## 🐛 Troubleshooting

### Common Issues

1. **MetaMask Connection Issues**
   - Ensure MetaMask is connected to the correct network (localhost:8545)
   - Check that the contract addresses in `.env.local` match the deployed addresses

2. **Contract Deployment Fails**
   - Make sure the local blockchain node is running
   - Check that all dependencies are installed correctly

3. **Frontend Not Loading**
   - Verify that the environment variables are set correctly
   - Check the browser console for any errors

4. **Transaction Failures**
   - Ensure you have sufficient ETH for gas fees
   - Check that you're connected to the correct network

### Getting Help

If you encounter any issues:
1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure all services are running (blockchain node, frontend server)
4. Check that MetaMask is properly configured

## 📝 Development Notes

- The system uses a local blockchain for development
- All transactions are free on the local network
- Test accounts are provided with unlimited ETH
- Smart contracts are automatically deployed with initial data

## 🔄 Workflow

1. Start the blockchain node (`pnpm run blockchain:node`)
2. Deploy contracts (`pnpm run blockchain:deploy`)
3. Update environment variables with contract addresses
4. Start the frontend (`pnpm run dev`)
5. Connect MetaMask and start using the application

## 📄 License

This project is licensed under the MIT License.
