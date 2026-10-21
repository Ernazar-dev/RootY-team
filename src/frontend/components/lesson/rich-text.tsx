import { Fragment } from "react";

// Lesson text format: `code`, **bold**, *italic*, blank line = new paragraph.
// Everything else is plain text; raw HTML is shown as text, never rendered.
export function Inline({ text }: { text: string }) {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g).map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code key={i} className="rounded bg-code px-1.5 py-0.5 font-mono text-[0.875em]">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export function RichText({ text }: { text: string }) {
  return text.split(/\n{2,}/).map((paragraph, i) => (
    <p key={i}>
      <Inline text={paragraph} />
    </p>
  ));
}
