import { useEffect, useRef } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
// @ts-ignore (Using ts-ignore if type definitions are missing for plugins)
import Header from '@editorjs/header';
// @ts-ignore
import List from '@editorjs/list';

const TextEditor = () => {
  // Explicitly type the ref to hold an EditorJS instance or null
  const ejInstance = useRef<EditorJS | null>(null);

  useEffect(() => {
    // Prevent duplicate initialization in React Strict Mode
    if (!ejInstance.current) {
      const editor = new EditorJS({
        holder: 'editorjs',
        tools: {
          header: Header,
          list: List,
        },
        placeholder: 'Click here to start writing...',
      });

      ejInstance.current = editor;
    }

    // Clean up on unmount
    return () => {
      if (ejInstance.current && typeof ejInstance.current.destroy === 'function') {
        ejInstance.current.destroy();
        ejInstance.current = null;
      }
    };
  }, []);

  // The Submit / Save handler
  const handleSave = async () => {
    if (ejInstance.current) {
      try {
        // OutputData is the official built-in type for Editor.js JSON structure
        const savedData: OutputData = await ejInstance.current.save();
        
        console.log('Successfully captured JSON target:', savedData);
        alert('Data captured! Check your browser console.');
        
        // Example: Send savedData to your database via fetch/axios here
        // fetch('/api/save', { method: 'POST', body: JSON.stringify(savedData) })
        
      } catch (error) {
        console.error('Editor.js saving failed: ', error);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Editor Container Container with styling fixes for injected Editor.js text components */}
      <div className="p-6 border border-slate-200 rounded-xl bg-white text-slate-800 shadow-sm min-h-[300px] focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-400 transition-all
        [&_.ce-block]:max-w-none [&_.ce-paragraph]:text-base [&_.ce-header]:font-bold [&_.ce-header]:mt-4 [&_.ce-header]:mb-2 [&_h1.ce-header]:text-3xl [&_h2.ce-header]:text-2xl [&_h3.ce-header]:text-xl [&_.cdx-list]:list-disc [&_.cdx-list]:pl-5">
        
        <div id="editorjs"></div>
      
      </div>

      {/* Tailwind Action Button */}
      <button
        onClick={handleSave}
        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg shadow-sm hover:shadow transition-all duration-200 self-start focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Save Content
      </button>
    </div>
  );
};

export default TextEditor;