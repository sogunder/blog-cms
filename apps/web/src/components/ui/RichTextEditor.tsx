import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Quote, 
  Undo, 
  Redo 
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const buttons = [
    { 
      icon: Bold, 
      action: () => editor.chain().focus().toggleBold().run(),
      active: editor.isActive('bold')
    },
    { 
      icon: Italic, 
      action: () => editor.chain().focus().toggleItalic().run(),
      active: editor.isActive('italic')
    },
    { 
      icon: Heading1, 
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      active: editor.isActive('heading', { level: 1 })
    },
    { 
      icon: Heading2, 
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor.isActive('heading', { level: 2 })
    },
    { 
      icon: List, 
      action: () => editor.chain().focus().toggleBulletList().run(),
      active: editor.isActive('bulletList')
    },
    { 
      icon: ListOrdered, 
      action: () => editor.chain().focus().toggleOrderedList().run(),
      active: editor.isActive('orderedList')
    },
    { 
      icon: Quote, 
      action: () => editor.chain().focus().toggleBlockquote().run(),
      active: editor.isActive('blockquote')
    },
  ];

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50 rounded-t-lg">
      {buttons.map((btn, i) => (
        <button
          key={i}
          onClick={btn.action}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
            btn.active ? 'bg-gray-200 text-indigo-600' : 'text-gray-600'
          }`}
        >
          <btn.icon size={18} />
        </button>
      ))}
      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
      <button
        onClick={() => editor.chain().focus().undo().run()}
        className="p-1.5 text-gray-600 hover:bg-gray-200 rounded"
      >
        <Undo size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        className="p-1.5 text-gray-600 hover:bg-gray-200 rounded"
      >
        <Redo size={18} />
      </button>
    </div>
  );
};

export const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 transition-all bg-white">
      <MenuBar editor={editor} />
      <EditorContent 
        editor={editor} 
        className="prose prose-indigo max-w-none p-4 min-h-[300px] focus:outline-none" 
      />
    </div>
  );
};
