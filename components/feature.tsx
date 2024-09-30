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
              Curabitur vitae mi tristique.
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Vestibulum felis leo, sodales auctor iaculis maximus, fringilla a
              nisi.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <ul className="grid gap-6">
              <li>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">Proin sed mollis orci.</h3>
                  <p className="text-muted-foreground">
                    Nullam accumsan et enim non condimentum. Nunc gravida
                    condimentum augue nec congue.
                  </p>
                </div>
              </li>
              <li>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">
                    Donec iaculis leo eu porta tristique.{" "}
                  </h3>
                  <p className="text-muted-foreground">
                    Cras ullamcorper vehicula auctor. Fusce aliquam sollicitudin
                    neque, nec ultrices nulla porttitor quis.
                  </p>
                </div>
              </li>
              <li>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">
                    Sed vestibulum ac quam eget ultricies.
                  </h3>
                  <p className="text-muted-foreground">
                    Quisque faucibus ligula neque, quis porta libero sagittis
                    vitae. Maecenas dignissim porttitor congue.
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <Image
            src="/image.png"
            width="550"
            height="310"
            alt="Features"
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
          />
        </div>
      </div>
    </section>
  );
}
