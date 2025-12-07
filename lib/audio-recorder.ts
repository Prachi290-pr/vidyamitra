// lib/audio-recorder.ts

let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];
let mediaStream: MediaStream | null = null;

/**
 * Ensures microphone resources are released and resets state.
 */
function cleanup() {
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
    mediaStream = null;
  }
  mediaRecorder = null;
  audioChunks = [];
}

/**
 * Starts the audio recording process and requests microphone access.
 * @returns {Promise<void>} Resolves when recording successfully starts.
 */
export async function startRecording(): Promise<void> {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    console.warn('Recording is already running.');
    return;
  }
  
  // Clean up any previous incomplete sessions
  cleanup();

  try {
    // 1. Get user's microphone media stream with higher quality settings (optional)
    mediaStream = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        // High quality settings
        sampleRate: 16000, 
        channelCount: 1, // Mono audio is often better for STT
      },
    });

    // 2. Initialize MediaRecorder, explicitly targeting a format Azure supports well (e.g., WAV or MP3/M4A via specific mimeTypes)
    // Using audio/webm is generally fine, but if issues persist, you might explore raw PCM or specific encoders.
    mediaRecorder = new MediaRecorder(mediaStream, { mimeType: 'audio/webm' });
    
    mediaRecorder.ondataavailable = (event: BlobEvent) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    mediaRecorder.onerror = (event) => {
      console.error('MediaRecorder Error:', event);
      cleanup();
    };

    mediaRecorder.start(1000); // Collect data chunks every 1 second
    console.log('Recording started. State:', mediaRecorder.state);

  } catch (err) {
    console.error('Error accessing microphone or starting recorder:', err);
    // User denied permission or no mic found
    alert('Failed to access the microphone. Please check permissions.');
    cleanup();
    throw err;
  }
}

/**
 * Stops the audio recording.
 * @returns {Promise<Blob>} Resolves with the final audio Blob (audio/webm).
 */
export function stopRecording(): Promise<Blob> {
  return new Promise((resolve, reject) => {
    if (!mediaRecorder || mediaRecorder.state !== 'recording') {
      console.warn('MediaRecorder is not in a recording state.');
      cleanup();
      return reject(new Error('Recorder not active.'));
    }

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      console.log('Recording stopped. Final Blob size:', audioBlob.size);
      cleanup(); // Release resources after successful stop
      resolve(audioBlob);
    };

    mediaRecorder.stop();
  });
}