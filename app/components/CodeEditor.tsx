import Editor from "@monaco-editor/react";

const CodeEditor = (props) => {
  return (
    <Editor
    //   height="70%" // By default, it's 100%
      defaultLanguage="javascript"
      defaultValue="// some comment"
      {...props} // Spread additional props if needed
    />
  );
};

export default CodeEditor;
