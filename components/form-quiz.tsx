import { AlertCircle } from "lucide-react";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "./extension/file-upload";
import { LoadingButton } from "./extension/loading-button";
import FileSvgDraw from "./file-svg-draw";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { z } from "zod";
import { GenerateQuizFormValues, generateQuizFormSchema } from "@/lib/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export default function FormQuizPrompt({
  isLoading,
  error,
  onSubmit,
}: {
  isLoading: boolean;
  error: string | null;
  onSubmit: (data: z.infer<typeof generateQuizFormSchema>) => void;
}) {
  const dropZoneConfig = {
    maxFiles: 3,
    maxSize: 1024 * 1024 * 12,
    multiple: true,
  };
  const form = useForm<GenerateQuizFormValues>({
    resolver: zodResolver(generateQuizFormSchema),
    mode: "onChange",
    defaultValues: {
      files: [],
      numOfQuiz: 30,
      typeOfQuiz: "both",
      prompt: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((f) => onSubmit(f))}>
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
            name="numOfQuiz"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Quizs</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    type="number"
                    placeholder="Enter a number of quiz (is between 10 and 100)"
                    className="resize-none"
                    {...field}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="typeOfQuiz"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type of Quiz</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="both">
                      Both Multiple Choice and True - False
                    </SelectItem>
                    <SelectItem value="multiple_choice">
                      Multiple Choice
                    </SelectItem>
                    <SelectItem value="true_false">True - False</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name="typeOfQuiz"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type of Quizs</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="both">
                      Both Multiple Choice and True - False
                    </SelectItem>
                    <SelectItem value="multiple_choice">
                      Multiple Choice
                    </SelectItem>
                    <SelectItem value="true_false">True - False</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          /> */}
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
  );
}
