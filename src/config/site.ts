export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Spotify Recommender",
  description:
    "Beautifully designed components built with Radix UI and Tailwind CSS.",
  mainNav: [
    {
      title: "Welcome",
      href: "/",
    },
    {
      title: "Presentation",
      href: "/presentation",
    },
    {
      title: "Recommender",
      href: "/recommender",
    },
    {
      title: "Spotify SDK",
      href: "/spotify-sdk",
    },
    {
      title: "About",
      href: "/about",
    },
  ],
  links: {
    twitter: "https://twitter.com/yyassif",
    github: "https://github.com/yyassif",
  },
}
