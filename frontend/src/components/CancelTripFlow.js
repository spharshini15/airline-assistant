import React, { useState } from "react";

export default function CancelTripFlow() {
  const [pnr, setPnr] = useState("");
  const [booking, setBooking] = useState(null);
  const [message, setMessage] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [refund, setRefund] = useState(null);

  const fetchBooking = async () => {
    try {
      const res = await fetch(`http://localhost:5000/flight/booking?pnr=${pnr}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setBooking(data);
      setMessage("");
    } catch (err) {
      setMessage(err.message);
      setBooking(null);
    }
  };

  const cancelFlight = async () => {
    try {
      const res = await fetch("http://localhost:5000/flight/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pnr })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setCancelled(true);
      setRefund(data.refundAmount);
      setMessage(data.message);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="cancel-flow">
      {!booking && !cancelled && (
        <div className="flow-step">
          <p>Please enter your PNR number to fetch booking details:</p>
          <input
            type="text"
            placeholder="Enter PNR"
            value={pnr}
            onChange={e => setPnr(e.target.value)}
          />
          <button onClick={fetchBooking}>Fetch Details</button>
          {message && <div className="error">{message}</div>}
        </div>
      )}

      {booking && !confirmed && (
        <div className="flow-step">
          <h4>Booking Details</h4>
          <p>
            Flight {booking.flight_id} from {booking.source_airport_code} →{" "}
            {booking.destination_airport_code}
          </p>
          <p>Seat: {booking.assigned_seat}</p>
          <p>Status: {booking.current_status}</p>
          <button onClick={() => setConfirmed(true)}>Confirm Cancellation</button>
        </div>
      )}

      {confirmed && !cancelled && (
        <div className="flow-step">
          <p>Are you sure you want to cancel this booking?</p>
          <button onClick={cancelFlight} className="danger">
            Yes, Cancel Flight
          </button>
          <button onClick={() => setConfirmed(false)}>Go Back</button>
        </div>
      )}

      {cancelled && (
        <div className="flow-step success">
          <h4>✅ Flight Cancelled</h4>
          <p>{message}</p>
          <p>Refund Amount: ₹{refund}</p>
        </div>
      )}
    </div>
  );
}
