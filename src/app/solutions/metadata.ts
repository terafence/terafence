import { Metadata } from "next";
import * as content from "./content";

export const metadata: Metadata = {
  title: content.metaTags.title,
  description: content.metaTags.description,
  openGraph: {
    title: content.metaTags.title,
    description: content.metaTags.description,
    images: [content.metaTags.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: content.metaTags.title,
    description: content.metaTags.description,
    images: [content.metaTags.ogImage],
  },
};