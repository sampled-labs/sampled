/**
 * Downloads an audio file from an IPFS link or URL with optional progress tracking
 * @param ipfs_link - The IPFS link or URL to the audio file
 * @param filename - Optional custom filename (defaults to extracted from URL or "audio")
 * @param onProgress - Optional callback for download progress (0-100)
 * @returns Promise that resolves when download starts/completes
 */
export const downloadAudio = async (
  ipfs_link: string,
  filename?: string,
  onProgress?: (progress: number) => void,
): Promise<void> => {
  try {
    const response = await fetch(ipfs_link);

    if (!response.ok) {
      throw new Error(`Failed to fetch audio: ${response.statusText}`);
    }

    let blob: Blob;

    if (onProgress && response.body) {
      const contentLength = response.headers.get("content-length");
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      const reader = response.body.getReader();
      let receivedLength = 0;
      const chunks: Uint8Array[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        receivedLength += value.length;

        if (total > 0) {
          const progress = Math.round((receivedLength / total) * 100);
          onProgress(progress);
        }
      }

      const allChunks = new Uint8Array(receivedLength);
      let position = 0;
      for (const chunk of chunks) {
        allChunks.set(chunk, position);
        position += chunk.length;
      }

      blob = new Blob([allChunks], {
        type: response.headers.get("content-type") || "audio/mpeg",
      });
      onProgress(100);
    } else {
      blob = await response.blob();
    }

    // Extract filename from URL if not provided
    let finalFilename = filename;
    if (!finalFilename) {
      const urlParts = ipfs_link.split("/");
      const urlFilename = urlParts[urlParts.length - 1];

      if (urlFilename && urlFilename.includes(".")) {
        finalFilename = urlFilename;
      } else {
        const timestamp = new Date().getTime();
        finalFilename = `audio-${timestamp}.mp3`;
      }
    }

    // Ensure filename has an extension
    if (!finalFilename.includes(".")) {
      const extension = blob.type.split("/")[1] || "mp3";
      finalFilename = `${finalFilename}.${extension}`;
    }

    // Create a temporary URL for the blob
    const blobUrl = window.URL.createObjectURL(blob);

    // Create a temporary anchor element and trigger download
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = finalFilename;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Error downloading audio:", error);
    throw new Error(
      `Failed to download audio: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};
