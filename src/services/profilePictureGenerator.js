function generateProfilePicture(username) {
    const baseUrl = 'https://api.dicebear.com/7.x/bottts-neutral/svg';
    return `${baseUrl}?seed=${encodeURIComponent(username)}`;
}

module.exports = generateProfilePicture;