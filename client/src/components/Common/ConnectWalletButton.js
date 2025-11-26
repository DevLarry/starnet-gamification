import React, { useEffect } from 'react';
import {
  TonConnectButton,
  useTonWallet,
  useTonConnectUI,
} from '@tonconnect/ui-react';
import { walletService } from '../../services/auth';

const ConnectWalletButton = () => {
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();

  useEffect(async () => {
    if (wallet?.account?.address) {
      const response = await walletService.connectWallet(wallet.account.address);
      console.log('Wallet connected on backend:', response);
    }
  }, [wallet]);

  const handleConnect = () => {
    if (!wallet) {
      tonConnectUI.openModal();
    } else {
      // Wallet is already connected
      console.log('Wallet is connected:', wallet);
    }
  };

  const handleDisconnect = () => {
    tonConnectUI.disconnect();
  };

  // Display connected wallet info
  const displayAddress = wallet?.account?.address
    ? `${wallet.account.address.slice(0, 6)}...${wallet.account.address.slice(-6)}`
    : '';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      {/* Using the pre-built button */}
      <TonConnectButton />

      {/* Or custom button implementation */}
      {/* <button
        onClick={handleConnect}
        style={{
          padding: '12px 24px',
          backgroundColor: wallet ? '#10b981' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '16px',
          minWidth: '200px',
        }}
      >
        {wallet ? `Connected: ${displayAddress}` : 'CONNECT WALLET'}
      </button> */}

      {wallet && (
        <button
          onClick={handleDisconnect}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Disconnect
        </button>
      )}
    </div>
  );
};

export default ConnectWalletButton;
