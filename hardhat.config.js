require("@nomiclabs/hardhat-waffle");
require("hardhat-typechain");
require("@nomiclabs/hardhat-web3");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
    const accounts = await ethers.getSigners();
    for (const account of accounts) {
        console.log(account.address);
    }
});

task("balance", "Prints an account's balance")
    .addParam("account", "The account's address")
    .setAction(async taskArgs => {
        const account = web3.utils.toChecksumAddress(taskArgs.account);
        const balance = await web3.eth.getBalance(account);

        console.log(web3.utils.fromWei(balance, "ether"), "ETH");
    });

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    defaultNetwork: "hardhat",
    paths: {
        artifacts: './src/artifacts',
    },
    networks: {
        hardhat: {
            chainId: 1337,
        },
        // ropsten: {
        //   url: "https://ropsten.infura.io/v3/projectid",
        //   accounts: [process.env.a2key]
        // },
        kovan: {
            url: "https://kovan.infura.io/v3/96014e9509214a81b3eec1303dd5e862",
            accounts: ["420c97cf4ad847fd49c8b79b4ab376d1d70d3de9729cd58b23e357a0d62b8b85"]
        }
        // rinkeby: {
        //   url: "https://rinkeby.infura.io/v3/projectid",
        //   accounts: [process.env.a2key]
        // }
    },
    solidity: "0.8.3",
};

