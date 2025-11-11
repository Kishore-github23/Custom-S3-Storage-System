# 🪣 Bucketra  
**"Your data, perfectly bucketed in the cloud."**

Bucketra is a self-hosted cloud storage platform inspired by **AWS S3**, designed to let users **upload, download, and manage files securely**.  
The system is being developed in structured phases — from MVP to production-ready — with scalability and modularity in mind.

---

## 🚀 Goal
To build a **secure, scalable cloud storage service** that mimics S3-like functionality — allowing users to create buckets, manage files, and define access policies effortlessly.

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | Angular |
| **Backend** | Java (Spring Boot) |
| **Database** | PostgreSQL |
| **Storage** | Local File System → MinIO (S3-compatible, in future) |
| **Security** | JWT Authentication + Access Control Lists (ACLs) |

---

## 🧩 Core Features

| Feature | Description |
|----------|--------------|
| 🪣 **Bucket Management** | Create, list, and delete storage buckets (like folders). |
| 📁 **File Upload/Download** | Upload and retrieve files securely via REST API or UI. |
| 🔒 **Authentication** | JWT-based user registration and login. |
| 📜 **Access Control** | Private/public bucket or object permissions (future). |
| 🔍 **File Metadata** | Store metadata like file size, type, and upload date. |
| 📊 **Dashboard (Planned)** | View total storage used, number of files, and usage analytics. |

---

## 🧭 Development Roadmap

### **Phase 1: MVP**
✅ User Authentication (Register/Login)  
✅ Bucket CRUD Operations  
✅ File Upload/Download (Single-Part)  
🔒 Basic Permissions (Private/Public) *(Planned)*  

---

### **Phase 2: Advanced Features**
🚧 Multipart Upload  
🚧 Presigned URLs  
🚧 Dashboard with Metrics  
🚧 File Search and Filtering  

---

### **Phase 3: Production-Ready**
🚀 MinIO Integration (S3-Compatible Storage)  
🚀 Storage Quotas  
🚀 Audit Logging  
🚀 File Compression & Deduplication  

---

## 📋 Table of Contents

1. [Project Structure](#project-structure)  
2. [Database Setup](#database-setup)  
3. [Backend Implementation (Spring Boot)](#backend-implementation-spring-boot)  
4. [Frontend Implementation (Angular)](#frontend-implementation-angular)  
5. [Testing & Running](#testing--running)  

---

## 📂 Project Structure

s3-storage-system/
├── backend/
│ ├── src/
│ │ ├── main/
│ │ │ ├── java/com/storage/s3/
│ │ │ │ ├── config/
│ │ │ │ ├── controller/
│ │ │ │ ├── dto/
│ │ │ │ ├── entity/
│ │ │ │ ├── repository/
│ │ │ │ ├── service/
│ │ │ │ ├── security/
│ │ │ │ ├── exception/
│ │ │ │ └── S3StorageApplication.java
│ │ │ └── resources/
│ │ │ ├── application.properties
│ │ │ └── application-dev.properties
│ │ └── test/
│ └── pom.xml
└── frontend/
├── src/
│ ├── app/
│ │ ├── core/
│ │ │ ├── services/
│ │ │ ├── guards/
│ │ │ └── interceptors/
│ │ ├── features/
│ │ │ ├── auth/
│ │ │ ├── buckets/
│ │ │ └── objects/
│ │ └── shared/
│ ├── assets/
│ └── environments/
└── package.json

⚙️ Backend Implementation (Spring Boot)

Modules:

AuthController → Handles registration and login.

BucketController → Manages bucket CRUD operations.

ObjectController → Handles file upload/download.

Key Layers:

Service Layer: Business logic for authentication, storage, and access control.

Repository Layer: JPA repositories for User, Bucket, and Object entities.

Security Layer: JWT token generation and validation.

Global Exception Handling: Centralized error responses with consistent formatting.

💻 Frontend Implementation (Angular)

Key Modules:

auth/ → Login, registration, and token management.

buckets/ → Create, list, and manage storage buckets.

objects/ → Upload and download files.

Core Features:

JWT interceptor integrated using Angular’s HttpInterceptorFn.

Modular service structure for scalability.

Reactive UI design with route guards for protected pages.

🧠 Learning Outcomes

Gained deep understanding of S3 architecture concepts.

Learned secure JWT integration between Angular and Spring Boot.

Designed modular monorepo architecture supporting cloud storage scalability.

Built a strong foundation for object storage systems with MinIO integration in future.

🧾 License

This project is for educational and portfolio demonstration purposes.
All rights reserved © 2025 Kishorekumar J

🌟 Vision

Bucketra is designed to evolve into a mini S3 cloud storage platform — open-source, modular, and self-hosted.

“From local storage to the cloud — one bucket at a time.”

💬 Connect With Me

LinkedIn - https://www.linkedin.com/in/iamkishore-dev/
