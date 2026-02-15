'use client'

import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import type { Editor } from '@tiptap/react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  CheckSquare,
  Eraser,
  Highlighter,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Paperclip,
  Redo,
  Underline as UnderlineIcon,
  Undo,
} from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { Toggle } from '@/components/ui/toggle'

interface RichEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const attachmentInputRef = React.useRef<HTMLInputElement>(null)

  if (!editor) return null

  const addImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const url = event.target?.result as string
        editor.chain().focus().setImage({ src: url }).run()
      }
      reader.readAsDataURL(file)
    }
  }

  const addAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const url = event.target?.result as string
        editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .setLink({ href: url })
          .insertContent(file.name)
          .run()
      }
      reader.readAsDataURL(file)
    }
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const resizeImage = (width: string) => {
    editor.chain().focus().updateAttributes('image', { width }).run()
  }

  return (
    <div className="flex flex-wrap items-center gap-1 border-b p-1 bg-muted/20">
      <Toggle
        pressed={editor.isActive('bold')}
        size="sm"
        type="button"
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        pressed={editor.isActive('italic')}
        size="sm"
        type="button"
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        pressed={editor.isActive('underline')}
        size="sm"
        type="button"
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        pressed={editor.isActive('highlight')}
        size="sm"
        type="button"
        onPressedChange={() => editor.chain().focus().toggleHighlight().run()}
      >
        <Highlighter className="h-4 w-4" />
      </Toggle>

      <Separator className="mx-1 h-6" orientation="vertical" />

      <Toggle
        pressed={editor.isActive({ textAlign: 'left' })}
        size="sm"
        type="button"
        onPressedChange={() =>
          editor.chain().focus().setTextAlign('left').run()
        }
      >
        <AlignLeft className="h-4 w-4" />
      </Toggle>
      <Toggle
        pressed={editor.isActive({ textAlign: 'center' })}
        size="sm"
        type="button"
        onPressedChange={() =>
          editor.chain().focus().setTextAlign('center').run()
        }
      >
        <AlignCenter className="h-4 w-4" />
      </Toggle>
      <Toggle
        pressed={editor.isActive({ textAlign: 'right' })}
        size="sm"
        type="button"
        onPressedChange={() =>
          editor.chain().focus().setTextAlign('right').run()
        }
      >
        <AlignRight className="h-4 w-4" />
      </Toggle>

      <Separator className="mx-1 h-6" orientation="vertical" />

      <Toggle
        pressed={editor.isActive('bulletList')}
        size="sm"
        type="button"
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle
        pressed={editor.isActive('orderedList')}
        size="sm"
        type="button"
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>
      <Toggle
        pressed={editor.isActive('taskList')}
        size="sm"
        type="button"
        onPressedChange={() => editor.chain().focus().toggleTaskList().run()}
      >
        <CheckSquare className="h-4 w-4" />
      </Toggle>

      <Separator className="mx-1 h-6" orientation="vertical" />

      <input
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        type="file"
        onChange={addImage}
      />
      <Button
        className="h-8 w-8 p-0"
        size="sm"
        type="button"
        variant="ghost"
        onClick={(e) => {
          e.preventDefault()
          fileInputRef.current?.click()
        }}
      >
        <ImageIcon className="h-4 w-4" />
      </Button>

      {editor.isActive('image') && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="h-8 gap-1 px-2 text-xs"
              size="sm"
              variant="ghost"
            >
              Size
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => resizeImage('25%')}>
              Small (25%)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => resizeImage('50%')}>
              Medium (50%)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => resizeImage('100%')}>
              Full (100%)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <input
        ref={attachmentInputRef}
        className="hidden"
        type="file"
        onChange={addAttachment}
      />
      <Button
        className="h-8 w-8 p-0"
        size="sm"
        type="button"
        variant="ghost"
        onClick={(e) => {
          e.preventDefault()
          attachmentInputRef.current?.click()
        }}
      >
        <Paperclip className="h-4 w-4" />
      </Button>

      <Separator className="mx-1 h-6" orientation="vertical" />

      <Toggle
        pressed={editor.isActive('link')}
        size="sm"
        type="button"
        onPressedChange={setLink}
      >
        <LinkIcon className="h-4 w-4" />
      </Toggle>

      <Separator className="mx-1 h-6" orientation="vertical" />

      <Button
        className="h-8 w-8 p-0"
        size="sm"
        type="button"
        variant="ghost"
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().unsetAllMarks().clearNodes().run()
        }}
      >
        <Eraser className="h-4 w-4" />
      </Button>

      <div className="ml-auto flex items-center gap-1">
        <Toggle
          disabled={!editor.can().undo()}
          size="sm"
          type="button"
          onPressedChange={() => editor.chain().focus().undo().run()}
        >
          <Undo className="h-4 w-4" />
        </Toggle>
        <Toggle
          disabled={!editor.can().redo()}
          size="sm"
          type="button"
          onPressedChange={() => editor.chain().focus().redo().run()}
        >
          <Redo className="h-4 w-4" />
        </Toggle>
      </div>
    </div>
  )
}

export function RichEditor({
  value,
  onChange,
  placeholder = 'Start typing...',
}: RichEditorProps) {
  const extensions = React.useMemo(
    () => [
      StarterKit.configure(),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-lg border shadow-sm max-w-full h-auto my-4 mx-auto',
        },
      }).extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            width: {
              default: '100%',
              renderHTML: (attributes) => ({
                style: `width: ${attributes.width}`,
              }),
            },
          }
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
    ],
    [placeholder],
  )

  const editor = useEditor({
    extensions,
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[300px] p-4 tiptap',
      },
    },
  })

  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  return (
    <div className="flex flex-col rounded-md border bg-background overflow-hidden ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-all">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
