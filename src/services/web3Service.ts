
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export class Web3Service {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private contract: ethers.Contract | null = null;
  private contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS || '';
  
  // コントラクトABI（簡略版）
  private contractABI = [
    "function mintNFT(address to, string uri, string nftType, string rarity, uint256 power) returns (uint256)",
    "function getUserNFTs(address user) view returns (uint256[])",
    "function tokenURI(uint256 tokenId) view returns (string)",
    "function nftType(uint256 tokenId) view returns (string)",
    "function rarity(uint256 tokenId) view returns (string)",
    "function power(uint256 tokenId) view returns (uint256)",
    "function culturalCapital(address user) view returns (uint256)",
    "function earnCulturalCapital(address user, uint256 amount)",
    "event NFTMinted(address indexed to, uint256 indexed tokenId, string nftType, string rarity)"
  ];

  async connectWallet(): Promise<string | null> {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMaskがインストールされていません');
      }

      this.provider = new ethers.BrowserProvider(window.ethereum);
      await this.provider.send('eth_requestAccounts', []);
      this.signer = await this.provider.getSigner();
      
      if (this.contractAddress) {
        this.contract = new ethers.Contract(this.contractAddress, this.contractABI, this.signer);
      }

      const address = await this.signer.getAddress();
      return address;
    } catch (error) {
      console.error('Wallet接続エラー:', error);
      return null;
    }
  }

  async mintNFTFromWorship(
    userAddress: string,
    nftData: {
      name: string;
      type: string;
      rarity: string;
      power: number;
      emoji: string;
      color: string;
      description: string;
    }
  ): Promise<{ tokenId: number; transactionHash: string } | null> {
    try {
      if (!this.contract || !this.signer) {
        throw new Error('Web3が初期化されていません');
      }

      // メタデータをIPFSにアップロード（ここではダミーURI）
      const metadata = {
        name: nftData.name,
        description: nftData.description,
        image: `data:image/svg+xml;base64,${this.generateSVGBase64(nftData)}`,
        attributes: [
          { trait_type: "Type", value: nftData.type },
          { trait_type: "Rarity", value: nftData.rarity },
          { trait_type: "Power", value: nftData.power },
          { trait_type: "Color", value: nftData.color },
          { trait_type: "Emoji", value: nftData.emoji }
        ]
      };

      const tokenURI = `data:application/json;base64,${btoa(JSON.stringify(metadata))}`;

      const tx = await this.contract.mintNFT(
        userAddress,
        tokenURI,
        nftData.type,
        nftData.rarity,
        nftData.power
      );

      const receipt = await tx.wait();
      
      // ミントイベントからトークンIDを取得
      const mintEvent = receipt.logs.find((log: any) => 
        log.fragment && log.fragment.name === 'NFTMinted'
      );
      
      const tokenId = mintEvent ? mintEvent.args[1] : 0;

      return {
        tokenId: Number(tokenId),
        transactionHash: receipt.hash
      };
    } catch (error) {
      console.error('NFTミントエラー:', error);
      return null;
    }
  }

  async getUserNFTs(userAddress: string): Promise<any[]> {
    try {
      if (!this.contract) {
        throw new Error('コントラクトが初期化されていません');
      }

      const tokenIds = await this.contract.getUserNFTs(userAddress);
      const nfts = [];

      for (const tokenId of tokenIds) {
        const [tokenURI, nftType, rarity, power] = await Promise.all([
          this.contract.tokenURI(tokenId),
          this.contract.nftType(tokenId),
          this.contract.rarity(tokenId),
          this.contract.power(tokenId)
        ]);

        // メタデータをデコード
        let metadata = {};
        try {
          if (tokenURI.startsWith('data:application/json;base64,')) {
            const json = atob(tokenURI.replace('data:application/json;base64,', ''));
            metadata = JSON.parse(json);
          }
        } catch (e) {
          console.error('メタデータ解析エラー:', e);
        }

        nfts.push({
          tokenId: Number(tokenId),
          type: nftType,
          rarity,
          power: Number(power),
          metadata,
          isOwned: true
        });
      }

      return nfts;
    } catch (error) {
      console.error('NFT取得エラー:', error);
      return [];
    }
  }

  async getCulturalCapital(userAddress: string): Promise<number> {
    try {
      if (!this.contract) return 0;
      const capital = await this.contract.culturalCapital(userAddress);
      return Number(capital);
    } catch (error) {
      console.error('文化資本取得エラー:', error);
      return 0;
    }
  }

  private generateSVGBase64(nftData: any): string {
    const svg = `
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="${nftData.color}"/>
        <text x="100" y="120" text-anchor="middle" font-size="60" fill="white">
          ${nftData.emoji}
        </text>
        <text x="100" y="180" text-anchor="middle" font-size="16" fill="white" font-family="Arial">
          ${nftData.name}
        </text>
      </svg>
    `;
    return btoa(svg);
  }

  isConnected(): boolean {
    return this.signer !== null;
  }

  async switchToPolygon() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x89' }], // Polygon Mainnet
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x89',
            chainName: 'Polygon Mainnet',
            nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
            rpcUrls: ['https://polygon-rpc.com/'],
            blockExplorerUrls: ['https://polygonscan.com/']
          }]
        });
      }
    }
  }
}

export const web3Service = new Web3Service();
