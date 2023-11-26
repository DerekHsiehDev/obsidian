import Editor from "@monaco-editor/react";

interface codeEditorProps {
  onChange: (value: string | undefined) => void;
  startingCode?: string
}

const CodeEditor = ({startingCode, onChange}: codeEditorProps) => {

  const defaultValue = startingCode ? startingCode : "// your code here!";

  return (
    <Editor
      onChange={onChange}
      defaultLanguage="typescript"
      defaultValue={defaultValue}
    />
  );
};

export default CodeEditor;
