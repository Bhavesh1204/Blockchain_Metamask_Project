const hre = require("hardhat");

async function main() {
    const CertificateRegistry = await hre.ethers.getContractFactory("CertificateRegistry");
    const contract = await CertificateRegistry.deploy();

    await contract.deployed();
    console.log("CertificateRegistry deployed at:", contract.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
