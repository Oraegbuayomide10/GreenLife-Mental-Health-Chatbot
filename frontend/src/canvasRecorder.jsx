import { useEffect, useRef } from "react";

const CanvasRecorder = () => {
  const canvasRef = useRef(null);
  const recordedChunks = useRef([]);
  const mediaRecorder = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Draw something simple to record
    let x = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "blue";
      ctx.fillRect(x, 50, 100, 100);
      x = (x + 2) % canvas.width;
      requestAnimationFrame(draw);
    };
    draw();

    const stream = canvas.captureStream(30);
    mediaRecorder.current = new MediaRecorder(stream, {
      mimeType: "video/webm; codecs=vp9",
    });

    mediaRecorder.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.current.push(event.data);
      }
    };

    mediaRecorder.current.onstop = () => {
      const blob = new Blob(recordedChunks.current, {
        type: "video/webm",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "recording.webm";
      a.click();
      URL.revokeObjectURL(url);
    };

    mediaRecorder.current.start();

    const stopRecording = () => {
      mediaRecorder.current.stop();
    };

    const timeoutId = setTimeout(stopRecording, 9000);

    return () => clearTimeout(timeoutId);
  }, []);

  return <canvas ref={canvasRef} width={640} height={360} />;
};

export default CanvasRecorder;
