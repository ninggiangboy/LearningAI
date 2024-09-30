export type FileBase64 = {
  data: string;
  name: string;
};

export type QuizOuput = {
  question: string;
  choices: string[];
  answerIndex: number[];
};
