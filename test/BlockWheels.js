const { expect } = require("chai");

describe("BlockWheels", function () {
  let BlockWheels;
  let blockWheels;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    BlockWheels = await ethers.getContractFactory("BlockWheels");
    [owner, addr1, addr2] = await ethers.getSigners();
    blockWheels = await BlockWheels.deploy();
    await blockWheels.waitForDeployment(); // Corrected line
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await blockWheels.lastnik()).to.equal(owner.address);
    });
  });

  describe("Dodaj vozilo", function () {
    it("Should add a new vehicle", async function () {
      await blockWheels.dodajVozilo("VIN123", "Znamka", "Model", 2022, "Barva", 150, "Menjalnik");
      const vozilo = await blockWheels.prikaziPodatke("VIN123");
      expect(vozilo.lastnik).to.equal(owner.address);
      expect(vozilo.znamka).to.equal("Znamka");
      expect(vozilo.model).to.equal("Model");
      expect(vozilo.letoProizvodnje).to.equal(2022);
      expect(vozilo.barva).to.equal("Barva");
      expect(vozilo.mocMotorja).to.equal(150);
      expect(vozilo.menjalnik).to.equal("Menjalnik");
    });
  });
});
