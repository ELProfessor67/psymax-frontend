"use client";
import React, { useRef, useEffect, useState } from "react";
import * as bodySegmentation from "@tensorflow-models/body-segmentation";
import "@tensorflow/tfjs-backend-webgl";

type Segmenter = bodySegmentation.BodySegmenter | null;

const App: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [segmenter, setSegmenter] = useState<Segmenter>(null);
  const [blurAmount, setBlurAmount] = useState<number>(0);
  const [isBlurMode, setIsBlurMode] = useState<boolean>(true);

  const initSegmenter = async () => {
    if (segmenter) return;

    const model = bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation;
    const segmenterConfig: bodySegmentation.MediaPipeSelfieSegmentationMediaPipeModelConfig = {
      runtime: "mediapipe",
      solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation",
      modelType: "general",
    };

    const newSegmenter = await bodySegmentation.createSegmenter(model, segmenterConfig);
    setSegmenter(newSegmenter);
  };

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { frameRate: 60, width: 640, height: 480 },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          initSegmenter();
        }
      } catch (err) {
        console.error(`An error occurred: ${err}`);
      }
    };

    startCamera();
  }, []);

  useEffect(() => {
    if (segmenter) {
      if (isBlurMode) {
        blurBackground(segmenter);
      } else {
        removeBackground(segmenter);
      }
    }
  }, [segmenter, blurAmount, isBlurMode]);

  const blurBackground = async (segmenter: bodySegmentation.BodySegmenter) => {
    const foregroundThreshold = 0.5;
    const edgeBlurAmount = 3;
    const flipHorizontal = false;
    const context = canvasRef.current?.getContext("2d");

    const processFrame = async () => {
      if (context && videoRef.current && canvasRef.current) {
        context.drawImage(videoRef.current, 0, 0, 640, 480);

        await bodySegmentation.drawBokehEffect(
          canvasRef.current,
          videoRef.current,
          await segmenter.segmentPeople(videoRef.current),
          foregroundThreshold,
          blurAmount,
          edgeBlurAmount,
          flipHorizontal
        );

        requestAnimationFrame(processFrame);
      }
    };

    requestAnimationFrame(processFrame);
  };

  const removeBackground = async (segmenter: bodySegmentation.BodySegmenter) => {
    const context = canvasRef.current?.getContext("2d");

    const processFrame = async () => {
      if (context && videoRef.current && canvasRef.current) {
        context.drawImage(videoRef.current, 0, 0, 640, 480);

        const segmentation = await segmenter.segmentPeople(videoRef.current);
        const foregroundColor = { r: 0, g: 0, b: 0, a: 12 };
        const backgroundColor = { r: 0, g: 0, b: 0, a: 15 };

        const coloredPartImage = await bodySegmentation.toBinaryMask(
          segmentation,
          foregroundColor,
          backgroundColor
        );

        const imageData = context.getImageData(0, 0, 640, 480);
        const pixels = imageData.data;

        for (let i = 3; i < pixels.length; i += 4) {
          if (coloredPartImage.data[i] === 15) {
            pixels[i] = 0;
          }
        }

        context.putImageData(imageData, 0, 0);

        requestAnimationFrame(processFrame);
      }
    };

    requestAnimationFrame(processFrame);
  };

  const handleBlurChange = (amount: number) => {
    setIsBlurMode(true);
    setBlurAmount(amount);
  };

  const setBackground = (id: number) => {
    setIsBlurMode(false);
    if (canvasRef.current) {
      canvasRef.current.style.backgroundImage = `url('/bg${id}.png')`;
    }
  };

  return (
    <div className="App">
      <video ref={videoRef} style={{ display: "none" }}></video>
      <canvas ref={canvasRef} width={640} height={480}></canvas>
      <div>
        <button
          className="py-2 px-4 bg-gray-300 rounded-md mx-3"
          onClick={() => handleBlurChange(0)}
        >
          No Blur
        </button>
        <button
          className="py-2 px-4 bg-gray-300 rounded-md mx-3"
          onClick={() => handleBlurChange(3)}
        >
          Low Blur
        </button>
        <button
          className="py-2 px-4 bg-gray-300 rounded-md mx-3"
          onClick={() => handleBlurChange(5)}
        >
          Medium Blur
        </button>
        <button
          className="py-2 px-4 bg-gray-300 rounded-md mx-3"
          onClick={() => handleBlurChange(10)}
        >
          High Blur
        </button>
        <button
          className="py-2 px-4 bg-gray-300 rounded-md mx-3"
          onClick={() => setBackground(1)}
        >
          Set Background 1
        </button>
        <button
          className="py-2 px-4 bg-gray-300 rounded-md mx-3"
          onClick={() => setBackground(2)}
        >
          Set Background 2
        </button>
      </div>
    </div>
  );
};

export default App;
