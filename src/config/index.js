const dotenv = require('dotenv');

dotenv.config();

const config = {
    PORT: process.env.PORT || 3000,
    SOCKET_IO_PATH: process.env.SOCKET_IO_PATH || '/socket.io',
    REACTION_OPTIONS: ['👍', '❤️', '😂', '😮', '😢', '😡'],
    PROFILE_PICTURE_URLS: [
        'https://example.com/profile1.png',
        'https://example.com/profile2.png',
        'https://example.com/profile3.png',
        // Add more profile picture URLs as needed
    ],
};

module.exports = config;