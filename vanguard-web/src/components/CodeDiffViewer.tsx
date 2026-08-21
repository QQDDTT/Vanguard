
import { FileCode, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface CodeDiffViewerProps {
  filePath: string;
  diff: string;
  rationale: string;
}

export function CodeDiffViewer({ filePath, diff, rationale }: CodeDiffViewerProps) {
  const [copied, setCopied] = useState(false);

  const lines = diff.split('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(diff);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      margin: '16px 0',
      borderRadius: '12px',
      background: 'rgba(20, 25, 35, 0.6)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      overflow: 'hidden'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-primary)' }}>
          <FileCode size={16} color="var(--color-accent)" />
          <span style={{ fontSize: '0.875rem', fontFamily: 'monospace' }}>{filePath}</span>
        </div>
        <button 
          onClick={handleCopy}
          style={{
            background: 'none',
            border: 'none',
            color: copied ? 'var(--color-success)' : 'var(--color-text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.75rem'
          }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy Patch'}
        </button>
      </div>

      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
          <strong>Rationale:</strong> {rationale}
        </p>
      </div>

      <div style={{
        padding: '16px',
        fontFamily: 'monospace',
        fontSize: '0.875rem',
        lineHeight: '1.5',
        overflowX: 'auto'
      }}>
        {lines.map((line, idx) => {
          let color = 'var(--color-text-primary)';
          let bg = 'transparent';
          if (line.startsWith('+')) {
            color = '#a6e22e'; // Greenish
            bg = 'rgba(166, 226, 46, 0.1)';
          } else if (line.startsWith('-')) {
            color = '#f92672'; // Reddish
            bg = 'rgba(249, 38, 114, 0.1)';
          }

          return (
            <div key={idx} style={{ color, backgroundColor: bg, padding: '0 8px', whiteSpace: 'pre' }}>
              {line}
            </div>
          );
        })}
      </div>
    </div>
  );
}
