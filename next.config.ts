import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
			{
				protocol: "https",
				hostname: "a.ltrbxd.com",
			},
			{
				protocol: "https",
				hostname: "s.ltrbxd.com",
			},
		],
	},
};

export default nextConfig;
