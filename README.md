# Bootcamp Assignment: Concert Ticket System

A robust, enterprise-ready backend for managing concert reservations, built with Node.js, TypeScript, Express, and TypeORM (SQLite).

## 🚀 Key Features
- **Concert Management**: Paginated listing of concerts.
- **Ticket System**: Categorized tickets (VIP, Premium, etc.) with stock management.
- **Atomicity**: Transaction-based reservation and purchase flow.
- **Auto-Cleanup**: Background job to release expired reservations and restore stock.
- **Dockerized**: Multi-stage Docker build for production deployment.

---

## 📝 Assignment Questions

### 1. What is Indexing? (Simple Version)
Think of a database index like the **Table of Contents** or the **Index at the back of a book**.
- **Without an index**: If you want to find a specific word, you have to read every single page of the book from start to finish. In a database, this is called a "Full Table Scan" and it's very slow.
- **With an index**: You look up the word in the index, see the page number, and jump straight to it. This makes searching for data nearly instantaneous, even with millions of records.

### 2. Why is a Partial Index better for "Cleanup"?
A **Standard Index** keeps track of every single reservation ever made (Pending, Completed, Canceled). Over time, this index becomes huge, taking up disk space and slowing down the system.

A **Partial Index** (like our `idx_reservations_status`) only indexes rows where `status = 'PENDING'`. 
- **Efficiency**: Since our cleanup job only cares about expired "Pending" reservations, we don't waste time indexing "Completed" ones.
- **Speed**: The index stays tiny and extremely fast, regardless of how many millions of successful sales you have.

### 3. Handling the "Double-Selling" Problem
We solved the double-selling problem using **Database Transactions**. 
When a user tries to reserve a ticket, the system follows an "All-or-Nothing" approach:
1. It checks if stock is available.
2. It decrements the stock.
3. It creates the reservation record.

These steps happen inside a single transaction. If step 3 fails (e.g., a database error), step 2 is automatically **rolled back** (the stock is put back). This ensures that we never sell more tickets than we actually have.

### 4. Why these columns for indexing?
- **`slug` & `ticketCode`**: These are unique strings used to identify concerts and tickets in URLs. We index them for instant lookups.
- **`concertId`**: This is a Foreign Key. We index it to speed up the process of joining concerts with their tickets.
- **`status` (Partial)**: As mentioned above, it optimizes the background cleanup task.

### 5. How "Vibe Coding" (AI) helped
AI "Vibe Coding" acted as a high-speed architectural partner:
- **Speed**: It instantly handled repetitive tasks like creating DTOs, Interfaces, and boilerplate routes, allowing me to focus on business logic.
- **Best Practices**: It suggested robust patterns like **Multi-stage Docker builds** and **Standardized Error Handling** that make the app production-ready.
- **Stability**: It helped write complex logic like the `cleanup.job` and the `transaction proof script` very quickly, ensuring the core "all-or-nothing" database logic was solid from the start.

---

## 🛠 Setup & Commands

### Local Development
```bash
yarn install
yarn migration:run
yarn seed
yarn dev
```

### Run Proof of Transaction
```bash
yarn proof
```

### Docker
```bash
docker build -t concert-app .
docker run -p 3000:3000 concert-app
```
# Bootcamp-Assignment
