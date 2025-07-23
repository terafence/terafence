export interface FileInfo {
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
  }
  
  // Function to upload a single file using the file API
  export const uploadFile = async (file: File): Promise<FileInfo> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/files', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      
      const fileInfo = await response.json();
      return fileInfo;
    } catch (error) {
      console.error('Failed to upload file:', error);
      throw new Error('Failed to upload file');
    }
  };
  
  // Function to handle multiple file uploads
  export const uploadMultipleFiles = async (files: File[]): Promise<FileInfo[]> => {
    const uploadPromises = files.map(file => uploadFile(file));
    return Promise.all(uploadPromises);
  };
  
  // Function to format file list for storage in Google Sheets
  export const formatFilesForStorage = (files: FileInfo[]): string => {
    return files.map(file => `${file.name}|${file.url}`).join(',');
  };
  
  // Function to parse file list from Google Sheets
  export const parseFilesFromStorage = (filesString: string): { name: string; url: string }[] => {
    if (!filesString) {
      return [];
    }
    
    return filesString.split(',').map(fileString => {
      const [name, url] = fileString.split('|');
      return { name, url };
    });
  };