## 🧩 WebSocket Group Chat API

## 📌 Objective

    Build a WebSocket-based group chat API that stores messages in a PostgreSQL database and provides an interface accessible by both mobile and web clients. The project is documented with Swagger and containerized using Docker.

---

## 🚀 Technologies Used

- **NestJS**: Backend framework
- **TypeORM**: ORM for database operations
- **PostgreSQL**: Database
- **Socket.IO**: WebSocket library
- **Swagger (OpenAPI)**: API documentation
- **Docker & Docker Compose**: Containerization
- **Dotenv**: Environment variable configuration.
- **@nestjs/jwt**: For handling JSON Web Token-based authentication.

---

## 📦 Features

    ✅ Real-time group chat via WebSocket

    ✅ Real-time one-to-one (1:1) chat

    ✅ Message history stored in PostgreSQL

    ✅ REST API to fetch chat history

    ✅ JWT-based user authentication

    ✅ Swagger for API documentation

    ✅ Dockerized setup for easy local development

    ✅ Ready for integration with web and mobile apps

---

## ⚙️ Local Setup Instructions

### Prerequisites

- Node.js (>= 18)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

---

## 🧪 Run Locally

```bash
  git clone https://github.com/dungha3112/test-chat-nestjs
  cd test-chat-nest
  npm i
  npm run start:dev or npm run start
```

## 🌍 Environment Configuration

```bash

  PORT=3000
  DATABASE_URL=your_database_connection_string

  JWT_ACCESS_SECRET=your_jwt_access_secret
  JWT_ACCESS_EXPIRES_IN=3600  # Token expiration time in seconds (e.g., 1 hour)

  REFRESH_TOKEN_SECRET=your_refresh_token_secret
  JWT_REFRESH_EXPIRES_IN=604800  # Refresh token expiration time in seconds (e.g., 7 days)

```

---

## 🔌 Access Points

WebSocket Endpoint: ws://localhost:3000

Swagger UI: http://localhost:3000/api/

---

# 📚 Chat API Documentation (v1.0)

**Specification**: OpenAPI 3.0  
**Base URL**: `http://localhost:3000`

---

## 🔐 Auth Module (`/api/auth`)

| Method | Endpoint         | Description                                  |
| ------ | ---------------- | -------------------------------------------- |
| POST   | `/register`      | Register a new user                          |
| POST   | `/login`         | Login and receive access + refresh tokens    |
| POST   | `/refresh-token` | Get a new access token using a refresh token |
| POST   | `/logout`        | Logout and clear refresh token cookie        |

---

## 👤 User Module (`/api/user`)

| Method | Endpoint  | Description                   |
| ------ | --------- | ----------------------------- |
| GET    | `/search` | Search for a user by username |

---

## 👥 Group Module (`/api/group`)

### Group Management

| Method | Endpoint      | Description                    |
| ------ | ------------- | ------------------------------ |
| POST   | `/`           | Create a new group             |
| GET    | `/`           | Get all groups                 |
| GET    | `/{id}`       | Get group details by ID        |
| PATCH  | `/{id}`       | Update group info (owner only) |
| PATCH  | `/{id}/owner` | Transfer group ownership       |
| DELETE | `/{id}/leave` | Leave the group                |

### Group Members

| Method | Endpoint          | Description            |
| ------ | ----------------- | ---------------------- |
| POST   | `/{id}/recipient` | Add user to group      |
| DELETE | `/{id}/recipient` | Remove user from group |

### Group Messages

| Method | Endpoint                    | Description                  |
| ------ | --------------------------- | ---------------------------- |
| POST   | `/{id}/message`             | Send a message to the group  |
| GET    | `/{id}/message`             | Get all group messages       |
| PATCH  | `/{id}/message/{messageId}` | Edit a group message by ID   |
| DELETE | `/{id}/message/{messageId}` | Delete a group message by ID |

---

## 💬 Direct Conversations (`/api/conversation`)

### Conversations

| Method | Endpoint | Description                       |
| ------ | -------- | --------------------------------- |
| POST   | `/`      | Create a new conversation         |
| GET    | `/`      | Get all conversations             |
| GET    | `/{id}`  | Get a specific conversation by ID |

### Conversation Messages

| Method | Endpoint                    | Description                         |
| ------ | --------------------------- | ----------------------------------- |
| POST   | `/{id}/message`             | Send a message in conversation      |
| GET    | `/{id}/message`             | Get all messages in conversation    |
| PATCH  | `/{id}/message/{messageId}` | Edit a conversation message by ID   |
| DELETE | `/{id}/message/{messageId}` | Delete a conversation message by ID |

---

## 🧬 Schemas (DTOs)

### ✅ Auth DTOs

- `UserRegisterDto`
- `UserLoginDto`
- `UserResponseDto`
- `UserLoginResponseDto`
- `UserRefreshTokenResponseDto`

### ✅ Group DTOs

- `GroupCreateDto`
- `GroupEditDto`
- `GroupResDto`
- `GroupMessageCreateDto`
- `GroupMessageEditDto`
- `MessageGroupResDto`
- `CreateNewMessageGroupDto`
- `GroupRecipientAddUserDto`
- `GroupRecipientRemoveUserDto`
- `AddUserToGroupResDto`
- `RemoveUserToGroupResDto`
- `GetMessagesGroupResponseDto`
- `UpdateMessageGroupResDto`
- `DeleteMessageGroupResDto`

### ✅ Conversation DTOs

- `ConversationCreateDto`
- `ConverstionResDto`
- `ConverMessageCreateDto`
- `ConverMessageEditDto`
- `MessageConverResDto`
- `CreateConversationResponseDto`
- `GetMessagesConversationResponseDto`
- `UpdateMessageConverResponseDto`
- `DeleteMessageConverResponseDto`

---

## 🧪 Swagger UI

You can test the API directly at:

👉 [http://localhost:3000/api](http://localhost:3000/api)

---

## 🌐 WebSocket (if supported)

> Connect using the following format:

## 🧱 Database Schema Overview

![Architecture Diagram](./neondb.png)

users: User info (id, email, username, password)

conversations: One-to-one chats between users

conversation_messages: Messages for one-to-one chats

groups: Chat groups

group_messages: Messages in groups

All messages include id, content, author, and createdAt.

## 🧱 Project Structure

```bash

src/
├── auth/                  # Auth DTOs, controllers, services, modules
├── conversation/
│   ├── controllers/       # Conversation & conversation-message controllers
│   ├── dtos/
│   ├── middlewares/
│   ├── services/
├── custom-jwt/            # JWT service and module
├── database/              # Database module config
├── events/                # WebSocket events
│   ├── conversations/
│   ├── groups/
├── gateway/               # WebSocket gateway setup
├── group/
│   ├── controllers/       # Group, message, and recipient controllers
│   ├── dtos/
│   ├── middlewares/
│   ├── services/
├── user/                  # User DTOs, controllers, services, module
├── util/                  # Constants, decorators, guards, helpers, types, interfacesm middlewares, typeorm
├── app.module.ts
└── main.ts

```

---

## ✅ Optional Additions You Could Include

🔒 Authentication Overview

This app uses JWT (via @nestjs/jwt) for secure authentication. On successful login, a JWT token is returned. Protected routes and WebSocket connections require this token.

Example WebSocket auth flow:

Connect to WebSocket with JWT as a query parameter:
ws://localhost:3000?token=<your_jwt_token>

---

## 📤 Future Enhancements

Verify otp

Add file/image messaging support

Support for typing indicators, online status

Push notification integration

Admin/moderation tools

Redis support for scaling WebSocket servers
