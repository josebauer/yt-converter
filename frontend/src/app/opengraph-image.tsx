import { ImageResponse } from "next/og";

export const alt =
  "YT Converter - Conversor online MP3 e MP4";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          padding: "50px",
          backgroundColor: "#09090B",
          backgroundImage:
            "radial-gradient(circle at top right, #48151C, #09090B 75%)",
          color: "#FAFAFA",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "40px",
            border: "2px solid #3F272C",
            borderRadius: "30px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <svg
              width="60"
              height="60"
              viewBox="0 0 64 64"
            >
              <rect
                width="64"
                height="64"
                rx="17"
                fill="#EF4444"
              />

              <path
                d="M25 17.5Q22 16 22 20V44Q22 48 25 46.5L45 34.5Q49 32 45 29.5Z"
                fill="#FFFFFF"
              />
            </svg>

            <div
              style={{
                display: "flex",
                fontSize: "36px",
                fontWeight: 700,
              }}
            >
              <span>YT</span>

              <span style={{ color: "#EF4444" }}>
                Converter
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span
              style={{
                fontSize: "70px",
                fontWeight: 700,
                letterSpacing: "-3px",
              }}
            >
              Seus vídeos, no
            </span>

            <span
              style={{
                fontSize: "70px",
                fontWeight: 700,
                letterSpacing: "-3px",
                color: "#EF4444",
              }}
            >
              formato que quiser.
            </span>

            <span
              style={{
                marginTop: "20px",
                fontSize: "26px",
                color: "#A1A1AA",
              }}
            >
              Conversor online de áudio e vídeo.
            </span>
          </div>

          <div
            style={{
              display: "flex",
              gap: "20px",
            }}
          >
            {["MP3", "MP4"].map((format) => (
              <div
                key={format}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "124px",
                  height: "58px",
                  borderRadius: "14px",
                  backgroundColor: "#18181B",
                  border: "2px solid #3F3F46",
                  fontSize: "24px",
                  fontWeight: 600,
                }}
              >
                {format}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}