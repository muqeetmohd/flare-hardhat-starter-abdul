import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

export const useWeb3 = () => {
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window.ethereum !== 'undefined';
  };

  // Get provider
  const getProvider = useCallback(() => {
    if (isMetaMaskInstalled()) {
      return new ethers.BrowserProvider(window.ethereum);
    }
    return null;
  }, []);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    console.log('useWeb3: connectWallet called');
    console.log('useWeb3: MetaMask installed:', isMetaMaskInstalled());
    
    if (!isMetaMaskInstalled()) {
      console.log('useWeb3: MetaMask not installed');
      setError('MetaMask is not installed. Please install MetaMask to continue.');
      return null;
    }

    console.log('useWeb3: Setting loading to true');
    setIsLoading(true);
    setError(null);

    try {
      console.log('useWeb3: Getting provider...');
      const provider = getProvider();
      console.log('useWeb3: Provider:', provider);
      
      if (!provider) {
        throw new Error('Failed to get provider');
      }

      // Request account access
      console.log('useWeb3: Requesting accounts...');
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      console.log('useWeb3: Accounts received:', accounts);

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const account = accounts[0];
      console.log('useWeb3: Using account:', account);
      
      console.log('useWeb3: Getting signer...');
      const signer = await provider.getSigner();
      console.log('useWeb3: Signer:', signer);
      
      console.log('useWeb3: Getting network...');
      const network = await provider.getNetwork();
      console.log('useWeb3: Network:', network);

      setAccount(account);
      setProvider(provider);
      setSigner(signer);
      setChainId(network.chainId.toString());
      setIsConnected(true);

      console.log('useWeb3: Wallet connected successfully');
      return account;
    } catch (err) {
      console.error('useWeb3: Wallet connection error:', err);
      setError(err.message || 'Failed to connect wallet');
      return null;
    } finally {
      console.log('useWeb3: Setting loading to false');
      setIsLoading(false);
    }
  }, [getProvider]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setChainId(null);
    setIsConnected(false);
    setError(null);
  }, []);

  // Sign message
  const signMessage = useCallback(async (message) => {
    console.log('useWeb3: signMessage called with message:', message);
    console.log('useWeb3: signer available:', !!signer);
    
    if (!signer) {
      console.log('useWeb3: No signer available');
      throw new Error('Wallet not connected');
    }

    try {
      console.log('useWeb3: Calling signer.signMessage...');
      const signature = await signer.signMessage(message);
      console.log('useWeb3: Signature received:', signature);
      return signature;
    } catch (err) {
      console.error('useWeb3: Message signing error:', err);
      throw new Error('Failed to sign message: ' + err.message);
    }
  }, [signer]);

  // Send transaction
  const sendTransaction = useCallback(async (transaction) => {
    if (!signer) {
      throw new Error('Wallet not connected');
    }

    try {
      const tx = await signer.sendTransaction(transaction);
      const receipt = await tx.wait();
      return { tx, receipt };
    } catch (err) {
      console.error('Transaction error:', err);
      throw new Error('Transaction failed');
    }
  }, [signer]);

  // Get balance
  const getBalance = useCallback(async (address = account) => {
    if (!provider || !address) {
      return null;
    }

    try {
      const balance = await provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (err) {
      console.error('Balance fetch error:', err);
      return null;
    }
  }, [provider, account]);

  // Switch network
  const switchNetwork = useCallback(async (chainId) => {
    if (!isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (err) {
      // If the network doesn't exist, add it
      if (err.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${chainId.toString(16)}`,
              chainName: 'Flare Coston2 Testnet',
              rpcUrls: ['https://coston2-api.flare.network/ext/C/rpc'],
              nativeCurrency: {
                name: 'Flare',
                symbol: 'FLR',
                decimals: 18,
              },
              blockExplorerUrls: ['https://coston2-explorer.flare.network'],
            }],
          });
        } catch (addError) {
          console.error('Failed to add network:', addError);
          throw new Error('Failed to add network');
        }
      } else {
        console.error('Failed to switch network:', err);
        throw new Error('Failed to switch network');
      }
    }
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
      }
    };

    const handleChainChanged = (chainId) => {
      setChainId(chainId);
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [account, disconnectWallet]);

  // Auto-connect on page load
  useEffect(() => {
    const autoConnect = async () => {
      if (isMetaMaskInstalled()) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts',
          });
          
          if (accounts.length > 0) {
            const provider = getProvider();
            const signer = await provider.getSigner();
            const network = await provider.getNetwork();
            
            setAccount(accounts[0]);
            setProvider(provider);
            setSigner(signer);
            setChainId(network.chainId.toString());
            setIsConnected(true);
          }
        } catch (err) {
          console.error('Auto-connect error:', err);
        }
      }
    };

    autoConnect();
  }, [getProvider]);

  return {
    account,
    isConnected,
    provider,
    signer,
    chainId,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    signMessage,
    sendTransaction,
    getBalance,
    switchNetwork,
    isMetaMaskInstalled: isMetaMaskInstalled()
  };
};
