"use client";

import FormQuizPrompt from "@/components/form-quiz";
import Quiz from "@/components/quiz";
import { generateQuiz } from "@/lib/actions";
import { generateQuizFormSchema } from "@/lib/schema";
import { FileBase64, QuizOuput } from "@/lib/types";
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
        </div>
        <div className="md:col-span-3">{quiz && <Quiz data={quiz} />}</div>
      </div>
    </div>
  );
}
