import { useState } from 'react';
import { createEngagement } from '../lib/dataconnect';
import { dataConnect } from '../lib/firebase';
import { PlusCircle } from 'lucide-react';

interface Props {
  onCreated: () => void;
}

export function CreateEngagement({ onCreated }: Props) {
  const [name, setName] = useState('');
  const [type, setType] = useState('INTERVIEW');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await createEngagement(dataConnect, {
        customerName: name,
        title: name,
        teamId: 'test-team',
        type: type as any,
      });
      setName('');
      onCreated();
    } catch (err) {
      console.error("Failed to create engagement:", err);
      alert("Error creating engagement. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="glass-panel animate-fade-in" onSubmit={handleSubmit} style={{ marginBottom: '2rem', display: 'flex', gap: '16px', alignItems: 'center' }}>
      <input 
        type="text" 
        placeholder="New Engagement Name..." 
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ flex: 1 }}
      />
      
      <select value={type} onChange={(e) => setType(e.target.value)} style={{ width: '200px' }}>
        <option value="INTERVIEW">INTERVIEW</option>
        <option value="WORKSHOP">WORKSHOP</option>
        <option value="POC">POC</option>
        <option value="DEPLOYMENT">DEPLOYMENT</option>
        <option value="TROUBLESHOOTING">TROUBLESHOOTING</option>
      </select>
      
      <button type="submit" className="primary" disabled={loading} style={{ whiteSpace: 'nowrap' }}>
        <PlusCircle size={18} />
        {loading ? 'Creating...' : 'Create Engagement'}
      </button>
    </form>
  );
}
