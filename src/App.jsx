import React, { useRef, useEffect } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import TextEditor from './components/TextEditor';
const App = () => {
  return (
    <div>
      <h1 class="text-3xl font-bold underline">
    Editor JS
  </h1>
  <TextEditor />
    </div>
  );
};

export default App;