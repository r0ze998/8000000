// Starknet スマートコントラクト設定
export const SHRINE_CONTRACT_ADDRESS = "0x04640e78f99427bca06749e90cf1f4a68163de68230f224b631137ef8b39f403"; // Deployed on Sepolia

// スマートコントラクトABI（Application Binary Interface）
export const SHRINE_CONTRACT_ABI = [
  {
    "name": "create_shrine",
    "type": "function",
    "inputs": [
      {
        "name": "name",
        "type": "felt252"
      }
    ],
    "outputs": [
      {
        "name": "shrine_id",
        "type": "u256"
      }
    ]
  },
  {
    "name": "record_visit",
    "type": "function", 
    "inputs": [
      {
        "name": "shrine_id",
        "type": "felt"
      },
      {
        "name": "visitor",
        "type": "felt"
      },
      {
        "name": "verification_hash",
        "type": "felt"
      }
    ],
    "outputs": [
      {
        "name": "visit_id",
        "type": "felt"
      }
    ]
  },
  {
    "name": "mint_visit_nft",
    "type": "function",
    "inputs": [
      {
        "name": "to",
        "type": "felt"
      },
      {
        "name": "visit_id", 
        "type": "felt"
      },
      {
        "name": "metadata_uri",
        "type": "felt"
      }
    ],
    "outputs": [
      {
        "name": "token_id",
        "type": "felt"
      }
    ]
  },
  {
    "name": "get_shrine_info",
    "type": "function",
    "inputs": [
      {
        "name": "shrine_id",
        "type": "felt"
      }
    ],
    "outputs": [
      {
        "name": "name",
        "type": "felt"
      },
      {
        "name": "owner",
        "type": "felt"
      },
      {
        "name": "visit_count",
        "type": "felt"
      },
      {
        "name": "cultural_capital",
        "type": "felt"
      }
    ]
  },
  {
    "name": "get_user_cultural_capital",
    "type": "function",
    "inputs": [
      {
        "name": "user",
        "type": "felt"
      }
    ],
    "outputs": [
      {
        "name": "amount",
        "type": "felt"
      }
    ]
  },
  {
    "name": "transfer_cultural_capital",
    "type": "function",
    "inputs": [
      {
        "name": "to",
        "type": "felt"
      },
      {
        "name": "amount",
        "type": "felt"
      }
    ],
    "outputs": []
  }
];

// NFTコントラクト設定
export const NFT_CONTRACT_ADDRESS = "0xfedcba9876543210..."; // TODO: 実際のNFTコントラクトアドレス

export const NFT_CONTRACT_ABI = [
  {
    "name": "mint",
    "type": "function",
    "inputs": [
      {
        "name": "to",
        "type": "felt"
      },
      {
        "name": "token_id",
        "type": "felt"
      },
      {
        "name": "metadata_uri",
        "type": "felt"
      }
    ],
    "outputs": []
  },
  {
    "name": "token_uri",
    "type": "function",
    "inputs": [
      {
        "name": "token_id",
        "type": "felt"
      }
    ],
    "outputs": [
      {
        "name": "uri",
        "type": "felt"
      }
    ]
  },
  {
    "name": "owner_of",
    "type": "function",
    "inputs": [
      {
        "name": "token_id",
        "type": "felt"
      }
    ],
    "outputs": [
      {
        "name": "owner",
        "type": "felt"
      }
    ]
  },
  {
    "name": "balance_of",
    "type": "function",
    "inputs": [
      {
        "name": "owner",
        "type": "felt"
      }
    ],
    "outputs": [
      {
        "name": "balance",
        "type": "felt"
      }
    ]
  }
];

// 文化資本トークンコントラクト設定
export const CULTURAL_TOKEN_ADDRESS = "0x1122334455667788..."; // TODO: 実際のトークンアドレス

export const CULTURAL_TOKEN_ABI = [
  {
    "name": "balance_of",
    "type": "function",
    "inputs": [
      {
        "name": "account",
        "type": "felt"
      }
    ],
    "outputs": [
      {
        "name": "balance",
        "type": "felt"
      }
    ]
  },
  {
    "name": "transfer",
    "type": "function",
    "inputs": [
      {
        "name": "recipient",
        "type": "felt"
      },
      {
        "name": "amount",
        "type": "felt"
      }
    ],
    "outputs": [
      {
        "name": "success",
        "type": "felt"
      }
    ]
  },
  {
    "name": "mint",
    "type": "function",
    "inputs": [
      {
        "name": "to",
        "type": "felt"
      },
      {
        "name": "amount",
        "type": "felt"
      }
    ],
    "outputs": []
  }
];