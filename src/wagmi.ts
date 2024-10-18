import { http, createConfig } from "wagmi";
import { bscTestnet, localhost, bsc } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export const config = createConfig({
  chains: [bsc, bscTestnet, localhost],
  connectors: [injected()],
  transports: {
    [bsc.id]: http(),
    [bscTestnet.id]: http(),
    [localhost.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
