import { useEffect, useState } from "react";

export default function TicketPage() {
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    const existingTicket = localStorage.getItem("ticket");

    if (existingTicket) {
      setTicket(existingTicket);
      return;
    }

    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    const newTicket = `IDST-${randomNumber}`;

    localStorage.setItem("ticket", newTicket);
    setTicket(newTicket);

    fetch("/api/save-ticket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ticket: newTicket }),
    }).catch(() => {
      // Не ломаем интерфейс, если запись в базу не удалась
    });
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
        fontFamily: "monospace",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "320px",
          padding: "24px",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "12px",
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(8px)",
          animation: "fadeIn 1.5s ease forwards",
          opacity: 0,
        }}
      >
        <div style={{ fontSize: "12px", opacity: 0.6 }}>
          СИСТЕМА idst
        </div>

        <div style={{ fontSize: "18px", marginBottom: "16px" }}>
          Посадочный талон
        </div>

        <div style={{ fontSize: "12px", opacity: 0.6 }}>
          ПАССАЖИР: ЗАРЕГИСТРИРОВАН
        </div>

        <div style={{ fontSize: "12px", opacity: 0.6 }}>
          МАРШРУТ: МУЗЫКА ДЛЯ ЛИФТА
        </div>

        <div
          style={{
            fontSize: "12px",
            opacity: 0.6,
            marginBottom: "20px",
          }}
        >
          СТАТУС: ДОПУЩЕН
        </div>

        <div
          style={{
            fontSize: "20px",
            letterSpacing: "2px",
            marginBottom: "20px",
            wordBreak: "break-word",
          }}
        >
          {ticket || "..."}
        </div>

        <div style={{ fontSize: "11px", opacity: 0.4 }}>
          Посадка начнется после релиза
        </div>

        <button
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "10px",
            background: "white",
            color: "black",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
          onClick={() => {
            window.print();
          }}
        >
          Сохранить билет
        </button>

        <p style={{ marginTop: "16px", fontSize: "12px", opacity: 0.35 }}>
          Номер билета сохраняется только в вашем браузере.
        </p>
      </div>

      <style jsx global>{`
        html,
        body,
        #__next {
          margin: 0;
          padding: 0;
          min-height: 100%;
          background: black;
        }

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
