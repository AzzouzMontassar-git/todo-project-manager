# Todo Project Manager

A full-stack project management application built with **Spring Boot (JDK 17)** for the backend and **Angular 16** for the frontend. This application allows **admins** to manage projects and tasks, and **students (students)** to track and complete their assigned tasks.  

## Features

### Admin Dashboard
- Add and delete projects.
- Add and delete tasks within projects.
- Track completion status of tasks and projects in real time.
- See which students have completed which tasks.

### Student Dashboard
- View projects assigned to them.
- See all tasks in their projects.
- Mark tasks as completed.
- Once all tasks in a project are completed, the project is automatically marked as done in the admin dashboard.

### User Management
- Spring Boot handles authentication and roles (`admin` or `élève (student)`).
- **To test admin features:** manually update a user’s role in the MySQL database from `eleve (student)` → `admin`.

## Technologies
- Backend: Spring Boot (Java 17)
- Frontend: Angular 16
- Database: MySQL
- Node.js: 20.x (for Angular)
- Package Manager: npm 10.x

## Setup & Run (all-in-one)
Clone the repository, install dependencies, and run both backend and frontend in sequence:

```bash
# Clone the repo
git clone https://github.com/AzzouzMontassar-git/todo-project-manager.git
cd todo-project-manager

# Run the backend (Spring Boot)
cd backend
./mvnw spring-boot:run

# Open a new terminal tab/window, then run the frontend (Angular)
cd ../frontend
npm install
ng serve

# Frontend available on http://localhost:4200
# Backend available on http://localhost:8080
