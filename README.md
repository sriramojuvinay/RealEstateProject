🏠 Real Estate Web Application

A full-stack Real Estate platform built using React, .NET Core Web API, and SQL Server.
The application allows users to browse properties, make bookings, manage rentals, and communicate with property owners in real-time.

🚀 Features
🏡 Property Management
Add, edit, and delete properties (Admin)
Multiple image upload with Cloudinary
Auto image update (add/remove images)
📅 Booking System
Users can book available properties
Prevents duplicate or invalid bookings
Booking validation based on rental status
📄 Rental Management
Rental agreement lifecycle using IsActive
Active rentals hide properties from listing
Ending rental makes property available again
💰 Payment Tracking
Monthly rent generation
Mark rent as paid
Prevent payment after rental ends
💬 Real-Time Chat
Chat between user and property owner
Implemented using SignalR
🔐 Authentication & Authorization
JWT-based authentication
Role-based access (Admin / User)
🛠️ Tech Stack
Frontend
React.js
Axios
React Router
Backend
.NET Core Web API
Entity Framework Core
Database
SQL Server
Other Tools
SignalR (Real-time chat)
Cloudinary (Image upload)
JWT Authentication
🧠 Business Logic Highlights
Property visibility controlled using RentalAgreement.IsActive
Booking system prevents multiple users from booking the same property
Clean UI with only available properties (no clutter)
Image management supports add/remove during edit
