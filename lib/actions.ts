"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { FileBase64, QuizOuput } from "./types";
import { exec } from "child_process";
import { join } from "path";
import { readFile, writeFile } from "fs/promises";
import { tmpdir } from "os";

export async function generateQuiz({
  title,
  prompt,
  numOfQuiz,
  typeOfQuiz,
  files,
}: {
  title: string;
  prompt?: string;
  numOfQuiz?: number;
  typeOfQuiz: "multiple_choice" | "true_false" | "both";
  files: FileBase64[];
}) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const fileParts = files.map(fileToGenerativePart);
  const quizPrompt = getGenerateQuizPrompt(
    title,
    prompt,
    numOfQuiz,
    typeOfQuiz
  );
  const result = await model.generateContent([quizPrompt, ...fileParts]);
  return JSON.parse(result.response.text()) as QuizOuput[];
}

export async function generateScript({
  title,
  prompt,
  files,
}: {
  title: string;
  prompt?: string;
  // numOfSlides?: number;
  files: FileBase64[];
}) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const fileParts = files.map(fileToGenerativePart);
  const scriptPrompt = getGenerateScriptPrompt(title, prompt);
  const result = await model.generateContent([scriptPrompt, ...fileParts]);
  return result.response.text();
}

export async function generateSlides({
  title,
  prompt,
  numOfSlides,
  script,
}: {
  title: string;
  prompt?: string;
  numOfSlides?: number;
  script: string;
}) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const content = getGenerateSlidesPrompt(
    title,
    script,
    "vietnamese",
    prompt,
    numOfSlides
  );
  const result = await model.generateContent(content);
  return result.response.text();
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

function getGenerateQuizPrompt(
  title: string,
  optionalRequest?: string,
  numOfQuiz: number = 30,
  typeOfQuiz: "multiple_choice" | "true_false" | "both" = "both"
) {
  const type =
    typeOfQuiz === "both" ? "both multiple choice and true/false" : typeOfQuiz;
  return `
  Create a quiz in Vietnamese with the title "${title}" that contains ${numOfQuiz} questions. 
  Flow the document, the quiz can only be generated based on the content of the document and should not include any external information (you can use the prompt to provide additional answer of questions).
  The quiz must be in type of ${type}
  The questions should be clear, concise, and focus on the most important points of the document. 
  The response must be is a json object (but must be pain text, must not have \`\`\`markdown) with the following structure:
  "
  [
    {
      question: string;
      choices: string[];
      answerIndex: number[];
    }
  ]
  "
  Note: index start from 0,
  Please dont include the answer in the question, the answer should be in the answerIndex array.
  Please dont add any additional information in the response, only the question itself.
  ${optionalRequest ? `Additional request: ${optionalRequest}` : ""}`;
}

function getGenerateScriptPrompt(title: string, optionalRequest?: string) {
  return `
    Summarize the key points of the document and generate a script for a lecture in Vietnamese with the title "${title}". 
    The script should develop the main ideas with sufficient detail, but focus only on the most important points to maintain clarity and conciseness. 
    The tone should be formal, suitable for an academic setting.
    ${optionalRequest ? `Additional request: ${optionalRequest}` : ""}
  `;
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

export async function convertToDocx(markdown: string) {
  console.log("Converting to docx...");

  const inputFilePath = join(tmpdir(), `script.md`);
  const outputFilePath = join(tmpdir(), `script.docx`);

  try {
    await writeFile(inputFilePath, markdown);

    await new Promise((resolve, reject) => {
      exec(`pandoc ${inputFilePath} -o ${outputFilePath}`, (error, stdout) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });

    // convert docx to base64
    const docxBuffer = await readFile(outputFilePath);
    const base64 = docxBuffer.toString("base64");
    return base64;
  } catch (error) {
    console.error("Error converting markdown to DOCX:", error);
    throw error;
  }
}

export async function convertToPptx(markdown: string) {
  console.log("Converting to pptx...");
  const inputFilePath = join(tmpdir(), `slides.md`);
  const outputFilePath = join(tmpdir(), `slides.pptx`);

  try {
    await writeFile(inputFilePath, markdown);

    await new Promise((resolve, reject) => {
      exec(`pandoc ${inputFilePath} -o ${outputFilePath}`, (error, stdout) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });

    // convert pptx to base64
    const pptxBuffer = await readFile(outputFilePath);
    const base64 = pptxBuffer.toString("base64");
    return base64;
  } catch (error) {
    console.error("Error converting markdown to PPTX:", error);
    throw error;
  }
}
