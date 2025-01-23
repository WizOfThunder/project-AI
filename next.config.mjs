/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, options) => {
    // Tambahkan aturan untuk menangani file .mp3
    config.module.rules.push({
      test: /\.(mp3)$/, // Cocokkan file dengan ekstensi .mp3
      type: "asset/resource", // Tandai file sebagai aset statis
      generator: {
        filename: "static/media/[hash][ext][query]", // Lokasi output file
      },
    });

    return config; // Kembalikan konfigurasi yang telah dimodifikasi
  },
};

export default nextConfig;
