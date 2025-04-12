import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Undo, Redo, Trash2 } from 'lucide-react';
import { RootState } from '../store';
import { addNote, updateNote, deleteNote } from '../store/slices/notesSlice';

export const Notes: React.FC = () => {
  const dispatch = useDispatch();
  const notes = useSelector((state: RootState) => state.notes.items);
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [newNoteTitle, setNewNoteTitle] = useState('');

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    onUpdate: ({ editor }) => {
      if (activeNote) {
        const note = notes.find(n => n.id === activeNote);
        if (note) {
          dispatch(updateNote({
            ...note,
            content: editor.getHTML(),
            updatedAt: new Date().toISOString(),
          }));
        }
      }
    },
  });

  useEffect(() => {
    if (notes.length > 0 && !activeNote) {
      setActiveNote(notes[0].id);
      editor?.commands.setContent(notes[0].content);
    }
  }, [notes, activeNote, editor]);

  const createNewNote = () => {
    if (!newNoteTitle.trim()) return;

    const newNote = {
      id: crypto.randomUUID(),
      title: newNoteTitle,
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch(addNote(newNote));
    setNewNoteTitle('');
    setActiveNote(newNote.id);
    editor?.commands.setContent('');
  };

  const selectNote = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    setActiveNote(noteId);
    editor?.commands.setContent(note?.content || '');
  };

  const handleDeleteNote = (noteId: string) => {
    dispatch(deleteNote(noteId));
    if (activeNote === noteId) {
      const remainingNotes = notes.filter(n => n.id !== noteId);
      setActiveNote(remainingNotes.length > 0 ? remainingNotes[0].id : null);
      editor?.commands.setContent(remainingNotes[0]?.content || '');
    }
  };

  return (
    <div className="bg-gray-900 p-8 rounded-lg shadow-xl">
      <h2 className="text-2xl font-semibold text-cyan-400 mb-6">Notes</h2>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="col-span-3 bg-gray-800 rounded-lg p-4">
          <div className="mb-4">
            <input
              type="text"
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              placeholder="New note title..."
              className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <button
              onClick={createNewNote}
              className="w-full mt-2 bg-cyan-400 text-gray-900 px-4 py-2 rounded-lg hover:bg-cyan-300 transition-colors"
            >
              Create Note
            </button>
          </div>

          <div className="space-y-2">
            {notes.map(note => (
              <div
                key={note.id}
                className="flex items-center gap-2"
              >
                <button
                  onClick={() => selectNote(note.id)}
                  className={`flex-1 text-left px-3 py-2 rounded-lg transition-colors ${
                    activeNote === note.id
                      ? 'bg-cyan-400 text-gray-900'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {note.title}
                </button>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className="col-span-9 bg-gray-800 rounded-lg p-4">
          {activeNote ? (
            <>
              <div className="border-b border-gray-700 pb-4 mb-4 flex gap-2">
                <button
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className={`p-2 rounded ${
                    editor?.isActive('bold')
                      ? 'bg-cyan-400 text-gray-900'
                      : 'text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <Bold size={20} />
                </button>
                <button
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className={`p-2 rounded ${
                    editor?.isActive('italic')
                      ? 'bg-cyan-400 text-gray-900'
                      : 'text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <Italic size={20} />
                </button>
                <button
                  onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  className={`p-2 rounded ${
                    editor?.isActive('bulletList')
                      ? 'bg-cyan-400 text-gray-900'
                      : 'text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <List size={20} />
                </button>
                <button
                  onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                  className={`p-2 rounded ${
                    editor?.isActive('orderedList')
                      ? 'bg-cyan-400 text-gray-900'
                      : 'text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <ListOrdered size={20} />
                </button>
                <button
                  onClick={() => editor?.chain().focus().undo().run()}
                  className="p-2 rounded text-gray-400 hover:bg-gray-700"
                >
                  <Undo size={20} />
                </button>
                <button
                  onClick={() => editor?.chain().focus().redo().run()}
                  className="p-2 rounded text-gray-400 hover:bg-gray-700"
                >
                  <Redo size={20} />
                </button>
              </div>
              <EditorContent
                editor={editor}
                className="prose prose-invert max-w-none focus:outline-none"
              />
            </>
          ) : (
            <div className="text-center text-gray-400 py-12">
              Select a note or create a new one to start writing
            </div>
          )}
        </div>
      </div>
    </div>
  );
};