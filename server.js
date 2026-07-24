require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const walletRoutes = require("./routes/wallet");
const savingsRoutes = require("./routes/savings");
const billsRoutes = require("./routes/bills");
const cardsRoutes = require("./routes/cards");
const transactionsRoutes = require("./routes/transactions");

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "Chucks Bank API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/savings", savingsRoutes);
app.use("/api/bills", billsRoutes);
app.use("/api/cards", cardsRoutes);
app.use("/api/transactions", transactionsRoutes);

// Flutterwave pings this after a transfer/payment finishes processing
app.post("/api/webhook/flutterwave", express.json(), (req, res) => {
  const signature = req.headers["verif-hash"];
  if (!signature || signature !== process.env.FLW_WEBHOOK_HASH) {
    return res.status(401).end();
  }

  const event = req.body;
  console.log("Flutterwave webhook received:", event.event);

  // TODO: look up the transaction by event.data.reference and flip its
  // status from "pending" to "successful" or "failed" based on event.data.status

  res.status(200).end();
});

app.use((req, res) => {
  res.status(404).json({ error: "That route doesn't exist." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Chucks Bank API listening on port ${PORT}`);
});
