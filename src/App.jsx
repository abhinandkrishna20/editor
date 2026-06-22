import React, { useState } from 'react';
import { BlogEditor } from './components/BlogEditor';
import BlogRenderer from './components/BlogRenderer'; // Fixed: Removed curly braces

const App = () => {
  // State to store the JSON payload coming out of the editor
  const [blogContent, setBlogContent] = useState(null);

  const handleSaveBlog = (savedData) => {
    console.log("Data captured from Editor.js:", savedData);
    setBlogContent(savedData); // Store it in state
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 className="text-3xl font-bold my-6 text-center">My Editor.js App</h1>
      
      {/* 1. Pass the onSave handler to the Editor */}
      <BlogEditor onSave={handleSaveBlog} />

      <hr style={{ margin: '40px 0', borderColor: '#eaeaea' }} />

      <h2 className="text-xl font-semibold mb-4">Live Preview Output:</h2>
      
      {/* 2. Only render the view if we actually have saved data blocks */}
      {blogContent && blogContent.blocks && blogContent.blocks.length > 0 ? (
        <BlogRenderer content={blogContent} />
      ) : (
        <p style={{ color: '#888', fontStyle: 'italic' }}>
          No content published yet. Write something above and click "Publish Blog Post"!
        </p>
      )}
    </div>
  );
};

export default App;