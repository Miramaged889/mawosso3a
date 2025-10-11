import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: "website" | "article";
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

const SEO = ({
  title = "الموسوعة الشنقيطية",
  description = "موسوعة شاملة تجمع التراث العلمي لعلماء وكتاب بلاد شنقيط، تشمل المخطوطات، التحقيقات، الكتب، والأبحاث في العلوم الشرعية واللغوية والاجتماعية",
  keywords = "شنقيط, موريتانيا, تراث, علماء, مخطوطات, كتب, علوم شرعية, فقه, حديث, تفسير, نحو, بلاغة, تحقيق, أدب",
  image = "https://chinguitipedia.com/logo1.png",
  type = "website",
  author,
  publishedTime,
  modifiedTime,
}: SEOProps) => {
  const location = useLocation();
  const currentUrl = `https://chinguitipedia.com${location.pathname}`;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMeta = (name: string, content: string, property = false) => {
      const attr = property ? "property" : "name";
      let element = document.querySelector(`meta[${attr}="${name}"]`);

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }

      element.setAttribute("content", content);
    };

    // Basic Meta Tags
    updateMeta("description", description);
    updateMeta("keywords", keywords);
    if (author) updateMeta("author", author);

    // Open Graph Tags
    updateMeta("og:title", title, true);
    updateMeta("og:description", description, true);
    updateMeta("og:image", image, true);
    updateMeta("og:url", currentUrl, true);
    updateMeta("og:type", type, true);
    updateMeta("og:site_name", "Chinguitipedia", true);
    updateMeta("og:locale", "ar_AR", true);
    updateMeta("og:locale:alternate", "en_US", true);

    // Twitter Card Tags
    updateMeta("twitter:card", "summary_large_image");
    updateMeta("twitter:title", title);
    updateMeta("twitter:description", description);
    updateMeta("twitter:image", image);
    updateMeta("twitter:site", "@chinguitipedia");
    updateMeta("twitter:creator", "@chinguitipedia");

    // Article specific tags
    if (type === "article") {
      if (publishedTime)
        updateMeta("article:published_time", publishedTime, true);
      if (modifiedTime) updateMeta("article:modified_time", modifiedTime, true);
      if (author) updateMeta("article:author", author, true);
    }

    // Update canonical link
    let canonical = document.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.href = currentUrl;
  }, [
    title,
    description,
    keywords,
    image,
    type,
    currentUrl,
    author,
    publishedTime,
    modifiedTime,
  ]);

  return null;
};

export default SEO;
