// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log(
        "Deploying contracts with the account:",
        deployer.address
    );

    const Greeter = await hre.ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, World!");

    const Token = await hre.ethers.getContractFactory("Token");
    const token = await Token.deploy();
    const APToken = await hre.ethers.getContractFactory("APToken");
    const aptoken = await APToken.deploy("Alphy Prime Token", "APT");

    const ETHPrice = await hre.ethers.getContractFactory("PriceConsumerV3");
    const ethprice = await ETHPrice.deploy();

    const StoreHash = await hre.ethers.getContractFactory("StoreHash")
    const storehash = await StoreHash.deploy();


    await greeter.deployed();
    await aptoken.deployed();
    await ethprice.deployed();
    await storehash.deployed();


    console.log("Greeter deployed to:", greeter.address);
    console.log("Token deployed to:", aptoken.address);
    console.log("ETHPrice deployed to:", ethprice.address);
    console.log("StoreHash deployed to:", storehash.address);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
