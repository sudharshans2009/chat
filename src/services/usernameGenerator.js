function generateUsername() {
    const adjectives = ["Cool", "Awesome", "Brave", "Clever", "Witty", "Charming", "Silly", "Swift", "Bold", "Funky"];
    const nouns = ["Tiger", "Lion", "Eagle", "Shark", "Panda", "Dragon", "Phoenix", "Wolf", "Bear", "Fox"];
    
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(Math.random() * 1000);
    
    return `${randomAdjective}${randomNoun}${randomNumber}`;
}

module.exports = generateUsername;