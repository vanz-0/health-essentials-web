import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  structuredData?: object;
  noindex?: boolean;
}

const SEO = ({
  title = '1Health Essentials | Natural Beauty & Wellness in Kiambu',
  description = 'Premium cosmetics and personal care in Thindiqua, Kiambu. Natural, cruelty-free, quality-tested. Shop online or visit Brentwood Arcade.',
  keywords = ['cosmetics', 'natural beauty', 'skincare', 'haircare', 'wellness', 'Kiambu', 'Kenya'],
  image = 'https://lovable.dev/opengraph-image-p98pqg.png',
  url = '/',
  type = 'website',
  structuredData,
  noindex = false,
}: SEOProps) => {
  const siteUrl = window.location.origin;
  const fullUrl = `${siteUrl}${url}`;
  const canonicalUrl = fullUrl.split('?')[0]; // Remove query params for canonical

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="1Health Essentials" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
