# Notes App (Fullstack) 

A Fullstack Notes / Todo style application built with **HTML, CSS, JavaScript** on the frontend and **Node.js + Express + MongoDB (Mongoose)** on the backend.

This project supports full **CRUD operations**:
- ✅ Create a note
- ✅ Read all notes
- ✅ Update a note
- ✅ Delete a note

---

## 🚀 Features

- Add new notes (Title + Content)
- View all saved notes from MongoDB
- Edit/Update notes
- Delete notes
- Notes stored permanently in MongoDB database

---

## 🛠 Tech Stack

### Frontend
- HTML
- CSS
- JavaScript (Vanilla JS)

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- dotenv
- cors

---

## 📂 Project Structure
Notes-App-fullstack/
│
├── frontend/
│ ├── index.html
│ ├── style.css
│ └── script.js
│
├── backend/
│ ├── server.js
│ ├── package.json
│ ├── .env
│ └── src/
│ ├── config/
│ ├── controllers/
│ ├── models/
│ └── routes/


---

## ✅ API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes` | Get all notes |
| POST | `/api/notes` | Create a new note |
| PUT | `/api/notes/:id` | Update a note |
| DELETE | `/api/notes/:id` | Delete a note |

---



