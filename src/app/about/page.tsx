import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";
import { siteConfig } from "~/config/site";

export default function AboutPage() {
  return (
    <div className="w-full pt-4">
      <div className="flex w-full flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold sm:text-3xl md:text-5xl lg:text-6xl">
          About The Project
        </h1>
        <p className="text-lg text-muted-foreground sm:text-xl mt-4">
          This project is a fruit subject of the AI Element that was studied the whole semester. 
          And this was possible to be done using Next.js 13 as Standalone web Framework built on React.
          It Uses two main models the first one is Standalone Model built on top of scikit learn mainly k-Means Clustering.
          That relies on the Content-Based Filtering algorithm and then Recommendations are served through a FastAPI Endpoint API.
          Then it Uses the Spotify SDK WebAPI 
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
