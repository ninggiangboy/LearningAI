"use client";

import * as z from "zod";
import { Download } from "lucide-react";
import { useState } from "react";
import { LoadingButton } from "@/components/extension/loading-button";
import SlideArtcle from "@/components/slide-article";
import {
  convertToDocx,
  convertToPptx,
  generateScript,
  generateSlides,
} from "@/lib/actions";
import { generateSlidesFormSchema } from "@/lib/schema";
import { FileBase64 } from "@/lib/types";
import ScriptArticle from "@/components/script-article";
import FormSlidesPrompt from "@/components/form-prompt";
// const promptSuggestions = [
//   "A city view with clouds",
//   "A beautiful glacier",
//   "A forest overlooking a mountain",
//   "A saharan desert",
// ];

export default function Slides() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [script, setScript] = useState<string | null>(null);
  const [slides, setSlides] = useState<string | null>(null);

  const handleSubmit = async (
    values: z.infer<typeof generateSlidesFormSchema>
  ) => {
    setError(null);
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
      setScript(scriptResponse);
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
      console.log(pptxContent);
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
          {isLoading ? (
            <>
              {!slides && <div>Loading slides...</div>}
              {!script && <div>Loading script...</div>}
            </>
          ) : (
            <>
              {slides && (
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
