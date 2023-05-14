const hre = require("hardhat")

async function main() {
    // ethers is available in the global scope
    const [deployer] = await ethers.getSigners();
    console.log(
      "Deploying the contracts with the account:",
      await deployer.getAddress()
    );

    console.log("Account balance:", (await deployer.getBalance()).toString());

    const Curate = await ethers.getContractFactory("Curate");
    const curate = await Curate.deploy();
    await curate.deployed();

    console.log("Contract address:", curate.address);

    const Categories = ["Confessions", "Thriller", "Horror", "Adventure", "Comedic"];
    for (let i = 0; i < Categories.length; i++){
      const createCategory = await curate.connect(deployer).createCategory(Categories[i]);
    }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});