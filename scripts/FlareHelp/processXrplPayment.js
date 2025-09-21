// scripts/processXrplPayment.js
// This script processes XRPL payments and mints badges

const { web3 } = require("hardhat");
const { prepareAttestationRequestBase, retrieveDataAndProofBaseWithRetry, submitAttestationRequest } = require("../utils/fdc");

const { VERIFIER_URL_TESTNET, VERIFIER_API_KEY_TESTNET, COSTON2_DA_LAYER_URL } = process.env;

// Configuration
const attestationTypeBase = "EVMTransaction";
const sourceIdBase = "testETH"; // Change to XRPL source when available
const verifierUrlBase = VERIFIER_URL_TESTNET;

async function processXrplDonation(transactionHash, xrplAmount, poolAddress) {
    console.log("Processing XRPL donation...");
    console.log("Transaction Hash:", transactionHash);
    console.log("XRPL Amount (drops):", xrplAmount);
    
    try {
        // Prepare attestation request for XRPL transaction
        const requestData = await prepareAttestationRequest(transactionHash);
        console.log("Attestation request prepared:", requestData.abiEncodedRequest);
        
        // Submit request and get round ID
        const roundId = await submitAttestationRequest(requestData.abiEncodedRequest);
        console.log("Request submitted, round ID:", roundId);
        
        // Wait and retrieve proof
        const proof = await retrieveDataAndProof(requestData.abiEncodedRequest, roundId);
        console.log("Proof retrieved");
        
        // Get the CrossChainDonationPool contract
        const CrossChainDonationPool = await ethers.getContractFactory("CrossChainDonationPool");
        const pool = CrossChainDonationPool.attach(poolAddress);
        
        // Decode the proof for the contract call
        const IEVMTransactionVerification = await artifacts.require("IEVMTransactionVerification");
        const responseType = IEVMTransactionVerification._json.abi[0].inputs[0].components[1];
        const decodedResponse = web3.eth.abi.decodeParameter(responseType, proof.response_hex);
        
        // Process the XRPL payment
        const tx = await pool.processXrplPayment(
            {
                merkleProof: proof.proof,
                data: decodedResponse,
            },
            transactionHash,
            xrplAmount
        );
        
        console.log("XRPL payment processed successfully!");
        console.log("Transaction hash:", tx.hash);
        
        // Wait for confirmation
        await tx.wait();
        console.log("Transaction confirmed!");
        
        return tx;
        
    } catch (error) {
        console.error("Error processing XRPL payment:", error);
        throw error;
    }
}

async function prepareAttestationRequest(transactionHash) {
    const requiredConfirmations = "1";
    const provideInput = true;
    const listEvents = true;
    const logIndices = [];

    const requestBody = {
        transactionHash: transactionHash,
        requiredConfirmations: requiredConfirmations,
        provideInput: provideInput,
        listEvents: listEvents,
        logIndices: logIndices,
    };

    const url = `${verifierUrlBase}verifier/${urlTypeBase}/EVMTransaction/prepareRequest`;
    const apiKey = VERIFIER_API_KEY_TESTNET;

    return await prepareAttestationRequestBase(url, apiKey, attestationTypeBase, sourceIdBase, requestBody);
}

async function retrieveDataAndProof(abiEncodedRequest, roundId) {
    const url = `${COSTON2_DA_LAYER_URL}api/v1/fdc/proof-by-request-round-raw`;
    return await retrieveDataAndProofBaseWithRetry(url, abiEncodedRequest, roundId);
}

// Example usage
async function main() {
    // Replace these with actual values
    const XRPL_TRANSACTION_HASH = "0x..."; // XRPL transaction hash
    const XRPL_AMOUNT = 5000000; // 5 XRP in drops
    const POOL_ADDRESS = "0x..."; // CrossChainDonationPool address
    
    console.log("=== XRPL Payment Processor ===");
    console.log("Pool Address:", POOL_ADDRESS);
    
    await processXrplDonation(XRPL_TRANSACTION_HASH, XRPL_AMOUNT, POOL_ADDRESS);
}

// Export for use in other scripts
module.exports = {
    processXrplDonation,
    prepareAttestationRequest,
    retrieveDataAndProof
};

if (require.main === module) {
    main().catch(console.error);
}
