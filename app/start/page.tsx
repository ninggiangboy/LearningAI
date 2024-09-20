"use client";

import * as z from "zod";
import { Download } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import FileSvgDraw from "@/components/file-svg-draw";
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from "@/components/extension/file-upload";
import { LoadingButton } from "@/components/extension/loading-button";
import SlideArtcle from "@/components/slide-article";
import { generate } from "@/lib/actions";
import { Input } from "@/components/ui/input";
import { generateFormSchema, GenerateFormValues } from "@/lib/schema";
import { FileBase64 } from "@/lib/types";
import ScriptArticle from "@/components/script-article";

// const promptSuggestions = [
//   "A city view with clouds",
//   "A beautiful glacier",
//   "A forest overlooking a mountain",
//   "A saharan desert",
// ];

export default function Start() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [script, setScript] = useState<string | null>(null);
  const [slides, setSlides] = useState<string | null>(null);
  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
  };

  const form = useForm<GenerateFormValues>({
    resolver: zodResolver(generateFormSchema),
    mode: "onChange",
    defaultValues: {
      files: [],
      numOfSlides: 10,
      prompt: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof generateFormSchema>) => {
    setError(null);
    setIsLoading(true);
    try {
      const { files, ...otherValues } = values;
      const fileContents = await filesToBase64(files);
      const { script: script1, slides: slides1 } = await generate({
        ...otherValues,
        files: fileContents,
      });
      setScript(script1);
      setSlides(slides1);
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
        <div className="col-span-2">
          <h1 className="text-3xl font-bold mb-10">
            Generate learning resources with AI!
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((f) => handleSubmit(f))}>
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="Enter a title"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="">
                        Enter a title for the learning resources.
                      </FormDescription>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="files"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document</FormLabel>
                      <FormControl>
                        <FileUploader
                          value={field.value}
                          onValueChange={field.onChange}
                          dropzoneOptions={dropZoneConfig}
                          className="relative bg-background rounded-lg p-2"
                        >
                          {!isLoading && (
                            <FileInput className="outline-dashed outline-1 dark:outline-white outline-gray-800">
                              <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
                                <FileSvgDraw />
                              </div>
                            </FileInput>
                          )}
                          <FileUploaderContent>
                            {field.value &&
                              field.value.length > 0 &&
                              field.value.map((file, i) => (
                                <FileUploaderItem key={i} index={i}>
                                  <p className="text-ellipsis w-44 md:w-80 overflow-hidden whitespace-nowrap">
                                    {file.name}
                                  </p>
                                </FileUploaderItem>
                              ))}
                          </FileUploaderContent>
                        </FileUploader>
                      </FormControl>
                      <FormDescription>
                        Upload a document to generate learning resources.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prompt (optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          disabled={isLoading}
                          placeholder="Enter a prompt"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="">
                        You can enter a prompt to guide the AI in generating the
                        content.
                      </FormDescription>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="numOfSlides"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of slides (optional)</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          type="number"
                          placeholder="Enter a number of slides (is between 4 and 20)"
                          className="resize-none"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <div className="my-2">
                  <p className="text-sm font-medium mb-3">Prompt suggestions</p>
                  <div className="grid sm:grid-cols-2 grid-cols-1 gap-3 text-center text-gray-500 text-sm">
                    {promptSuggestions.map((suggestion) => (
                      <PromptSuggestion
                        key={suggestion}
                        suggestion={suggestion}
                        onClick={() => handleSuggestionClick(suggestion)}
                        isLoading={isLoading}
                      />
                    ))}
                  </div>
                </div> */}
                <div className="grid grid-cols-1 gap-3">
                  <LoadingButton
                    type="submit"
                    disabled={isLoading}
                    loading={isLoading}
                  >
                    {isLoading ? " ✨ Generating..." : "Generate"}
                  </LoadingButton>
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </form>
          </Form>
          {slides && script && !isLoading && (
            <div className="grid grid-cols-3 gap-3 mt-4">
              <LoadingButton>
                <Download className="mr-2" />
                Script (docs)
              </LoadingButton>
              <LoadingButton>
                <Download className="mr-2" />
                Slides (pptx)
              </LoadingButton>
              <LoadingButton>
                <Download className="mr-2" />
                Slides (pdf)
              </LoadingButton>
            </div>
          )}
        </div>
        {slides && script && !isLoading && (
          <div className="col-span-3">
            <h1 className="text-3xl font-bold mb-5">Slides</h1>
            <SlideArtcle slidesRaw={slides} />
            <h1 className="text-3xl font-bold mb-5 mt-5">Script</h1>
            <ScriptArticle scriptRaw={script} />
            {/* <Textarea className="mt-4" value={script} readOnly /> */}
          </div>
        )}
      </div>
    </div>
  );
}
