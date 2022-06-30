# dynamic_NFT
Demo application to test dynamic NFT development

# System description
The government wants to keep track of cars using the blockchain. 

Each time a brand new car is sold, an NFT representing that car is minted.

The Automotive Registration Agency (ARA) will be the manager of the smart contract. 

The NFT will contain information about car characteristics: 

- Brand and model
- Chassis Serial Number
- Motor Serial Number
- Construction date
- Registration plate number
- Car picture

And it will also track information about brand official maintenance.

The owner can transfer the car to another account. Only the owner, or the ARA (in case of owner demise or lost private keys) will be allowed to transfer a car. 

Only the authorized automotive dealer will be able to update maintenance information

The ARA will be able to change the authorized dealers for each car

Any user can read car information using provided front ends

The transfer of the car will only be effective once the new owner pays the accorded price. The contract will charge a n% fee for the service, beeing n a number that could be modified by the owner of the contract. 

# Download and run
npm 8.7.0 or later in needed

node 16.14.2 or later is needed

```
git clone https://github.com/joinplank/dynamic_NFT.git
cd dynamic_NFT
npm install
cd off-chain
npm install
npm start
```

Inside dynamic_NFT folder should exist a .env file with the folloging format and information:
```
MNEMONIC="your mnemonic here"
INFURA_ACCESS_TOKEN="your infura access token for rinkeby test network"
```
Be aware that doing this you will interact with a deployed contratact on rinkeby and, as you are not the owner of the contract, your interaction with it will be limitated. (Basically you can only use the "Viewer" functionality.


# Compile and deploy your own contract
npm 8.7.0 or later in needed, 
node 16.14.2 or later is needed

```
git clone https://github.com/joinplank/dynamic_NFT.git
cd dynamic_NFT
npm install
cd off-chain
npm install
```

Inside dynamic_NFT folder should exist a .env file with the folloging format and information:
```
MNEMONIC="your mnemonic here"
INFURA_ACCESS_TOKEN="your infura access token for rinkeby test network"
```
## Compile contract 
```
truffle compile
```

## Run unit tests
```
ganache-cli &
truffle test
```

## Deploy on Rinkeby
Before deploying be sure:
- To set your mnemonic in .env
- To create a project in infura and set the API KEY ok on .env
- To have some test eth in the account you are deploying with. (0.1 eth its ok)
```
truffle migrate --network rinkeby
```
Then you should take note of the contract address that was just deployed. For example, this is a part of the output where you can find the contract address (0x6FA29bDA75A56d86784ea9515E01542b5083dcF7)

```
1_initial_migration.js
======================

   Replacing 'carRegistrationContract'
   -----------------------------------
   > transaction hash:    0xe14a6eb93bda9453f1ae63aa2c5396bf4386842e6e9ecc25750ae0dea2993dac
   > Blocks: 1            Seconds: 5
   > contract address:    0x6FA29bDA75A56d86784ea9515E01542b5083dcF7
   > block number:        10938716
   > block timestamp:     1656537005
   > account:             0xfCad84b2493E2e6bD0c2F141dA8D6d76aA85D0fC
   > balance:             0.244862246644107041
   > gas used:            4279930 (0x414e7a)
   > gas price:           10 gwei
   > value sent:          0 ETH
   > total cost:          0.0427993 ETH

   > Saving artifacts
   -------------------------------------
   > Total cost:           0.0427993 ETH
```

## Prepare the front end
Now we should tell the front end the address of the contract you just deployed and (in case you change something on the contract (solidity) the new ABI agenerated when you compiled the contract. 
For that you have to open the file: off-chain/src/carRegistrationContract.js, replace the address with the new address and, if necesary, replace the abi (const abi) with the new generated abi, wich is in the file: dynamic_NFT/build/contracts/carRegistrationContract.json.

## Run the front end
```
cd off-chain
npm start
```



