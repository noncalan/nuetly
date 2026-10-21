import katex from "katex";
import { Fragment } from "react";

/**
 * Renders text with inline math between `$…$`.
 * Content comes from our own reviewed question bank, and KaTeX escapes its output.
 */
export function MathText({ text, className }: { text: string; className?: string }) {
  const parts = text.split("$");
  return (
    <span className={className}>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <span
            key={index}
            dangerouslySetInnerHTML={{ __html: katex.renderToString(part, { throwOnError: false }) }}
          />
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </span>
  );
}
