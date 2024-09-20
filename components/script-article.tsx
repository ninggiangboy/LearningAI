import Markdown from "react-markdown";

const ScriptArticle = ({ scriptRaw }: { scriptRaw: string }) => {
  return (
    <div>
      <Markdown>{scriptRaw}</Markdown>
    </div>
  );
};
export default ScriptArticle;
