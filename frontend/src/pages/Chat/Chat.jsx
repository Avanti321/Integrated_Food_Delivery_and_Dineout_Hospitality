import { useState, useEffect } from "react";
import io from "socket.io-client";
import "./Chat.css";

const socket = io("http://localhost:4000");

const Chat = () => {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });
  }, []);

  const sendMessage = () => {
    socket.emit("sendMessage", msg);
    setMsg("");
  };

  return (
    <div className="chat">
      <h2>💬 Chat Support</h2>

      <div className="chat-box">
        {messages.map((m, i) => <p key={i}>{m}</p>)}
      </div>

      <div className="chat-input">
        <input value={msg} onChange={(e) => setMsg(e.target.value)} />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;