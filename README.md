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
##Compile contract 
