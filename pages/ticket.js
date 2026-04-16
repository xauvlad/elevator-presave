import { useEffect, useRef, useState } from "react";

export default function TicketPage() {
  const [ticket, setTicket] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const ticketRef = useRef(null);
  const frameWidth = 720;
  const frameHeight = 405;

  const loadImage = (src) =>
    new Promise((resolve) => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.onload = () => resolve(image);
      image.onerror = () => resolve(null);
      image.src = src;
    });

  const renderMaskedText = (context, text, canvasWidth, canvasHeight) => {
    const scratchImage = new Image();
    scratchImage.crossOrigin = "anonymous";
    scratchImage.src = "/images/scratches2.png";

    return new Promise((resolve) => {
      scratchImage.onload = () => {
        const textCanvas = document.createElement("canvas");
        textCanvas.width = canvasWidth;
        textCanvas.height = canvasHeight;
        const textContext = textCanvas.getContext("2d");

        if (!textContext) {
          resolve();
          return;
        }

        textContext.clearRect(0, 0, canvasWidth, canvasHeight);
        textContext.fillStyle = "rgb(66, 43, 1)";
        textContext.textAlign = "center";
        textContext.textBaseline = "middle";
        textContext.font = `bold ${Math.round(canvasWidth * 0.042)}px bahnschrift, monospace, sans-serif`;
        textContext.shadowColor = "rgba(255, 255, 255, 0.56)";
        textContext.fillText(text || "...", canvasWidth / 2, canvasHeight * 0.68);

        textContext.globalCompositeOperation = "destination-in";
        textContext.drawImage(scratchImage, 0, 0, canvasWidth, canvasHeight);
        textContext.globalCompositeOperation = "source-over";

        context.drawImage(textCanvas, 0, 0);
        resolve();
      };

      scratchImage.onerror = () => {
        context.fillStyle = "rgba(66, 43, 1, 0.95)";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = `bold ${Math.round(canvasWidth * 0.042)}px bahnschrift, monospace, sans-serif`;
        context.shadowColor = "rgba(255, 255, 255, 0.56)";
        context.fillText(text || "...", canvasWidth / 2, canvasHeight * 0.62);
        resolve();
      };
    });
  };

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
    if (isDownloading) {
      return;
    }

    try {
      setIsDownloading(true);

      const ticketImage = await loadImage("/images/ticket3.png");

      if (!ticketImage) {
        return;
      }

      const canvas = document.createElement("canvas");
      canvas.width = ticketImage.naturalWidth || 1920;
      canvas.height = ticketImage.naturalHeight || 1080;

      const context = canvas.getContext("2d");

      if (!context) {
        return;
      }

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(ticketImage, 0, 0, canvas.width, canvas.height);

      await renderMaskedText(context, ticket, canvas.width, canvas.height);

      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, "image/png", 1);
      });

      if (!blob) {
        return;
      }

      const safeTicket = (ticket || "lottery-ticket")
        .replace(/[^a-z0-9-]/gi, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .toLowerCase();
      const fileName = safeTicket
        ? `lottery-ticket-${safeTicket}.png`
        : "lottery-ticket.png";

      const isTelegramWebView = /Telegram/i.test(navigator.userAgent || "");

      if (isTelegramWebView) {
        const file = new File([blob], fileName, { type: "image/png" });

        if (
          typeof navigator !== "undefined" &&
          typeof navigator.canShare === "function" &&
          navigator.canShare({ files: [file] })
        ) {
          try {
            await navigator.share({
              files: [file],
              title: "Lottery ticket",
              text: "IDST ticket",
            });
            return;
          } catch {
            // Share can be canceled or blocked, continue to open fallback.
          }
        }
      }

      const imageUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = imageUrl;
      link.download = fileName;
      link.rel = "noopener noreferrer";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (isTelegramWebView) {
        window.open(imageUrl, "_blank", "noopener,noreferrer");
      }

      setTimeout(() => {
        URL.revokeObjectURL(imageUrl);
      }, 2000);
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
            pointerEvents: "none",
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
            color: "rgba(66, 43, 1, 1)",
            fontFamily: "bahnschrift, monospace, sans-serif",
            fontSize: "clamp(16px, 5cqi, 48px)",
            letterSpacing: "clamp(1px, 0.45cqi, 3px)",
            fontWeight: "bold",
            wordBreak: "break-word",
            textAlign: "center",
            textShadow: "0 0 16px rgba(255, 255, 255, 0.9)",
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
