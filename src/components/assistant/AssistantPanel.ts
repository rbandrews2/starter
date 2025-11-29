import React, { useState } from "react";
import { useAssistant } from "@/contexts/AssistantContext";
import "./assistant.css";

export default function AssistantPanel({ open, onClose }: any) {
  const { messages, loading, ask } = useAssistant();
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | undefined>(undefined);

  async function handleSend() {
    if (!input && !file) return;
    await ask(input, file);
    setInput("");
    setFile(undefined);
  }

  return (
    <div className={`ai-panel ${open ? "open" : ""}`}>
      <div className="ai-header">
        <span>AI Assistant</span>
        <button onClick={onClose}>×</button>
      </div>

      <div className="ai-body">
        {messages.map((m, i) => (
          <div key={i} className={`ai-msg ${m.sender}`}>
            {m.text}
          </div>
        ))}
        {loading && <div className="ai-msg ai">Thinking...</div>}
      </div>

      <div className="ai-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Work Zone AI..."
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0])}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
