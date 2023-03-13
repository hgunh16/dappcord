const { expect } = require("chai")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("Dappcord", function () {
  let dappcord ;

  const NAME = "Dappcord"
  const SYMBOL = "DC"

  beforeEach(async () =>{
    //Deploy Contract
    const Dappcord = await ethers.getContractFactory("Dappcord")
    dappcord = await Dappcord.deploy(NAME, SYMBOL)
  })

    describe("development", function(){
      it("Sets the name", async()=> {
        //Fetch Name
        let result = await dappcord.name()
        //check name
        expect(result).to.equal(NAME)

      })

      it("Sets the symbol" , async()=> {
        //fetch symbol
        let result = await dappcord.symbol()
        //ceehck symbol
        expect(result).to.equal(SYMBOL)
      })
    })
})
