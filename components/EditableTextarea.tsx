// EditableTextarea.tsx
import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

interface EditableTextareaProps {
  value: string;
  editMode: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
}

const EditableTextarea: React.FC<EditableTextareaProps> = ({ value, editMode, onChange, onBlur }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editMode && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [editMode]);

  return (
    <div className={`flex-1 outline-none border-none bg-transparent resize-none ${editMode ? ' focus:border-gray-500' : ''}`}>
      {editMode ? (
        <>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            rows={3}
            style={{ marginRight: "8px" }}
          />
          <FontAwesomeIcon icon={faSave} className="mr-2 text-blue-500" />
        </>
      ) : (
        <p className="text-sm">{value}</p>
      )}
    </div>
  );
};

export default EditableTextarea;
