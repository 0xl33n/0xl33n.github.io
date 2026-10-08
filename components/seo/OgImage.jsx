/**
 * Social preview card (1200×630) rendered to PNG at build time by next/og.
 * next/og supports a subset of CSS: every element with several children
 * needs `display: flex`.
 */
export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

const COLORS = {
  background: '#050805',
  frame: '#1f4d1f',
  accent: '#39ff7a',
  heading: '#eafff1',
  text: '#8fbd98',
  prompt: '#5cf6ff',
};

/**
 * @param {string} eyebrow - Small line above the title, e.g. "writeup · 25 min read".
 * @param {string} title
 * @param {string} subtitle
 * @param {string} path - Shown in the fake title bar, e.g. "~/writeups/foo.md".
 */
export default function OgImage({ eyebrow, title, subtitle, path }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        padding: 48,
        background: '#000',
        backgroundImage: 'radial-gradient(circle at 85% 0%, rgba(57,255,122,0.18), transparent 45%)',
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          border: `2px solid ${COLORS.frame}`,
          borderRadius: 18,
          background: COLORS.background,
          overflow: 'hidden',
        }}
      >
        {/* Title bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '20px 28px',
            borderBottom: `2px solid ${COLORS.frame}`,
            color: COLORS.text,
            fontSize: 24,
          }}
        >
          <div style={{ width: 16, height: 16, borderRadius: 8, background: '#ff5f56' }} />
          <div style={{ width: 16, height: 16, borderRadius: 8, background: '#ffbd2e' }} />
          <div style={{ width: 16, height: 16, borderRadius: 8, background: '#27c93f' }} />
          <div style={{ display: 'flex', marginLeft: 16 }}>
            <span style={{ color: COLORS.accent }}>neel</span>@portfolio: {path}
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 64px' }}>
          <div
            style={{
              display: 'flex',
              color: COLORS.accent,
              fontSize: 26,
              letterSpacing: 4,
              textTransform: 'uppercase',
            }}
          >
            {`> ${eyebrow}`}
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 20,
              color: COLORS.heading,
              fontSize: title.length > 40 ? 60 : 76,
              fontWeight: 700,
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>
          <div style={{ display: 'flex', marginTop: 24, color: COLORS.text, fontSize: 30, lineHeight: 1.4 }}>
            {subtitle}
          </div>
        </div>
      </div>
    </div>
  );
}
