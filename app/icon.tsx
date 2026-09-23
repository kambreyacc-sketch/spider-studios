import { ImageResponse } from "next/og";

export const runtime = "edge";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#05070b",
      }}
    >
      <img
        src="https://cdn.discordapp.com/icons/1541030301336215562/4119cf6ca8318ba22c8882efb6e18505.webp?size=1024"
        width="256"
        height="256"
        style={{ borderRadius: "50%" }}
      />
    </div>,
    { width: 256, height: 256 }
  );
}
