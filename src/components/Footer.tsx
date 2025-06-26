import React from "react";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-gray-50 text-gray-500 text-center py-4 mt-8">
      <div className="max-w-6xl mx-auto px-4">
        <span>&copy; {new Date().getFullYear()} CKHO. All rights reserved.</span>
        <div className="mt-2 space-x-4 text-sm">
          <a href="/about" className="hover:text-pink-600">About</a>
          <a href="/faq" className="hover:text-pink-600">FAQ</a>
          <a href="/contact" className="hover:text-pink-600">Contact</a>
        </div>
      </div>
    </footer>
  );
}
