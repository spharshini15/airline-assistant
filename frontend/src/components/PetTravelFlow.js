import React, { useState, useEffect } from "react";

export default function PetTravelFlow({ userMessage }) {
  const [response, setResponse] = useState("Fetching pet travel information...");
  const [informed, setInformed] = useState(false);

  useEffect(() => {
    if (!userMessage) return;

    const fetchPetAnswer = async () => {
      try {
        const res = await fetch("http://localhost:5000/pet-answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userMessage })
        });

        const data = await res.json();

        // Set the answer from Gemini API
        setResponse(
          data.answer ||
            "Could not fetch pet policy. Please check here: https://www.jetblue.com/traveling-together/traveling-with-pets"
        );
      } catch (err) {
        console.error(err);
        setResponse(
          "Could not fetch pet policy. Please check here: https://www.jetblue.com/traveling-together/traveling-with-pets"
        );
      }
    };

    fetchPetAnswer();
  }, [userMessage]);

  return (
    <div className="cancel-flow">
      {!informed ? (
        <div className="flow-step">
          <h4>🐾 Pet Travel Information</h4>
          <p>{response}</p>
          <button onClick={() => setInformed(true)} className="success">
            I have informed the customer
          </button>
        </div>
      ) : (
        <div className="flow-step success">
          <p>✅ Customer informed.</p>
        </div>
      )}
    </div>
  );
}
