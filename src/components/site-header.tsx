
import Link from "next/link"
import { Icons } from "~/components/icons"
import { MainNav } from "~/components/main-nav"
import { ThemeToggle } from "~/components/theme-toggle"
import { buttonVariants } from "~/components/ui/button"
import { siteConfig } from "~/config/site"
import { nunitoFont } from "~/lib/fonts"
import { cn } from "~/lib/util"
import { UserIcon } from "./user-icon"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className={cn("container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0", nunitoFont.variable)}>
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
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
            <UserIcon />
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
