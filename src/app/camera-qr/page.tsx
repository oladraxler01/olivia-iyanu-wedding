"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";

const CAMERA_URL = "https://www.oliviawedsiyanu.xyz/#disposable-camera";

export default function CameraQRPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, CAMERA_URL, {
        width: 320,
        margin: 2,
        color: {
          dark: "#0E5C52",
          light: "#FDFBF7",
        },
      });
    }
  }, []);

  const handlePrint = () => window.print();

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "olivia-iyanu-camera-qr.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Inter:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #FDFBF7;
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .page {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem 1rem;
          width: 100%;
        }

        /* ── Printable card ── */
        .card {
          background: #fff;
          border: 2px solid #E3D3DA;
          border-radius: 24px;
          padding: 3rem 2.5rem;
          max-width: 440px;
          width: 100%;
          text-align: center;
          box-shadow: 0 20px 60px rgba(14,92,82,0.08);
          position: relative;
          overflow: hidden;
        }

        .card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 6px;
          background: linear-gradient(90deg, #0E5C52, #B23A6B, #D4AF37);
        }

        .camera-icon {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }

        .couple {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 2.2rem;
          font-weight: 300;
          font-style: italic;
          color: #0E5C52;
          line-height: 1.2;
          margin-bottom: 0.25rem;
        }

        .subtitle {
          font-family: 'Inter', sans-serif;
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #B23A6B;
          margin-bottom: 1.75rem;
        }

        .qr-wrapper {
          background: #FDFBF7;
          border-radius: 16px;
          padding: 1.25rem;
          display: inline-block;
          border: 1.5px solid #E3D3DA;
          margin-bottom: 1.75rem;
        }

        .qr-wrapper canvas {
          display: block;
          border-radius: 8px;
        }

        .instruction {
          font-size: 0.85rem;
          color: #6B5A63;
          line-height: 1.6;
          margin-bottom: 0.6rem;
        }

        .instruction strong {
          color: #0E5C52;
        }

        .divider {
          width: 40px;
          height: 1px;
          background: #E3D3DA;
          margin: 1.25rem auto;
        }

        .url-label {
          font-size: 0.65rem;
          color: #aaa;
          letter-spacing: 0.05em;
          word-break: break-all;
        }

        /* ── Action buttons (hidden on print) ── */
        .actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .btn {
          padding: 0.65rem 1.8rem;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .btn-primary {
          background: #0E5C52;
          color: #fff;
        }
        .btn-primary:hover { background: #0A4A42; transform: translateY(-1px); }

        .btn-outline {
          background: transparent;
          border: 1.5px solid #0E5C52;
          color: #0E5C52;
        }
        .btn-outline:hover { background: #E8F0EF; transform: translateY(-1px); }

        /* ── Print styles ── */
        @media print {
          body { background: #fff; }
          .actions { display: none !important; }
          .card {
            box-shadow: none;
            border: 1px solid #ccc;
            page-break-inside: avoid;
          }
        }
      `}</style>

      <div className="page">
        {/* Printable card */}
        <div className="card" id="qr-card">
          <div className="camera-icon">📷</div>
          <h1 className="couple">Olivia &amp; Iyanu</h1>
          <p className="subtitle">Digital Disposable Camera</p>

          <div className="qr-wrapper">
            <canvas ref={canvasRef} />
          </div>

          <p className="instruction">
            Scan this QR code on your phone to upload the candid photos &amp; videos you took on our special day.
          </p>
          <p className="instruction">
            <strong>Friday, October 30 · 2026</strong>
          </p>

          <div className="divider" />
          <p className="url-label">{CAMERA_URL}</p>
        </div>

        {/* Action buttons */}
        <div className="actions">
          <button className="btn btn-primary" onClick={handlePrint}>
            🖨️ &nbsp;Print QR Code
          </button>
          <button className="btn btn-outline" onClick={handleDownload}>
            ⬇️ &nbsp;Download PNG
          </button>
        </div>
      </div>
    </>
  );
}
