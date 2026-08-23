import { useState, useEffect, useRef } from 'react';
import { 
  UploadCloud, 
  FileAudio, 
  Image as ImageIcon, 
  FileCode, 
  FileText, 
  CheckCircle2, 
  Clock, 
  HardDrive
} from 'lucide-react';

export interface ArtifactItem {
  id: string;
  engagement_id: string;
  file_name: string;
  artifact_type: string;
  file_size_bytes: number;
  storage_uri: string;
  status: string;
  created_at: string;
}

interface ArtifactUploaderProps {
  engagementId: string;
}

export function ArtifactUploader({ engagementId }: ArtifactUploaderProps) {
  const [artifacts, setArtifacts] = useState<ArtifactItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchArtifacts = async () => {
    try {
      const res = await fetch(`/api/v1/engagements/${engagementId}/artifacts`);
      if (res.ok) {
        const data = await res.json();
        setArtifacts(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch artifacts', err);
    }
  };

  useEffect(() => {
    fetchArtifacts();
  }, [engagementId]);

  const detectArtifactType = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    if (['mp3', 'm4a', 'wav', 'aac', 'ogg'].includes(ext)) return 'AUDIO';
    if (['jpg', 'jpeg', 'png', 'webp', 'svg'].includes(ext)) return 'IMAGE';
    if (['log', 'txt', 'pcap'].includes(ext)) return 'LOG';
    if (['json', 'yaml', 'yml', 'toml', 'conf', 'env'].includes(ext)) return 'CONFIG';
    return 'LOG';
  };

  const handleUploadFile = async (file: File) => {
    setUploading(true);
    setUploadProgress(10);

    try {
      const artifactType = detectArtifactType(file.name);

      // 1. 获取预签名 URL
      const presignRes = await fetch(`/api/v1/engagements/${engagementId}/artifacts/presign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file_name: file.name,
          file_size_bytes: file.size,
          artifact_type: artifactType,
        })
      });

      if (!presignRes.ok) throw new Error('Presign failed');
      const presignData = await presignRes.json();
      const { artifact_id } = presignData.data;

      setUploadProgress(50);

      // 2. 模拟直传 GCS
      await new Promise(r => setTimeout(r, 400));
      setUploadProgress(90);

      // 3. 确认上传完成
      const confirmRes = await fetch(`/api/v1/engagements/${engagementId}/artifacts/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artifact_id })
      });

      if (confirmRes.ok) {
        setUploadProgress(100);
        setTimeout(() => {
          setUploading(false);
          setUploadProgress(0);
          fetchArtifacts();
        }, 300);
      }
    } catch (err) {
      console.error(err);
      alert('上传失败，请重试');
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUploadFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUploadFile(file);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getArtifactIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'AUDIO':
        return <FileAudio size={18} color="#38bdf8" />;
      case 'IMAGE':
        return <ImageIcon size={18} color="#a855f7" />;
      case 'CONFIG':
        return <FileCode size={18} color="#34d399" />;
      default:
        return <FileText size={18} color="#fbbf24" />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* 拖拽上传区域 */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          background: isDragOver ? 'rgba(56, 189, 248, 0.12)' : 'rgba(15, 23, 42, 0.65)',
          border: isDragOver ? '2px dashed #38bdf8' : '1px dashed rgba(255, 255, 255, 0.15)',
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          cursor: 'pointer',
          transition: 'all 0.2s',
          backdropFilter: 'blur(8px)'
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept=".mp3,.m4a,.wav,.jpg,.jpeg,.png,.webp,.log,.txt,.json,.yaml,.toml"
        />
        
        <div style={{
          background: 'rgba(56, 189, 248, 0.15)',
          padding: '10px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <UploadCloud size={24} color="#38bdf8" />
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '0.92rem', color: '#f1f5f9', fontWeight: 500 }}>
            点击或拖拽上传现场多模态素材
          </p>
          <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
            支持现场录音 (.m4a/.wav)、机房机架照片 (.jpg/.png)、系统日志与配置文件 (GCS 直传)
          </p>
        </div>

        {uploading && (
          <div style={{ width: '80%', maxWidth: '300px', marginTop: '6px' }}>
            <div style={{
              height: '4px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '2px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${uploadProgress}%`,
                background: 'linear-gradient(90deg, #38bdf8, #2563eb)',
                transition: 'width 0.3s'
              }} />
            </div>
            <span style={{ fontSize: '0.72rem', color: '#38bdf8', display: 'block', textAlign: 'center', marginTop: '4px' }}>
              正在通过 GCS Presigned URL 直传中 ({uploadProgress}%)...
            </span>
          </div>
        )}
      </div>

      {/* 已上传素材列表 */}
      {artifacts.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <HardDrive size={14} color="#38bdf8" /> 已挂载现场素材 ({artifacts.length})
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
            {artifacts.map((art) => (
              <div
                key={art.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                  {getArtifactIcon(art.artifact_type)}
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{
                      fontSize: '0.85rem',
                      color: '#f8fafc',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontWeight: 500
                    }}>
                      {art.file_name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      {formatFileSize(art.file_size_bytes)} • {art.artifact_type}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{
                    background: art.status === 'UPLOADED' ? 'rgba(52, 211, 153, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                    color: art.status === 'UPLOADED' ? '#34d399' : '#fbbf24',
                    border: art.status === 'UPLOADED' ? '1px solid rgba(52, 211, 153, 0.3)' : '1px solid rgba(251, 191, 36, 0.3)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '0.68rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}>
                    {art.status === 'UPLOADED' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                    {art.status === 'UPLOADED' ? '已就绪' : '待处理'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
