import React, { createContext, useContext, useState } from "react";
import { runTextQuery, runVisionQuery } from "@/lib/ai/assistantEngine";

const AssistantContext = createContext<any>(null);

export function AssistantProvider({ children }: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function ask(prompt: string, file?: File) {
    setLoading(true);
    let reply = "";

    try {
      if (file) {
        reply = await runVisionQuery(prompt, file);
      } else {
        reply = await runTextQuery(prompt);
      }
    } catch {
      reply = "Sorry, I ran into a problem processing your request.";
    }

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: prompt },
      { sender: "ai", text: reply },
    ]);

    setLoading(false);
  }

  return (
    <AssistantContext.Provider value={{ messages, loading, ask }}>
      {children}
    </AssistantContext.Provider>
  );
}

export function useAssistant() {
  return useContext(AssistantContext);
}
