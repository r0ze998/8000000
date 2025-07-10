// Debug utilities
export const debugLog = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[神社アプリ] ${message}`, data || '');
  }
};

// Format utilities
export * from './formatUtils';

// Game utilities
export * from './gameUtils';

// NFT utilities
export * from './nftUtils';

// StarkNet utilities
export * from './starknet';