/**
 * v0 by Vercel.
 * @see https://v0.dev/t/gL3iUCmZTQ7
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link";
import { Button } from "./ui/button";

export default function Hero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 text-center">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:gap-12 ">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2 justify-center items-center">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Learning AI
              </h1>
              <p className="text-muted-foreground md:text-xl max-w-xl mx-auto">
                This AI-powered application will help you learn anything.
              </p>
            </div>
            <div className="flex flex-row items-center justify-center gap-2">
              <Link href="/quiz" passHref>
                <Button>Start it now!</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
