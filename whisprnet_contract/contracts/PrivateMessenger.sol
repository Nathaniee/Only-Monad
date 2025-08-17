// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract PrivateMessenger {
    struct PrivateMessage {
        address sender;
        string content;
        uint timestamp;
    }

    mapping(address => PrivateMessage[]) private inbox;

    event PrivateMessageSent(address indexed from, address indexed to, string content, uint timestamp);

    function sendPrivateMessage(address _to, string calldata _content) external {
        PrivateMessage memory newMsg = PrivateMessage({
            sender: msg.sender,
            content: _content,
            timestamp: block.timestamp
        });

        inbox[_to].push(newMsg);
        emit PrivateMessageSent(msg.sender, _to, _content, block.timestamp);
    }

    function getInbox() external view returns (PrivateMessage[] memory) {
        return inbox[msg.sender];
    }

    function getMessagesFrom(address _sender) external view returns (PrivateMessage[] memory) {
        PrivateMessage[] memory all = inbox[msg.sender];
        uint count = 0;

        for (uint i = 0; i < all.length; i++) {
            if (all[i].sender == _sender) {
                count++;
            }
        }

        PrivateMessage[] memory filtered = new PrivateMessage[](count);
        uint index = 0;

        for (uint i = 0; i < all.length; i++) {
            if (all[i].sender == _sender) {
                filtered[index++] = all[i];
            }
        }

        return filtered;
    }
}
