import React, { useEffect, useState } from "react";

type AssistantNudgesProps = {
  activeTab: string;
};

/**
 * Minimal, persistent AI assistant presence.
 * - Shows a small AI avatar in the lower-left corner on all screens.
 * - Shows a one-time speech bubble: "I'm here to help if you need me."
 * - After the first display, only the avatar remains (no more bubbles).
 */
const AssistantNudges: React.FC<AssistantNudgesProps> = () => {
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = window.localStorage.getItem("wzos_ai_bubble_seen") === "1";
    if (!seen) {
      setShowBubble(true);
      const timer = window.setTimeout(() => {
        setShowBubble(false);
        window.localStorage.setItem("wzos_ai_bubble_seen", "1");
      }, 8000);
      return () => window.clearTimeout(timer);
    }
  }, []);

  const handleCloseBubble = () => {
    setShowBubble(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("wzos_ai_bubble_seen", "1");
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 flex items-end gap-2">
      <div className="h-10 w-10 rounded-full bg-black/80 border border-amber-500/50 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(255,179,0,0.6)]">
        <img
          src="/Work_Zone_AI_MAN.png"
          alt="Work Zone OS assistant"
          className="h-8 w-8 object-contain"
        />
      </div>
      {showBubble && (
        <button
          type="button"
          onClick={handleCloseBubble}
          className="bg-black/90 border border-amber-500/40 rounded-2xl px-3 py-2 text-[11px] text-amber-100 max-w-[180px] shadow-[0_0_18px_rgba(255,179,0,0.5)] text-left"
        >
          I&apos;m here to help if you need me.
        </button>
      )}
    </div>
  );
};

export default AssistantNudges;
