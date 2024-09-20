import {
  Carousel,
  CarouselIndicatorDot,
  CarouselMainContainer,
  CarouselNext,
  CarouselPrevious,
  CarouselThumbsContainer,
  SliderMainItem,
} from "./extension/carousel";
import { parse } from "node-html-parser";
import { Card } from "./ui/card";
import Marp from "@marp-team/marp-core";

const SlideArtcle = ({ slidesRaw }: { slidesRaw: string }) => {
  const marp = new Marp({
    html: true,
  });
  const { html, css } = marp.render(slidesRaw);
  const extractSlides = (html: string) => {
    const root = parse(html);
    const sections = root.querySelectorAll(".marpit > svg");
    return Array.from(sections).map((section, index) => ({
      id: section.id || index + 1,
      content: section.outerHTML,
    }));
  };

  const slides = extractSlides(html);
  return (
    <Carousel>
      <CarouselNext className="top-1/2 -translate-y-1/2" />
      <CarouselPrevious className="top-1/2 -translate-y-1/2" />
      <CarouselMainContainer className="">
        {slides.map((slide, index) => (
          <SliderMainItem key={index} className="">
            <Card className="prose lg:prose-xl">
              <div
                className="marpit"
                dangerouslySetInnerHTML={{ __html: slide.content }}
              ></div>
            </Card>
          </SliderMainItem>
        ))}
      </CarouselMainContainer>
      <style
        dangerouslySetInnerHTML={{
          __html: css,
        }}
      ></style>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
        <CarouselThumbsContainer className="gap-x-1 ">
          {Array.from({ length: slides.length }).map((_, index) => (
            <CarouselIndicatorDot key={index} index={index} />
          ))}
        </CarouselThumbsContainer>
      </div>
    </Carousel>
  );
};

export default SlideArtcle;
