import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";

import {
  createEditor,
  Descendant,
  Element as SlateElement,
  Transforms,
  Editor,
  Range,
  BaseEditor,
} from "slate";
import {
  Slate,
  Editable,
  withReact,
  useSlate,
  RenderElementProps,
  RenderLeafProps,
  ReactEditor,
} from "slate-react";

type Format = "bold" | "italic";
type BlockType =
  | "paragraph"
  | "link"
  | "numbered-list"
  | "bulleted-list"
  | "list-item";

type CustomElement = {
  type: BlockType;
  url?: string;
  children: CustomText[];
};

type CustomText = {
  type?: BlockType;
  text?: string;
  bold?: boolean;
  italic?: boolean;
  children?: CustomText[];
};

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

//   JSON.parse(
//     '[{"type":"paragraph","children":[{"text":"balls"},{"text":"balls","bold":true},{"text":"balls","italic":true}]},{"type":"bulleted-list","children":[{"type":"list-item","children":[{"text":"hello"}]}]},{"type":"numbered-list","children":[{"type":"list-item","children":[{"text":"sadfdfs"}]},{"type":"list-item","children":[{"text":""}]},{"type":"list-item","children":[{"text":"adsfasffsdsfdfdsafsaasfdfsad"}]},{"type":"list-item","children":[{"text":""},{"type":"link","url":"google.com","children":[{"text":"dsffadssdf"}]},{"text":""}]},{"type":"list-item","children":[{"text":"dfsdfsfdsa"}]}]}]'
//   );

const LIST_TYPES = ["numbered-list", "bulleted-list"] as const;

// Toolbar Button Component
function ToolbarButton({
  icon: Icon,
  isActive = false,
  onClick,
}: {
  icon: React.ElementType;
  isActive?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 ${
        isActive ? "text-black bg-gray-200" : "text-gray-600"
      }`}
    >
      <Icon size={18} />
    </button>
  );
}

// Utility Functions
const isBlockActive = (editor: Editor, format: BlockType) => {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
  });
  return !!match;
};

const isMarkActive = (editor: Editor, format: Format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const toggleBlock = (editor: Editor, format: BlockType) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format as (typeof LIST_TYPES)[number]);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type as (typeof LIST_TYPES)[number]),
    split: true,
  });

  const newProperties: Partial<CustomElement> = {
    type: isActive ? "paragraph" : isList ? "list-item" : format,
  };
  Transforms.setNodes(editor, newProperties);

  if (!isActive && isList) {
    const block: CustomElement = {
      type: format,
      children: [],
    };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor: Editor, format: Format) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const insertLink = (editor: Editor) => {
  const url = window.prompt("Enter the URL of the link:");
  if (!url) return;

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);

  const link: CustomElement = {
    type: "link",
    url,
    children: isCollapsed ? [{ text: url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: "end" });
  }
};

const removeLink = (editor: Editor) => {
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link",
  });
};

// Plugin to mark links as inline
const withLinks = (editor: Editor) => {
  const { insertData, insertText, isInline } = editor;

  editor.isInline = (element) => element.type === "link" || isInline(element);

  editor.insertText = (text) => {
    if (text && isUrl(text)) {
      insertLink(editor);
    } else {
      insertText(text);
    }
  };

  editor.insertData = (data) => {
    const text = data.getData("text/plain");
    if (text && isUrl(text)) {
      insertLink(editor);
    } else {
      insertData(data);
    }
  };

  return editor;
};

const isUrl = (text: string) => {
  try {
    new URL(text);
    return true;
  } catch {
    return false;
  }
};

// Render Functions
const Element = ({ attributes, children, element }: RenderElementProps) => {
  switch (element.type) {
    case "bulleted-list":
      return (
        <ul className="list-disc list-inside" {...attributes}>
          {children}
        </ul>
      );
    case "numbered-list":
      return (
        <ol className="list-decimal list-inside" {...attributes}>
          {children}
        </ol>
      );
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "link":
      return (
        <a
          {...attributes}
          href={element.url}
          target="_blank"
          rel="noopener noreferrer"
          contentEditable={false}
          className="cursor-pointer text-blue-600 underline"
          onClick={(e) => {
            if (!e.metaKey && !e.ctrlKey) {
              e.preventDefault();
              window.open(element.url, "_blank");
            }
          }}
        >
          {children}
        </a>
      );
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.italic) children = <em>{children}</em>;
  return <span {...attributes}>{children}</span>;
};

function Toolbar() {
  const editor = useSlate();
  const linkActive = isBlockActive(editor, "link");

  return (
    <div className="border-b border-gray-300 p-2 flex items-center gap-1 bg-gray-50 rounded-t-md">
      <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
        <ToolbarButton
          icon={Bold}
          isActive={isMarkActive(editor, "bold")}
          onClick={() => toggleMark(editor, "bold")}
        />
        <ToolbarButton
          icon={Italic}
          isActive={isMarkActive(editor, "italic")}
          onClick={() => toggleMark(editor, "italic")}
        />
      </div>

      <div className="flex items-center gap-1 px-2 border-r border-gray-200">
        <ToolbarButton
          icon={List}
          isActive={isBlockActive(editor, "bulleted-list")}
          onClick={() => toggleBlock(editor, "bulleted-list")}
        />
        <ToolbarButton
          icon={ListOrdered}
          isActive={isBlockActive(editor, "numbered-list")}
          onClick={() => toggleBlock(editor, "numbered-list")}
        />
      </div>

      <div className="flex items-center gap-1 pl-2">
        <ToolbarButton
          icon={LinkIcon}
          isActive={linkActive}
          onClick={() => (linkActive ? removeLink(editor) : insertLink(editor))}
        />
      </div>
    </div>
  );
}

export default function Textarea({
  handleDescription,
}: {
  handleDescription: (description: string) => void;
}) {
  const editor = useMemo(() => withLinks(withReact(createEditor())), []);

  useEffect(() => {
    const resetHandler = () => {
      Transforms.select(editor, []);
      Transforms.removeNodes(editor, { at: [0] });
      Transforms.insertNodes(editor, initialValue, { at: [0] });
    };

    document.addEventListener("ClearEditor", resetHandler);

    return () => {
      document.removeEventListener("ClearEditor", resetHandler);
    };
  }, [editor]);

  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    []
  );
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  );

  const handleEditorKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!event.ctrlKey && !event.metaKey) return;
      if (event.key === "b") {
        event.preventDefault();
        toggleMark(editor, "bold");
      } else if (event.key === "i") {
        event.preventDefault();
        toggleMark(editor, "italic");
      }
    },
    [editor]
  );

  return (
    <div className="space-y-1">
      <label
        htmlFor="description"
        className="flex gap-3 font-medium text-gray-700"
      >
        Description
      </label>
      <div className="border border-gray-300 rounded-md  focus-within:ring-neutral-700">
        <Slate
          editor={editor}
          initialValue={initialValue}
          onChange={() => handleDescription(JSON.stringify(editor.children))}
        >
          <Toolbar />
          <div className="px-4 py-2 min-h-[120px]">
            <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              placeholder="Enter Description"
              className="focus:outline-none"
              onKeyDown={handleEditorKeyDown}
            />
          </div>
        </Slate>
      </div>
    </div>
  );
}
