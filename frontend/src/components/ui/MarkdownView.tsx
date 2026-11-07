'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownViewProps {
  content: string;
  className?: string;
}

export default function MarkdownView({ content, className = '' }: MarkdownViewProps) {
  if (!content) return null;

  return (
    <div className={`markdown-content text-zinc-200 leading-relaxed ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-5 mb-2 pb-1.5 border-b border-zinc-800 tracking-tight flex items-center gap-2" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-lg sm:text-xl font-bold text-zinc-100 mt-4 mb-2 tracking-tight flex items-center gap-2" {...props}>
              <span className="w-1.5 h-3.5 bg-red-500 rounded-2xs inline-block" />
              <span>{props.children}</span>
            </h2>
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-base font-bold text-zinc-200 mt-3 mb-1.5 text-zinc-300 hud-mono uppercase tracking-wider" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="mb-3 leading-relaxed text-zinc-300 text-sm sm:text-base font-sans" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-bold text-white tracking-wide" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="italic text-zinc-200 text-zinc-300" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="my-4 pl-4 pr-3 py-2.5 border-l-4 border-red-500 bg-zinc-900/80 rounded-r-lg text-zinc-200 text-sm sm:text-base font-serif space-y-1"
              {...props}
            />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside my-2 space-y-1 text-zinc-300 text-sm sm:text-base pl-2" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside my-2 space-y-1 text-zinc-300 text-sm sm:text-base pl-2" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="leading-relaxed" {...props} />
          ),
          hr: ({ node, ...props }) => (
            <hr className="my-5 border-zinc-800" {...props} />
          ),
          code: ({ node, className, children, ...props }) => (
            <code
              className="px-1.5 py-0.5 rounded bg-black text-red-400 border border-zinc-800 font-mono text-xs font-semibold"
              {...props}
            >
              {children}
            </code>
          ),
          pre: ({ node, ...props }) => (
            <pre className="p-3 my-3 rounded-lg bg-black/90 border border-zinc-800 overflow-x-auto text-xs font-mono text-zinc-300" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
