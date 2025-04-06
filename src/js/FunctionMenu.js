import { useState } from "react";

export default function FunctionMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 right-4 z-50 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {open ? "關閉功能列" : "顯示功能列"}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transition-transform z-40 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 space-y-4">
          <h2 className="text-xl font-bold">功能列</h2>
          <button className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded">功能 1</button>
          <button className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded">功能 2</button>
          <button className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded">功能 3</button>
        </div>
      </div>
    </div>
  );
}
