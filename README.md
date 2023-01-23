### Summary 
This learning practice deploys 4 ethereum-based applications/smart contracts
- write to the chain: set the [greetings](contracts/Greeter.sol)
- An [ERC20 token](ERC20)
- Fetch [Ethereum Price](contracts/ETHPrice.sol)
- Upload files to [IPFS](contracts/StoreHash.sol) 


Credits:
I learned from the repo [full-stack-ethereum](https://github.com/dabit3/full-stack-ethereum)
and the cool tutorial [The Complete Guide to Full Stack Ethereum Development](https://dev.to/dabit3/the-complete-guide-to-full-stack-ethereum-development-3j13)

### Config

configure the deployed contract address  and when deploying the project to the chain  
- [hardhat.config.js](hardhat.config.js)  -- the testnet account to deploy with
- [App.js](src/App.js) -- update the smart contract addresses in 



```sh
npm install
npm start
```



### Getting started

Here's how to deploy this project

1.Install the dependencies

```sh
npm install

# or

yarn
```

2.Start the local test node

```sh
npx hardhat node
```

3. Deploy the contract

```sh
npx hardhat run scripts/deploy.js --network localhost
```

4. Update __src/App.js__ with the values of your contract addresses (`greeterAddress` and `tokenAddress`)

5. Run the app

```sh
npm start
```

Credit: 
#####
This codebase goes along with the tutorial [The Complete Guide to Full Stack Ethereum Development](https://dev.to/dabit3/the-complete-guide-to-full-stack-ethereum-development-3j13)

