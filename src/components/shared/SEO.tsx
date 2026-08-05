import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "music.song" | "product";
  keywords?: string;
  noIndex?: boolean;
}

const DEFAULT_TITLE = "Sampled - Music IP Platform on Stellar Blockchain";
const DEFAULT_DESCRIPTION =
  "Register your music as IP assets, define licensing terms, and receive instant royalty payments. A two-layer platform connecting producers, artists, and fans on Stellar blockchain.";
const DEFAULT_IMAGE =
  "https://www.stellarsampled.com/assets/landing/og-image.png";
const SITE_URL = "https://www.stellarsampled.com";
const TWITTER_HANDLE = "@Osaretinfrank3";

export const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url,
  type = "website",
  keywords,
  noIndex = false,
}: SEOProps) => {
  const pageTitle = title ? title + " | Sampled" : DEFAULT_TITLE;
  const pageUrl = url ? SITE_URL + url : SITE_URL;

  // Organization structured data
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Sampled",
    url: SITE_URL,
    logo: SITE_URL + "/favicon.ico",
    description: "Music IP Platform on Stellar Blockchain",
    sameAs: ["https://x.com/Osaretinfrank3"],
  };

  // WebSite structured data
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Sampled",
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: SITE_URL + "/explore?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  // Page-specific structured data
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": type === "music.song" ? "MusicRecording" : "WebPage",
    name: title || "Sampled",
    description: description,
    url: pageUrl,
    image: image,
    ...(type === "music.song" && {
      "@type": "MusicRecording",
      inAlbum: {
        "@type": "MusicAlbum",
        name: "Sampled Marketplace",
      },
    }),
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={pageUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:creator" content={TWITTER_HANDLE} />
      <meta name="twitter:url" content={pageUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      <script type="application/ld+json">{JSON.stringify(pageSchema)}</script>
    </Helmet>
  );
};
