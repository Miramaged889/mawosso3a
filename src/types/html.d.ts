// Extend React HTML attributes to include fetchpriority
declare module "react" {
  interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
    fetchpriority?: "high" | "low" | "auto";
  }
}

export {};
