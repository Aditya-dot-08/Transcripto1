import React, { useState } from 'react';
import '../App.css';

export default function Transcripto() {
  const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'Hindi' },
    { code: 'es', label: 'Spanish' },
    { code: 'fr', label: 'French' },
    { code: 'de', label: 'German' },
  ];

  const FORMATS = [
    { value: 'txt', label: '.txt' },
    { value: 'pdf', label: '.pdf' },
    { value: 'docx', label: '.docx' },
  ];

  const [audioFiles, setAudioFiles] = useState([]);
  const [language, setLanguage] = useState('');
  const [format, setFormat] = useState('');
  const [status, setStatus] = useState('No file selected');
  const [transcripts, setTranscripts] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).filter(f => f.type.startsWith('audio/'));
    if (files.length === 0) return alert('Please upload valid audio files.');
    setAudioFiles(files);
    setTranscripts(Array(files.length).fill(''));
    setStatus(`${files.length} audio file(s) ready`);
    setShowPreview(false);
  };

  const handleTranscribe = async () => {
    if (audioFiles.length === 0) return alert('Upload audio first');
    if (!language) return alert('Please select a language');
    setIsLoading(true);
    setStatus('Transcribing…');
    setShowPreview(false);

    try {
      const results = await Promise.all(audioFiles.map(async (file) => {
        const form = new FormData();
        form.append('file', file);
        form.append('language', language);
        // replace with your API call, e.g.:
        // const resp = await fetch('/api/transcribe', { method: 'POST', body: form });
        // const json = await resp.json();
        // return json.text;
        return `Transcription of ${file.name}`; // placeholder
      }));

      setTranscripts(results);
      setStatus('Transcription complete');
    } catch (err) {
      console.error(err);
      setStatus('Error during transcription');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!transcripts.length || transcripts.every(t => !t)) {
      return alert('No transcripts to download');
    }

    transcripts.forEach((text, idx) => {
      const mime = format === 'pdf'
        ? 'application/pdf'
        : format === 'docx'
        ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        : 'text/plain';
      const blob = new Blob([text], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transcript_${idx + 1}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="transcripto-container">
      <h1>TRANSCRIPTO</h1>

      <div className="upload-box" onClick={() => document.getElementById('audio-input').click()}>
        <div className="upload-icon">🎵</div>
        <div className="upload-text">
          {audioFiles.length > 0
            ? audioFiles.map(f => f.name).join(', ')
            : 'Click to select audio file(s)'}
        </div>
        <input
          id="audio-input"
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          multiple
          style={{ display: 'none' }}
        />
      </div>

      <div className="action-row">
        <select
          className="small-dropdown"
          value={language}
          onChange={e => setLanguage(e.target.value)}
        >
          <option value="" disabled hidden>Select Language</option>
          {LANGUAGES.map(l => (
            <option key={l.code} value={l.code}>{l.label}</option>
          ))}
        </select>
        <button
          className="btn"
          onClick={handleTranscribe}
          disabled={audioFiles.length === 0 || isLoading}
        >
          {isLoading ? 'Transcribing...' : 'Transcribe'}
        </button>
      </div>

      <div className="status-bar">{status}</div>

      <div className="action-row">
        <select
          className="small-dropdown"
          value={format}
          onChange={e => setFormat(e.target.value)}
        >
          <option value="" disabled hidden>Select Format</option>
          {FORMATS.map(f => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
        <button
          className="btn"
          onClick={handleDownload}
          disabled={!format || transcripts.every(t => !t)}
        >
          Download
        </button>
      </div>

      {transcripts.some(t => t) && (
        <div className="action-row">
          <button
            className="btn preview-btn"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? 'Hide Preview' : 'Preview'}
          </button>
        </div>
      )}

      {showPreview && (
        <div className="preview-container">
          {transcripts.map((t, i) => (
            <div key={i}>
              <h4>File {i + 1}: {audioFiles[i].name}</h4>
              <pre className="preview-text">{t}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}