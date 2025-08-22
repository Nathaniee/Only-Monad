import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { WHISPRNET_CONTRACT_ABI } from "../lib/contractABI";
import { WHISPRNET_CONTRACT_ADDRESS } from "../lib/constants";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(accounts[0]);
      } catch (err) {
        console.error("User rejected the request.");
      }
    } else {
      alert("MetaMask not detected");
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
  };

  const fetchMessages = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        WHISPRNET_CONTRACT_ADDRESS,
        WHISPRNET_CONTRACT_ABI,
        signer
      );
      const messages = await contract.getAllMessages();
      const parsedMessages = messages.map((m: any) => m.content); // extract 'content' field
      setMessages(parsedMessages);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!walletAddress || !message.trim()) return;
    try {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        WHISPRNET_CONTRACT_ADDRESS,
        WHISPRNET_CONTRACT_ABI,
        signer
      );
      const tx = await contract.sendMessage(message);
      await tx.wait();
      setMessage("");
      fetchMessages();
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkWalletConnection();
    fetchMessages();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-red-900 via-blue-800 to-red-950 text-white">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-6 w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-4 text-center text-purple-300">Nathieon Monad Community</h1>

        <div className="flex justify-between mb-4">
          {walletAddress ? (
            <button
              onClick={disconnectWallet}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
            >
              Disconnect Wallet
            </button>
          ) : (
            <button
              onClick={connectWallet}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
            >
              Connect Wallet
            </button>
          )}
          {walletAddress && (
            <span className="text-xs text-gray-300 truncate ml-4">
              Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </span>
          )}
        </div>

        <div className="mb-4">
          <input
            type="text"
            className="w-full p-3 rounded bg-white/20 placeholder-gray-300 text-white"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={!walletAddress}
          />
        </div>

        <button
          onClick={sendMessage}
          disabled={!walletAddress || loading}
          className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>

        <div className="mt-6 space-y-2">
          <h2 className="text-xl font-semibold text-purple-200 mb-2">Messages:</h2>
          {messages.length === 0 ? (
            <p className="text-gray-300 text-sm">Nothing here yet.</p>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className="bg-white/10 p-2 rounded">
                {msg}
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
