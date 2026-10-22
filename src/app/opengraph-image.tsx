import { ImageResponse } from "next/og";

export const alt = "Nuetly — NUET preparation: real-format mock exams with step-by-step review";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Latin-only copy: the built-in OG font has no Cyrillic glyphs.
const FACTS = [
  { value: "2", label: "sections" },
  { value: "60", label: "questions" },
  { value: "120", label: "minutes" },
];

const STRIP = ["c", "c", "w", "c", "c", "c", "w", "c", "c", "c", "c", "w", "c", "c", "s"];
const STRIP_COLOR: Record<string, string> = { c: "#2a7f8e", w: "#c0392b", s: "#ede6f7" };

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#fcfbfe",
          color: "#16121f",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#4b2c82",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            N
          </div>
          <div style={{ fontSize: 36, fontWeight: 600, letterSpacing: -1 }}>Nuetly</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 68, fontWeight: 700, letterSpacing: -2.5, lineHeight: 1.05, maxWidth: 1040 }}>
            NUET mock exams that show where every point goes
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {STRIP.map((status, index) => (
              <div key={index} style={{ width: 36, height: 22, borderRadius: 5, background: STRIP_COLOR[status] }} />
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 56, borderTop: "2px solid #e7e1ef", paddingTop: 32 }}>
          {FACTS.map((fact) => (
            <div key={fact.label} style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <div style={{ fontSize: 56, fontWeight: 700, color: "#4b2c82" }}>{fact.value}</div>
              <div style={{ fontSize: 28, color: "#4a5260" }}>{fact.label}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
