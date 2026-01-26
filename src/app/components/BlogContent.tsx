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

const BlogContent: React.FC<BlogContentProps> = ({ html }) => {
    console.log(html);
     let afterFinalThoughts = false; 
    
  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element) {
        const children = domToReact(domNode.children as DOMNode[], options);

        switch (domNode.name) {
            case "p": {
            const text = domNode.children
              .map((child: any) => child.data || "")
              .join("")
              .trim();

            // Case 1: The "Final Thoughts" paragraph
            if (text === "Final Thoughts") {
              afterFinalThoughts = true; // mark that next <p> should also be bold
              return (
                <p className="font-bold text-gray-900 my-4">{children}</p>
              );
            }

            // Case 2: The paragraph immediately after "Final Thoughts"
            if (afterFinalThoughts) {
              afterFinalThoughts = false; // reset so only one p is bolded
              return (
                <p className="font-bold text-gray-800 mb-4">{children}</p>
              );
            }
             // Default <p>
            return (
              <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
            );
          }
            
          case "section":
            return <section className="py-3">{children}</section>;
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
              <h3 className="text-xl font-medium mt-4 mb-2 text-gray-700">
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
              <h4 className="text-lg font-bold mt-4 mb-2 text-gray-700">
                {children}
              </h4>
            );
          case "p":
            return (
              <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
            );
          case "a":
            return (
              <a
                href={domNode.attribs.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                {children}
              </a>
            );
          case "ul":
            return <ul className="list-disc pl-6 space-y-2 my-4">{children}</ul>;
          case "ol":
            return (
              <ol className="list-decimal pl-6 space-y-2 my-4">{children}</ol>
            );
          case "li":
            return <li className="text-gray-700">{children}</li>;
          case "blockquote":
            return (
              <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4">
                {children}
              </blockquote>
            );
        }
      }
      return undefined;
    },
  };

  return <div>{parse(html, options)}</div>;
};

export default BlogContent;
