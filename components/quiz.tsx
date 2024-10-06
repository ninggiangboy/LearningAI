import { QuizOuput } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "@radix-ui/react-context-menu";
import {
  Carousel,
  CarouselIndicatorDot,
  CarouselMainContainer,
  CarouselNext,
  CarouselPrevious,
  CarouselThumbsContainer,
  SliderMainItem,
} from "./extension/carousel";

export default function QuizDisplay({ data }: Readonly<{ data: QuizOuput[] }>) {
  const dataArray = Array.isArray(data) ? data : [];
  console.table(data);
  return (
    <Carousel>
      <CarouselNext className="top-1/2 -translate-y-1/2" />
      <CarouselPrevious className="top-1/2 -translate-y-1/2" />
      <CarouselMainContainer className="">
        {dataArray.map((quiz, index) => (
          <SliderMainItem key={index} className="">
            <Card className="bg-white shadow-md p-4 rounded-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  {`${index + 1}. ${quiz.question}`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {quiz.choices.map((choice, choiceIndex) => (
                    <li
                      key={choiceIndex}
                      className={`flex items-center space-x-2 ${
                        quiz.answerIndex.includes(choiceIndex)
                          ? "text-green-600"
                          : "text-gray-700"
                      }`}
                    >
                      <span>{choiceIndex + 1}.</span>
                      <span>{choice}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <Separator className="my-4" />
            </Card>
          </SliderMainItem>
        ))}
      </CarouselMainContainer>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
        <CarouselThumbsContainer className="gap-x-1 ">
          {Array.from({ length: dataArray.length }).map((_, index) => (
            <CarouselIndicatorDot key={index} index={index} />
          ))}
        </CarouselThumbsContainer>
      </div>
    </Carousel>
    // <div className="flex flex-col space-y-6">

    // </div>
  );
}
