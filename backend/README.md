# 📖 We‑Write API Guide

A quick reference to run the project and interact with the backend endpoints.

---

## 🚀 Running the Project

From your project root (or respective folder), use one of the following commands:

```bash
# Frontend (Vite or CRA dev server)
npm run dev

# Backend (auto‑reload via nodemon)
nodemon index.js
```

---

## 📡 API Endpoints

| Method | URL                                                     | Description                                      |
| :----: | :------------------------------------------------------ | :----------------------------------------------- |
| POST   | `/api/register`                                         | Register a new user                              |
| POST   | `/api/login`                                            | Authenticate user & return JWT                   |
| PUT    | `/api/updatepwd`                                        | Update user password                             |
| GET    | `/api/viewStory/:id`                                    | Retrieve a single story by ID                    |
| POST   | `/api/create`                                           | Create a new story                               |
| GET    | `/api/search/title/:titlePattern`                       | Search stories by title (currently unused)       |
| GET    | `/api/stories?tags=tag1,tag2`                          | Filter stories by tags (empty → all stories)     |
| PUT    | `/api/edit/:id`                                         | Edit an existing story                           |
| POST   | `/api/lockStory/:id`                                    | Lock a story for editing                         |
| POST   | `/api/unlockStory/:id`                                  | Unlock a story                                   |
| DELETE | `/api/viewStory/:id`                                    | Delete a story by ID                             |

---

## 📝 Request Collection

Below are sample **Request** and **Response** payloads. Replace IDs and tokens as needed.

---

### 1. Register New User

<details>
<summary>Show Request & Response</summary>

```http
POST /api/register HTTP/1.1
Content-Type: application/json

{
  "name": "TestUser",
  "email": "test@gmail.com",
  "password": "password"
}
```

```json
{
  "msg": "User registered successfully!",
  "user": {
    "id": "67ee9ccc84a1f8236bf3c98b",
    "name": "TestUser",
    "email": "test@gmail.com"
  }
}
```

</details>

### 2. Login

<details>
<summary>Show Request & Response</summary>

```http
POST /api/login HTTP/1.1
Content-Type: application/json

{
  "email": "test@gmail.com",
  "password": "password"
}
```

```json
{
  "msg": "Login successful!",
  "token": "<JWT_TOKEN_HERE>",
  "user": {
    "id": "67eaaff8ffe51028aed23ef1",
    "name": "TestUser",
    "email": "test@gmail.com"
  }
}
```

</details>

> **Note:** Include the `token` from login in `Authorization: Bearer <token>` for protected routes.

### 3. Update Password

<details>
<summary>Show Request & Response</summary>

```http
PUT /api/updatepwd HTTP/1.1
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "TestUser",
  "email": "test@gmail.com",
  "oldPassword": "123",
  "newPassword": "1234"
}
```

```json
{ "msg": "Password updated successfully!" }
```

</details>

### 4. View a Story

<details>
<summary>Show Response</summary>

```http
GET /api/viewStory/67f2fcdbf808f886ebe9c025 HTTP/1.1
Authorization: Bearer <token>
```

```json
{
  "message": "Story retrieved successfully",
  "story": { ... },
  "log":   { ... }
}
```

</details>

### 5. Create Story

<details>
<summary>Show Request & Response</summary>

```http
POST /api/create HTTP/1.1
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Echoes of the Timekeeper",
  "tags": ["science fiction","time travel","mystery"],
  "authorId": "60c72b2f5f1b2c6d88f8e8b7",
  "snapshots": [{
    "heading": "The Broken Watch",
    "content": "When Leo found the antique pocket watch...",
    "imageName": "watch.jpg"
  }]
}
```

```json
{
  "msg": "Story created successfully!",
  "story": { ... },
  "log":   { ... }
}
```

</details>

### 6. Filter Stories by Tags

```
GET /api/stories?tags=thriller HTTP/1.1
Authorization: Bearer <token>
```

Returns an array of stories matching the specified tags; empty `tags` returns all.

### 7. Get All Stories

```
GET /api/stories HTTP/1.1
Authorization: Bearer <token>
```

Returns all stories in the database.

### 8. Lock a Story

```
POST /api/lockStory/:id HTTP/1.1
Authorization: Bearer <token>
```

```json
{ "message": "Story locked successfully", "story": { ... } }
```

### 9. Edit Story

<details>
<summary>Show Request & Response</summary>

```http
PUT /api/edit/:id HTTP/1.1
Content-Type: application/json
Authorization: Bearer <token>

{ /* updated story payload */ }
```

```json
{ "message": "Story updated successfully and log entered", "story": { ... }, "log": { ... } }
```

</details>

---

*End of API Guide*

