// src/components/resources/SearchBar.tsx
"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search query to avoid excessive API calls
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      clearTimeout(timerId);
    };
  }, [query]);

  // Trigger search callback when debounced query changes
  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  // Clear search
  const handleClearSearch = () => {
    setQuery("");
    setDebouncedQuery("");
  };

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      
      <Input
        type="text"
        placeholder="Search files and folders..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 pr-10"
      />
      
      {query && (
        <button
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          onClick={handleClearSearch}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}