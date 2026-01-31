import path from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  sassOptions: {
    includePaths: ["./src/styles"]
  },
  webpack(config) {
    // Treat .scss under src/components as CSS modules (so Button.scss behaves like Button.module.scss)
    const oneOfRule = config.module.rules.find((r) => r.oneOf);
    if (oneOfRule?.oneOf) {
      const moduleScssRule = oneOfRule.oneOf.find(
        (r) => r.test?.toString().includes("scss") && r.test?.toString().includes("module")
      );
      if (moduleScssRule?.use) {
        oneOfRule.oneOf.unshift({
          test: /\.scss$/,
          include: path.join(__dirname, "src/components"),
          use: moduleScssRule.use,
        });
      }
    }
    return config;
  },
};

export default nextConfig;

