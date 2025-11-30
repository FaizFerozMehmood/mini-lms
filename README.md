📚 Mini LMS – Single Page Application

Internship Project: 3rd Week Task as a Frontend Developer at DevBazm 

A lightweight and fully dynamic Learning Management System built with Vanilla JavaScript using hash-based SPA routing.
Deployed on Vercel, this LMS includes Courses, Lessons, Quizzes, Progress Tracking, and a Dashboard — all on a single page.

🌍 Live Demo

🔗 mini-lms-ten.vercel.app

✨ Features
🔹 SPA Architecture

No page reloads

Routing handled using window.location.hash

🔹 Dynamic Courses Page

Fetches data from courses.json

Displays course title, description, level, and category

🔹 Course Detail Page

Full course description

Lessons list

Dynamic progress bar (0%–100%)

🔹 Lessons Page

YouTube video for each lesson

Checkboxes to mark lessons as complete

Saves lesson progress using localStorage

🔹 Quizzes System

Each lesson contains a quiz

Minimum 5 questions

Shows score, percentage & result

Stores last quiz score in localStorage

🔹 Dashboard

Shows progress for all enrolled courses

Displays last quiz score

Clean and simple progress overview

🔹 Modern UI

Built with Bootstrap 5

Clean, responsive layout

Smooth card-based design

🛠️ Technologies Used

HTML

CSS

JavaScript (Vanilla)

Bootstrap 5

localStorage

JSON Data Fetch

Vercel Deployment

🚀 How to Run Locally

1️⃣ Clone the Project

git clone https://github.com/FaizFerozMehmood/mini-lms.git

2️⃣ Navigate to the folder

cd mini-lms

3️⃣ Start a Local Server

Use VS Code Live Server or any static local server.


📁 Folder Structure
mini-lms/
│
├── assets/
│   ├── images/
│   └── style.css
│
├── data/
│   ├── courses.json
│   └── dataHandler.js
│
├── app.js
├── index.html
└── README.md

👤 Author

Faaiz Mahmood


GitHub: https://github.com/FaizFerozMehmood