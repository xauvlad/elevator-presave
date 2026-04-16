export default function Home() {
  return (
    <main
      className="home-page"
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        padding: "20px",
        textAlign: "center",
        margin: 0,
        fontFamily: "monospace",
      }}
    >
      <div
        style={{
          position: "relative",
          containerType: "inline-size",
          width: "min(94vw, calc(150vh * 9 / 16), 1080px)",
          aspectRatio: "9 / 16",
          borderRadius: "12px",
          overflow: "hidden",
          animation: "fadeIn 1.5s ease forwards",
          opacity: 0,
        }}
      >
        <div
        className="brush-reveal"
          style={{
            position: "absolute",
            inset: 0,
          }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              background: "rgba(0, 0, 0, 0.65)",
              display: "block",
            }}
          >
            <source src="/images/prospect.webm" type="video/webm" />
          </video>
        </div>

        <button
          className="gold-button"
          style={{
            position: "absolute",
            zIndex: 2,
            left: "50%",
            bottom: "1.3%",
            transform: "translateX(-50%)",
            minWidth: "30%",
            maxHeight: "12%",
            cursor: "pointer",
            fontSize: "3cqi",
            boxShadow: "0 0 24px rgba(214, 117, 6, 0.56)",
            marginBottom: "0.001cqi",
          }}
          onClick={() => {
            window.location.href = "/ticket";
          }}
        >
          Участвовать в лотерее
        </button>
      </div>

      <style jsx global>{`
        html, body, #__next {
          margin: 0;
          padding: 0;
          min-height: 100%;
          background: black;
        }

        .home-page {
          background-image: url('/images/background.png');
          background-color: rgba(0, 0, 0, 0.7);
          background-blend-mode: darken;
          background-repeat: repeat;
          background-position: left top;
          background-size: 100% auto;
        }

        @media (orientation: landscape) {
          .home-page {
            background-size: 50% auto;
          }
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
