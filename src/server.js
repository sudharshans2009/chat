const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const ChatController = require('./controllers/chatController');
const generateUsername = require('./services/usernameGenerator');
const generateProfilePicture = require('./services/profilePictureGenerator');
const { toggleReaction, getReactions } = require('./services/reactionService');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const chatController = new ChatController();

const channels = {}; // Store channels and their owners
const users = {}; // Track users and their current channels

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
    let username = generateUsername();
    let profilePicture = generateProfilePicture(username);

    socket.emit('userDetails', { username, profilePicture });

    socket.on('updateUsername', (newUsername) => {
        username = newUsername;
        profilePicture = generateProfilePicture(newUsername);
        socket.emit('userDetails', { username, profilePicture });
    });

    socket.on('createChannel', ({ channelCode, channelName }) => {
        const oldChannel = users[socket.id];
        if (oldChannel) {
            socket.leave(oldChannel);
            io.to(oldChannel).emit('systemMessage', `${username} has left the channel.`);
        }

        if (!channels[channelCode]) {
            channels[channelCode] = { name: channelName, owner: socket.id };
            users[socket.id] = channelCode;
            socket.join(channelCode);
            io.to(channelCode).emit('systemMessage', `${username} has joined the channel.`);
            socket.emit('channelJoined', { channelCode, channelName, isOwner: true });
        } else {
            socket.emit('error', 'Channel already exists.');
        }
    });

    socket.on('joinChannel', (channelCode) => {
        const oldChannel = users[socket.id];
        if (oldChannel) {
            socket.leave(oldChannel);
            io.to(oldChannel).emit('systemMessage', `${username} has left the channel.`);
        }

        if (channels[channelCode]) {
            users[socket.id] = channelCode;
            socket.join(channelCode);
            const isOwner = channels[channelCode].owner === socket.id;
            io.to(channelCode).emit('systemMessage', `${username} has joined the channel.`);
            socket.emit('channelJoined', { channelCode, channelName: channels[channelCode].name, isOwner });
        } else {
            socket.emit('error', 'Channel does not exist.');
        }
    });

    socket.on('leaveChannel', () => {
        const channelCode = users[socket.id];
        if (channelCode) {
            io.to(channelCode).emit('systemMessage', `${username} has left the channel.`);
            socket.leave(channelCode);
            delete users[socket.id];

            // Send channel code to the leaving user so they can clear their messages
            socket.emit('channelLeft', channelCode);
        }
    });

    socket.on('sendMessage', (message) => {
        const channelCode = users[socket.id];
        if (channelCode) {
            const chatMessage = chatController.sendMessage(username, message);
            const isOwner = channels[channelCode].owner === socket.id;
            // Attach the channelCode to each message
            io.to(channelCode).emit('newMessage', {
                ...chatMessage,
                profilePicture,
                isOwner,
                channelCode // Send the channel code along with the message
            });
        } else {
            socket.emit('error', 'You are not in a channel.');
        }
    });

    socket.on('toggleReaction', ({ messageId, reaction }) => {
        toggleReaction(messageId, socket.id, reaction);
        const reactions = getReactions(messageId);
        const channelCode = users[socket.id];
        if (channelCode) {
            io.to(channelCode).emit('updateReactions', { messageId, reactions });
        }
    });

    socket.on('disconnect', () => {
        const channelCode = users[socket.id];
        if (channelCode) {
            io.to(channelCode).emit('systemMessage', `${username} has left the channel.`);
            delete users[socket.id];
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});