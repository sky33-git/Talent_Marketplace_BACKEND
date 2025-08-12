import 'dotenv/config';
import admin from 'firebase-admin';

if (!process.env.SERVICE_ACCOUNT) {
  throw new Error('FIREBASE_CONFIG environment variable is missing');
}

const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
