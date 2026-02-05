import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	devIndicators: {
		appIsrStatus: false,
	},
	turbopack: {
		root: __dirname,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images-na.ssl-images-amazon.com",
			},
			{
				protocol: "https",
				hostname: "i.gr-assets.com",
			},
			{
				protocol: "https",
				hostname: "images.gr-assets.com",
			},
		],
	},
};

export default nextConfig;
