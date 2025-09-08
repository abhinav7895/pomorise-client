import { Helmet } from "react-helmet";

type SEOProps = {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl: string;
  ogImage?: string;
};

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
}) => {
  const defaultImage = "/og-home.png";

  return (
    <Helmet>
      {/* Standard meta tags */}
      <title>{title}</title>

      {/* Google Site Verification */}
      <meta
        name="google-site-verification"
        content="6UE73xGLXkLeeW8-HDy9Z80IAEzA7h4yAzQzh7KEKOY"
      />

      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content="index, follow" />

      {/* Open Graph tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={ogImage || defaultImage} />
      <meta property="og:url" content={canonicalUrl} />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage || defaultImage} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
};

export default SEO;
