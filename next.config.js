module.exports = {
  reactStrictMode: true,
  env: {
    solanaApi: 'https://solana-mainnet.g.alchemy.com/v2/mkS5RTRkNAuSVqodGQPQED87YaVIwyLJ'
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  }
}
