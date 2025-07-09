'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { IconClipboard, IconCheck, IconTerminal2 } from '@tabler/icons-react';
import { useToast } from '@/hooks/use-toast';

interface CodeBlockProps {
  language: string;
  code: string;
}

export default function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast({
      title: "Code copied!",
      description: "The code has been copied to your clipboard.",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  // Get the appropriate language display name
  const getLanguageDisplayName = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'js':
      case 'javascript':
        return 'JavaScript';
      case 'ts':
      case 'typescript':
        return 'TypeScript';
      case 'py':
      case 'python':
        return 'Python';
      case 'bash':
      case 'sh':
        return 'Shell';
      case 'cpp':
        return 'C++';
      case 'cs':
        return 'C#';
      case 'html':
        return 'HTML';
      case 'css':
        return 'CSS';
      case 'java':
        return 'Java';
      case 'go':
        return 'Go';
      case 'rust':
        return 'Rust';
      default:
        return lang.charAt(0).toUpperCase() + lang.slice(1);
    }
  };

  return (
    <div className="relative group rounded-xl overflow-hidden my-6 shadow-lg border border-gray-800">
      <motion.div 
        className="flex items-center justify-between bg-gray-900 px-4 py-2 text-white"
        initial={{ opacity: 0.9 }}
        whileHover={{ opacity: 1 }}
      >
        <div className="flex items-center gap-2">
          <IconTerminal2 className="h-4 w-4 text-primary" />
          <span className="font-mono text-sm font-medium">{getLanguageDisplayName(language)}</span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="text-gray-300 hover:text-white hover:bg-gray-800"
          onClick={copyToClipboard}
        >
          {copied ? (
            <IconCheck className="h-4 w-4 text-green-400" />
          ) : (
            <IconClipboard className="h-4 w-4" />
          )}
          <span className="ml-2">{copied ? 'Copied!' : 'Copy'}</span>
        </Button>
      </motion.div>
      <div className="relative">
        <pre className="bg-gray-900 p-4 overflow-x-auto text-gray-200 text-sm font-mono">
          <code>{code}</code>
        </pre>
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
      </div>
    </div>
  );
}