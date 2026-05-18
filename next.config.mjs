/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "image.mux.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/api/payments/:gateway/webhook",
        headers: [{ key: "x-robots-tag", value: "noindex" }],
      },
    ];
  },
};

export default nextConfig;
