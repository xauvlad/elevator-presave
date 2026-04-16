import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";

export default function TicketPage() {
  const [ticket, setTicket] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const ticketRef = useRef(null);
  const frameWidth = 720;
  const frameHeight = 405;

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

  const handleDownloadTicket = async () => {
    if (!ticketRef.current || isDownloading) {
      return;
    }

    try {
      setIsDownloading(true);

      const canvas = await html2canvas(ticketRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        onclone: (clonedDoc) => {
          const clonedTicket = clonedDoc.getElementById("ticket-capture");
          const clonedTicketArt = clonedDoc.getElementById("ticket-art");
          const clonedTicketCode = clonedDoc.getElementById("ticket-code");

          if (clonedTicket) {
            clonedTicket.style.animation = "none";
            clonedTicket.style.opacity = "1";
          }

          if (clonedTicketArt) {
            clonedTicketArt.classList.remove("brush-reveal");
          }

          if (clonedTicketCode) {
            clonedTicketCode.style.maskImage = "url('/images/scratches2.png')";
            clonedTicketCode.style.maskSize = "cover";
            clonedTicketCode.style.maskPosition = "center";
            clonedTicketCode.style.maskRepeat = "no-repeat";
            clonedTicketCode.style.WebkitMaskImage = "url('/images/scratches2.png')";
            clonedTicketCode.style.WebkitMaskSize = "cover";
            clonedTicketCode.style.WebkitMaskPosition = "center";
            clonedTicketCode.style.WebkitMaskRepeat = "no-repeat";
          }
        },
      });

      const imageUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      const safeTicket = (ticket || "lottery-ticket")
        .replace(/[^a-z0-9-]/gi, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .toLowerCase();

      link.href = imageUrl;
      link.download = safeTicket
        ? `lottery-ticket-${safeTicket}.png`
        : "lottery-ticket.png";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main
      className="ticket-page"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
        color: "white",
        fontFamily: "monospace",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        id="ticket-capture"
        ref={ticketRef}
        style={{
          position: "relative",
          containerType: "inline-size",
          width: `${frameWidth}px`,
          height: `${frameHeight}px`,
          maxWidth: "92vw",
          maxHeight: "52vw",
          aspectRatio: "16 / 9",
          animation: "ticketSlideIn 1.1s cubic-bezier(0.2, 0.9, 0.24, 1) forwards",
          willChange: "transform, opacity",
          opacity: 0,
          overflow: "hidden",
        }}
      >
        <div
          id="ticket-art"
          className="ticket-reveal"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/images/ticket3.png')",
            backgroundSize: "100% 100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
      
        <div
          id="ticket-code"
          style={{
            position: "absolute",
            top: "62%",
            left: "50%",
            width: "86%",
            transform: "translateX(-50%)",
            color: "rgba(66, 43, 1, 0.95)",
            fontFamily: "bahnschrift, monospace, sans-serif",
            fontSize: "clamp(16px, 5cqi, 48px)",
            letterSpacing: "clamp(1px, 0.45cqi, 3px)",
            fontWeight: "bold",
            wordBreak: "break-word",
            textAlign: "center",
            textShadow: "0 0 12px rgba(255, 255, 255, 0.56)",
            maskImage: "url('/images/scratches2.png')",
            maskSize: "cover",
            maskPosition: "center",
            maskRepeat: "no-repeat",
            WebkitMaskImage: "url('/images/scratches2.png')",
            WebkitMaskSize: "cover",
            WebkitMaskPosition: "center",
            WebkitMaskRepeat: "no-repeat",
          }}
        >
          {ticket || "..."}
        </div>
        </div>
      </div>

      <div
        style={{
          width: "min(420px, 92vw)",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <button
          className="gold-button ticket-button"
          style={{
            alignSelf: "center",
            width: "80%",
            cursor: "pointer",
            opacity: isDownloading ? 0.7 : 1,
          }}
          onClick={handleDownloadTicket}
          disabled={isDownloading}
        >
          {isDownloading ? "Сохранение..." : "Оторвать талончик"}
        </button>

        <button
          className="gold-button ticket-button"
          style={{
            width: "80%",
            cursor: "pointer",
            alignSelf: "center",
          }}
          onClick={() => {
            window.location.href = "https://t.me/idstband";
          }}
        >
          Перейти в Telegram
        </button>
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

        .ticket-page {
          background-image: url('/images/background.png');
          background-color: rgba(0, 0, 0, 0.7);
          background-blend-mode: darken;
          background-repeat: repeat;
          background-position: left top;
          background-size: 100% auto;
        }

        @media (orientation: landscape) {
          .ticket-page {
            background-size: 50% auto;
          }
        }

        @keyframes ticketSlideIn {
          from {
            opacity: 0;
            transform: translateX(-24vw);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </main>
  );
}
