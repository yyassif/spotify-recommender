import Link from "next/link"
import { buttonVariants } from "~/components/ui/button"
import { siteConfig } from "~/config/site"


export default function IndexPage() {
  return (
    <>
      <div className="flex w-full flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold sm:text-3xl md:text-5xl lg:text-6xl">
          Beautifully designed components <br className="hidden sm:inline" />
          built with Radix UI and Tailwind CSS.
        </h1>
        <p className="text-lg text-muted-foreground sm:text-xl mt-4">
          Accessible and customizable components that you can copy and paste
          into your apps. Free. Open Source. And Next.js 13 Ready.
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          target="_blank"
          rel="noreferrer"
          href={siteConfig.links.github}
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          GitHub
        </Link>
      </div>
    </>
  )
}
