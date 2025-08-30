"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { QRCodeCanvas } from "qrcode.react";
import { useZxing } from "react-zxing";
import { parseEther } from "viem";
import { useAccount, useWalletClient } from "wagmi";
import { Address, AddressInput, Balance, EtherInput } from "~~/components/scaffold-eth";
import { useTransactor } from "~~/hooks/scaffold-eth";

// Typed, simple scanner using react-zxing
function Scanner({ onDecoded }: { onDecoded: (text: string) => void }) {
  const { ref } = useZxing({
    onDecodeResult(result) {
      onDecoded(result.getText());
    },
    constraints: { video: { facingMode: { ideal: "environment" } } },
  });

  return (
    <div className="mt-3 rounded-xl border p-2">
      <video ref={ref} style={{ width: "100%", borderRadius: "0.75rem" }} />
    </div>
  );
}

const Home: NextPage = () => {
  const { address: connectedAddress, isConnected, chain } = useAccount();
  const { data: walletClient } = useWalletClient();
  const transactor = useTransactor(walletClient);

  const [destinationAddress, setDestinationAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Scanner UI state
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanError, setScanError] = useState<string>("");

  // simple EVM address check to avoid wallet JSON-RPC -32603 errors
  const isValidHexAddress = (addr: string) => /^0x[0-9a-fA-F]{40}$/.test(addr);

  return (
    <div className="flex items-center flex-col grow pt-10">
      <div className="px-5">
        <h1 className="text-center">
          <span className="block text-4xl font-bold">XDC Transfer App</span>
        </h1>

        {/* Connected address */}
        <div className="flex justify-center items-center space-x-2 flex-col">
          <p className="my-2 font-medium">Connected Address:</p>
          <Address address={connectedAddress} />
        </div>

        {/* Receive QR (auto-updates when wallet changes) */}
        <div className="my-8 flex justify-center">
          <div className="p-4 rounded-2xl shadow bg-white max-w-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Receive (Your Address)</h3>
              <span className="text-xs px-2 py-1 rounded bg-gray-100">{chain?.name ?? "Unknown"}</span>
            </div>

            {isConnected && connectedAddress ? (
              <>
                <div className="flex justify-center mb-3">
                  <QRCodeCanvas key={connectedAddress} value={connectedAddress} size={180} />
                </div>
                <div className="text-xs break-all text-center">{connectedAddress}</div>
                <button
                  className="mt-3 w-full rounded-xl py-2 bg-blue-600 text-white"
                  onClick={() => navigator.clipboard.writeText(connectedAddress)}
                >
                  Copy Address
                </button>
              </>
            ) : (
              <div className="text-gray-500">Connect wallet to show QR</div>
            )}
          </div>
        </div>

        {/* Wallet Balance Card */}
        <div className="mt-8 flex justify-center">
          <div className="card card-compact w-80 bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <h2 className="card-title text-lg">Wallet Balance</h2>
              <div className="text-2xl font-bold">
                <Balance address={connectedAddress} />
              </div>
            </div>
          </div>
        </div>

        {/* Send TXDC Card + Scanner */}
        <div className="mt-8 flex justify-center">
          <div className="card card-compact w-96 bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <h2 className="card-title text-lg">Send XDC</h2>
              <div className="w-full space-y-4">
                {/* Destination + Scan */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Destination Address</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <AddressInput
                        value={destinationAddress}
                        onChange={setDestinationAddress}
                        placeholder="Enter or scan destination address"
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => {
                        setScanError("");
                        setScannerOpen(s => !s);
                      }}
                    >
                      {scannerOpen ? "Close Scanner" : "Scan QR"}
                    </button>
                  </div>

                  {/* Scanner panel */}
                  {scannerOpen && (
                    <div className="mt-3 rounded-xl border p-2">
                      <div className="text-xs text-gray-600 mb-2">
                        Allow camera access. Works best on <b>https</b> or <b>localhost</b>.
                      </div>

                      <Scanner
                        onDecoded={text => {
                          const val = text.trim();
                          setDestinationAddress(val);
                          setScannerOpen(false);
                          setScanError("");
                        }}
                      />

                      {scanError && <div className="text-red-600 text-xs mt-2">{scanError}</div>}
                    </div>
                  )}
                </div>

                {/* Amount */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Amount (XDC)</span>
                  </label>
                  <EtherInput value={amount} onChange={setAmount} placeholder="Enter amount" />
                </div>

                {/* Send button */}
                <button
                  className="btn btn-primary w-full"
                  onClick={async () => {
                    if (!walletClient) return;
                    if (!isValidHexAddress(destinationAddress)) {
                      setScanError("Invalid destination address.");
                      return;
                    }
                    if (!amount) return;

                    setIsSending(true);
                    try {
                      await transactor({
                        to: destinationAddress as `0x${string}`,
                        value: parseEther(amount),
                      });
                      setDestinationAddress("");
                      setAmount("");
                      setScanError("");
                    } catch (error) {
                      console.error("Transaction failed:", error);
                    } finally {
                      setIsSending(false);
                    }
                  }}
                  disabled={!destinationAddress || !amount || isSending}
                >
                  {isSending ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Sending...
                    </>
                  ) : (
                    "Send TXDC"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hints */}
        {/* <p className="text-center text-lg mt-8">
          Get started by editing{" "}
          <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
            packages/nextjs/app/page.tsx
          </code>
        </p>
        <p className="text-center text-lg">
          Edit your smart contract{" "}
          <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
            YourContract.sol
          </code>{" "}
          in{" "}
          <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
            packages/hardhat/contracts
          </code>
        </p> */}
      </div>
    </div>
  );
};

export default Home;
