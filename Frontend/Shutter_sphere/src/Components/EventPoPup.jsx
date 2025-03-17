import React from 'react';
import { X, Calendar as CalendarIcon, Type, AlignLeft } from 'lucide-react';

export const EventPoPup = ({
  isOpen,
  onClose,
  title,
  setTitle,
  description,
  setDescription,
  date,
  setDate,
  onSave,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1F2937] rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-semibold text-white mb-6">Add New Event</h2>
        
        <div className="space-y-4">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
              <Type size={16} className="mr-2" />
              Event Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)} // Corrected
              className="w-full bg-[#374151] border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#EAB305] transition-colors"
              placeholder="Enter event title"
            />
          </div>
          
          <div>
            <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
              <CalendarIcon size={16} className="mr-2" />
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)} // Corrected
              className="w-full bg-[#374151] border border-gray-600 rounded-lg px-4 py-2 text-white"
            />
          </div>
          
          <div>
            <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
              <AlignLeft size={16} className="mr-2" />
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)} // Corrected
              className="w-full bg-[#374151] border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#EAB305] transition-colors min-h-[100px]"
              placeholder="Enter event description (optional)"
            />
          </div>
        </div>
        
        <div className="flex gap-4 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(title, description, date)} // Pass the arguments
            className="flex-1 px-4 py-2 bg-[#EAB305] hover:bg-[#F5C13C] text-black font-medium rounded-lg transition-colors"
          >
            Save Event
          </button>
        </div>
      </div>
    </div>
  );
};
