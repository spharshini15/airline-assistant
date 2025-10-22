import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: "AIzaSyBxvbkT-sbEpLZwo9UdXd80i94WUHkXv9Q"
});

// 🔹 Mock flight booking data
const bookings = [
  {
    pnr: "AB123",
    flight_id: 9876,
    source_airport_code: "MAA",
    destination_airport_code: "DEL",
    scheduled_departure: "2025-10-25T08:00:00Z",
    scheduled_arrival: "2025-10-25T10:45:00Z",
    assigned_seat: "12A",
    current_departure: "2025-10-25T08:00:00Z",
    current_arrival: "2025-10-25T10:45:00Z",
    current_status: "Confirmed"
  },
  {
    pnr: "ZX999",
    flight_id: 5678,
    source_airport_code: "BLR",
    destination_airport_code: "BOM",
    scheduled_departure: "2025-10-30T06:30:00Z",
    scheduled_arrival: "2025-10-30T08:00:00Z",
    assigned_seat: "22C",
    current_departure: "2025-10-30T06:30:00Z",
    current_arrival: "2025-10-30T08:00:00Z",
    current_status: "Confirmed"
  }
];

// ✅ Flight booking endpoints
app.get("/flight/booking", (req, res) => {
  const { pnr } = req.query;
  const booking = bookings.find(b => b.pnr.toLowerCase() === (pnr || "").toLowerCase());
  if (!booking) return res.status(404).json({ message: "PNR Not Found" });
  res.status(200).json(booking);
});

app.post("/flight/cancel", (req, res) => {
  const { pnr } = req.body;
  const booking = bookings.find(b => b.pnr.toLowerCase() === (pnr || "").toLowerCase());
  if (!booking) return res.status(404).json({ message: "PNR Not Found" });

  booking.current_status = "Cancelled";
  const refundAmount = Math.floor(Math.random() * 3000) + 2000;

  res.status(200).json({
    message: "Flight successfully cancelled",
    refundAmount,
    booking
  });
});

// ✅ Classification endpoint with Pet Travel fallback
app.post("/classify", async (req, res) => {
  const { userMessage } = req.body;
  if (!userMessage) return res.status(400).json({ error: "User message required" });

  let category = "Others";
  let petPolicy = null;

  try {
    const lowerMsg = userMessage.toLowerCase();

    // Rule-based classification first
    if (lowerMsg.includes("cancel")) category = "cancel trip";
    else if (lowerMsg.includes("pet") || lowerMsg.includes("dog") || lowerMsg.includes("cat")) category = "Pet Travel";

    // Optional AI classification fallback
    // ...

    // Fetch Pet Travel policy if needed
    if (category === "Pet Travel") {
      const policyUrl = "https://www.jetblue.com/traveling-together/traveling-with-pets";
      petPolicy = `You can check the pet travel policy here: ${policyUrl}`;
    }

    // Always return category
    return res.json({ category, petPolicy });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ category: "Others", petPolicy: null });
  }
});

app.listen(5000, () => console.log("✅ CloudDesk Server running on http://localhost:5000"));
