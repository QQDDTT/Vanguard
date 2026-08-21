
import { Terminal, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface ToolExecutionLogProps {
  name: string;
  args: any;
  status: string;
  result?: string | null;
}

export function ToolExecutionLog({ name, args, status, result }: ToolExecutionLogProps) {
  return (
    <div style={{
      margin: '12px 0',
      borderRadius: '8px',
      background: 'rgba(0, 0, 0, 0.4)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      fontFamily: 'monospace',
      overflow: 'hidden'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 12px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        gap: '8px'
      }}>
        {status === 'Executing' ? (
          <Loader2 size={14} className="spin" color="var(--color-accent)" />
        ) : status === 'Finished' ? (
          <CheckCircle2 size={14} color="var(--color-success)" />
        ) : (
          <XCircle size={14} color="var(--color-danger)" />
        )}
        <Terminal size={14} color="var(--color-text-secondary)" />
        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-primary)' }}>
          {name}({JSON.stringify(args)})
        </span>
      </div>
      
      {result && (
        <div style={{
          padding: '12px',
          fontSize: '0.75rem',
          color: status === 'Error' ? 'var(--color-danger)' : 'var(--color-text-secondary)',
          whiteSpace: 'pre-wrap',
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          {result}
        </div>
      )}
    </div>
  );
}
