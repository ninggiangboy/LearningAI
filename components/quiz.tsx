import { QuizOuput } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "@radix-ui/react-context-menu";

export default function QuizDisplay({ data }: { data: QuizOuput[] }) {
  const dataArray = Array.isArray(data) ? data : [];
  console.table(data);
  return (
    <div className="flex flex-col space-y-6">
      {dataArray.map((quiz, index) => (
        <Card key={index} className="bg-white shadow-md p-4 rounded-lg">
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
      ))}
    </div>
  );
}
