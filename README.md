# 🔐 User Authentication System (Backend)

A secure backend authentication system built using Node.js and Express. It includes user registration with email verification, login functionality, and a complete forgot password system using OTP.

## 🚀 Features

- User Registration with Email Verification  
- Secure Login System  
- Forgot Password with OTP (Email आधारित)  
- Reset Password Functionality  
- Password Hashing using bcrypt  
- Protected Routes for authenticated users  

## 🔄 Authentication Flow

### 1. User Registration
- User registers using email and password  
- Verification email is sent to the registered email  

### 2. Email Verification
- User verifies their email  
- Only verified users can log in  

### 3. Login
- User logs in using email and password  
- Access is granted only if email is verified  

### 4. Forgot Password
- User requests password reset  
- OTP is sent to the registered email  

### 5. Reset Password
- User verifies OTP  
- User sets a new password  
  
## 🛠️ Tech Stack

- Node.js  
- Express.js  
- MongoDB   
- bcrypt  
- Nodemailer  

## 🔐 Security Features

- Password hashing using bcrypt  
- Email verification before login  
- OTP-based password reset  
- Protected API routes  
