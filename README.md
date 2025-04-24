# Chat Application

This is a real-time chat application built with Node.js, Express, and Socket.io. The application allows users to connect, send messages, and react to messages in real-time. Each user is assigned a randomly generated username and profile picture.

## Features

- Real-time messaging using Socket.io
- Randomly generated usernames
- Randomly selected profile pictures
- User reactions to messages

## Project Structure

```
chat-app
├── src
│   ├── app.js                # Initializes the Express application and sets up middleware
│   ├── server.js             # Starts the server and listens for connections
│   ├── config
│   │   └── index.js          # Configuration settings for the application
│   ├── controllers
│   │   └── chatController.js  # Handles chat message logic
│   ├── routes
│   │   └── chatRoutes.js      # Defines API routes for the chat application
│   ├── services
│   │   ├── usernameGenerator.js # Generates random usernames
│   │   ├── profilePictureGenerator.js # Returns random profile picture URLs
│   │   └── reactionService.js  # Manages user reactions to messages
│   └── public
│       ├── css
│       │   └── styles.css     # CSS styles for the chat application
│       ├── js
│       │   └── chat.js        # Client-side JavaScript for chat interactions
│       └── index.html         # Main HTML file for the chat application
├── package.json               # npm configuration file
├── .env                       # Environment variables for the application
└── README.md                  # Documentation for the project
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd chat-app
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and set the necessary environment variables, such as the port number.

## Usage

1. Start the server:
   ```
   npm start
   ```

2. Open your browser and navigate to `http://localhost:<port>` to access the chat application.

## Contributing

Feel free to submit issues or pull requests to improve the application.