export const WHISPRNET_CONTRACT_ABI = [
  {
    "inputs": [{ "internalType": "string", "name": "_message", "type": "string" }],
    "name": "sendMessage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllMessages",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "sender", "type": "address" },
          { "internalType": "string", "name": "content", "type": "string" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
        ],
        "internalType": "struct WhisprNet.Message[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
