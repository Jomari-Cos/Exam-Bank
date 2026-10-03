import React from 'react';
import { FlowchartNode } from '../../types';

interface FlowchartViewerProps {
  nodes: FlowchartNode[];
}

export const FlowchartViewer: React.FC<FlowchartViewerProps> = ({ nodes }) => {
  if (!nodes || nodes.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-lg">
        No flowchart structure defined.
      </div>
    );
  }

  return (
    <div className="border border-slate-200 rounded-lg bg-white p-4 overflow-x-auto">
      <div className="flex flex-col items-center gap-3 min-w-[340px] max-w-xl mx-auto py-2">
        {nodes.map((node, index) => {
          const isTerminal = node.type === 'terminal';
          const isDecision = node.type === 'decision';
          const isIO = node.type === 'io';
          const hasYesNo = isDecision && (node.yesNext || node.noNext);

          return (
            <React.Fragment key={node.id || index}>
              {/* Node Shape */}
              <div className="w-full flex flex-col items-center">
                {isTerminal && (
                  <div className="px-5 py-2 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-950 font-medium text-xs text-center shadow-sm max-w-xs">
                    {node.label}
                  </div>
                )}

                {isDecision && (
                  <div className="relative flex items-center justify-center p-3">
                    <div className="w-48 h-20 bg-amber-50 border-2 border-amber-500 transform rotate-45 flex items-center justify-center shadow-sm">
                      <div className="transform -rotate-45 text-center text-amber-950 text-xs font-semibold px-2">
                        {node.label}
                      </div>
                    </div>
                  </div>
                )}

                {isIO && (
                  <div className="px-5 py-2.5 bg-sky-50 border-2 border-sky-500 text-sky-950 text-xs font-medium text-center shadow-sm skew-x-[-12deg] max-w-xs">
                    <div className="skew-x-[12deg]">{node.label}</div>
                  </div>
                )}

                {!isTerminal && !isDecision && !isIO && (
                  <div className="px-5 py-2.5 rounded bg-slate-100 border-2 border-slate-600 text-slate-900 text-xs font-medium text-center shadow-sm max-w-xs">
                    {node.label}
                  </div>
                )}
              </div>

              {/* Connector Arrow */}
              {index < nodes.length - 1 && (
                <div className="flex flex-col items-center my-0.5">
                  {hasYesNo ? (
                    <div className="text-[11px] font-mono text-slate-500 flex items-center gap-3">
                      <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        [Branch ↓]
                      </span>
                    </div>
                  ) : null}
                  <div className="w-0.5 h-5 bg-slate-400"></div>
                  <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-slate-500"></div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
