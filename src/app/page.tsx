import Link from "next/link"
import { buttonVariants } from "~/components/ui/button"
import { siteConfig } from "~/config/site"


export default function IndexPage() {
  return (
    <div className="w-full pt-4">
      <div className="flex w-full flex-col items-start gap-2">
        <h1 className="text-xl font-extrabold sm:text-2xl md:text-4xl lg:text-5xl">
          Graphical User Interface for a Music Recommendation System Built on top of Content-Based Filtering / Spotify SDK, FastAPI, and Next.js 13
        </h1>
        <p className="text-lg text-muted-foreground sm:text-xl mt-4">
          Accessible customizable platform that lets customize your listening records based on the music similarity vectors.
          <br />
          Ready to be deployed for custom use cases.
        </p>
      </div>
      <div className="mt-4">
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
      </div>
    </div>
  )
}
