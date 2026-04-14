"use client";

import { useEffect, useState } from "react";

export default function TicketPage() {
  const [ticket, setTicket] = useState<string | null>(null);

  useEffect(() => {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    setTicket(`LFT-${randomNumber}`);
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "black",
        color: "white",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          maxWidth: "500px",
          border: "1px solid rgba(255,255,255,0.2)",
          padding: "30px",
          borderRadius: "12px",
          animation: "fadeIn 1.5s ease forwards",
          opacity: 0,
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Ваш билет</h2>

        <div
          style={{
            fontSize: "32px",
            letterSpacing: "4px",
            marginBottom: "20px",
          }}
        >
          {ticket || "..."}
        </div>

        <p style={{ opacity: 0.7 }}>
          Сохраните этот номер.
          <br />
          Он участвует в розыгрыше портрета.
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
