const hre = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {

//setup accounts & variables
[deployer] = await ethers.getSigners()
const NAME = "Dappcord"
const SYMBOL = "DC"

//Deploy Contract
const Dappcord = await ethers.getContractFactory("Dappcord")
const dappcord = await Dappcord.deploy(NAME, SYMBOL)
await dappcord.deployed()

console.log(`Deployed Dappcord contract at : ${dappcord.address}\n`)

//create 3 channels
const CHANNEL_NAMES = ["general", "intro", "self-introduction"]
const COSTS = [tokens(1), tokens(0), tokens(0.25)]

for (let i = 0 ; i <3; i++){
  const transaction = await dappcord.connect(deployer).createChannel(CHANNEL_NAMES[i], COSTS[i])
  await transaction.wait()

  console.log(`Created text channel #${CHANNEL_NAMES[i]}`)
}
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});