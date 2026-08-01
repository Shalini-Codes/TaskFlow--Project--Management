const fs = require("fs");

const env = {
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY || "",
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN || "",
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || "",
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET || "",
    FIREBASE_MESSAGING_SENDER_ID:
        process.env.FIREBASE_MESSAGING_SENDER_ID || "",
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID || "",
    MOCK_API_BASE_URL: process.env.MOCK_API_BASE_URL || ""
};

fs.writeFileSync(
    "env.js",
    `window.env = ${JSON.stringify(env, null, 2)};`
);

console.log("env.js generated successfully");