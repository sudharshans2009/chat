class ChatController {
    constructor() {
        this.messages = [];
    }

    sendMessage(username, message) {
        const timestamp = new Date();
        const chatMessage = { username, message, timestamp };
        this.messages.push(chatMessage);
        return chatMessage;
    }

    getMessages() {
        return this.messages;
    }
}

module.exports = ChatController;