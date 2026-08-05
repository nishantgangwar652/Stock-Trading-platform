// Render injects REACT_APP_API_URL at build time. The fallback keeps the
// deployed landing site from trying to call a visitor's localhost machine.
export const API_URL = process.env.REACT_APP_API_URL || "https://zerodha-clone-api.onrender.com";
