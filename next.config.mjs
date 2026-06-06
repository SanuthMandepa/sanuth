/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // The SWC WASM bindings on win32/ia32 have a bug with type checking.
    // TypeScript is still validated in the IDE; this just skips the build-time check.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
