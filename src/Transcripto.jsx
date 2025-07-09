import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Transcripto = () => {
  const [audioFile, setAudioFile] = useState(null);
  const { transcript, resetTranscript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      alert('Your browser does not support speech recognition.');
    }
  }, [browserSupportsSpeechRecognition]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      // Implement audio file processing logic here
    } else {
      alert('Please select a valid audio file.');
    }
  };

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const reset = () => {
    resetTranscript();
    setAudioFile(null);
  };

  return (
    <div className="transcripto-container">
      <div className="header">
        <h1>TRANSCRIPTO</h1>
        <p className="subtitle">Convert audio files or speech to text</p>
      </div>
      <div className="action-buttons">
        <button className="btn" onClick={startListening} disabled={listening}>
          Start Mic
        </button>
        <button className="btn stop" onClick={stopListening} disabled={!listening}>
          Stop Mic
        </button>
        <button className="btn reset" onClick={reset}>
          Reset Text
        </button>
      </div>
      <div className="file-upload">
        <label htmlFor="audio-file" className="file-label">
          Select Audio File
        </label>
        <input
          type="file"
          id="audio-file"
          accept="audio/*"
          onChange={handleFileChange}
          className="file-input"
        />
        {audioFile && <p>{audioFile.name}</p>}
      </div>
      <div className="transcript-box">
        {transcript ? transcript : 'No transcription yet.'}
      </div>
    </div>
  );
};

export default Transcripto;