"use client";

import { LoadingButton } from "@/components/extension/loading-button";
import FormQuizPrompt from "@/components/form-quiz";
import Quiz from "@/components/quiz";
import { generateQuiz } from "@/lib/actions";
import { generateQuizFormSchema } from "@/lib/schema";
import { FileBase64, QuizOuput } from "@/lib/types";
import { Download } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

export default function QuizPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<QuizOuput[] | null>(null);
  const handleSubmit = async (
    values: z.infer<typeof generateQuizFormSchema>
  ) => {
    setError(null);
    setIsLoading(true);
    try {
      const { files, ...otherValues } = values;
      console.time("base64");
      const fileContents = await filesToBase64(files);
      console.timeEnd("base64");
      const quizResponse = await generateQuiz({
        ...otherValues,
        files: fileContents,
      });
      setQuiz(quizResponse);
    } catch (error) {
      console.log(error);
      setError("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const filesToBase64 = async (files: File[]) => {
    const data = await Promise.all(
      files.map(async (file) => {
        return await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result as string);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      })
    );
    return data.map((d, i) => ({
      data: d,
      name: files[i].name,
    })) as FileBase64[];
  };

  const downloadQuiz = () => {
    console.log("Downloading quiz...");

    if (!quiz) {
      console.error("No quiz data available");
      setError("No quiz data available to download");
      return;
    }

    try {
      // Convert quiz data to Quizlet format
      const quizletFormat = quiz
        .map(
          (item) => `
${item.question}
${item.choices
  .map((choice, index) => `${index + 1}. ${choice}`)
  .join("\n")}---${item.choices
            .filter((_, index) => item.answerIndex.includes(index))
            .join("\n")}
        `
        )
        .join("----");

      // Create a Blob with the formatted data
      const blob = new Blob([quizletFormat], { type: "text/plain" });

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "quizlet_import.txt";

      // Append to the document, trigger click, and clean up
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading quiz:", error);
      setError("Error downloading quiz");
    }
  };

  return (
    <div className="flex justify-center items-center flex-col w-full lg:p-0 p-4 mb-0">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-12 mt-10">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-10">Generate Quiz with AI!</h1>
          <FormQuizPrompt
            isLoading={isLoading}
            onSubmit={handleSubmit}
            error={error}
          />
          {quiz && !isLoading && (
            <div className="grid grid-cols-1 gap-3 mt-4">
              <LoadingButton onClick={() => downloadQuiz()}>
                <Download className="mr-2" />
                Export to Quizlet
              </LoadingButton>
            </div>
          )}
        </div>
        <div className="md:col-span-3">{quiz && <Quiz data={quiz} />}</div>
      </div>
    </div>
  );
}
