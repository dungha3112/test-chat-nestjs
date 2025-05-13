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

## 🌍 Deploy URL

If you've deployed your application to a platform like

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

## Architecture Diagram

                               +------------------------+
                               |   Client (Web/Mobile)  |
                               +-----------+------------+
                                           |
                                    WebSocket + REST API
                                           |
                              +------------+------------+
                              |     NestJS Backend      |
                              |                         |
                              |      +-----------+      |
                              |      |  Gateway  |      |
                              |      +-----------+      |
                              |           |             |
                              |           ▼             |
                              |     +------------+      |
                              |     | EventModule|      |
                              |     +------------+      |
                              |        /      \         |
                              |       /        \        |
                              ▼      ▼          ▼       ▼
                          +----------------+  +----------------+
                          | Conversation   |  |     Group      |
                          |    Module      |  |     Module     |
                          |----------------|  |----------------|
                                /                   \
                               /                     \
                              ▼                       ▼
       +----------------+------------------+   +----------------+------------------+
       | - ConversationController          |   | - GroupController                 |
       | - ConversationMessageController   |   | - GroupMessageController          |
       |                                   |   | - GroupRecipientController        |
       +----------------+------------------+   +----------------+------------------+
                        |---------------------------------------|
                                             |
                                    TypeORM (Repository)
                                             |
                                      +----------------+
                                      | PostgreSQL DB  |
                                      +----------------+

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

## 📡 WebSocket Gateway – Real-Time Messaging (Conversation & Group)

This WebSocket gateway handles real-time communication for two main features:

1-on-1 conversations

Group chats

It broadcasts relevant events to connected clients who have joined specific "rooms" based on conversation or group IDs.

✅ Features

👤 Conversation (1-on-1 Messaging)

Emitted events:

**onConversationCreate** : when a conversation is created

**onConversationUpdate** : when a conversation is updated

**onConversationDelete** : when a conversation is deleted

**onConversationMessageCreate** : when a new message is sent

**onConversationMessageEdit** : when a message is edited

**onConversationMessageDelete** : when a message is deleted

👥 Group Messaging
Room name: group-${groupId}

Emitted events:

**onGroupCreate** : when a new group is created

**onGroupUpdate** : when group information is updated

**onGroupOwnerUpdate** : when the group owner changes

**onGroupMemberAdd** : when a member is added

**onGroupMemberRemove** : when a member is removed

**onGroupMessageCreate** : when a new group message is sent

**onGroupMessageEdit** : when a group message is edited

**onGroupMessageDelete** : when a group message is deleted

📲 Joining Rooms
To receive real-time updates, the client must join the appropriate room after authenticating via socket:

```bash

  socket.emit("onGroupJoin", {id: "groupId"})

```

To leave:

```bash

  socket.emit("onGroupLeave", {id: "groupId"})

```

🧠 Notes
All rooms are dynamically named by prefixing either conversation- or group- with their corresponding IDs.

Only clients who join a room will receive that room’s updates.

JWT authentication is expected during WebSocket connection handshake.

---

## 🧱 Database Schema Overview

![](./neondb.png)

## 🧱 Project Structure

```bash

src/
│   app.module.ts
│   main.ts
│
├───auth
│   │   auth.controller.ts
│   │   auth.module.ts
│   │   auth.service.ts
│   │
│   └───dtos
│           index.dto.ts
│           user-login.dto.ts
│           user-register.dto.ts
│
├───conversation
│   │   conversation.module.ts
│   │
│   ├───controllers
│   │       conversation-message.controller.ts
│   │       conversation.controller.ts
│   │
│   ├───dtos
│   │       conversation-create.dto.ts
│   │       conversation-message-edit.dto.ts
│   │       conversation-message.create.ts
│   │       index.ts
│   │
│   ├───middlewares
│   │       conversation.middleware.ts
│   │
│   └───services
│           conversation-mesage.service.ts
│           conversation.service.ts
│
├───custom-jwt
│       custom-jwt.module.ts
│       custom-jwt.service.ts
│
├───database
│       database.module.ts
│
├───events
│   │   events.module.ts
│   │
│   ├───conversations
│   │       conversation-message.event.ts
│   │       conversation.event.ts
│   │
│   └───groups
│           group-message.event.ts
│           group-recipient.event.ts
│           group.event.ts
│
├───gateway
│       gateway.adapter.ts
│       gateway.module.ts
│       gateway.session.ts
│       gateway.ts
│
├───group
│   │   group.module.ts
│   │
│   ├───controllers
│   │       group-message.controller.ts
│   │       group-recipient.controller.ts
│   │       group.controller.ts
│   │
│   ├───dtos
│   │       group-add-user.dto.ts
│   │       group-create.dto.ts
│   │       group-edit.dto.ts
│   │       group-message-create.dto.ts
│   │       group-message-edit.dto.ts
│   │       group-recipient.add.dto.ts
│   │       group-recipient.remove.dto.ts
│   │       index.ts
│   │
│   ├───middlewares
│   │       group.middleware.ts
│   │
│   └───services
│           group-message.service.ts
│           group-recipients.service.ts
│           group.service.ts
│
├───user
│   │   user.controller.ts
│   │   user.module.ts
│   │   user.service.ts
│   │
│   └───dtos
│           index.ts
│           user-response.dto.ts
│
└───utils
    ├───constants
    │       index.ts
    │       routes.constant.ts
    │       server-event.constant.ts
    │       services.constant.ts
    │
    ├───decorators
    │       auth-user.decorator.ts
    │       index.ts
    │
    ├───guards
    │       AuthJwtGuard.ts
    │       index.ts
    │
    ├───helpers
    │       index.ts
    │       password.helper.ts
    │
    ├───interfaces
    │       auth.interface.ts
    │       conversation-message.interface.ts
    │       conversation.interface.ts
    │       custom-jwt.interface.ts
    │       gateway.interface.ts
    │       group-message.interface.ts
    │       group-recipients.interface.ts
    │       group.interface.ts
    │       index.ts
    │       user.interface.ts
    │
    ├───middlewares
    │       auth.middeware.ts
    │       index.ts
    │
    ├───typeorm
    │   │   index.ts
    │   │
    │   └───entities
    │           base-message.entity.ts
    │           conversation-message.entity.ts
    │           conversation.entity.ts
    │           group-message.entity.ts
    │           group.entity.ts
    │           index.ts
    │           user.entity.ts
    │
    └───types
            auth.type.ts
            conversation-message.type.ts
            conversation.type.ts
            custom-jwt.type.ts
            group-message.type.ts
            group-recipients.type.ts
            group.type.ts
            index.ts
            message.type.ts
            user.type.ts

```

---

## ✅ Optional Additions You Could Include

🔒 Authentication Overview

This app uses JWT (via @nestjs/jwt) for secure authentication. On successful login, a JWT token is returned. Protected routes and WebSocket connections require this token.

Example WebSocket auth flow:

Connect to WebSocket with JWT as a query parameter:
ws://localhost:3000

## Bonus: Deployment

    The application is deployed on Render and can be accessed via:

👉 [https://test-chat-nestjs.onrender.com/api](https://test-chat-nestjs.onrender.com/api)

## 📤 Future Enhancements

Verify otp

Request, Request Friend

Add file/image messaging support

Support for typing indicators, online status

Push notification integration

Call video, cal audio 1-1, 1-n

Admin/moderation tools

Redis support for scaling WebSocket servers
