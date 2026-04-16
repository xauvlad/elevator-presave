import { useEffect, useRef, useState } from "react";

export default function TicketPage() {
  const [ticket, setTicket] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [isExistingTicketModal, setIsExistingTicketModal] = useState(false);
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
      setIsExistingTicketModal(true);
      setShowRegistrationModal(true);
      return;
    }

    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    const newTicket = `IDST-${randomNumber}`;

    localStorage.setItem("ticket", newTicket);
    setTicket(newTicket);
    setIsExistingTicketModal(false);
    setShowRegistrationModal(true);

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

      const imageUrl = URL.createObjectURL(blob);
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

      {showRegistrationModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="registration-modal-title"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            background: "rgba(0, 0, 0, 0.58)",
            backdropFilter: "blur(2px)",
          }}
        >
          <div
            style={{
              width: "min(620px, 94vw)",
              borderRadius: "14px",
              border: "2px solid rgba(212, 166, 58, 0.95)",
              background:
                "linear-gradient(160deg, rgba(12, 50, 34, 0.97) 0%, rgba(8, 31, 22, 0.98) 100%)",
              color: "#f1dfac",
              boxShadow:
                "0 22px 44px rgba(0, 0, 0, 0.45), inset 0 0 0 1px rgba(255, 235, 170, 0.26)",
              padding: "22px 20px 18px",
            }}
          >
            <h2
              id="registration-modal-title"
              style={{
                margin: "0 0 14px",
                fontFamily: "bahnschrift, trebuchet ms, sans-serif",
                letterSpacing: "0.02em",
                fontSize: "clamp(20px, 2.5vw, 28px)",
                color: "#ffe9a9",
                textShadow: "0 0 14px rgba(250, 206, 97, 0.24)",
              }}
            >
              {isExistingTicketModal
                ? "Каждому по одному..."
                : "Вы успешно зарегистрировались!"}
            </h2>

            {isExistingTicketModal ? (
              <p
                style={{
                  margin: 0,
                  lineHeight: 1.45,
                  fontSize: "clamp(14px, 1.7vw, 18px)",
                  color: "rgba(255, 241, 201, 0.92)",
                }}
              >
              </p>
            ) : (
              <p
                style={{
                  margin: 0,
                  whiteSpace: "pre-line",
                  lineHeight: 1.45,
                  fontSize: "clamp(14px, 1.7vw, 18px)",
                  color: "rgba(255, 241, 201, 0.92)",
                }}
              >
                {
                  "Результаты лотереи будут опубликованы в телеграм-канале IDST. Обязательно сохраните талон по кнопке или сделайте скриншот.\nЖелаем удачи!"
                }
              </p>
            )}

            <div style={{ marginTop: "18px", display: "flex", justifyContent: "flex-end" }}>
              <button
                className="gold-button ticket-button"
                style={{ width: "auto", minWidth: "140px", cursor: "pointer" }}
                onClick={() => {
                  setShowRegistrationModal(false);
                }}
              >
                {isExistingTicketModal
                ? ":("
                : "Спасибо!"}
              </button>
            </div>
          </div>
        </div>
      )}

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
