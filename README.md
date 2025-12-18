# 📸 Shutter Sphere - Photography Marketplace Platform

<div align="center">

**Connect clients with photographers. Book extraordinary moments.**

[Live Demo](https://NA) • [Project Walkthrough](https://youtu.be/esvS8qtjuo0?si=UXFz2Q01aiMg2BRw) • [API Docs](https://NA) • [GitHub Repo](https://github.com/ArjunDivraniya/shutter_sphere.git)

![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)
![Tech Stack](https://img.shields.io/badge/Stack-MERN-61DAFB?style=flat-square)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [API Documentation](#-api-documentation)
- [Installation & Setup](#-installation--setup)
- [Folder Structure](#-folder-structure)
- [Environment Variables](#-environment-variables)
- [How to Use](#-how-to-use)
- [Future Enhancements](#-future-enhancements)
- [Interview Talking Points](#-interview-talking-points)
- [Project Description for Resume](#-project-description-for-resume)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**Shutter Sphere** is a full-stack web application that bridges the gap between photography clients and professional photographers. The platform enables users to:
- Discover photographers based on location and specialization
- Create and manage detailed professional profiles
- Browse portfolios and past work
- Book photography services
- Leave and read reviews
- Manage bookings and payments

**Target Users:** Photography clients, professional photographers, event organizers, and photography enthusiasts.

**Project Type:** Full Stack (MERN Stack - MongoDB, Express, React, Node.js)

---

## 🌍 Problem Statement

**Challenge:** Photography clients struggle to find qualified photographers in their area, and photographers lack a centralized platform to showcase their work and connect with clients.

**Solution:** Shutter Sphere provides a unified marketplace where:
- Clients can search and filter photographers by location, specialization, and experience
- Photographers can build professional profiles with portfolios and reviews
- Both parties can manage transactions and communications efficiently
- Trust is built through a rating and review system

---

## ✨ Features

### Core Features

| Feature | Description |
|---------|-------------|
| 🔍 **Smart Search** | Find photographers by location, specialization, and filters |
| 👤 **Profile Management** | Create and customize photographer/client profiles |
| 🎨 **Portfolio Showcase** | Upload and display high-quality photography work |
| 📅 **Booking System** | Schedule and manage photography appointments |
| ⭐ **Review System** | Rate and review photographers and clients |
| 💬 **Social Links** | Connect via Instagram, website, and other platforms |
| 🌐 **Multi-Language Support** | English, Spanish, Hindi, Gujarati, Arabic |
| 📱 **Responsive Design** | Optimized for mobile, tablet, and desktop |
| 🔐 **Secure Authentication** | JWT-based authentication and authorization |

### User Roles

| Role | Capabilities |
|------|-------------|
| **Client** | Search photographers, book services, leave reviews, manage bookings |
| **Photographer** | Create profile, upload portfolio, manage bookings, respond to reviews |
| **Admin** | Manage users, moderate content, resolve disputes (future enhancement) |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React.js** | UI library for dynamic components |
| **Vite** | Fast build tool and dev server |
| **Tailwind CSS** | Utility-first CSS framework |
| **i18n** | Multi-language support |
| **Axios** | HTTP client for API calls |
| **FontAwesome** | Icon library |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** | JavaScript runtime |
| **Express.js** | Web framework for APIs |
| **MongoDB** | NoSQL database |
| **JWT** | Secure authentication |
| **Cloudinary** | Image upload & storage |
| **Multer** | File upload middleware |

### Tools & Services
- **Postman** - API testing
- **Git** - Version control
- **Firebase** - Database rules and deployment

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (React)                     │
├─────────────────────────────────────────────────────────────┤
│  Landing Page │ Search │ Profiles │ Bookings │ Reviews      │
└────────────────────────┬────────────────────────────────────┘
                         │ (REST API Calls)
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY (Express)                     │
├─────────────────────────────────────────────────────────────┤
│  Routes │ Middleware │ Authentication │ Error Handling      │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ↓                ↓                ↓
    ┌───────────┐   ┌─────────────┐   ┌──────────────┐
    │ Handlers  │   │  Middleware │   │  Utils       │
    │ (Logic)   │   │  (Auth/Upload)  │  (Cloudinary)│
    └────┬──────┘   └──────┬──────┘   └──────┬───────┘
         │                 │                 │
    ┌────────────────────────────────────────┴───┐
    ↓                                             ↓
┌─────────────────────────────────────────────────────┐
│              DATA LAYER (MongoDB)                   │
├─────────────────────────────────────────────────────┤
│  Users │ Photographers │ Events │ Bookings │ Reviews│
└─────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Registration/Login** → JWT Token issued → Stored in localStorage
2. **Photographer Search** → Filter by location/specialization → Display results
3. **Profile Creation** → Upload images to Cloudinary → Store metadata in MongoDB
4. **Booking** → Create booking record → Send notification → Update status
5. **Review** → Submit rating & comment → Update photographer profile

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All protected endpoints require JWT token in header:
```
Authorization: Bearer <your_jwt_token>
```

### Key Endpoints

#### 👤 User Endpoints
```
POST   /signup              - Register new user
POST   /login               - User login
GET    /user/:id            - Get user profile
PUT    /user/:id            - Update user profile
DELETE /user/:id            - Delete user account
```

#### 📸 Photographer Endpoints
```
GET    /photographers       - Get all photographers (with filters)
GET    /photographers/:id   - Get photographer details
POST   /photographers       - Create photographer profile
PUT    /photographers/:id   - Update photographer profile
GET    /photographers/:id/portfolio - Get photographer's portfolio
```

#### 📅 Event/Booking Endpoints
```
POST   /events              - Create event/booking
GET    /events              - Get user's events
GET    /events/:id          - Get event details
PUT    /events/:id          - Update event
DELETE /events/:id          - Cancel event
```

#### ⭐ Review Endpoints
```
POST   /reviews             - Create review
GET    /reviews/:photographerId - Get photographer reviews
PUT    /reviews/:id         - Update review
DELETE /reviews/:id         - Delete review
```

**Full API documentation:** [Postman Docs](https://NA)

---

## 🚀 Installation & Setup

### Prerequisites

Before you begin, ensure you have the following installed:

```
Node.js (v14.x or higher)
MongoDB (v4.x or higher)
npm or yarn
Git
Cloudinary account (for image uploads)
```

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/shutter-sphere.git
cd shutter-sphere
```

### Step 2: Setup Backend

```bash
cd Backend
npm install
```

### Step 3: Setup Frontend

```bash
cd Frontend/Shutter_sphere
npm install
```

### Step 4: Configure Environment Variables

Create `.env` file in `Backend/` directory (see [Environment Variables](#-environment-variables) section)

### Step 5: Start MongoDB

```bash
# If MongoDB is installed locally
mongod
```

### Step 6: Run Backend Server

```bash
cd Backend
npm start
# Server runs on http://localhost:5000
```

### Step 7: Run Frontend Development Server

```bash
cd Frontend/Shutter_sphere
npm run dev
# Frontend runs on http://localhost:5173
```

### Step 8: Access the Application

Open your browser and navigate to: **`http://localhost:5173`**

---

## 📁 Folder Structure

```
shutter_sphere/
│
├── Backend/                           # Node.js/Express server
│   ├── config/
│   │   └── db.js                     # MongoDB connection setup
│   ├── Handlers/                      # Request handlers (controllers)
│   │   ├── eventController.js         # Event/booking logic
│   │   ├── photographerController.js  # Photographer logic
│   │   ├── userController.js          # User logic
│   │   ├── ourreviewController.js     # Review logic
│   │   └── signupcontroller.js        # Authentication logic
│   ├── middleware/
│   │   ├── auth.js                   # JWT authentication middleware
│   │   └── upload.js                 # File upload handling
│   ├── Models/                        # Mongoose schemas
│   │   ├── UserModel.js              # User schema
│   │   ├── photographerModel.js      # Photographer schema
│   │   ├── eventsModel.js            # Event/booking schema
│   │   ├── ourreview.js              # Review schema
│   │   └── signupmodel.js            # Signup schema
│   ├── Paths/                         # API routes
│   │   ├── eventRoutes.js
│   │   ├── photographerRoutes.js
│   │   ├── userRoutes.js
│   │   ├── ourreview.js
│   │   └── signuproutes.js
│   ├── utils/
│   │   └── cloudinary.js             # Cloudinary image upload
│   ├── server.js                      # Express app setup & port config
│   └── package.json
│
├── Frontend/
│   └── Shutter_sphere/                # React + Vite application
│       ├── src/
│       │   ├── Components/            # Reusable React components
│       │   │   ├── navbar.jsx
│       │   │   ├── landingpage.jsx
│       │   │   ├── login.jsx
│       │   │   ├── searchform.jsx
│       │   │   ├── searchresult.jsx
│       │   │   ├── photographerprofile.jsx
│       │   │   ├── profile.jsx
│       │   │   ├── bookings.jsx
│       │   │   ├── ourreviewpage.jsx
│       │   │   ├── portfolio.jsx
│       │   │   ├── protectroute.jsx   # Protected route component
│       │   │   └── ... (other components)
│       │   ├── locales/               # Multi-language translations
│       │   │   ├── en.json
│       │   │   ├── es.json
│       │   │   ├── hi.json
│       │   │   ├── gu.json
│       │   │   └── ar.json
│       │   ├── utils/
│       │   │   └── authUtils.jsx      # Authentication utilities
│       │   ├── App.jsx
│       │   ├── main.jsx
│       │   ├── i18n.js                # i18n configuration
│       │   └── index.css
│       ├── public/                    # Static assets
│       ├── vite.config.js             # Vite configuration
│       ├── tailwind.config.cjs        # Tailwind CSS config
│       ├── package.json
│       └── index.html
│
├── database.rules.json                # Firebase database rules
├── firestore.rules                    # Firestore rules
└── README.md                          # This file

```

### Key Folder Explanations

- **Backend/Handlers**: Business logic for different features
- **Backend/Models**: Database schemas defining data structure
- **Backend/Paths**: API route definitions and endpoint organization
- **Frontend/Components**: Reusable UI components (buttons, cards, forms, etc.)
- **Frontend/locales**: Translation files for multi-language support

---

## 🔐 Environment Variables

### Backend `.env` file

Create a file named `.env` in the `Backend/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/shutter_sphere
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shutter_sphere

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRY=7d

# Cloudinary Configuration (Image Upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Service (if implemented)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Frontend Configuration

Environment variables are configured in frontend components/config files. Example in `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 💻 How to Use the Application

### For Clients

1. **Sign Up** → Create account with email
2. **Explore** → Search photographers by location and specialization
3. **View Profiles** → Check photographer portfolios and reviews
4. **Book** → Schedule photography session and make payment
5. **Review** → Rate and review photographer after service

### For Photographers

1. **Register** → Create photographer account with details
2. **Build Profile** → Add specialization, experience, portfolio
3. **Upload Portfolio** → Showcase past work using Cloudinary
4. **Manage Bookings** → Accept/decline bookings and manage schedule
5. **Build Reputation** → Collect positive reviews and ratings

### Key Features Walkthrough

#### 🔍 Searching for Photographers
- Use search bar with location filter
- Apply specialty filters (wedding, portrait, event, etc.)
- Sort by rating, experience, or price
- View photographer profiles with portfolio

#### 📝 Creating Your Profile
- Navigate to Profile section
- Upload profile picture (via Cloudinary)
- Add bio, specializations, and experience
- Link social media accounts
- Upload portfolio images

#### 📅 Booking a Photographer
- Browse photographer listings
- Click "Book Now"
- Select date and time
- Add event details
- Proceed to payment
- Receive confirmation

#### ⭐ Leaving Reviews
- Go to "My Bookings"
- Find completed booking
- Click "Leave Review"
- Rate (1-5 stars) and write feedback
- Submit review

---

## 🚀 Future Enhancements

| Enhancement | Description | Priority |
|------------|-------------|----------|
| 💳 **Payment Gateway Integration** | Stripe/PayPal integration for secure payments | High |
| 📧 **Email Notifications** | Booking confirmations and reminders | High |
| 🤖 **AI Recommendation Engine** | ML-based photographer recommendations | Medium |
| 📊 **Analytics Dashboard** | Admin panel with statistics and insights | Medium |
| 💬 **Real-time Chat** | Messaging between clients and photographers | Medium |
| 📱 **Mobile App** | React Native or Flutter mobile applications | Low |
| 🌐 **Advanced Filters** | More sophisticated search and filtering | Low |
| 🔔 **Push Notifications** | Browser/mobile push alerts | Low |
| 🗺️ **Map Integration** | Google Maps for location-based search | Low |

---

## 🎤 Interview Talking Points

### 1. **Architecture & Design Decisions**
- **Question:** "Tell me about your system architecture."
- **Answer:** "I built a three-tier MERN architecture with clear separation of concerns. The frontend handles UI rendering, the backend manages business logic, and MongoDB stores data. I used JWT for stateless authentication, which scales well. I chose Cloudinary for image management to avoid storage overhead on the server."

### 2. **Authentication & Security**
- **Question:** "How did you secure user data?"
- **Answer:** "I implemented JWT-based authentication with secure token storage. Passwords are handled by authentication logic, and I used middleware to protect routes. I added CORS configuration to prevent unauthorized requests and used environment variables for sensitive keys."

### 3. **Database Design**
- **Question:** "How did you structure your database?"
- **Answer:** "I created separate MongoDB collections for Users, Photographers, Events, and Reviews. Each collection has relationships (using references) that allow efficient queries. For example, a Photography document has a reference to the User collection and links to multiple Reviews."

### 4. **Search & Filter Functionality**
- **Question:** "How does the search feature work?"
- **Answer:** "I implemented MongoDB queries that filter photographers by location and specialization. The frontend sends filter parameters to the backend, which constructs a query using MongoDB's find() method with multiple conditions ($regex for text search, $in for array matching). Results are paginated for performance."

### 5. **Handling File Uploads**
- **Question:** "How did you handle image uploads?"
- **Answer:** "I used Multer middleware to handle file uploads on the backend, then uploaded files to Cloudinary. This approach reduces server storage overhead and provides CDN benefits for faster image delivery. I also added validation to accept only image files."

### 6. **Multi-language Support**
- **Question:** "How did you implement multi-language support?"
- **Answer:** "I used i18n library to manage language translations. I created separate JSON files for each language (English, Spanish, Hindi, Gujarati, Arabic). Users can switch languages, and the app dynamically updates the UI by loading the appropriate translation file."

### 7. **Scalability Considerations**
- **Question:** "How would you scale this application?"
- **Answer:** "To scale, I would implement caching (Redis), database indexing, API rate limiting, and load balancing. For large file uploads, I'd use CDNs more aggressively. I'd also separate concerns further with microservices, implement job queues for async operations, and use containerization (Docker) for deployment."

### 8. **Challenges Faced**
- **Question:** "What was the biggest challenge?"
- **Answer:** "Integrating real-time image uploads with Cloudinary while maintaining performance. I solved this by implementing async upload handlers and adding progress indicators for user feedback."

---

## 📄 Project Description for Resume

### Format 1: Bullet Points
- Developed a **full-stack MERN photography marketplace** connecting clients with photographers; implemented JWT authentication, MongoDB database with 5+ collections, and image management via Cloudinary
- Engineered **smart search functionality** with location and specialty filters using MongoDB queries; frontend integrated React hooks for dynamic filtering and results display
- Built **multi-language support** (5 languages) using i18n library and created responsive UI with Tailwind CSS; deployed backend on Node.js with Express framework handling 10+ API endpoints

### Format 2: Short Paragraph
"Shutter Sphere" is a full-stack MERN photography marketplace I built to connect clients with photographers based on location and specialization. I implemented JWT-based authentication for secure user management, designed MongoDB schemas for users, photographers, events, and reviews, and integrated Cloudinary for seamless image uploads. The platform features advanced search filters, multi-language support (English, Spanish, Hindi, Gujarati, Arabic), and responsive design. I handled both frontend development (React + Vite) and backend API design (Express + MongoDB), gaining experience in full-stack development, database design, and cloud integration.

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/shutter-sphere.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```

4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```

5. **Open a Pull Request**
   - Provide clear description of changes
   - Link any related issues
   - Ensure code passes linting and tests

### Coding Standards
- Follow ES6+ JavaScript conventions
- Use meaningful variable/function names
- Add comments for complex logic
- Write clean, DRY code
- Test features before submitting PR

---

## 📄 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

You are free to:
- Use this project for personal or commercial purposes
- Modify and distribute the code
- Use it in private or public projects

You must:
- Include a copy of the license
- Include the original copyright notice

---

## 👤 Author

**Created by:** [Your Name]  
**Email:** your.email@example.com  
**GitHub:** [@yourusername](https://github.com/yourusername)  
**LinkedIn:** [Your LinkedIn Profile](https://linkedin.com/in/yourprofile)  
**Portfolio:** [your-portfolio.com](https://your-portfolio.com)

---

## 🙏 Acknowledgments

- **React & Vite** communities for excellent documentation
- **MongoDB** for scalable database solutions
- **Cloudinary** for image management services
- **Tailwind CSS** for utility-first CSS framework
- All contributors and testers

---

<div align="center">

### ⭐ If you found this project helpful, please consider giving it a star! ⭐

**[Back to Top](#-shutter-sphere---photography-marketplace-platform)**

</div>
