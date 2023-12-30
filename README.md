# Curate
## Video Overview - Turn Aduio on
https://github.com/f1rtuna/Curate/assets/59737277/0dfe8956-6bd0-4feb-9d79-73982aa1574f

See live deployment here: https://celebrated-concha-ab08b2.netlify.app/
NOTE some wallet trasnactions may be faulty on test ethereum network due to Netifly deployment side of things

link to contract: https://sepolia.etherscan.io/address/0x5Ce2bcC8d8F854447A5A66FD2421C31cfBD3Ea01

## Technology Stack & Tools

- Solidity (Writing Smart Contracts & Tests)c
- Javascript (React)
- [Hardhat](https://hardhat.org/) (Development Framework)
- [Ethers.js](https://docs.ethers.io/v5/) (Blockchain Interaction)
- [React.js](https://reactjs.org/) (Frontend Framework)

## Requirements For Initial Setup
- Install [NodeJS](https://nodejs.org/en/)

## Setting Up
### 1. Clone/Download the Repository

### 2. Install Dependencies:
`$ npm install`

### 3. Start Hardhat node
`$ npx hardhat node`

### 4. Run deployment script
In a separate terminal execute:
`$ npx hardhat run ./scripts/deploy.js --network localhost`

### 5. Start frontend
In a separate terminal execute:
`$ npm run start`
