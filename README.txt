# MTG Card Manager
A Node.js API for managing Magic: The Gathering cards, collections, and decks. This project uses data from the Scryfall API to provide card information and allows users to create and manage their card collections.
Tech Stack

Backend: Node.js, Express.js, TypeScript
Database: PostgreSQL
ORM: Prisma
Authentication: JWT (JSON Web Tokens)
API Integration: Scryfall API

Upcoming: Authenticated API endpoints for User, Deck with updated schemas and relationships

Notes to self: 
Adding User model to prisma schema:


I started with just the Card model to match the Scryfall API data structure. This allows us to ingest card data and build our initial API endpoints. Now, let's extend the schema to add user authentication and card management features..."

# First: add User model to schema.prisma
# Second:
npx prisma migrate dev --name add_user_model

# After adding the Collection and Deck models
npx prisma migrate dev --name add_collections_and_decks



Running the server locally:

npm run build
npm run dev

http://localhost:3000/health

npm run ingest


Whenever I change schema.prisma , rerun npx prisma generate to update client (which is a code layer for code completion/safety layer)

npx prisma studio to open the localhost GUI editor

pgadmin4 application let's view postgress DB directly