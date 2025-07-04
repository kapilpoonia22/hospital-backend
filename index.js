const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient, ObjectId } = require("mongodb");
const path = require("path");

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

const mongoUrl = "mongodb://localhost:27017";
const dbName = "hospitalDB";

let db;
MongoClient.connect(mongoUrl)
  .then((client) => {
    db = client.db(dbName);
    console.log("MongoDB Connected");
  })
  .catch((err) => console.error(err));

// ✅ Book appointment
app.post("/api/book", async (req, res) => {
  try {
    const data = req.body; // This now includes name, mobile, address, etc.
    await db.collection("appointments").insertOne(data);
    res.send({ success: true, message: "Appointment booked!" });
  } catch (err) {
    res.status(500).send({ error: "Failed to book appointment" });
  }
});

// ✅ Get all appointments
app.get("/api/appointments", async (req, res) => {
  const result = await db.collection("appointments").find().toArray();
  res.send(result);
});

// ✅ Add doctor
app.post("/api/doctors", async (req, res) => {
  try {
    const { name, specialization, image } = req.body;
    await db.collection("doctors").insertOne({ name, specialization, image });
    res.json({ message: "Doctor added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error adding doctor", error: err });
  }
});

// ✅ Get all doctors
app.get("/api/doctors", async (req, res) => {
  const doctors = await db.collection("doctors").find().toArray();
  res.json(doctors);
});

// ✅ ✅ Get doctor by ID (IMPORTANT FIX)
app.get("/api/doctors/:id", async (req, res) => {
  try {
    const doctor = await db.collection("doctors").findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(doctor);
  } catch (error) {
    console.error("Error fetching doctor by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//Add a Clinical Trial
// -------------------------
app.post("/api/trials", async (req, res) => {
  try {
    const { title, condition, location, startDate, moreInfo } = req.body;
    if (!title || !condition || !location || !startDate) {
      return res.status(400).json({ message: "Missing fields" });
    }

    await db.collection("clinical_trials").insertOne({
      title,
      condition,
      location,
      startDate,
      moreInfo: moreInfo || "#"
    });

    res.json({ success: true, message: "Trial added!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding trial", error });
  }
});

// -------------------------
// 📥 Get All Clinical Trials
// -------------------------
app.get("/api/trials", async (req, res) => {
  try {
    const trials = await db.collection("clinical_trials").find().toArray();
    res.json(trials);
  } catch (error) {
    res.status(500).json({ message: "Error fetching trials", error });
  }
});

// 💸 POST - Save payment
app.post('/api/payments', async (req, res) => {
  try {
    const { name, amount, method, transactionId } = req.body;

    if (!name || !amount || !method || !transactionId) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    await db.collection('payments').insertOne({
      name,
      amount,
      method,
      transactionId,
      createdAt: new Date()
    });

    res.json({ success: true, message: "Payment recorded successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", err });
  }
});

// 📃 GET - All payments
app.get('/api/payments', async (req, res) => {
  try {
    const payments = await db.collection('payments').find().sort({ createdAt: -1 }).toArray();
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed", err });
  }
});


app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
