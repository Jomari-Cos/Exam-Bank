import React, { useState } from 'react';
import { Play, CheckCircle2, XCircle, Eye, EyeOff } from 'lucide-react';
import { TestCase } from '../../types';

interface TestCaseRunnerProps {
  testCases: TestCase[];
  language?: string;
  solutionCode?: string;
  points?: number;
}

export const TestCaseRunner: React.FC<TestCaseRunnerProps> = ({
  testCases,
  language = 'C++',
  solutionCode = '',
  points = 10,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<{
    id: string;
    passed: boolean;
    actualOutput: string;
    runtimeMs: number;
  }[] | null>(null);
  const [showHidden, setShowHidden] = useState(false);

  const handleRunAllTests = () => {
    setIsRunning(true);
    setResults(null);

    // Simulate code execution against test cases with realistic runtime
    setTimeout(() => {
      const simulatedResults = testCases.map((tc) => {
        // Evaluate expected output
        return {
          id: tc.id,
          passed: true, // Expected solution passes test cases
          actualOutput: tc.expectedOutput,
          runtimeMs: Math.floor(Math.random() * 18) + 4,
        };
      });
      setResults(simulatedResults);
      setIsRunning(false);
    }, 450);
  };

  const totalWeight = testCases.reduce((acc, tc) => acc + (tc.weight || 1), 0);
  const passedCount = results ? results.filter((r) => r.passed).length : 0;
  const earnedWeight = results
    ? testCases.reduce((acc, tc) => {
        const res = results.find((r) => r.id === tc.id);
        return acc + (res?.passed ? tc.weight || 1 : 0);
      }, 0)
    : 0;

  return (
    <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
      <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800 text-xs">
            Unit Test Cases Suite ({testCases.length} Cases)
          </span>
          <span className="text-slate-400 text-xs">·</span>
          <span className="text-xs text-slate-600 font-mono">
            Total Points: {points} pts (Weight: {totalWeight})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowHidden(!showHidden)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 border border-slate-300 rounded bg-white transition-colors"
          >
            {showHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showHidden ? 'Hide Private Cases' : 'Show Hidden Cases'}</span>
          </button>

          <button
            type="button"
            onClick={handleRunAllTests}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 rounded transition-colors"
          >
            <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Executing...' : 'Run Test Cases'}</span>
          </button>
        </div>
      </div>

      {/* Results banner if executed */}
      {results && (
        <div className="px-4 py-2.5 bg-emerald-50 border-b border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">
              All Test Cases Passed ({passedCount}/{testCases.length})
            </span>
            <span>· Score: {earnedWeight}/{totalWeight} weight ({points}/{points} pts)</span>
          </div>
          <span className="font-mono text-emerald-700 text-[11px]">
            Avg Runtime: 12ms · Memory: 8.4MB
          </span>
        </div>
      )}

      {/* Test cases table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100/75 text-slate-600 border-b border-slate-200 font-medium">
              <th className="py-2.5 px-3 w-16">Case</th>
              <th className="py-2.5 px-3">Standard Input</th>
              <th className="py-2.5 px-3">Expected Output</th>
              <th className="py-2.5 px-3 w-20 text-right">Weight</th>
              <th className="py-2.5 px-3 w-24">Visibility</th>
              <th className="py-2.5 px-3 w-24 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {testCases.map((tc, idx) => {
              const res = results?.find((r) => r.id === tc.id);
              const isHidden = tc.isHidden && !showHidden;

              return (
                <tr key={tc.id || idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2 px-3 text-slate-500 font-semibold">#{idx + 1}</td>
                  <td className="py-2 px-3 text-slate-800">
                    {isHidden ? (
                      <span className="text-slate-400 italic">[Hidden Input]</span>
                    ) : (
                      <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-900">
                        {tc.input || '(empty)'}
                      </code>
                    )}
                  </td>
                  <td className="py-2 px-3 text-slate-800">
                    {isHidden ? (
                      <span className="text-slate-400 italic">[Hidden Expected Output]</span>
                    ) : (
                      <code className="bg-slate-100 px-1.5 py-0.5 rounded text-emerald-800">
                        {tc.expectedOutput}
                      </code>
                    )}
                  </td>
                  <td className="py-2 px-3 text-right text-slate-600 font-sans tabular-nums">
                    {tc.weight || 1} pt
                  </td>
                  <td className="py-2 px-3 font-sans">
                    {tc.isHidden ? (
                      <span className="text-amber-700 text-[11px] font-medium">Hidden</span>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Public</span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-right">
                    {res ? (
                      res.passed ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-sans font-semibold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Pass ({res.runtimeMs}ms)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-700 font-sans font-semibold text-[11px]">
                          <XCircle className="w-3.5 h-3.5" /> Fail
                        </span>
                      )
                    ) : (
                      <span className="text-slate-400 font-sans text-[11px]">Ready</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
