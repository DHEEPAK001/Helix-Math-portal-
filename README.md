# 📚 Math Learning Management System (Math LMS)

A modern, AI-powered Learning Management System (LMS) designed to simplify mathematics education through interactive learning modules, automated assessments, intelligent tutoring, and real-time performance analytics.

Built with **React**, **Spring Boot**, **MySQL**, and **Docker**, Math LMS provides a secure and scalable platform for students, teachers, and administrators.

---

## 🚀 Overview

Math LMS is a full-stack web application that digitizes mathematics education by offering role-based learning environments, automated quiz evaluation, AI-assisted problem solving, and comprehensive progress tracking.

The platform is designed to improve the learning experience for students while reducing administrative effort for educators through automation and intelligent features.

---

## ✨ Features

### 🔐 Authentication & Security

- JWT-based Authentication
- Role-Based Authorization (RBAC)
- Secure Password Encryption (BCrypt)
- Protected REST APIs
- Session Management using Spring Security

---

### 👨‍🎓 Student Features

- Personalized Dashboard
- Interactive Learning Modules
- Attempt Online Quizzes
- Instant Quiz Evaluation
- View Performance History
- AI Math Assistant
- Track Learning Progress
- Update Profile

---

### 👨‍🏫 Teacher Features

- Teacher Dashboard
- Create Learning Modules
- Manage Courses
- Create & Publish Quizzes
- Manage Questions
- View Student Performance
- Assessment Analytics

---

### 👨‍💼 Administrator Features

- User Management
- Teacher & Student Administration
- Platform Monitoring
- Dashboard Analytics
- System Management

---

### 🤖 AI Integration

- AI-powered Math Tutor
- Mathematical Problem Solving
- Step-by-Step Explanations
- Concept Clarification
- Interactive Learning Support

---

## 🏗️ System Architecture

```
                   Users
                      │
        React + Vite Frontend
                      │
                 Axios REST APIs
                      │
          Spring Boot REST Backend
                      │
 Controller → Service → Repository
                      │
         Spring Data JPA (Hibernate)
                      │
                 MySQL Database
                      │
             Docker Compose Stack
```

---

## 🛠️ Technology Stack

### Frontend

- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Zustand

### Backend

- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- Spring Validation
- Spring Mail
- JWT Authentication
- MapStruct
- Lombok

### Database

- MySQL 8

### DevOps

- Docker
- Docker Compose
- Nginx

### Documentation

- Swagger (SpringDoc OpenAPI)

---

## 📂 Project Structure

```
Math-LMS/
│
├── backend/
│   ├── config/
│   ├── controller/
│   ├── dto/
│   ├── entity/
│   ├── exception/
│   ├── repository/
│   ├── security/
│   ├── service/
│   ├── util/
│   └── resources/
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   └── utils/
│   │
│   └── public/
│
├── docker-compose.yml
├── README.md
└── pom.xml
```

---

## 👥 User Roles

| Role | Responsibilities |
|------|------------------|
| Administrator | Manage users, monitor system, analytics |
| Teacher | Create courses, quizzes, monitor students |
| Student | Learn, attempt quizzes, AI assistance |

---

## 📖 Modules

- Authentication
- User Management
- Learning Module
- Quiz Management
- Assessment Evaluation
- AI Chatbot
- Student Dashboard
- Teacher Dashboard
- Admin Dashboard
- Performance Analytics

---

## 🔄 Application Workflow

1. User Registration/Login
2. JWT Authentication
3. Role Verification
4. Dashboard Access
5. Learning Module Access
6. Quiz Participation
7. Automatic Evaluation
8. Performance Tracking
9. AI Learning Assistance

---

## 🔒 Security

The application follows industry-standard security practices.

- JWT Authentication
- Spring Security
- BCrypt Password Encryption
- Role-Based Access Control
- Secure REST APIs
- Input Validation
- Exception Handling

---

## 📊 Database

Main Entities

- User
- Role
- StudentProfile
- Teacher
- LearningModule
- Assessment
- Quiz
- Question
- QuizResult

---

## 🐳 Running with Docker

Clone the repository

```bash
git clone https://github.com/your-username/math-lms.git
```

Navigate to the project

```bash
cd math-lms
```

Start the application

```bash
docker-compose up -d
```

Stop the application

```bash
docker-compose down
```

---

## 💻 Local Development

### Backend

```bash
cd backend

mvn clean install

mvn spring-boot:run
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## 📡 REST API

The backend exposes REST APIs for:

- Authentication
- User Management
- Learning Modules
- Quiz Management
- AI Services
- Student Operations
- Teacher Operations
- Administrator Operations

API Documentation is available through **Swagger UI** after running the backend.

---

## 📈 Future Enhancements

- 📹 Live Classes
- 📱 Mobile Application
- 🎯 Personalized Learning Paths
- 🏆 Gamification
- 📜 Certificate Generation
- 📚 Assignment Submission
- 💬 Discussion Forums
- 🔔 Push Notifications
- 🌍 Multi-language Support
- 📊 AI Performance Prediction

---

## 🎯 Learning Outcomes

This project demonstrates practical implementation of:

- Full Stack Web Development
- Spring Boot REST APIs
- React Application Development
- JWT Authentication
- Role-Based Authorization
- Database Design
- Docker Containerization
- AI Integration
- Software Architecture
- RESTful API Design

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push to GitHub

```bash
git push origin feature/new-feature
```

5. Create a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Karthi Keyan**

B.Tech – Artificial Intelligence and Data Science

---

## ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub!

It helps others discover the project and motivates future development.
