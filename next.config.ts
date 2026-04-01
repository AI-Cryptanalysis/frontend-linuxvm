import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: false,
};
module.exports = {
  allowedDevOrigins: ['192.168.56.1'],
}
export default nextConfig;
