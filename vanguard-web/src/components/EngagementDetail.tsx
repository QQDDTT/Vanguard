import { useEffect, useState, useRef } from 'react';
import { ArrowLeft, Play, Activity } from 'lucide-react';
import { CodeDiffViewer } from './CodeDiffViewer';
import { ToolExecutionLog } from './ToolExecutionLog';

interface EngagementDetailProps {
  engagementId: string;
  onBack: () => void;
}

type SseEvent = 
  | { type: 'Message', content: string }
  | { type: 'ToolCall', name: string, args: any, status: string, result?: string }
  | { type: 'FilePatch', file_path: string, diff: string, rationale: string };

export function EngagementDetail({ engagementId, onBack }: EngagementDetailProps) {
  const [events, setEvents] = useState<SseEvent[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const eventsEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    eventsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [events]);

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    setEvents([]);
    try {
      // 1. Call REST API to start background task
      const res = await fetch(`/api/v1/engagements/${engagementId}/analyze`, {
        method: 'POST'
      });
      const data = await res.json();
      
      // 2. Connect to SSE Stream
      const eventSource = new EventSource(data.stream_url);
      
      eventSource.onmessage = (e) => {
        try {
          const parsed: SseEvent = JSON.parse(e.data);
          
          setEvents(prev => {
            // For ToolCall, we want to update the existing one if it changes status
            if (parsed.type === 'ToolCall') {
              const existingIdx = prev.findIndex(ev => ev.type === 'ToolCall' && ev.name === parsed.name && JSON.stringify(ev.args) === JSON.stringify(parsed.args));
              if (existingIdx !== -1) {
                const newEvents = [...prev];
                newEvents[existingIdx] = parsed;
                return newEvents;
              }
            }
            return [...prev, parsed];
          });
        } catch (err) {
          // Fallback if the server sends plain text
          setEvents(prev => [...prev, { type: 'Message', content: e.data }]);
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        setIsAnalyzing(false);
      };

    } catch (e) {
      console.error(e);
      setIsAnalyzing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <button 
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '1rem'
          }}
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        
        <button
          onClick={startAnalysis}
          disabled={isAnalyzing}
          style={{
            background: isAnalyzing ? 'var(--color-surface)' : 'var(--color-accent)',
            color: isAnalyzing ? 'var(--color-text-secondary)' : '#000',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: isAnalyzing ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '600'
          }}
        >
          {isAnalyzing ? <Activity size={18} className="spin" /> : <Play size={18} />}
          {isAnalyzing ? 'Probing...' : 'Start Probing'}
        </button>
      </div>

      <div style={{
        flex: 1,
        background: 'rgba(20, 25, 35, 0.4)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '24px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {events.length === 0 ? (
          <div style={{ 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'var(--color-text-secondary)',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <Activity size={48} color="var(--color-surface)" />
            <p>Click "Start Probing" to initiate the AI diagnostic sequence.</p>
          </div>
        ) : (
          events.map((ev, idx) => (
            <div key={idx} style={{ width: '100%' }}>
              {ev.type === 'Message' && (
                <div style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  padding: '12px 16px', 
                  borderRadius: '12px',
                  color: 'var(--color-text-primary)'
                }}>
                  {ev.content}
                </div>
              )}
              {ev.type === 'ToolCall' && (
                <ToolExecutionLog 
                  name={ev.name} 
                  args={ev.args} 
                  status={ev.status} 
                  result={ev.result} 
                />
              )}
              {ev.type === 'FilePatch' && (
                <CodeDiffViewer 
                  filePath={ev.file_path} 
                  diff={ev.diff} 
                  rationale={ev.rationale} 
                />
              )}
            </div>
          ))
        )}
        <div ref={eventsEndRef} />
      </div>
    </div>
  );
}
