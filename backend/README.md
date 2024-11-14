# Backend README

# KIM2 Backend

This directory contains the backend server for the KIM2 application. The backend is built using **Node.js** , **Express.js** , and **Sequelize ORM** for database interactions.

## Table of Contents

- [Introduction](#introduction)

- [Features](#features)

- [Requirements](#requirements)

- [Installation](#installation)

- [Configuration](#configuration)

- [Database Setup](#database-setup)

- [Running the Server](#running-the-server)

- [API Documentation](#api-documentation)

- [Development](#development)

- [License](#license)

## Introduction

The backend server handles user authentication, manages conversations, and communicates with the Azure OpenAI service to generate AI responses.

## Features

- **JWT Authentication** : Secure endpoints with JSON Web Tokens.

- **Conversation Management** : Start new conversations, add messages, and load conversation history.

- **Azure OpenAI Integration** : Utilizes Azure OpenAI services for generating responses.

- **RESTful API** : Provides clear and well-documented API endpoints.

- **Middleware** : Includes security middleware like Helmet, CORS, and Compression.

## Requirements

- **Node.js** (version 14 or higher)

- **NPM**

- **MySQL** database server

## Installation

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

## Configuration

Create a `.env` file in the root of the `backend/` directory. Use the example [backend/.env.example](.env.example) file as a template for the required environment variables.

## Database Setup

Ensure you have a MySQL database set up and configured with the credentials provided in the `.env` file.

### Running Migrations

To create the necessary tables, run:

```bash
npm run migrate
```

### Undoing Migrations

To undo the last migration:

```bash
npm run migrate:undo
```

To undo all migrations:

```bash
npm run migrate:undo:all
```

## Running the Server

### Production Mode

```bash
npm start
```

### Development Mode

Starts the server with `nodemon` for hot-reloading:

```bash
npm run dev
```

## API Documentation

### Authentication

All API requests require a valid JWT token included in the `Authorization` header:

```makefile
Authorization: Bearer <your_jwt_token>
```

### Endpoints

#### 1. Start a New Conversation

- **Endpoint** : `POST /chat/start`

- **Description** : Initiates a new conversation with the assistant.

- **Headers** :

  - `Authorization: Bearer <your_jwt_token>`

- **Response** : Streams the assistant's initial response in plain text.

#### 2. Add a Message to the Conversation

- **Endpoint** : `POST /chat/add`

- **Description** : Sends a user's message to the assistant and receives a response.

- **Headers** :

  - `Authorization: Bearer <your_jwt_token>`
  - `Content-Type: application/json`

- **Body** :

```json
{
  "message": "Your message here"
}
```

- **Response** : Streams the assistant's response in plain text.

#### 3. Load Conversation History

- **Endpoint** : `GET /chat/load`

- **Description** : Retrieves the authenticated user's conversation history.

- **Headers** :

  - `Authorization: Bearer <your_jwt_token>`

- **Response** :

```json
{
  "messages": [
    {
      "role": "assistant",
      "content": "Hello, how can I assist you today?"
    },
    {
      "role": "user",
      "content": "I need help with..."
    }
    // Additional messages...
  ]
}
```

## Development

### Project Structure

- `src/`

  - `app.js`: Entry point of the application.
  - `routes/`: Contains route definitions.
  - `controllers/`: Contains controller logic.
  - `services/`: Business logic and external API integrations.
  - `middleware/`: Custom middleware functions.

- `config/`: Configuration files and environment settings.

### Scripts

- **Start Server** : `npm start`

- **Start Server in Dev Mode** : `npm run dev`

- **Run Migrations** : `npm run migrate`

- **Undo Migrations** : `npm run migrate:undo`

### Code Quality

- **ESLint** : Linting is set up with ESLint.

- **Prettier** : Code formatting is handled by Prettier.

- **Lint Command** : Run `npm run lint` to check for code issues.

### Testing

- Currently, no tests are set up. Contributions are welcome to add test suites.

## License

This project is licensed under the **UNLICENSED** license.

---

Feel free to reach out for any questions or issues regarding the backend setup.
