# Real-Time Global Chat Feature

This document provides instructions on how to set up and use the real-time global chat feature implemented for the Trading University website.

## Overview

The global chat feature allows users to communicate with each other in real-time across the entire platform. The chat appears as a floating button in the bottom-right corner of every page, which expands into a chat window when clicked.

## Features

- Real-time messaging using Socket.IO
- Global chat visible to all authenticated users
- Persisted messages stored in the database
- User avatars and names displayed with messages
- Responsive design that works on all devices
- Dark theme matching the website's aesthetic

## Technical Implementation

The chat feature consists of:

1. A Socket.IO server for real-time communication
2. Prisma models for storing chats, chat members, and messages
3. API endpoints for fetching message history
4. React components for the UI

## Setup Instructions

### 1. Environment Variables

Ensure the following environment variables are set in your `.env.local` file:

```
# Database connection string
DATABASE_URL="your-database-connection-string"

# NextAuth configuration
NEXTAUTH_URL="your-site-url"
NEXTAUTH_SECRET="your-secret-key"

# Site URL for Socket.IO connections
NEXT_PUBLIC_SITE_URL="your-site-url"
```

### 2. Database Models

The necessary database models are already included in the `schema.prisma` file:

- `Chat` - Represents a chat room (global or direct)
- `ChatMember` - Links users to chats they're members of
- `Message` - Stores individual chat messages

### 3. API Routes

The following API routes handle chat functionality:

- `/api/socket/io` - Socket.IO server endpoint
- `/api/chat/global` - Fetches global chat messages

### 4. Components

The main components for the chat feature are:

- `GlobalChat.tsx` - The UI component for the chat window
- `useSocket.ts` - A custom hook for managing socket connections

## Usage

The chat feature is automatically included in the main layout and will appear on all pages for authenticated users. Users can:

1. Click the chat button in the bottom-right corner to open the chat window
2. See messages from all users in real-time
3. Send messages which will immediately appear to all other users
4. Close the chat window by clicking the X or the chat button again

## Customization

To modify the appearance of the chat:

- Edit `GlobalChat.tsx` to change the UI components
- Update the color scheme in the component classes to match your brand
- Adjust the position and size by modifying the CSS classes

## Troubleshooting

Common issues and solutions:

- If messages aren't sending, check that Socket.IO is properly configured
- If the chat doesn't appear, verify that the user is authenticated
- For database connection issues, ensure your DATABASE_URL is correct

## Future Improvements

Potential enhancements for the chat feature:

- Add support for direct messaging between users
- Implement message reactions and emoji support
- Add file and image sharing capabilities
- Include typing indicators and read receipts 