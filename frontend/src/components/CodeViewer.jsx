import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

function CodeViewer({ code, theme, language = "text" }) {
  return (
    <SyntaxHighlighter
      language={language}
      style={theme === "light" ? oneLight : oneDark}
      showLineNumbers={true}
      wrapLines={true}
      wrapLongLines={false}
      lineProps={{
        style: {
          display: "block",
        },
      }}
      customStyle={{
        borderRadius: "10px",
        padding: "20px",
        fontSize: "15px",
        margin: 0,
        background: theme === "light" ? "#f8fafc" : "#0f172a",
      }}
    >
      {code}
    </SyntaxHighlighter>
  );
}

export default CodeViewer;