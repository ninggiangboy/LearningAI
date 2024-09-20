"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { FileBase64 } from "./types";

export async function generate({
  title,
  prompt,
  numOfSlides,
  files,
}: {
  title: string;
  prompt?: string;
  numOfSlides?: number;
  files: FileBase64[];
}) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const fileParts = files.map(fileToGenerativePart);
  const scriptPrompt = getGenerateScriptPrompt(title, prompt, numOfSlides);
  const scriptResponse = await model.generateContent([
    scriptPrompt,
    ...fileParts,
  ]);
  const script = scriptResponse.response.text();
  console.log("script", script);
  const content = getGenerateSlidesPrompt(
    title,
    script,
    "vietnamese",
    prompt,
    numOfSlides
  );
  const result = await model.generateContent(content);
  return {
    script: script,
    slides: result.response.text(),
  };
}

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
      return "application/msword";
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

function getGenerateScriptPrompt(
  title: string,
  optionalRequest?: string,
  numOfSlides: number = 10
) {
  const prompt = `
  Summarize the content of the document and generate a script for a lecture. 
  The lecture should be complete and main ideas and it' parts should be developed in detail 
  (don't just list) in the most appropriate Vietnamese with title ${title}.
  If the content be convert to slides, it will be contain ${numOfSlides} slides.
  The script should be written in a formal tone and be structured as a lecture.
  ${optionalRequest ? `And more request is: ${optionalRequest}` : ""}`;
  return prompt;
}

function getGenerateSlidesPrompt(
  title: string,
  content: string,
  language: string = "vietnamese",
  optionalRequest?: string,
  numberOfSlides: number = 10
) {
  const prompt = `
        "${content}"
        -----------------------
        ${
          content ? "Based on the above content, " : ""
        } Generate a slides in the most appropriate ${language} with title ${title}. 
        ${optionalRequest ? `And more request is: ${optionalRequest}` : ""}
        This presentation not need to be a full sentence of the content, if content is too long, you can summary and quote the main idea of the content.
        The sentence should only contain the content, without any introductory text like 'Here is the answer.'
        It should be written in Markdown Presentation Ecosystem format (but must be pain text, must not have \`\`\`markdown) and match the formal tone. 
        The slides will be contain  ${numberOfSlides} slides.
        Each slide should not exceed 100 words or exceed 10 line, you can split the content of this part into multiple slides.
        Example of output in Markdown Presentation Ecosystem format is:
        "
        # My Presentation

        ---

        ## I. Introduction

        Welcome to the presentation! Here, we will cover:

        - Introduction to Markdown
        - Presentation tools
        - Example slides

        ---

        - Markdown is a lightweight markup language with plain-text formatting syntax.
        - It's used for:
          - Writing documentation
          - Creating web content
          - Drafting presentations

        ---

        ## II. Markdown Basics

        Markdown is a lightweight markup language with plain-text formatting syntax. It's used for:

        - Writing documentation
        - Creating web content
        - Drafting presentations

        **Example:**
        "
        `;
  return prompt;
}
