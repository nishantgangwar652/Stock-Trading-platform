const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const express=require("express");
const mongoose =require("mongoose");
const bodyParser=require("body-parser");
const cors=require("cors")
const jwt = require("jsonwebtoken");
const { PositionsModel } = require("./model/PositionsModel");
const { HoldingsModel } = require("./model/HoldingsModel");
const { OrdersModel } = require("./model/OrdersModel");
const { UserModel } = require("./model/UserModel");
const PORT=process.env.PORT || 3002;
const uri=process.env.MONGO_URL;
const dashboardLoginCodes = new Map();
const signupOtps = new Map();
const signupVerificationCodes = new Map();
const app=express();
app.use(cors());
app.use(bodyParser.json());
app.get("/", (_req, res) => {
  res.status(200).json({ message: "Zerodha Clone API is running" });
});
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});
app.use((req, res, next) => {
  // Phone verification is intentionally available while MongoDB is reconnecting.
  // Account creation below remains protected by the database check.
  if (req.path === "/request-otp" || req.path === "/verify-otp") return next();
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: "Database unavailable. Check the MongoDB connection." });
  }
  next();
});

const createToken = (user) =>
  jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Authentication required" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

app.post("/dashboard-login-code", requireAuth, (req, res) => {
  const code = require("crypto").randomUUID();
  dashboardLoginCodes.set(code, {
    token: req.headers.authorization.split(" ")[1],
    expiresAt: Date.now() + 60_000,
  });
  res.json({ code });
});

app.post("/dashboard-login-code/exchange", (req, res) => {
  const { code } = req.body;
  const login = dashboardLoginCodes.get(code);
  dashboardLoginCodes.delete(code);

  if (!login || login.expiresAt < Date.now()) {
    return res.status(401).json({ message: "Dashboard sign-in link has expired. Please try again." });
  }

  res.json({ token: login.token });
});

app.post("/request-otp", async (req, res) => {
  const phone = String(req.body.phone || "").replace(/\D/g, "");
  if (!/^\d{10}$/.test(phone)) {
    return res.status(400).json({ message: "Enter a valid 10-digit mobile number" });
  }

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  if (!process.env.FAST2SMS_API_KEY) {
    return res.status(500).json({ message: "SMS service is not configured. Add FAST2SMS_API_KEY to the backend environment." });
  }

  try {
    const smsResponse = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        Authorization: process.env.FAST2SMS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        variables_values: otp,
        route: "otp",
        numbers: phone,
      }),
    });
    const smsData = await smsResponse.json();
    if (!smsResponse.ok || smsData.return === false) {
      console.error("Fast2SMS OTP request failed:", smsData);
      return res.status(502).json({ message: "Unable to send OTP. Please try again shortly." });
    }

    signupOtps.set(phone, { otp, expiresAt: Date.now() + 10 * 60_000 });
    res.json({ message: "OTP sent successfully." });
  } catch (error) {
    console.error("Fast2SMS request failed:", error.message);
    res.status(502).json({ message: "Unable to reach the SMS service. Please try again shortly." });
  }
});

app.post("/verify-otp", (req, res) => {
  const phone = String(req.body.phone || "").replace(/\D/g, "");
  const otp = String(req.body.otp || "");
  const savedOtp = signupOtps.get(phone);

  if (!savedOtp || savedOtp.expiresAt < Date.now() || savedOtp.otp !== otp) {
    return res.status(400).json({ message: "Enter the valid 6-digit OTP." });
  }

  signupOtps.delete(phone);
  const verificationToken = require("crypto").randomUUID();
  signupVerificationCodes.set(verificationToken, { phone, expiresAt: Date.now() + 15 * 60_000 });
  res.json({ verificationToken });
});

app.post("/signup", async (req, res) => {
  try {
    const { name, email, phone, password, verificationToken } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "Name, email, phone, and password are required" });
    }

    // Validate phone number format (10-digit)
    const phoneRegex = /^[0-9]{10}$/;
    const cleanPhone = phone.replace(/\D/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      return res.status(400).json({ message: "Invalid phone number format. Please provide a 10-digit phone number" });
    }

    const verification = signupVerificationCodes.get(verificationToken);
    if (!verification || verification.phone !== cleanPhone || verification.expiresAt < Date.now()) {
      return res.status(403).json({ message: "Verify your mobile number before creating an account" });
    }

    const existingUser = await UserModel.findOne({ 
      $or: [{ email: email.toLowerCase() }, { phone: cleanPhone }]
    });
    if (existingUser) {
      return res.status(409).json({ message: "Email or phone number is already registered" });
    }

    const user = await UserModel.create({ name, email: email.toLowerCase(), phone: cleanPhone, password });
    signupVerificationCodes.delete(verificationToken);
    res.status(201).json({ token: createToken(user), user: { name: user.name, email: user.email, phone: user.phone } });
  } catch (error) {
    console.error("signup failed:", error);
    res.status(500).json({ message: "Unable to create account" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email: email?.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({ token: createToken(user), user: { name: user.name, email: user.email } });
  } catch {
    res.status(500).json({ message: "Unable to log in" });
  }
});
// app.get("/addPositions",async(req,res)=>{
//     let tempPositions=[{
//     product: "CNC",
//     name: "EVEREADY",
//     qty: 2,
//     avg: 316.27,
//     price: 312.35,
//     net: "+0.58%",
//     day: "-1.24%",
//     isLoss: true,
//   },
//   {
//     product: "CNC",
//     name: "JUBLFOOD",
//     qty: 1,
//     avg: 3124.75,
//     price: 3082.65,
//     net: "+10.04%",
//     day: "-1.35%",
//     isLoss: true,
//   },];
//   await PositionsModel.insertMany(tempPositions);
//   res.send("Done!");
// });
app.get("/allHoldings",async(req,res)=>{
let allHoldings=await HoldingsModel.find({});
res.json(allHoldings);
}); 
app.get("/allPositions",async(req,res)=>{
let allPositions=await PositionsModel.find({});
res.json(allPositions);
});
app.post("/newOrder", requireAuth, async(req,res)=>{
  try {
    const newOrder = new OrdersModel({
      name: req.body.name,
      qty: req.body.qty,
      price: req.body.price,
      mode: req.body.mode,
    });

    await newOrder.save();
    res.status(201).send("order saved");
  } catch (error) {
    res.status(500).json({ message: "Unable to save order" });
  }
});

mongoose.connect(uri).then(
  () => console.log("database connected"),
  (error) => console.error("database connection failed:", error.message)
);

app.listen(PORT, () => {
  console.log(`app started on port ${PORT}`);
});
