import { Contract, Provider, Account, cairo } from 'starknet';
import { 
  SHRINE_CONTRACT_ADDRESS, 
  SHRINE_CONTRACT_ABI,
  NFT_CONTRACT_ADDRESS,
  NFT_CONTRACT_ABI,
  CULTURAL_TOKEN_ADDRESS,
  CULTURAL_TOKEN_ABI
} from '../contracts/shrineContract';
import { SIMPLE_SHRINE_ABI, SIMPLE_SHRINE_CONTRACT_ADDRESS } from '../contracts/simpleShrineABI';

class BlockchainService {
  constructor() {
    this.provider = null;
    this.account = null;
    this.shrineContract = null;
    this.nftContract = null;
    this.culturalTokenContract = null;
    this.isInitialized = false;
  }

  // 初期化
  async initialize(account) {
    try {
      this.provider = new Provider({ sequencer: { network: 'goerli-alpha' } });
      this.account = account;

      // コントラクトインスタンスを作成（SimpleShrineを使用）
      this.shrineContract = new Contract(SIMPLE_SHRINE_ABI, SIMPLE_SHRINE_CONTRACT_ADDRESS, this.provider);
      // NFTとトークンコントラクトは後で実装
      // this.nftContract = new Contract(NFT_CONTRACT_ABI, NFT_CONTRACT_ADDRESS, this.provider);
      // this.culturalTokenContract = new Contract(CULTURAL_TOKEN_ABI, CULTURAL_TOKEN_ADDRESS, this.provider);

      // アカウントが接続されている場合はコントラクトを接続
      if (this.account) {
        this.shrineContract.connect(this.account);
        this.nftContract.connect(this.account);
        this.culturalTokenContract.connect(this.account);
      }

      this.isInitialized = true;
      console.log('Blockchain service initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize blockchain service:', error);
      return false;
    }
  }

  // 神社作成
  async createShrine(name, location) {
    if (!this.isInitialized || !this.account) {
      throw new Error('Blockchain service not initialized or no account connected');
    }

    try {
      // 文字列をfeltに変換
      const nameHex = cairo.felt(name);
      const locationHex = cairo.felt(location);

      const result = await this.shrineContract.create_shrine(nameHex, locationHex);
      await this.provider.waitForTransaction(result.transaction_hash);

      console.log('Shrine created on blockchain:', result);
      return result;
    } catch (error) {
      console.error('Failed to create shrine:', error);
      throw error;
    }
  }

  // 参拝記録
  async recordVisit(shrineId, verificationHash) {
    if (!this.isInitialized || !this.account) {
      throw new Error('Blockchain service not initialized or no account connected');
    }

    try {
      const result = await this.shrineContract.record_visit(
        shrineId,
        this.account.address,
        verificationHash
      );
      
      await this.provider.waitForTransaction(result.transaction_hash);
      console.log('Visit recorded on blockchain:', result);
      return result;
    } catch (error) {
      console.error('Failed to record visit:', error);
      throw error;
    }
  }

  // NFTミント
  async mintVisitNFT(visitId, metadataUri) {
    if (!this.isInitialized || !this.account) {
      throw new Error('Blockchain service not initialized or no account connected');
    }

    try {
      const result = await this.shrineContract.mint_visit_nft(
        this.account.address,
        visitId,
        cairo.felt(metadataUri)
      );

      await this.provider.waitForTransaction(result.transaction_hash);
      console.log('NFT minted on blockchain:', result);
      return result;
    } catch (error) {
      console.error('Failed to mint NFT:', error);
      throw error;
    }
  }

  // 神社情報取得
  async getShrineInfo(shrineId) {
    if (!this.isInitialized) {
      throw new Error('Blockchain service not initialized');
    }

    try {
      const result = await this.shrineContract.get_shrine_info(shrineId);
      return {
        name: result.name,
        owner: result.owner,
        visitCount: result.visit_count,
        culturalCapital: result.cultural_capital
      };
    } catch (error) {
      console.error('Failed to get shrine info:', error);
      throw error;
    }
  }

  // ユーザーの文化資本取得
  async getUserCulturalCapital(userAddress = null) {
    if (!this.isInitialized) {
      throw new Error('Blockchain service not initialized');
    }

    const address = userAddress || this.account?.address;
    if (!address) {
      throw new Error('No user address provided');
    }

    try {
      const result = await this.shrineContract.get_user_cultural_capital(address);
      return Number(result.amount);
    } catch (error) {
      console.error('Failed to get cultural capital:', error);
      throw error;
    }
  }

  // 文化資本トークン残高取得
  async getCulturalTokenBalance(userAddress = null) {
    if (!this.isInitialized) {
      throw new Error('Blockchain service not initialized');
    }

    const address = userAddress || this.account?.address;
    if (!address) {
      throw new Error('No user address provided');
    }

    try {
      const result = await this.culturalTokenContract.balance_of(address);
      return Number(result.balance);
    } catch (error) {
      console.error('Failed to get token balance:', error);
      throw error;
    }
  }

  // 文化資本トークン転送
  async transferCulturalTokens(toAddress, amount) {
    if (!this.isInitialized || !this.account) {
      throw new Error('Blockchain service not initialized or no account connected');
    }

    try {
      const result = await this.culturalTokenContract.transfer(toAddress, amount);
      await this.provider.waitForTransaction(result.transaction_hash);
      console.log('Cultural tokens transferred:', result);
      return result;
    } catch (error) {
      console.error('Failed to transfer tokens:', error);
      throw error;
    }
  }

  // NFT所有数取得
  async getNFTBalance(userAddress = null) {
    if (!this.isInitialized) {
      throw new Error('Blockchain service not initialized');
    }

    const address = userAddress || this.account?.address;
    if (!address) {
      throw new Error('No user address provided');
    }

    try {
      const result = await this.nftContract.balance_of(address);
      return Number(result.balance);
    } catch (error) {
      console.error('Failed to get NFT balance:', error);
      throw error;
    }
  }

  // トランザクション状態チェック
  async getTransactionStatus(txHash) {
    if (!this.isInitialized) {
      throw new Error('Blockchain service not initialized');
    }

    try {
      const result = await this.provider.getTransactionReceipt(txHash);
      return result.status;
    } catch (error) {
      console.error('Failed to get transaction status:', error);
      throw error;
    }
  }

  // ネットワーク情報取得
  async getNetworkInfo() {
    if (!this.isInitialized) {
      throw new Error('Blockchain service not initialized');
    }

    try {
      const blockNumber = await this.provider.getBlockNumber();
      return {
        blockNumber,
        network: 'goerli-alpha' // TODO: 動的に取得
      };
    } catch (error) {
      console.error('Failed to get network info:', error);
      throw error;
    }
  }
}

export default new BlockchainService();