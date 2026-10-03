import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeEditorViewerProps {
  code: string;
  language?: string;
  readOnly?: boolean;
  onChange?: (code: string) => void;
  maxHeight?: string;
  minHeight?: string;
  showLineNumbers?: boolean;
}

export const CodeEditorViewer: React.FC<CodeEditorViewerProps> = ({
  code,
  language = 'c++',
  readOnly = true,
  onChange,
  maxHeight = '400px',
  minHeight = '140px',
  showLineNumbers = true,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-950 text-slate-100 overflow-hidden font-mono text-xs">
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800 text-slate-400">
        <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
          {language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          title="Copy code"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      <div
        className="overflow-auto relative"
        style={{ maxHeight, minHeight }}
      >
        {readOnly ? (
          <div className="flex p-3 leading-relaxed">
            {showLineNumbers && (
              <div className="select-none text-slate-600 text-right pr-4 shrink-0 border-r border-slate-800 font-mono">
                {lines.map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
            )}
            <pre className="pl-4 text-emerald-300 whitespace-pre overflow-x-auto flex-1 font-mono">
              <code>{code}</code>
            </pre>
          </div>
        ) : (
          <div className="flex p-2">
            {showLineNumbers && (
              <div className="select-none text-slate-600 text-right pr-3 shrink-0 pt-1 border-r border-slate-800 font-mono">
                {lines.map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
            )}
            <textarea
              value={code}
              onChange={(e) => onChange && onChange(e.target.value)}
              className="w-full bg-transparent pl-3 text-emerald-300 font-mono text-xs leading-relaxed focus:outline-none resize-none"
              style={{ minHeight }}
              spellCheck={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};
