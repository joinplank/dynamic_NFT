# dynamic_NFT
Demo application to test dynamic NFT development

# System description
The government wants to keep track of cars using the blockchain. 

Each time a brand new car is sold, an NFT representing that car is minted.

The Automotive Registration Agency (ARA) will be the manager of the smart contract. 

The NFT will contain unalterable information about car characteristics: 

- Brand and model
- Chassis Serial Number
- Motor Serial Number
- Construction date
- Registration plate number
- Car picture

And it will also track information about: 

- Preventive brand official maintenance
- Incidents (crashes)
- Fines

The owner can transfer the car to another account. Only the owner, or the ARA (in case of owner demise or lost private keys) will be allowed to transfer a car. 

Only the authorized automotive dealer will be able to update maintenance information

Only the authorized insurance agency will be able to update incidents information

Only the authorized fine agency will be able to update fines information

The ARA will be able to change the authorized agencies

Any user can read car information using provided front ends. 

(TBC) The transfer of the car will only be effective once the new owner pays the accorded price. The contract will charge a 1% fee for the service.
