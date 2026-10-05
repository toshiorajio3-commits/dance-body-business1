import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dance Match β",
    short_name: "Dance Match",
    description: "自分に合うダンスの学び方・先生・スクール環境を整理するプロフィール",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f5f3",
    theme_color: "#111111",
    lang: "ja",
  };
}
