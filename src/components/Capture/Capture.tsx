import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import s from './Capture.module.css';

export const Capture = () => {
  const video = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const photo = useRef<HTMLImageElement>(null);

  const [isStreaming, setStreaming] = useState<boolean>(false);
  const [pictureWidth] = useState<number>(320);
  const [pictureHeight, setPictureHeight] = useState<number>();

  const handleVideo = (stream: MediaStream) => {
    if (video.current) {
      video.current.srcObject = stream;
      video.current.play();
    }
  };

  const clearPicture = () => {
    if (!canvas.current || !photo.current) {
      return;
    }

    const context = canvas.current.getContext('2d');

    if (!context) {
      return;
    }

    context.fillStyle = '#aaa';
    context.fillRect(0, 0, canvas.current.width, canvas.current.height);

    const data = canvas.current.toDataURL('image/png');
    photo.current.setAttribute('src', data);
  };

  const takePicture = () => {
    if (
      !canvas.current ||
      !photo.current ||
      !video.current ||
      !pictureWidth ||
      !pictureHeight
    ) {
      clearPicture();
      return;
    }

    const context = canvas.current.getContext('2d');

    if (!context) {
      return;
    }

    canvas.current.width = pictureWidth;
    canvas.current.height = pictureHeight;
    context.drawImage(video.current, 0, 0, pictureWidth, pictureHeight);

    const data = canvas.current.toDataURL('image/png');
    photo.current.setAttribute('src', data);

    setStreaming(false);
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then(handleVideo)
      .catch(alert);

    if (!video.current) {
      return;
    }

    video.current.addEventListener(
      'canplay',
      () => {
        if (isStreaming || !video.current || !canvas.current || !pictureWidth) {
          return;
        }

        const picHeight =
          video.current.videoHeight / (video.current.videoWidth / pictureWidth);

        setPictureHeight(picHeight);

        canvas.current.setAttribute('width', pictureWidth.toString());
        canvas.current.setAttribute('height', picHeight.toString());

        setStreaming(true);
      },
      false,
    );
  }, []);

  return (
    <>
      <video className={clsx(s.video, !isStreaming && s.hidden)} ref={video} />
      <img
        className={clsx(s.photoResult, isStreaming && s.hidden)}
        ref={photo}
        alt="Output"
      />
      <canvas className={s.canvas} ref={canvas} />
      <div className={s.captureBar}>
        <button
          className={s.captureButton}
          type="button"
          disabled={!isStreaming}
          onClick={takePicture}>
          Capture
        </button>
      </div>
      {/* <select ref={selectR} />
      <button type="button" onClick={getVideoStream}>
        Start
      </button> */}
    </>
  );
};
