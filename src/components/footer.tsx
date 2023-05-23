import Link from "next/link"
import { Icons } from "~/components/icons"
import { siteConfig } from "~/config/site"
import { buttonVariants } from "./ui/button"

export const Footer = () => {
  return (
    <footer className="p-4 sm:p-6">
    <div className="mx-auto max-w-screen-xl">
      <div className="md:flex md:items-center md:justify-between">
        <div className="mb-6 md:mb-0">
              <Link href="/" className="flex items-center">
                <Icons.logo className="h-6 w-6 dark:fill-white" />
                <span className="sr-only">Spotify Recommender</span>
              </Link>
          </div>
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <Link href="/" className="hover:underline">Spotify Recommender</Link>. All Rights Reserved [YASSIF & Dkhissi].
        </span>
        <div className="flex mt-4 space-x-6 sm:justify-center sm:mt-0">
          <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                })}
              >
                <Icons.gitHub className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <Link
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                })}
              >
                <Icons.twitter className="h-5 w-5 fill-current" />
                <span className="sr-only">Twitter</span></div>
            </Link>
        </div>
      </div>
  </div>
</footer>
  )
}
