interface BoxProps {
  x: number;
  y: number;
  title: string;
  sub: string;
}

function Box({ x, y, title, sub }: BoxProps) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={180}
        height={70}
        rx={10}
        strokeWidth={1.5}
        className="fill-surface stroke-line"
      />
      <text
        x={x + 90}
        y={y + 31}
        textAnchor="middle"
        fontSize={19}
        className="display fill-ink"
      >
        {title}
      </text>
      <text
        x={x + 90}
        y={y + 53}
        textAnchor="middle"
        fontSize={13}
        className="fill-ink-soft"
      >
        {sub}
      </text>
    </g>
  );
}

const ARROW = {
  fill: 'none',
  strokeWidth: 2,
  markerEnd: 'url(#arrowhead)',
} as const;

export function ArchitectureDiagram() {
  return (
    <div className="ticket overflow-x-auto p-4">
      <svg
        viewBox="0 0 920 300"
        role="img"
        aria-labelledby="arch-title arch-desc"
        className="text-ink-soft min-w-160"
      >
        <title id="arch-title">System architecture</title>
        <desc id="arch-desc">
          The browser talks to a Next.js app on Vercel. The app forwards API
          calls to an Express API on Render. The API uses MongoDB Atlas, Stripe
          Checkout and the Gemini API. Stripe sends webhooks back to the API.
        </desc>
        <defs>
          <marker
            id="arrowhead"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0 0L10 5L0 10z" fill="currentColor" />
          </marker>
        </defs>

        <path d="M190 150H248" stroke="currentColor" {...ARROW} />
        <path d="M430 150H488" stroke="currentColor" {...ARROW} />
        <path
          d="M670 140C700 140 700 55 728 55"
          stroke="currentColor"
          {...ARROW}
        />
        <path d="M670 150H728" stroke="currentColor" {...ARROW} />
        <path
          d="M670 160C700 160 700 245 728 245"
          stroke="currentColor"
          {...ARROW}
        />
        <path
          d="M728 172H672"
          stroke="currentColor"
          strokeDasharray="5 5"
          {...ARROW}
        />
        <text
          x={700}
          y={192}
          textAnchor="middle"
          fontSize={12}
          className="fill-ink-soft"
        >
          webhook
        </text>
        <text
          x={219}
          y={140}
          textAnchor="middle"
          fontSize={12}
          className="fill-ink-soft"
        >
          HTTPS
        </text>
        <text
          x={459}
          y={140}
          textAnchor="middle"
          fontSize={12}
          className="fill-ink-soft"
        >
          /api rewrite
        </text>

        <Box x={10} y={115} title="Browser" sub="Shopper or admin" />
        <Box x={250} y={115} title="Next.js" sub="Vercel, App Router" />
        <Box x={490} y={115} title="Express API" sub="Render, TypeScript" />
        <Box x={730} y={20} title="MongoDB" sub="Atlas, atomic stock" />
        <Box x={730} y={115} title="Stripe" sub="Hosted checkout" />
        <Box x={730} y={210} title="Gemini" sub="Function calling" />
      </svg>
    </div>
  );
}
