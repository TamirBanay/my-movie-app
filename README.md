# Movie Explorer App

## Description

My Movie Explorer App is a small React project integrated with a Django backend that I developed for self-practice. It's a web application that allows users to explore a curated list of movies/series, view detailed information about each movie, search for specific films, and manage user profiles. The project focuses on enhancing my skills in React, Django, state management, routing, API creation, and consumption.

## Features

### Movie Listing

- The app displays a list of currently playing movies, fetched from TMDb's database.
- Users can navigate through multiple pages of movie listings.

### Movie Details

- Clicking on a movie/series card reveals detailed information about the selected movie and trailer.
- Information includes the movie title, release date, rating, poster, and a brief overview.

### User Management with Django

- Users can register, log in, view, and update their profile.
- Django's built-in user authentication and session management are used to securely handle user data.

### Responsive Design

- The app is designed to work seamlessly on web browser, tablet, and mobile devices.

## Getting Started

### Prerequisites

- Node.js and npm for the frontend.
- Python and pip for the backend.
- A virtual environment tool like `venv` for isolated Python execution.

### Installation

#### Frontend Setup:

1. Clone the repository: `git clone https://gitlab.com/banay9329/my-movie-app.git`
2. Change to the frontend project directory: `cd my-movie-app/frontend`
3. Install dependencies: `npm install`
4. Start the application: `npm start`

#### Backend Setup:
1. In the root of the project
2. Set up a virtual environment: `python -m venv venv`
3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - MacOS/Linux: `source venv/bin/activate` 
4. Navigate to the backend directory: `cd codes/backend/movies_app`
5. Install backend dependencies: `pip install -r requirements.txt`
6. Run migrations: `python manage.py migrate`
7. Start the Django server: `python manage.py runserver`

### Usage

1. Open a web browser and access the app at `http://localhost:3000`.
2. Browse and explore movies, view details, use the search feature to find specific films, and manage user profiles.

---

## Brief About Django Users

Django provides a powerful user authentication system that handles user accounts, groups, permissions, and cookie-based user sessions. Some of the main features and benefits include:

- **User Model**: Django comes with a built-in `User` model in `django.contrib.auth.models`. This model contains fields and methods essential for user authentication.
- **Password Handling**: Django securely handles passwords, ensuring they're hashed and salted, making it near-impossible to reverse-engineer the original password from the stored value.
- **Forms & Views**: Django includes built-in views and forms for common authentication tasks, such as logging in, logging out, and password reset.
- **Session Management**: Django's session framework lets you store and retrieve arbitrary data on a per-site-visitor basis.
- **Custom User Model**: While Django's built-in `User` model covers most use cases, you can extend it or replace it with a custom user model if needed.

This app utilizes Django's built-in user system to manage registration, log in, and profile management, ensuring a secure and robust user experience.

---
