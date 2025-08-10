import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export default prisma;
// This file is used to initialize the Prisma client for database operations.
// It connects to a MySQL database using the connection string defined in the .env file.