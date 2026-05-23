The current project already contains the complete frontend built in React with TypeScript (.tsx files) generated from the Figma design. Do NOT recreate or redesign the UI. Instead, convert this project into a complete MERN stack application by adding the backend, database, and integration with the existing frontend.
1. Frontend (Already Existing)
The frontend is built with React + TypeScript (.tsx).
Keep the existing UI components, layouts, and styling unchanged.
Only modify the frontend where necessary to connect it with backend APIs.
Use Axios or Fetch API to communicate with the backend.
Implement proper state management (React hooks or Context API if needed).
2. Backend
Create a Node.js + Express.js backend server.
Use a modular folder structure for scalability.
Example structure:
Copy code

/project-root
  /client (existing React TypeScript frontend)
  /server
     /controllers
     /models
     /routes
     /middleware
     /config
     server.js
Implement RESTful API endpoints for all necessary operations used in the UI.
Follow best practices for clean architecture and separation of concerns.
3. Database
Use MongoDB with Mongoose.
Create appropriate schemas and models based on the data fields used in the frontend forms and UI components.
Ensure relationships between collections if necessary.
Example collections:
Users
Application data related to the system (based on the UI functionality)
4. Authentication
Implement user authentication system including:
User registration
Login
Logout
Use JWT (JSON Web Tokens) for authentication.
Hash passwords using bcrypt.
5. API Integration
Connect all frontend forms, buttons, and data views with the backend APIs.
Ensure CRUD functionality:
Create
Read
Update
Delete
6. Validation and Error Handling
Add input validation for both frontend and backend.
Implement proper error handling middleware in Express.
7. Security Best Practices
Use CORS configuration.
Protect routes that require authentication.
Sanitize user inputs.
8. Environment Configuration
Use .env file for sensitive configuration values such as:
MongoDB connection string
JWT secret
Server port
9. Project Setup Instructions
Provide clear instructions for running the project locally:
Installing dependencies
Running frontend and backend
Connecting to MongoDB
Example commands:
Copy code

npm install
npm run dev
10. Documentation
Also generate:
API documentation
Database schema explanation
System architecture overview
The final result should be a fully functional MERN stack application using the existing React TypeScript frontend, with a working backend, database integration, authentication, and complete CRUD operations.