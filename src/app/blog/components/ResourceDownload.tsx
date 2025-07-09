'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconDownload, IconFileZip, IconFileText, IconFile } from '@tabler/icons-react';

interface ResourceDownloadProps {
  resource: {
    title: string;
    description?: string;
    url: string;
    type: 'pdf' | 'zip' | 'doc' | 'other';
  };
}

export default function ResourceDownload({ resource }: ResourceDownloadProps) {
  const getIcon = () => {
    switch (resource.type) {
      case 'pdf':
        return <IconFileText className="h-6 w-6 text-red-500" />;
      case 'zip':
        return <IconFileZip className="h-6 w-6 text-yellow-500" />;
      case 'doc':
        return <IconFileText className="h-6 w-6 text-blue-500" />;
      default:
        return <IconFile className="h-6 w-6 text-gray-500" />;
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -3 }}
    >
      <Card className="rounded-xl shadow-md border-gray-200 bg-gradient-to-r from-white to-gray-50 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-0">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center bg-white w-12 h-12 rounded-lg shadow-sm">
                {getIcon()}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{resource.title}</h4>
                {resource.description && (
                  <p className="text-sm text-gray-600 line-clamp-1">{resource.description}</p>
                )}
              </div>
            </div>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-white gap-1 px-4 h-9 shadow-sm">
              <IconDownload className="h-4 w-4" />
              <span>Download</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}