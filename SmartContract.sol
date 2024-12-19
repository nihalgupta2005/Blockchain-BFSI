// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract TransactionManager {
    // Structure to represent a transaction
    struct Transaction {
        address sender;
        address recipient;
        uint256 amount;
        string currency;
        uint256 timestamp;
    }

    // Mapping to store user balances
    mapping(address => uint256) private balances;

    // Array to store all transactions
    Transaction[] private transactions;

    // Events
    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event Transfer(
        address indexed sender,
        address indexed recipient,
        uint256 amount,
        string currency
    );

    // Function to deposit Ether into the contract
    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than zero");
        balances[msg.sender] += msg.value;

        emit Deposit(msg.sender, msg.value);
    }

    // Function to withdraw Ether from the contract
    function withdraw(uint256 amount) public {
        require(amount > 0, "Withdraw amount must be greater than zero");
        require(balances[msg.sender] >= amount, "Insufficient balance");

        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);

        emit Withdraw(msg.sender, amount);
    }

    // Function to transfer funds to another user
    function transfer(
        address recipient,
        uint256 amount,
        string memory currency
    ) public {
        require(amount > 0, "Transfer amount must be greater than zero");
        require(balances[msg.sender] >= amount, "Insufficient balance");
        require(recipient != address(0), "Invalid recipient address");

        balances[msg.sender] -= amount;
        balances[recipient] += amount;

        // Record the transaction
        transactions.push(
            Transaction({
                sender: msg.sender,
                recipient: recipient,
                amount: amount,
                currency: currency,
                timestamp: block.timestamp
            })
        );

        emit Transfer(msg.sender, recipient, amount, currency);
    }

    // Function to get the balance of a user
    function getBalance(address user) public view returns (uint256) {
        return balances[user];
    }

    // Function to get all transactions
    function getAllTransactions() public view returns (Transaction[] memory) {
        return transactions;
    }
}