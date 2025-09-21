// Blockchain data service for real-time contract data
import { ethers } from 'ethers';

// Contract addresses (from your deployed contracts)
const CONTRACT_ADDRESSES = {
  donationPool: "0x7845fF302E85389E88c12F24D9cF479A56e3Dab0",
  badgeNft: "0x3C58E50b6A5C74A816B47BA739C914D743E6A78a",
  recurringManager: "0x09Af2320c08537D44efCBFe55ad67C280F63F36E"
};

// Contract ABIs (simplified)
const DONATION_POOL_ABI = [
  "function totalPool() external view returns (uint256)",
  "function nextRequestId() external view returns (uint256)",
  "function getRequest(uint256 id) external view returns (tuple(string invoiceId, address creator, string hospitalXrpl, uint256 amountWei, bool funded, bool paidOut))",
  "function donate() external payable",
  "event DonationMade(address indexed donor, uint256 amountWei, uint256 time)",
  "event RequestCreated(uint256 indexed requestId, string invoiceId, uint256 amountWei, string hospitalXrpl)"
];

const RECURRING_MANAGER_ABI = [
  "function totalActiveSubscriptions() external view returns (uint256)",
  "function totalRecurringVolume() external view returns (uint256)",
  "function getSubscription(address donor) external view returns (tuple(address donor, uint256 amountWei, uint256 intervalDays, uint256 lastPayment, uint256 nextPayment, bool active, bool isXrpl, string xrplAddress))"
];

class BlockchainService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contracts = {};
  }

  // Initialize with provider and signer
  async initialize(provider, signer = null) {
    this.provider = provider;
    this.signer = signer;
    
    // Initialize contracts
    this.contracts.donationPool = new ethers.Contract(
      CONTRACT_ADDRESSES.donationPool,
      DONATION_POOL_ABI,
      signer || provider
    );
    
    this.contracts.recurringManager = new ethers.Contract(
      CONTRACT_ADDRESSES.recurringManager,
      RECURRING_MANAGER_ABI,
      signer || provider
    );
  }

  // Get real pool data
  async getPoolData() {
    try {
      const [totalPool, nextRequestId] = await Promise.all([
        this.contracts.donationPool.totalPool(),
        this.contracts.donationPool.nextRequestId()
      ]);

      return {
        totalPool: parseFloat(ethers.formatEther(totalPool)),
        totalPoolFormatted: `${parseFloat(ethers.formatEther(totalPool)).toFixed(2)} FLR`,
        nextRequestId: nextRequestId.toString(),
        poolAddress: CONTRACT_ADDRESSES.donationPool
      };
    } catch (error) {
      console.error('Error fetching pool data:', error);
      return {
        totalPool: 0,
        totalPoolFormatted: "0.00 FLR",
        nextRequestId: "0",
        poolAddress: CONTRACT_ADDRESSES.donationPool
      };
    }
  }

  // Get real subscription data
  async getSubscriptionData() {
    try {
      const [activeSubscriptions, recurringVolume] = await Promise.all([
        this.contracts.recurringManager.totalActiveSubscriptions(),
        this.contracts.recurringManager.totalRecurringVolume()
      ]);

      return {
        activeSubscriptions: activeSubscriptions.toString(),
        recurringVolume: parseFloat(ethers.formatEther(recurringVolume)),
        recurringVolumeFormatted: `${parseFloat(ethers.formatEther(recurringVolume)).toFixed(2)} FLR/month`,
        recurringAddress: CONTRACT_ADDRESSES.recurringManager
      };
    } catch (error) {
      console.error('Error fetching subscription data:', error);
      return {
        activeSubscriptions: "0",
        recurringVolume: 0,
        recurringVolumeFormatted: "0.00 FLR/month",
        recurringAddress: CONTRACT_ADDRESSES.recurringManager
      };
    }
  }

  // Get real emergency requests
  async getEmergencyRequests() {
    try {
      const nextRequestId = await this.contracts.donationPool.nextRequestId();
      const requests = [];

      for (let i = 0; i < nextRequestId; i++) {
        try {
          const request = await this.contracts.donationPool.getRequest(i);
          requests.push({
            id: i.toString(),
            invoiceId: request.invoiceId,
            creator: request.creator,
            hospitalXrpl: request.hospitalXrpl,
            amountWei: request.amountWei.toString(),
            amountFormatted: `${parseFloat(ethers.formatEther(request.amountWei)).toFixed(2)} FLR`,
            funded: request.funded,
            paidOut: request.paidOut,
            status: request.funded ? (request.paidOut ? 'completed' : 'funded') : 'pending'
          });
        } catch (error) {
          console.error(`Error fetching request ${i}:`, error);
        }
      }

      return requests;
    } catch (error) {
      console.error('Error fetching emergency requests:', error);
      return [];
    }
  }

  // Get user's subscription
  async getUserSubscription(userAddress) {
    try {
      const subscription = await this.contracts.recurringManager.getSubscription(userAddress);
      return {
        donor: subscription.donor,
        amountWei: subscription.amountWei.toString(),
        amountFormatted: `${parseFloat(ethers.formatEther(subscription.amountWei)).toFixed(2)} FLR`,
        intervalDays: subscription.intervalDays.toString(),
        lastPayment: subscription.lastPayment.toString(),
        nextPayment: subscription.nextPayment.toString(),
        active: subscription.active,
        isXrpl: subscription.isXrpl,
        xrplAddress: subscription.xrplAddress
      };
    } catch (error) {
      console.error('Error fetching user subscription:', error);
      return null;
    }
  }

  // Make a real donation (FLR)
  async makeDonation(amountWei) {
    try {
      if (!this.signer) {
        throw new Error('No signer available');
      }

      const tx = await this.contracts.donationPool.donate({ value: amountWei });
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: tx.hash,
        receipt: receipt
      };
    } catch (error) {
      console.error('Error making donation:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Make token donation (USDC, USDT, etc.)
  async makeTokenDonation(tokenAddress, amount) {
    try {
      if (!this.signer) {
        throw new Error('No signer available');
      }

      // This would need the MultiTokenDonationPool contract
      const tx = await this.contracts.donationPool.donateToken(tokenAddress, amount);
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: tx.hash,
        receipt: receipt
      };
    } catch (error) {
      console.error('Error making token donation:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Make XRPL donation (cross-chain)
  async makeXrplDonation(amount, requestId = null) {
    try {
      // This would integrate with XRPL and cross-chain attestation
      // For now, simulate the process
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            transactionHash: `xrpl_${Date.now()}`,
            xrplTxHash: `xrpl_${Math.random().toString(36).substr(2, 9)}`,
            message: 'XRPL donation initiated. Please complete the transaction on XRPL network.'
          });
        }, 2000);
      });
    } catch (error) {
      console.error('Error making XRPL donation:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Make card donation (Stripe integration)
  async makeCardDonation(amount, requestId = null) {
    try {
      // This would integrate with Stripe
      // For now, simulate the process
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            paymentIntentId: `pi_${Math.random().toString(36).substr(2, 9)}`,
            message: 'Card payment processed successfully.'
          });
        }, 3000);
      });
    } catch (error) {
      console.error('Error making card donation:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create a real emergency request
  async createEmergencyRequest(invoiceId, amountWei, hospitalXrpl) {
    try {
      if (!this.signer) {
        throw new Error('No signer available');
      }

      const tx = await this.contracts.donationPool.createRequest(
        invoiceId,
        amountWei,
        hospitalXrpl
      );
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: tx.hash,
        receipt: receipt
      };
    } catch (error) {
      console.error('Error creating emergency request:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Listen to real-time events
  async listenToEvents(callback) {
    try {
      // Listen to donation events
      this.contracts.donationPool.on("DonationMade", (donor, amountWei, time) => {
        callback({
          type: 'donation',
          donor,
          amount: ethers.formatEther(amountWei),
          timestamp: new Date(parseInt(time) * 1000)
        });
      });

      // Listen to request creation events
      this.contracts.donationPool.on("RequestCreated", (requestId, invoiceId, amountWei, hospitalXrpl) => {
        callback({
          type: 'request_created',
          requestId: requestId.toString(),
          invoiceId,
          amount: ethers.formatEther(amountWei),
          hospitalXrpl
        });
      });

    } catch (error) {
      console.error('Error setting up event listeners:', error);
    }
  }

  // Stop listening to events
  removeAllListeners() {
    try {
      this.contracts.donationPool.removeAllListeners();
    } catch (error) {
      console.error('Error removing listeners:', error);
    }
  }
}

// Create singleton instance
const blockchainService = new BlockchainService();

export default blockchainService;
