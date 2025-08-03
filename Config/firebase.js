import admin from "firebase-admin";
import dotenv from "dotenv";
import path from "path";
import { readFileSync } from "fs";

dotenv.config();

const serviceAccountPath = path.resolve(process.env.SERVICE_ACCOUNT_PATH);
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
