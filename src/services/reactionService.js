const reactions = {};

const toggleReaction = (messageId, userId, reaction) => {
    if (!reactions[messageId]) {
        reactions[messageId] = [];
    }

    const existingReactionIndex = reactions[messageId].findIndex(r => r.userId === userId && r.reaction === reaction);

    if (existingReactionIndex !== -1) {
        // Remove the reaction if it already exists
        reactions[messageId].splice(existingReactionIndex, 1);
    } else {
        // Add the reaction
        reactions[messageId].push({ userId, reaction });
    }
};

const getReactions = (messageId) => {
    return reactions[messageId] || [];
};

module.exports = {
    toggleReaction,
    getReactions
};