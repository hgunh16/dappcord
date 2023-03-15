const { expect } = require("chai")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("Dappcord", function () {
  let deployer, user
  let dappcord ;

  const NAME = "Dappcord"
  const SYMBOL = "DC"

  beforeEach(async () =>{
    //setup account
    [deployer, user] = await ethers.getSigners()

    //Deploy Contract
    const Dappcord = await ethers.getContractFactory("Dappcord")
    dappcord = await Dappcord.deploy(NAME, SYMBOL)

    //Create a channel
    const transaction = await dappcord.connect(deployer).createChannel("general", tokens(1))
    await transaction.wait()
  })

  describe("Development", function(){
      it("Sets the name", async()=> {
        //Fetch Name
        let result = await dappcord.name()
        //check name
        expect(result).to.equal(NAME)

      })

      it("Sets the symbol" , async()=> {
        //fetch symbol
        let result = await dappcord.symbol()
        //check symbol
        expect(result).to.equal(SYMBOL)
      })

      it("Sets the owner" , async()=> {
        let result = await dappcord.owner()
        expect(result).to.equal(deployer.address)
      })
    })

    describe("Createing Channels", ()=>{
      it('Returns total channels', async ()=>{
        const result = await dappcord.totalChannels()
        expect(result).to.be.equal(1)
      })

      it('Returns channel atrributes', async ()=>{
        const channel = await dappcord.getChannel(1)
        expect(channel.id).to.be.equal(1)
        expect(channel.name).to.be.equal("general")
        expect(channel.cost).to.be.equal(tokens(1))
      })
    })


  describe("Joining Channels", ()=>{
      const ID = 1
      const AMOUNT = ethers.utils.parseUnits("1", 'ether')

      beforeEach(async()=>{
        const transaction = await dappcord.connect(user).mint(ID, {value : AMOUNT})
        await transaction.wait()
      })

      it('Joins the user', async()=>{
        const result = await dappcord.hasJoined(ID, user.address)
        expect(result).to.be.equal(true)
      })

      it('Increase total user', async()=>{
        const result = await dappcord.totalSupply()
        expect(result).to.be.equal(ID)
      })

      it('updates the contract balance', async()=>{
        const result = await ethers.provider.getBalance(dappcord.address)
        expect(result).to.be.equal(AMOUNT)
      })
    })

  describe("Withdrawing", ()=>{
      const ID =1
      const AMOUNT = ethers.utils.parseUnits("10", "ether")
      let balanceBefore

      beforeEach(async()=>{
        balanceBefore = await ethers.provider.getBalance(deployer.address)
        
        let transaction = await dappcord.connect(user).mint(ID, { value : AMOUNT })
        await transaction.wait()

        transaction = await dappcord.connect(deployer).withdraw()
        await transaction.wait()
      })

      it('Updates the owner balance', async()=>{
        const balanceAfter = await ethers.provider.getBalance(deployer.address)
        expect(balanceAfter).to.be.greaterThan(balanceBefore)
      })

      it('Updates the contract balance', async() =>{
        const result = await ethers.provider.getBalance(dappcord.address)
        expect(result).to.equal(0)
      })
    })

  
})
