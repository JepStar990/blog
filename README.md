# Data Engineering Blog Platform

A professional blog website for a data engineer to showcase content about data engineering, AI/ML, and reporting with modern design and essential features.

![Screenshot of Application](https://images.unsplash.com/photo-1489875347897-49f64b51c1f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80)

## Features

- **Blog System** with categories and tags
- **Project Portfolio** showcase
- **Dark Mode** support
- **Responsive Design** for all devices
- **Search Functionality**
- **Contact Form**
- **Newsletter Subscription**

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL (optional, can use in-memory storage)
- **ORM**: Drizzle ORM
- **Testing**: Jest, Testing Library, Supertest

## Project Structure

```
├── client/                  # Frontend React application
├── server/                  # Backend Express application
│   └── storage/             # Storage implementation with interface pattern
├── shared/                  # Shared types and schemas
├── tests/                   # Test files
└── docs/                    # Documentation
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- PostgreSQL (optional)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and visit: `http://localhost:5000`

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Database (optional)
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
USE_DATABASE=true  # Set to false to use in-memory storage

# Email (optional, for contact form)
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
```

## Database Setup

The application can run with either:

1. **In-memory Storage**: No database required, perfect for development
2. **PostgreSQL Database**: For production use

To use PostgreSQL:
1. Set `DATABASE_URL` in your environment variables
2. Set `USE_DATABASE=true` in your environment variables
3. Run database migrations: `npm run db:push`

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Architecture

The application follows a loosely coupled architecture with clear separation of concerns:

- **Storage Interface**: Defines a common interface for data operations
- **Memory Storage**: Implements the interface using in-memory collections
- **Database Storage**: Implements the interface using PostgreSQL

This design allows for:
- Easy switching between storage implementations
- Simplified testing
- Better maintainability and scalability

## Documentation

For detailed documentation, see:
- [Project Documentation](docs/project-documentation.md)
- [API Documentation](docs/api-documentation.md)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [React](https://reactjs.org/) - UI library
- [Express](https://expressjs.com/) - Web framework for Node.js
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM