# GearUp Backend Assignment

**Student ID:** L2B7-0284
**Project:** GearUp

## 🔗 Links
- Live API: https://gear-up-assignment.vercel.app
- Local API: http://localhost:5001
- GitHub Repo: https://github.com/Iam-Zarif/gearUp-assignment
- ERD: https://drawsql.app/teams/webefo/diagrams/gearup/embed
- Folder Structure: https://github.com/Iam-Zarif/gearUp-assignment/blob/main/folder_structure.md
- Postman Collection: https://github.com/Iam-Zarif/gearUp-assignment/tree/main/postman
- API Walkthrough: https://drive.google.com/file/d/1fUVNBNrIILGMPHD1qxDS7fR03mop30ip/view?usp=sharing

## 🛠️ Admin Credentials
- Email: admin@gearup.com
- Password: admin123

## 🚀 Development Approach
1. Designed the ERD manually.
2. Installed and configured required technologies.
3. Set up Prisma, Stripe, environment variables, and server configuration.
4. Planned folder structure before implementation.
5. Built and tested modules service-by-service using Postman.
6. Committed progress with logical versioned commits.

## 🧱 Database Note
Main tables used:
- Users
- GearItems
- Categories
- RentalOrders
- Payments
- Reviews

Added an extra bridge table:
- RentalOrderItems

Reason: one rental order may contain multiple gear items, and one gear item may be rented across multiple orders. This follows module guidelines by avoiding a direct many-to-many relation.

## 📚 API Documentation
Postman collections are organized per feature inside the `postman/` folder.

### Dynamic request variables
- `AdminToken` — Admin JWT token
- `ProviderToken` — Provider JWT token
- `CustomerToken` — Customer JWT token
- `userId` — User id for admin actions
- `categoryId` — Category id for category update/delete
- `gearItemId` — Gear item id for gear, rental, and review APIs
- `rentalOrderId` — Rental order id for payment, provider order, and review APIs
- `paymentId` — Payment id for payment details
- `reviewId` — Review id for review details/update/delete
- `sessionId` — Stripe checkout session id for payment confirmation

## 📁 Notes
- The project is built with a modular structure for admin, provider, and customer flows.
- Environment variables are used for secure API and Stripe integration.
