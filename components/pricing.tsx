import { Button } from "@/components/ui/button";
import { Card } from "./ui/card";

export default function Pricing() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
              Pricing
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Lorem ipsum dolor sit amet
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-4 py-12 lg:grid-cols-3 lg:gap-8">
          <Card className="flex flex-col justify-center space-y-4 rounded-lg bg-background p-6 shadow-sm">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Lorem Ipsum</h3>
              <p className="text-4xl font-bold">$5/month</p>
              <p className="text-muted-foreground">
                Lorem ipsum dolor sit amet.
              </p>
            </div>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-green-500" />
                <span>Lorem ipsum dolor sit amet</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-green-500" />
                <span>Consectetur adipiscing elit</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-green-500" />
                <span>Sed do eiusmod tempor</span>
              </li>
              <li className="flex items-center gap-2">
                <XIcon className="w-4 h-4 text-red-500" />
                <span>Ut enim ad minim veniam</span>
              </li>
            </ul>
            <Button className="w-full">Lorem Ipsum</Button>
          </Card>
          <Card className="flex flex-col justify-center space-y-4 rounded-lg bg-primary p-6 shadow-sm text-primary-foreground">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Dolor Sit Amet</h3>
              <p className="text-4xl font-bold">$10/mo</p>
              <p className="text-primary-foreground/80">
                Lorem ipsum dolor sit amet.
              </p>
            </div>
            <ul className="space-y-2 text-primary-foreground/80">
              <li className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4" />
                <span>Lorem ipsum dolor sit amet</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4" />
                <span>Consectetur adipiscing elit</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4" />
                <span>Sed do eiusmod tempor</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4" />
                <span>Ut enim ad minim veniam</span>
              </li>
            </ul>
            <Button className="w-full" variant="secondary">
              Lorem Ipsum
            </Button>
          </Card>
          <Card className="flex flex-col justify-center space-y-4 rounded-lg bg-background p-6 shadow-sm">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Consectetur Adipiscing</h3>
              <p className="text-4xl font-bold">Contact Us!</p>
              <p className="">Lorem ipsum dolor sit amet.</p>
            </div>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-green-500" />
                <span>Lorem ipsum dolor sit amet</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-green-500" />
                <span>Consectetur adipiscing elit</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-green-500" />
                <span>Sed do eiusmod tempor</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-green-500" />
                <span>Ut enim ad minim veniam</span>
              </li>
            </ul>
            <Button className="w-full">Lorem Ipsum</Button>
          </Card>
        </div>
      </div>
    </section>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
