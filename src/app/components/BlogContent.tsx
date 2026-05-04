/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import parse, {
  domToReact,
  HTMLReactParserOptions,
  Element,
  DOMNode,
} from "html-react-parser";

interface BlogContentProps {
  html: string;
}

function parseCssString(styleStr: string): React.CSSProperties {
  const style: Record<string, string> = {};
  styleStr.split(";").forEach((rule) => {
    const colonIdx = rule.indexOf(":");
    if (colonIdx === -1) return;
    const prop = rule.slice(0, colonIdx).trim();
    const value = rule.slice(colonIdx + 1).trim();
    if (!prop || !value) return;
    const camel = prop.replace(/-([a-z])/g, (_, l) => l.toUpperCase());
    style[camel] = value;
  });
  return style as React.CSSProperties;
}

const BlogContent: React.FC<BlogContentProps> = ({ html }) => {
  let afterFinalThoughts = false;

  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element) {
        const children = domToReact(domNode.children as DOMNode[], options);

        switch (domNode.name) {
          // ── Wrapper div from admin normalizeDescription ───────────────────
          case "div":
            return (
              <div className="w-full break-words [word-break:normal]">
                {children}
              </div>
            );

          // ── Paragraphs ────────────────────────────────────────────────────
          case "p": {
            const text = domNode.children
              .map((child: any) => child.data || "")
              .join("")
              .trim();

            if (text === "Final Thoughts") {
              afterFinalThoughts = true;
              return (
                <p className="font-bold text-gray-900 my-4">{children}</p>
              );
            }
            if (afterFinalThoughts) {
              afterFinalThoughts = false;
              return (
                <p className="font-bold text-gray-800 mb-4">{children}</p>
              );
            }
            return (
              <p className="text-gray-700 leading-relaxed mb-4">
                {children}
              </p>
            );
          }

          // ── Headings ──────────────────────────────────────────────────────
          case "h1":
            return (
              <h1 className="text-3xl font-bold mt-6 mb-4 text-gray-900">
                {children}
              </h1>
            );
          case "h2":
            return (
              <h2 className="text-2xl font-semibold mt-5 mb-3 text-gray-800">
                {children}
              </h2>
            );
          case "h3":
            return (
              <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-700">
                {children}
              </h3>
            );
          case "h4":
            return (
              <h4 className="text-lg font-bold mt-4 mb-2 text-gray-700">
                {children}
              </h4>
            );
          case "h5":
            return (
              <h5 className="text-base font-bold mt-3 mb-2 text-gray-700">
                {children}
              </h5>
            );
          case "h6":
            return (
              <h6 className="text-sm font-bold mt-3 mb-2 text-gray-600">
                {children}
              </h6>
            );

          // ── Inline formatting ─────────────────────────────────────────────
          case "strong":
          case "b":
            return <strong className="font-bold">{children}</strong>;

          case "em":
          case "i":
            return <em className="italic">{children}</em>;

          case "u":
            return <u className="underline">{children}</u>;

          case "s":
          case "strike":
            return <s className="line-through text-gray-500">{children}</s>;

          case "br":
            return <br />;

          // Quill colour/background spans — preserve inline style
          case "span":
            return (
              <span
                style={
                  domNode.attribs?.style
                    ? parseCssString(domNode.attribs.style)
                    : undefined
                }
              >
                {children}
              </span>
            );

          // ── Links ─────────────────────────────────────────────────────────
          case "a":
            return (
              <a
                href={domNode.attribs.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800 break-words [word-break:normal]"
              >
                {children}
              </a>
            );

          // ── Lists ─────────────────────────────────────────────────────────
          case "ul":
            return (
              <ul className="list-disc pl-6 space-y-2 my-4">{children}</ul>
            );
          case "ol":
            return (
              <ol className="list-decimal pl-6 space-y-2 my-4">{children}</ol>
            );
          case "li":
            return <li className="text-gray-700">{children}</li>;

          // ── Blockquote ────────────────────────────────────────────────────
          case "blockquote":
            return (
              <blockquote className="border-l-4 border-teal-500 pl-4 italic text-gray-600 my-4 bg-teal-50 py-2 pr-3 rounded-r-md">
                {children}
              </blockquote>
            );

          // ── Code blocks (Quill outputs <pre class="ql-syntax">) ───────────
          case "pre":
            return (
              <pre className="bg-gray-900 text-green-300 rounded-lg p-4 my-4 overflow-x-auto text-sm leading-relaxed whitespace-pre-wrap max-w-full">
                {children}
              </pre>
            );

          case "code":
            return (
              <code className="bg-gray-100 text-teal-700 px-1.5 py-0.5 rounded text-sm font-mono break-words [word-break:normal]">
                {children}
              </code>
            );

          // ── Images ────────────────────────────────────────────────────────
          case "img":
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={domNode.attribs.src}
                alt={domNode.attribs.alt || ""}
                className="my-4 rounded-md max-w-full h-auto block"
              />
            );

          // ── Section ───────────────────────────────────────────────────────
          case "section":
            return <section className="py-3">{children}</section>;

          // ── Tables ────────────────────────────────────────────────────────
          case "table":
            return (
              <div className="overflow-x-auto my-4 rounded-md border border-gray-200">
                <table className="min-w-full text-sm text-left">
                  {children}
                </table>
              </div>
            );
          case "thead":
            return <thead className="bg-gray-50 text-gray-700">{children}</thead>;
          case "tbody":
            return <tbody className="divide-y divide-gray-100">{children}</tbody>;
          case "tr":
            return <tr className="border-b border-gray-100">{children}</tr>;
          case "th":
            return (
              <th className="px-4 py-2 font-semibold text-gray-700 whitespace-nowrap">
                {children}
              </th>
            );
          case "td":
            return (
              <td className="px-4 py-2 text-gray-600">
                {children}
              </td>
            );
        }
      }
      return undefined;
    },
  };

  const normalizedHtml = html.replace(/&nbsp;/g, " ");

  return (
    <div className="w-full break-words [word-break:normal]">
      {parse(normalizedHtml, options)}
    </div>
  );
};

export default BlogContent;
