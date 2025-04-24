const socket = io('http://localhost:3000');

let username = '';
let profilePicture = '';
const userReactionStats = { '👍': 0, '❤️': 0, '👀': 0 }; // Track reactions for the current user's messages

socket.on('userDetails', (data) => {
    username = data.username;
    profilePicture = data.profilePicture;

    document.getElementById('usernameInput').value = username;
    document.getElementById('userProfilePicture').src = profilePicture;
});

document.getElementById('updateUsernameButton').addEventListener('click', () => {
    const newUsername = document.getElementById('usernameInput').value.trim();
    if (newUsername) {
        socket.emit('updateUsername', newUsername);
    }
});

document.getElementById('createChannelButton').addEventListener('click', () => {
    const channelCode = Math.random().toString(16).substr(2, 8);
    const channelName = document.getElementById('channelNameInput').value.trim();
    if (channelName) {
        socket.emit('createChannel', { channelCode, channelName });
    }
});

document.getElementById('joinChannelButton').addEventListener('click', () => {
    const channelCode = document.getElementById('channelCodeInput').value.trim();
    if (channelCode) {
        socket.emit('joinChannel', channelCode);
    }
});

socket.on('channelJoined', ({ channelCode, channelName, isOwner }) => {
    document.getElementById('channelList').textContent = `Channel: ${channelName} (${channelCode})`;
});

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;
    if (message.trim()) {
        socket.emit('sendMessage', message);
        messageInput.value = '';
    }
}

document.getElementById('sendButton').addEventListener('click', sendMessage);

document.getElementById('messageInput').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

socket.on('newMessage', (data) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.setAttribute('data-username', data.username); // Add username to the message element
    // Store the channel code on the message so we can remove it later
    messageElement.setAttribute('data-channel', data.channelCode);

    messageElement.innerHTML = `
        <img src="${data.profilePicture}" alt="${data.username}'s profile picture" width="30" height="30">
        <strong>${data.username}${data.isOwner ? ' 👑' : ''}:</strong> ${data.message}
        <div class="reaction-display"></div>
        <div class="reaction-container">
            <span class="reaction" data-id="${data.timestamp}" data-reaction="👍">👍</span>
            <span class="reaction" data-id="${data.timestamp}" data-reaction="❤️">❤️</span>
            <span class="reaction" data-id="${data.timestamp}" data-reaction="👀">👀</span>
        </div>
    `;
    document.getElementById('messages').appendChild(messageElement);
});

document.getElementById('messages').addEventListener('click', (event) => {
    if (event.target.classList.contains('reaction')) {
        const messageId = event.target.getAttribute('data-id');
        const reaction = event.target.getAttribute('data-reaction');
        socket.emit('toggleReaction', { messageId, reaction });
    }
});

socket.on('updateReactions', ({ messageId, reactions }) => {
    // Find the message element with the matching data-id
    const messageElement = document.querySelector(`.message [data-id="${messageId}"]`);
    if (messageElement) {
        // Calculate reaction counts
        const reactionCounts = reactions.reduce((counts, r) => {
            counts[r.reaction] = (counts[r.reaction] || 0) + 1;
            return counts;
        }, {});

        // Ensure all reactions are displayed, even if their count is 0
        const allReactions = ['👍', '❤️', '👀'];
        const reactionDisplay = allReactions
            .map((reaction) => `${reaction} ${reactionCounts[reaction] || 0}`)
            .join(' ');

        // Ensure the reaction display element exists
        const reactionDisplayElement = messageElement.closest('.message').querySelector('.reaction-display');
        if (reactionDisplayElement) {
            reactionDisplayElement.textContent = reactionDisplay;
        }

        // Update the sidebar if the message belongs to the current user
        const messageUsername = messageElement.closest('.message').getAttribute('data-username');
        if (messageUsername === username) {
            allReactions.forEach((reaction) => {
                userReactionStats[reaction] = reactionCounts[reaction] || 0;
            });

            // Update the sidebar reaction stats
            const reactionStatsElement = document.getElementById('reactionStats');
            reactionStatsElement.innerHTML = `
                <p>👍 ${userReactionStats['👍']}</p>
                <p>❤️ ${userReactionStats['❤️']}</p>
                <p>👀 ${userReactionStats['👀']}</p>
            `;
        }
    } else {
        console.warn(`Message element with data-id "${messageId}" not found.`);
    }
});

// Listen for system messages
socket.on('systemMessage', (message) => {
    const systemMessageElement = document.createElement('div');
    systemMessageElement.classList.add('message', 'system-message');
    systemMessageElement.textContent = message;
    document.getElementById('messages').appendChild(systemMessageElement);
});

// Clear only the messages for the channel that was left
socket.on('channelLeft', (channelCode) => {
    const allMessages = document.querySelectorAll('.message');
    allMessages.forEach((msg) => {
        if (msg.getAttribute('data-channel') === channelCode) {
            msg.remove();
        }
    });
});

// Optional: Add a "Leave Channel" button to let the user leave manually
document.getElementById('leaveChannelButton')?.addEventListener('click', () => {
    socket.emit('leaveChannel');
});

// Sidebar toggle functionality
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');

sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});