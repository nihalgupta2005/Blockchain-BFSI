import { ethers } from "ethers";

const contractAddress = "SmartContract"; // Replace with the deployed contract address
const contractABI = [
    {
        "inputs": [],
        "name": "deposit",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "recipient", "type": "address" },
            { "internalType": "uint256", "name": "amount", "type": "uint256" },
            { "internalType": "string", "name": "currency", "type": "string" }
        ],
        "name": "transfer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "user", "type": "address" }
        ],
        "name": "getBalance",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllTransactions",
        "outputs": [
            {
                "components": [
                    { "internalType": "address", "name": "sender", "type": "address" },
                    { "internalType": "address", "name": "recipient", "type": "address" },
                    { "internalType": "uint256", "name": "amount", "type": "uint256" },
                    { "internalType": "string", "name": "currency", "type": "string" },
                    { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
                ],
                "internalType": "struct TransactionManager.Transaction[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

let provider;
let signer;
let contract;

export const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
        try {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            signer = provider.getSigner();
            contract = new ethers.Contract(contractAddress, contractABI, signer);

            const address = await signer.getAddress();
            console.log("Connected wallet:", address);
            return address;
        } catch (error) {
            console.error("Wallet connection failed:", error.message);
            throw error;
        }
    } else {
        alert("MetaMask is not installed. Please install it to use this feature.");
        throw new Error("MetaMask not installed");
    }
};

export const depositFunds = async (amountInEther) => {
    if (!contract) throw new Error("Contract not connected");

    try {
        const tx = await contract.deposit({
            value: ethers.utils.parseEther(amountInEther)
        });
        await tx.wait();
        console.log("Deposit successful:", tx);
    } catch (error) {
        console.error("Deposit failed:", error.message);
        throw error;
    }
};

export const withdrawFunds = async (amount) => {
    if (!contract) throw new Error("Contract not connected");

    try {
        const tx = await contract.withdraw(ethers.utils.parseUnits(amount, "wei"));
        await tx.wait();
        console.log("Withdrawal successful:", tx);
    } catch (error) {
        console.error("Withdrawal failed:", error.message);
        throw error;
    }
};

export const transferFunds = async (recipient, amount, currency) => {
    if (!contract) throw new Error("Contract not connected");

    try {
        const tx = await contract.transfer(
            recipient,
            ethers.utils.parseUnits(amount, "wei"),
            currency
        );
        await tx.wait();
        console.log("Transfer successful:", tx);
    } catch (error) {
        console.error("Transfer failed:", error.message);
        throw error;
    }
};

export const getBalance = async (userAddress) => {
    if (!contract) throw new Error("Contract not connected");

    try {
        const balance = await contract.getBalance(userAddress);
        return ethers.utils.formatEther(balance);
    } catch (error) {
        console.error("Failed to fetch balance:", error.message);
        throw error;
    }
};

export const getAllTransactions = async () => {
    if (!contract) throw new Error("Contract not connected");

    try {
        const transactions = await contract.getAllTransactions();
        console.log("Fetched transactions:", transactions);
        return transactions;
    } catch (error) {
        console.error("Failed to fetch transactions:", error.message);
        throw error;
    }
};
