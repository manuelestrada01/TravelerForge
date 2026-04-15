import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#141109",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          border: "1px solid rgba(200,168,75,0.55)",
        }}
      >
        {/* Inner inset frame */}
        <div
          style={{
            position: "absolute",
            inset: 3,
            border: "1px solid rgba(200,168,75,0.18)",
            display: "flex",
          }}
        />
        {/* Corner marks */}
        <div style={{ position: "absolute", top: 2, left: 2, width: 3, height: 3, background: "rgba(200,168,75,0.5)", display: "flex" }} />
        <div style={{ position: "absolute", top: 2, right: 2, width: 3, height: 3, background: "rgba(200,168,75,0.5)", display: "flex" }} />
        <div style={{ position: "absolute", bottom: 2, left: 2, width: 3, height: 3, background: "rgba(200,168,75,0.5)", display: "flex" }} />
        <div style={{ position: "absolute", bottom: 2, right: 2, width: 3, height: 3, background: "rgba(200,168,75,0.5)", display: "flex" }} />
        {/* T */}
        <span
          style={{
            color: "#c8a84b",
            fontSize: 18,
            fontWeight: 700,
            lineHeight: 1,
            fontFamily: "Georgia, serif",
            position: "relative",
            zIndex: 1,
          }}
        >
          T
        </span>
      </div>
    ),
    { ...size }
  );
}
