"use client";

import * as z from "zod";
import { Download } from "lucide-react";
import { useState } from "react";
import { LoadingButton } from "@/components/extension/loading-button";
import SlideArtcle from "@/components/slide-article";
import {
  convertToDocx,
  convertToPptx,
  generateSlides,
  getGenerateScriptPrompt,
  getKey,
} from "@/lib/actions";
import { generateSlidesFormSchema } from "@/lib/schema";
import { FileBase64 } from "@/lib/types";
import ScriptArticle from "@/components/script-article";
import FormSlidesPrompt from "@/components/form-prompt";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function Slides() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [script, setScript] = useState<string | null>(null);
  const [slides, setSlides] = useState<string | null>(null);

  const handleSubmit = async (
    values: z.infer<typeof generateSlidesFormSchema>
  ) => {
    setError(null);
    setScript(null);
    setSlides(null);
    setIsLoading(true);
    try {
      const { files, ...otherValues } = values;
      console.time("base64");
      const fileContents = await filesToBase64(files);
      console.timeEnd("base64");
      console.time("script");
      const scriptResponse = await generateScript({
        ...otherValues,
        files: fileContents,
      });
      console.timeEnd("script");
      console.time("slides");
      const slidesResponse = await generateSlides({
        ...otherValues,
        script: scriptResponse,
      });
      console.timeEnd("slides");
      setSlides(slidesResponse);
    } catch (error) {
      console.log(error);
      setError("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const generateScript = async ({
    title,
    prompt,
    files,
  }: {
    title: string;
    prompt?: string;
    files: FileBase64[];
  }) => {
    const genAI = new GoogleGenerativeAI(await getKey());
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const fileParts = files.map(fileToGenerativePart);
    const scriptPrompt = await getGenerateScriptPrompt(title, prompt);

    const chat = model.startChat({
      history: [],
    });

    const response = await chat.sendMessageStream([scriptPrompt, ...fileParts]);
    let script = "";
    for await (const chuck of response.stream) {
      script += chuck.text();
      setScript(script);
    }
    return script;
  };

  function fileToGenerativePart(file: FileBase64) {
    return {
      inlineData: {
        data: file.data.replace(/^data:.*?;base64,/, ""),
        mimeType: getFileMimeType(file.name),
      },
    };
  }

  function getFileMimeType(name: string) {
    switch (name.split(".").pop()) {
      case "pdf":
        return "application/pdf";
      case "doc":
      case "docx":
        return "application/vnd.ms-word";
      case "ppt":
      case "pptx":
        return "application/vnd.ms-powerpoint";
      case "xls":
      case "xlsx":
        return "application/vnd.ms-excel";
      case "png":
      case "jpg":
      case "jpeg":
        return "image/*";
      default:
        return "text/plain";
    }
  }

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

  const downloadScript = async () => {
    console.log("Downloading script...");

    try {
      const docxContent = await convertToDocx(script!);
      const blob = new Blob([Buffer.from(docxContent, "base64")], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "script.docx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading script:", error);
      setError("Error downloading script");
    }
  };

  const downloadSlides = async () => {
    console.log("Downloading slides...");

    try {
      const pptxContent = await convertToPptx(slides!);
      const blob = new Blob([Buffer.from(pptxContent, "base64")], {
        type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "slides.pptx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading slides:", error);
      setError("Error downloading slides");
    }
  };

  return (
    <div className="flex justify-center items-center flex-col w-full lg:p-0 p-4 mb-0">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-12 mt-10">
        <div className="col-span-2">
          <h1 className="text-3xl font-bold mb-10">Generate Slides with AI!</h1>
          <FormSlidesPrompt
            isLoading={isLoading}
            onSubmit={handleSubmit}
            error={error}
          />
          {slides && script && !isLoading && (
            <div className="grid grid-cols-2 gap-3 mt-4">
              <LoadingButton onClick={() => downloadScript()}>
                <Download className="mr-2" />
                Script (docs)
              </LoadingButton>
              <LoadingButton onClick={() => downloadSlides()}>
                <Download className="mr-2" />
                Slides (pptx)
              </LoadingButton>
            </div>
          )}
        </div>
        <div className="col-span-3">
          {isLoading && <div>Loading...</div>}
          {slides && !isLoading && (
            <>
              <h1 className="text-3xl font-bold mb-5">Slides</h1>
              <SlideArtcle slidesRaw={slides} />
            </>
          )}
          {script && (
            <>
              <h1 className="text-3xl font-bold mb-5 mt-5">Script</h1>
              <ScriptArticle scriptRaw={script} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
