import React from "react";
import "./assistant.css";

export default function AssistantBubble({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="ai-bubble"
    >
      <img src="/Work_Zone_AI_Man.png" className="ai-avatar" />
    </button>
  );
}
