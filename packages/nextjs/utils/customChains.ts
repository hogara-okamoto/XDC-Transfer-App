import { defineChain } from "viem";

// XDC Apothem Testnet
export const xdcApothem = defineChain({
  id: 51,
  name: "XDC Apothem Testnet",
  nativeCurrency: { name: "XDC", symbol: "XDC", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://rpc.ankr.com/xdc_testnet"],
    },
  },
  blockExplorers: {
    default: {
      name: "Apothem Explorer",
      url: "https://explorer.apothem.network",
    },
  },
  testnet: true,
});

// XDC Mainnet
export const xdcMainnet = defineChain({
  id: 50,
  name: "XDC Network",
  nativeCurrency: { name: "XDC", symbol: "XDC", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://erpc.xinfin.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "XDC Explorer",
      url: "https://explorer.xinfin.network",
    },
  },
  testnet: false,
});
