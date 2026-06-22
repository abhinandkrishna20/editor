import { useEffect, useRef } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';

interface BlogEditorProps {
  onSave: (data: OutputData) => void;
  initialData?: OutputData;
}

export const BlogEditor = ({ onSave, initialData }: BlogEditorProps) => {
  const editorRef = useRef<EditorJS | null>(null);
  const holderId = 'editorjs-container';

  useEffect(() => {
    // Prevent double-initialization in React Strict Mode
    if (editorRef.current) return;

    const editor = new EditorJS({
      holder: holderId,
      data: initialData,
      placeholder: 'Write your engineering blog post...',
      tools: {
        header: {
          class: Header as any, // Type-casting required for some community plugins in TS
          inlineToolbar: true,
          config: { levels: [2, 3, 4], defaultLevel: 2 }
        },
        paragraph: {
          class: Paragraph as any,
          inlineToolbar: true
        }
      },
      onReady: () => {
        editorRef.current = editor;
      }
    });

    // Cleanup on component unmount
    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === 'function') {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [initialData]);

  const handleSaveClick = async () => {
    if (editorRef.current) {
      try {
        const savedData = await editorRef.current.save();
        onSave(savedData);
      } catch (error) {
        console.error('Failed to parse Editor.js data:', error);
      }
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '6px' }}>
      {/* The designated container Editor.js hooks into */}
      <div id={holderId} />
      
      <button 
        onClick={handleSaveClick}
        style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}
      >
        Publish Blog Post
      </button>
    </div>
  );
};