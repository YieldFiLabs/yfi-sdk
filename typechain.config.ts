import { defineConfig } from "@typechain/ethers-v6";

export default defineConfig({
  target: "ethers-v6",
  outDir: "src/typechain/contracts",
  glob: "abis/v3/*.json",
  alwaysGenerateOverloads: false,
  discriminateTypes: false,
  tsNocheck: false,
});
