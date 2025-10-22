import React, { useState } from "react";
import "./App.css";
import CancelTripFlow from "./components/CancelTripFlow";
import PetTravelFlow from "./components/PetTravelFlow";

export default function App() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Welcome to CloudDesk! ✈️ I'm your intelligent airline assistant. How can I help you today?"
    }
  ]);

  const [category, setCategory] = useState(null);
  const [input, setInput] = useState("");
const [lastUserMessage, setLastUserMessage] = useState("");

const sendMessage = async () => {
  if (!input.trim()) return;
  const newMsg = { sender: "user", text: input };
  setMessages(prev => [...prev, newMsg]);

  try {
    const res = await fetch("http://localhost:5000/classify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userMessage: input })
    });
    const data = await res.json();

    setCategory(data.category || "Others");
    setLastUserMessage(input); // save the message that triggered the category

    setMessages(prev => [
      ...prev,
      { sender: "bot", text: `✈️ Category identified: ${data.category}` }
    ]);
  } catch (err) {
    setMessages(prev => [...prev, { sender: "bot", text: "Sorry, could not classify your request." }]);
  }

  setInput(""); // clear input
};

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="logo">CloudDesk</div>
        <div className="status"><span className="dot"></span> Online</div>
      </div>

      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble ${msg.sender === "user" ? "user" : "bot"}`}>
            {msg.text}
          </div>
        ))}

        {category === "cancel trip" && <CancelTripFlow />}
        {category === "Pet Travel" && <PetTravelFlow userMessage={lastUserMessage} />}
      </div>

      <div className="input-area">
        <input
          type="text"
          placeholder="Type your request here..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>✈️</button>
      </div>
      <footer>Powered by CloudDesk AI • Airline Support System</footer>
    </div>
  );
}
