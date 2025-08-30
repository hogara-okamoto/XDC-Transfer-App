declare module "react-qr-reader" {
  import * as React from "react";

  export interface QrReaderProps {
    constraints?: MediaTrackConstraints;
    scanDelay?: number;
    onResult?: (result: any, error: any) => void; // v3 API
    onScan?: (data: string | null) => void; // v2 compatibility
    onError?: (err: any) => void; // v2 compatibility
    videoStyle?: React.CSSProperties;
    containerStyle?: React.CSSProperties;
    className?: string;
  }

  const QrReader: React.FC<QrReaderProps>;
  export default QrReader;
}
