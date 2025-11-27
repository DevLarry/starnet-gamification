# Starnet Gamification Platform - Backend

A comprehensive gamification platform built with NestJS/Express that rewards users for completing tasks, maintaining daily streaks, and connecting their TON wallets.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v5.0 or higher)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd starnet-gamification

# Install dependencies
npm install

# setup the client
cd client && npm install
npm run build
cd ..

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run start:dev
```

### Environment Configuration

```env
# Database
DATABASE_URL=

CORS_ORIGIN=
JWT_SECRET=

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=

CORS_ORIGIN="*"

TON_API_URL=
```

## 📁 Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── controllers/
│   ├── services/
│   ├── strategies/
│   ├── guards/
│   └── dto/
├── users/               # User management
│   ├── schemas/
│   ├── services/
│   └── controllers/
├── tasks/               # Task management
│   ├── schemas/
│   ├── services/
│   └── controllers/
├── streaks/             # Streak system
│   ├── services/
│   └── controllers/
├── wallet/              # TON wallet integration
│   ├── services/
│   └── controllers/
├── common/              # Shared utilities
│   ├── filters/
│   ├── interceptors/
│   └── decorators/
└── main.ts              # Application entry point
```

## 🔑 API Endpoints
`API full documentation can be found at /doc of the app`

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | User registration | ❌ |
| POST | `/api/auth` | User login | ❌ |
| GET | `/api/auth/confirm-email` | Confirm email with OTP | ❌ |
| GET | `/api/auth/resend-confirmation-email` | Resend verification | ❌ |
| GET | `/api/auth/forgot-password` | Password reset initiation | ❌ |
| POST | `/api/auth/reset-password` | Password reset completion | ❌ |
| GET | `/api/auth/profile` | Get user profile | ✅ |
| GET | `/api/auth/logout` | User logout | ✅ |
| GET | `/api/auth/check-in` | Daily streak check-in | ✅ |

### Task Management

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/task/daily` | Get daily tasks | ✅ |
| POST | `/api/task` | Create new task | ✅ |
| GET | `/api/task` | Get all tasks | ✅ |
| GET | `/api/task/{id}` | Get task by ID | ✅ |
| PATCH | `/api/task/{id}` | Update task | ✅ |
| DELETE | `/api/task/{id}` | Delete task | ✅ |
| POST | `/api/task/{id}/complete` | Complete task | ✅ |

### Wallet Integration

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/wallet` | Connect TON wallet | ✅ |


## ⚡ Key Features

### Authentication System
- JWT-based authentication with refresh tokens
- Email verification with OTP
- Secure password reset flow

### Gamification Engine
- **Points System**: Dynamic points based on task difficulty
- **Daily Streaks**: Consecutive day tracking with bonuses
- **Achievements**: Badges and milestone system
- **Leaderboards**: Real-time user rankings

### Task Management
- Daily rotating tasks
- Task completion tracking
- Admin task management
- Points awarding system

### TON Wallet Integration
- TON Connect SDK integration
- Secure wallet connection flow
- Wallet address verification
- Blockchain transaction support

## 🔄 Data Flows

### User Registration
1. Client → `POST /api/auth/register`
2. Server validates & hashes password
3. Generate OTP and send email
4. User confirms email
5. Account activated & JWT issued
6. Login page -> Register

### Task Completion
1. Fetch tasks via `GET /api/task`
2. User completes task
3. Client → `POST /api/task/{id}/complete`
4. Server validates & awards points
5. Update user profile & leaderboards

### Daily Check-in
1. User → `GET /api/auth/check-in`
2. Verify 24-hour window
3. Increment streak counter
4. Apply bonus multipliers
5. Send progress notification
6. Dashboard -> Check in

### Wallet Connection
1. User → `POST /api/wallet`
2. Generate TON Connect deeplink/QR
3. Wallet signs connection request
4. Server verifies & links wallet
5. Award connection points
6. Dashboard -> User Profile -> Connect Wallet

## 🛡️ Security

### Authentication
- JWT tokens with short expiration
- Role-based access control
- Input validation with class-validator
- Rate limiting on auth endpoints

### Data Protection
- Password hashing with bcrypt (work factor 12)
- Sensitive data exclusion from responses
- MongoDB injection prevention
- XSS protection

## 📊 API Design

## 🚀 Performance

### Database Optimization
- Indexed fields (email, categories, dates)
- Aggregation pipelines
- Connection pooling
- Query optimization

## 🧪 Development

```bash
# Start development
npm run start:dev

# Build project
npm run build

# Run tests
npm test

# Run with watch mode
npm run start:debug
```

## 📝 API Documentation

Access Swagger documentation at: `http://localhost:4000/doc`

## 🔧 Configuration

### TON Connect Manifest
Create `public/tonconnect-manifest.json`:
```json
{
  "url": "https://your-app.com",
  "name": "Starnet Gamification",
  "iconUrl": "https://your-app.com/icon.png",
  "termsOfUseUrl": "https://your-app.com/terms",
  "privacyPolicyUrl": "https://your-app.com/privacy"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@starnet.com or join our Slack channel.

---

**Built with ❤️ using NestJS, MongoDB, and TON Connect**
