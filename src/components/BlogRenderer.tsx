import React from 'react';
import { OutputData, OutputBlockData } from '@editorjs/editorjs';

interface BlogRendererProps {
  content: OutputData;
}

const BlogRenderer = ({ content }: BlogRendererProps) => {
  return (
    <article className="prose max-w-none">
      {content.blocks.map((block: OutputBlockData) => {
        switch (block.type) {
          case 'header':
            return <HeaderBlock key={block.id} data={block.data} />;
          case 'paragraph':
            return <ParagraphBlock key={block.id} data={block.data} />;
          // Add cases for 'image', 'list', etc., as you scale out features
          default:
            console.warn(`Unknown block type: ${block.type}`, block);
            return null;
        }
      })}
    </article>
  );
};

/* Sub-Components typed cleanly */

const HeaderBlock = ({ data }: { data: any }) => {
  const Tag = `h${data.level || 2}` as keyof React.JSX.IntrinsicElements;
  return React.createElement(Tag, {
    className: 'text-2xl font-bold my-4',
    dangerouslySetInnerHTML: { __html: data.text },
  });
};

const ParagraphBlock = ({ data }: { data: any }) => {
  return (
    <p 
      className="text-base text-gray-700 leading-relaxed my-2"
      dangerouslySetInnerHTML={{ __html: data.text }} 
    />
  );
};
export default BlogRenderer