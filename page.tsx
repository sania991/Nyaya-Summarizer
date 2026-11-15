import Shell from '@/components/Shell';
import UploadForm from '@/components/UploadForm';

export const metadata = { title: 'Upload judgment' };

export default function Upload() {
  return (
    <Shell>
      {() => (
        <div style={{ maxWidth: 720 }}>
          <h1>Upload a judgment</h1>
          <p className="muted">You get a summary, key legal points, citations, similar judgments from your library, and any next hearing date found in the text.</p>
          <div className="panel"><UploadForm /></div>
        </div>
      )}
    </Shell>
  );
}
