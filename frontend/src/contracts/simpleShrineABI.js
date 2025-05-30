// Simple Shrine Contract ABI
export const SIMPLE_SHRINE_ABI = [
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
        "type": "u256"
      }
    ],
    "outputs": [
      {
        "type": "u256"
      }
    ]
  },
  {
    "name": "get_shrine_info",
    "type": "function",
    "inputs": [
      {
        "name": "shrine_id",
        "type": "u256"
      }
    ],
    "outputs": [
      {
        "type": "ContractAddress"
      },
      {
        "type": "felt252"
      },
      {
        "type": "u256"
      }
    ]
  },
  {
    "name": "get_user_info",
    "type": "function",
    "inputs": [
      {
        "name": "user",
        "type": "ContractAddress"
      }
    ],
    "outputs": [
      {
        "type": "u256"
      },
      {
        "type": "u256"
      }
    ]
  },
  {
    "name": "get_total_shrines",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "type": "u256"
      }
    ]
  }
];

export const SIMPLE_SHRINE_CONTRACT_ADDRESS = "0x04640e78f99427bca06749e90cf1f4a68163de68230f224b631137ef8b39f403";