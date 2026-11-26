
import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#EF4444",
        }}
      >
        <svg
          width="110"
          height="110"
          viewBox="0 0 64 64"
        >
          <path
            d="M25 17.5Q22 16 22 20V44Q22 48 25 46.5L45 34.5Q49 32 45 29.5Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}