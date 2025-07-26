"use client";

import React, { useState } from "react";
import { Edit, PlusCircle } from "lucide-react";
import { CreatePageDialog } from "@/components/admin/CreatePageDialog";
import { useEditMode } from "@/hooks/EditModeContext";
import { useAuth } from "@/components/providers/AuthProvider";

interface ButtonStyles extends React.CSSProperties {
  '--button-bg'?: string;
  '--button-hover-bg'?: string;
  '--button-active-bg'?: string;
  '--button-text'?: string;
  '--button-border'?: string;
}

export default function PageEditFab() {
  const { isAdmin } = useAuth();
  const { isEditMode, toggleEditMode } = useEditMode();
  const [open, setOpen] = useState(false);

  if (!isAdmin) return null;

  // Debug log
  console.log('Rendering PageEditFab', { isAdmin, isEditMode, open });

  // Container styles with TypeScript type
  const containerStyles: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    right: '1rem',
    transform: 'translateY(-50%)',
    zIndex: 2147483647, // Max z-index value
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(8px)',
    borderRadius: '1rem',
    padding: '1rem',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(209, 213, 219, 0.7)',
    // Debug styles
    outline: '2px solid #3b82f6',
    outlineOffset: '2px',
    visibility: 'visible',
    opacity: 1,
    pointerEvents: 'auto',
  };

  // Button styles with TypeScript type
  const buttonStyles: ButtonStyles = {
    width: '3rem',
    height: '3rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    '--button-bg': '#ffffff',
    '--button-hover-bg': '#f3f4f6',
    '--button-active-bg': '#e5e7eb',
    '--button-text': '#1f2937',
    '--button-border': '#e5e7eb',
  };

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4 p-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200">
      {/* Edit Mode Toggle Button */}
      <button
        onClick={toggleEditMode}
        aria-label={isEditMode ? "Exit Edit Mode" : "Edit Page"}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
          isEditMode 
            ? 'bg-blue-500 text-white shadow-md hover:bg-blue-600' 
            : 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50 hover:shadow-md'
        }`}
      >
        <Edit className={`w-5 h-5 ${isEditMode ? 'text-white' : 'text-gray-600'}`} />
        {isEditMode && (
          <span className="absolute bottom-0 left-0 right-0 h-1 bg-blue-400 rounded-full" />
        )}
      </button>
      {/* Only the Page Edit icon is visible. Add New Page button and dialog removed. */}
    </div>
  );
}
