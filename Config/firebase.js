import admin from "firebase-admin"
import { serviceAccount } from "../serviceAccount.js";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export default admin