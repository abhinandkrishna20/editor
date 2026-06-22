import { useEffect, useRef } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
// @ts-ignore
import Header from '@editorjs/header';
// @ts-ignore
import List from '@editorjs/list';
// @ts-ignore
import ImageTool from '@editorjs/image';

const TextEditor = () => {
  const ejInstance = useRef<EditorJS | null>(null);

  useEffect(() => {
    if (!ejInstance.current) {
      const editor = new EditorJS({
        holder: 'editorjs',
        tools: {
          header: Header,
          list: List,
          image: {
            class: ImageTool,
            config: {
              /**
               * Custom client-side uploader logic.
               * Converts local files to base64 strings so they can save directly in your local JSON file.
               */
              uploader: {
                uploadByFile(file: File) {
                  return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                      resolve({
                        success: 1,
                        file: {
                          url: reader.result, // This returns the raw base64 data string
                        },
                      });
                    };
                    reader.onerror = (error) => reject(error);
                  });
                },
                // Optional: Allows users to simply paste an image link from the internet
                uploadByUrl(url: string) {
                  return Promise.resolve({
                    success: 1,
                    file: {
                      url: url,
                    },
                  });
                },
              },
            },
          },
        },
        placeholder: 'Click here to start writing or add an image...',
      });

      ejInstance.current = editor;
    }

    return () => {
      if (ejInstance.current && typeof ejInstance.current.destroy === 'function') {
        ejInstance.current.destroy();
        ejInstance.current = null;
      }
    };
  }, []);

  // Handler to export data as a JSON file
  const handleExportJSON = async () => {
    if (ejInstance.current) {
      try {
        const savedData: OutputData = await ejInstance.current.save();
        const jsonString = JSON.stringify(savedData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `editor-content-${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Failed to export JSON file: ', error);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Editor Canvas Container */}
      <div className="p-6 border border-slate-200 rounded-xl bg-white text-slate-800 shadow-sm min-h-[300px] focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-400 transition-all
        [&_.ce-block]:max-w-none [&_.ce-paragraph]:text-base [&_.ce-header]:font-bold [&_.ce-header]:mt-4 [&_.ce-header]:mb-2 [&_h1.ce-header]:text-3xl [&_h2.ce-header]:text-2xl [&_h3.ce-header]:text-xl [&_.cdx-list]:list-disc [&_.cdx-list]:pl-5
        [&_.image-tool__image]:mx-auto [&_.image-tool__image-picture]:rounded-lg [&_.image-tool__caption]:text-center [&_.image-tool__caption]:text-sm [&_.image-tool__caption]:text-slate-500">
        
        <div id="editorjs"></div>
      
      </div>

      {/* Export Action Button */}
      <button
        onClick={handleExportJSON}
        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg shadow-sm hover:shadow transition-all duration-200 self-start focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Export as JSON File
      </button>
    </div>
  );
};

export default TextEditor;