import Image from "next/image";

export default function Feature() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
              Key Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Generate your own slides and quizzes.
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              This AI-powered application allows you to create your own slides
              and quizzes.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <ul className="grid gap-6">
              <li>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">
                    Automatic Slide Creation
                  </h3>
                  <p className="text-muted-foreground">
                    The app automatically converts text content into
                    presentation slides with logical and visually appealing
                    structures.
                  </p>
                </div>
              </li>
              <li>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">
                    Interactive Question Generation
                  </h3>
                  <p className="text-muted-foreground">
                    The AI system generates interactive questions from lecture
                    content, enabling teachers to assess students&apos;
                    understanding and knowledge.
                  </p>
                </div>
              </li>
              <li>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">User-friendly Interface</h3>
                  <p className="text-muted-foreground">
                    The app has a user-friendly interface that allows you to
                    easily create your own slides and quizzes.
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <Image
            src="/image.png"
            width="550"
            height="400"
            alt="Features"
            className="mx-auto aspect-auto overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
          />
        </div>
      </div>
    </section>
  );
}
