"use client";

import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useAccount } from "wagmi";

export default function ReceiveQR() {
  const { address } = useAccount();
  const [addr, setAddr] = useState<string>("");

  useEffect(() => {
    if (address) setAddr(address);
  }, [address]);

  if (!addr) return <div className="text-gray-500">Connect wallet to show QR</div>;

  return (
    <div className="p-4 rounded-2xl shadow bg-white max-w-sm">
      <h3 className="text-lg font-semibold mb-3">Receive (Your Address)</h3>
      <div className="flex justify-center mb-3">
        <QRCodeCanvas value={addr} size={180} />
      </div>
      <div className="text-xs break-all text-center">{addr}</div>
      <button
        className="mt-3 w-full rounded-xl py-2 bg-blue-600 text-white"
        onClick={() => navigator.clipboard.writeText(addr)}
      >
        Copy Address
      </button>
    </div>
  );
}
