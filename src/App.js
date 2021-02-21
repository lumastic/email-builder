import React, { useRef } from 'react';
import EmailEditor from 'react-email-editor';
import {Button, TopBar, Main} from "lumastic-ui";
import sample from "./default.json"
import "lumastic-ui/index.css";
import "./App.css"

function download(content, fileName, contentType) {
  var a = document.createElement("a");
  var file = new Blob([content], {type: contentType});
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

function readTextFile(file, callback) {
  var reader = new FileReader();
        reader.onload = function(){
          var text = reader.result;
          callback(text)
        };
        reader.readAsText(file);
}

const App = (props) => {
  const emailEditorRef = useRef(null);

  const exportHtml = () => {
    emailEditorRef.current.editor.exportHtml((data) => {
      const { html } = data;
      const name = window.prompt("Enter a name for this template", "default")  
      if(name) download(html, `${name}.html`, 'text/plain')
    });
  };


  const loadDesign = (data) => {
    var input = document.createElement('input');
  input.type = 'file';

  input.onchange = e => { 
    var file = e.target.files[0]; 
    readTextFile(file, data => emailEditorRef.current.editor.loadDesign(JSON.parse(data)))
 }

  input.click();
    
  };
  const defaultLoad = () => emailEditorRef.current.editor.loadDesign(sample)

  const saveDesign = (data) => {
    emailEditorRef.current.editor.saveDesign(data => {
      const name = window.prompt("Enter a name for this template", "default")  
      if(name) download(JSON.stringify(data), `${name}.json`, 'text/plain')
      
    });
  };

  return (
      <>
      <TopBar>
      <Button onClick={loadDesign} variant={"contained"} size="small" color="primary">Load</Button>
        <Button onClick={saveDesign} variant={"contained"} size="small" color="primary">Save</Button>
        <Button onClick={exportHtml} variant={"contained"} size="small" >Export</Button>
      </TopBar>
      <Main className={"editor-main"}>
      <React.StrictMode>
      <EmailEditor
        ref={emailEditorRef}
        onLoad={defaultLoad}
      />
      </React.StrictMode>
      </Main>
      
      
    </>
    
  );
};

export default App;
