# Personal Book Library Manager

A Node.js web application built with Express, MongoDB, Mongoose, Passport.js, and EJS that allows users to manage their personal book collections. Users can register, login, add, update, and delete books, and track their reading status.

---

## Features

- User registration and authentication with username/password using Passport.js and bcrypt.
- Persistent user and book data stored in MongoDB.
- Book management including title, author, genre, reading status (`read`, `reading`, `planned`), and thumbnail image URLs.
- User-specific book collections.
- Secure session management with express-session and flash messages.
- Responsive UI using Bootstrap and EJS templates.
- Route protection ensuring only authenticated users can access their book collections.

---

## Technologies Used

- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** Passport.js with Local Strategy
- **Templating Engine:** EJS
- **Frontend:** Bootstrap 5
- **Session & Flash Messages:** express-session, connect-flash
- **Password Security:** bcryptjs
- **Environment Management:** dotenv

---

## Installation & Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/personal-book-library-manager.git
   cd personal-book-library-manager