// components/PrivateMessenger.tsx
"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import PRIVATE_MESSENGER_ABI from "../lib/privateMessengerABI";
import { PRIVATE_MESSENGER_CONTRACT_ADDRESS } from "../lib/constants";

type PrivateMessengerProps = {
  walletAddress: string;
};

const PrivateMessenger = ({ walletAddress }: PrivateMessengerProps) => {
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [wallet, setWallet] = useState("");
  const [inbox, setInbox] = useState<
    { sender: string; content: string; timestamp: number }[]
  >([]);
  const [txHash, setTxHash] = useState<string | null>(null);

  useEffect(() => {
    const loadWallet = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWallet(accounts[0]);
      }
    };
    loadWallet();
  }, []);

  const sendPrivateMessage = async () => {
    try {
      if (!recipient || !message) {
        setStatus("Recipient and message required.");
        return;
      }

      if (!window.ethereum) {
        throw new Error("MetaMask is not available");
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        PRIVATE_MESSENGER_CONTRACT_ADDRESS,
        PRIVATE_MESSENGER_ABI,
        signer
      );

      setStatus("Sending...");
      setTxHash(null); // Reset previous txHash
      const tx = await contract.sendPrivateMessage(recipient, message);
      await tx.wait();

      setStatus("✅ Message sent successfully!");
      setTxHash(tx.hash);
      setMessage("");
    } catch (err: any) {
      console.error("SEND ERROR:", err);
      setStatus("❌ Error sending message.");
      setTxHash(null);
    }
  };

  const loadInbox = async () => {
    setStatus("⏳ Loading inbox...");
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.error("Ethereum provider not found");
        return;
      }

      const provider = new ethers.providers.Web3Provider(ethereum as any);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        PRIVATE_MESSENGER_CONTRACT_ADDRESS,
        PRIVATE_MESSENGER_ABI,
        signer
      );

      const messages = await contract.getInbox();
      setInbox(messages);
      setStatus("📬 Inbox loaded.");
    } catch (err: any) {
      console.error("INBOX ERROR:", err);
      setStatus("❌ Failed to load inbox.");
    }
  };

  return (
    <div className="p-4 mt-8 bg-white/10 rounded-2xl backdrop-blur-md shadow-xl">
      <h2 className="text-xl font-semibold text-purple-200 mb-4">📬 Private Messenger</h2>

      <input
        type="text"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        placeholder="Recipient Wallet Address"
        className="w-full p-2 mb-2 rounded-lg bg-purple-100/10 text-white border border-purple-500"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your private message..."
        className="w-full p-2 mb-2 rounded-lg bg-purple-100/10 text-white border border-purple-500"
      />
      <button
        onClick={sendPrivateMessage}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-xl"
      >
        Send Private Message
      </button>

      <div className="text-sm text-purple-300 mt-2">{status}</div>
      {txHash && (
        <div className="mt-1 text-xs text-purple-400">
          🔗{" "}
          <a
            href={`https://testnet.monadexplorer.com/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            View on Monad Explorer
          </a>
        </div>
      )}

      <hr className="my-6 border-purple-400/30" />

      <button
        onClick={loadInbox}
        className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-xl mb-4"
      >
        📥 Load My Inbox
      </button>

      {inbox.length > 0 && (
        <div className="space-y-4 max-h-64 overflow-y-auto">
          {inbox.map((msg, i) => (
            <div
              key={i}
              className="p-3 border border-purple-500 bg-purple-200/10 rounded-lg"
            >
              <p className="text-sm text-purple-100">
                <strong>From:</strong> {msg.sender}
              </p>
              <p className="text-white">{msg.content}</p>
              <p className="text-xs text-purple-300">
                {new Date(msg.timestamp * 1000).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PrivateMessenger;
