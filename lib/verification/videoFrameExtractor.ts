// lib/verification/videoFrameExtractor.ts

export interface FrameExtractionOptions {
  framesPerSecond?: number;
  maxFrames?: number;
  quality?: number;
  maxDimension?: number;
}

export interface FrameExtractionResult {
  frames: string[];
  totalFrames: number;
  videoDuration: number;
  videoResolution: { width: number; height: number };
}

/**
 * Client-side video frame extractor (Nocena Engine)
 * Extracts base64 JPEG frames at evenly spaced intervals from a video Blob.
 */
export async function extractVideoFrames(
  videoBlob: Blob,
  options: FrameExtractionOptions = {}
): Promise<FrameExtractionResult> {
  const { framesPerSecond = 2, maxFrames = 10, quality = 0.7, maxDimension = 640 } = options;

  console.log('[FrameExtractor] Extracting frames from video blob size:', `${(videoBlob.size / 1024).toFixed(1)} KB`);

  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return reject(new Error('Canvas context unavailable'));
    }

    const videoUrl = URL.createObjectURL(videoBlob);
    const frames: string[] = [];

    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error('Extrakce snímků z videa vypršela'));
    }, 20000);

    const cleanup = () => {
      clearTimeout(timeout);
      URL.revokeObjectURL(videoUrl);
      video.remove();
    };

    video.onloadedmetadata = async () => {
      try {
        const duration = video.duration && isFinite(video.duration) ? video.duration : 10;
        const width = video.videoWidth || 640;
        const height = video.videoHeight || 480;

        let canvasWidth = width;
        let canvasHeight = height;

        if (Math.max(width, height) > maxDimension) {
          const scale = maxDimension / Math.max(width, height);
          canvasWidth = Math.round(width * scale);
          canvasHeight = Math.round(height * scale);
        }

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // Generate time points
        const timePoints: number[] = [];
        const interval = duration / Math.min(maxFrames, 10);
        for (let t = 0.2; t < duration; t += interval) {
          if (timePoints.length < maxFrames) {
            timePoints.push(t);
          }
        }

        if (timePoints.length === 0) {
          timePoints.push(0.5, 1.5, 2.5, 3.5, 4.5);
        }

        // Seek and extract frames
        for (const timePoint of timePoints) {
          await new Promise<void>((resSeek) => {
            const onSeek = () => {
              video.removeEventListener('seeked', onSeek);
              resSeek();
            };
            video.addEventListener('seeked', onSeek);
            video.currentTime = timePoint;
          });

          ctx.clearRect(0, 0, canvasWidth, canvasHeight);
          ctx.drawImage(video, 0, 0, canvasWidth, canvasHeight);

          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          const base64 = dataUrl.split(',')[1];
          if (base64 && base64.length > 500) {
            frames.push(base64);
          }
        }

        cleanup();
        resolve({
          frames,
          totalFrames: frames.length,
          videoDuration: duration,
          videoResolution: { width, height }
        });
      } catch (err) {
        cleanup();
        reject(err);
      }
    };

    video.onerror = () => {
      cleanup();
      reject(new Error('Nepodařilo se načíst video pro extrakci snímků'));
    };

    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    video.src = videoUrl;
  });
}
