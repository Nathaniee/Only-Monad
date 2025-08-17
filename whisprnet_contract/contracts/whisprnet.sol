// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract whisprnet {
    struct Message {
        address sender;
        string content;
        uint timestamp;
    }

    Message[] public messages;

    event MessageSent(address indexed sender, string content, uint timestamp);

    function sendMessage(string calldata _message) external {
        messages.push(Message(msg.sender, _message, block.timestamp));
        emit MessageSent(msg.sender, _message, block.timestamp);
    }

    function getAllMessages() external view returns (Message[] memory) {
        return messages;
    }
}
