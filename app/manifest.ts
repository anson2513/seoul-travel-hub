import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SEOUL Travel Hub",
    short_name: "韓旅 Hub",
    description: "Personal Travel Companion for Seoul 2026.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F7F5F2",
    theme_color: "#F7F5F2",
    orientation: "portrait",
    icons: [
      {
        src: "/images/app-icon-black-gold.png",
        sizes: "1254x1254",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
