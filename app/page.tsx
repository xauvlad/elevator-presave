"use client";

export default function Home() {
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
          backdropFilter: "blur(10px)",
          animation: "fadeIn 1.5s ease forwards",
          opacity: 0,
        }}
      >
        <h1 style={{ marginBottom: "20px", fontSize: "28px" }}>
          Музыка для лифта
        </h1>

        <p style={{ marginBottom: "20px", opacity: 0.8 }}>
          Благодарим за бронирование музыкального маршрута.
        </p>

        <p style={{ marginBottom: "30px", opacity: 0.6 }}>
          Ваше внимание зафиксировано системой.
          <br />
          Пассажирам с активным пресейвом доступна портретная лотерея.
        </p>

        <button
          style={{
            padding: "12px 24px",
            background: "white",
            color: "black",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
          }}
          onClick={() => {
            window.location.href = "/ticket";
          }}
        >
          Участвовать в лотерее
        </button>
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
