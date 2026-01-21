import React, { useEffect, useState } from "react";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const USER =
  import.meta.env.VITE_USER || "anonymous";

function App() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const loadMessages = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/messages`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Backend not reachable");
    }
  };

  const sendMessage = async () => {
    if (!text) return;

    await fetch(`${BACKEND_URL}/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: USER,
        text: text
      })
    });

    setText("");
    loadMessages();
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h2>Simple Chat ({USER})</h2>

      <div
        style={{
          border: "1px solid #ccc",
          height: "300px",
          overflowY: "auto",
          padding: "10px",
          marginBottom: "10px"
        }}
      >
        {messages.map(m => (
          <div key={m.id}>
            <strong>{m.sender}</strong>: {m.text}
          </div>
        ))}
      </div>

      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type message..."
        style={{ width: "70%" }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
