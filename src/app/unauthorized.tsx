"use client"

import React from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Shield, AlertTriangle } from 'lucide-react';

const UnauthorizedPage: React.FC = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/20 mb-6">
            <Shield className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
          
          {/* Main heading */}
          <h1 className="text-4xl font-bold text-white mb-2">
            Access Denied
          </h1>
          
          {/* Subheading */}
          <h2 className="text-xl text-gray-300 mb-6">
            401 - Unauthorized
          </h2>
          
          {/* Description */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
            <div className="flex items-center mb-3">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
              <span className="text-yellow-400 font-medium">Authentication Required</span>
            </div>
            <p className="text-gray-300 text-left">
              You don&lsquo;t have permission to access this resource. This could be because:
            </p>
            <ul className="text-gray-400 text-sm mt-3 space-y-1 text-left">
              <li>• Your session has expired</li>
              <li>• You&lsquo;re not logged in</li>
              <li>• You don&lsquo;t have the required permissions</li>
              <li>• Invalid authentication credentials</li>
            </ul>
          </div>
          
          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={handleLogin}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 transition duration-200"
            >
              Sign In
            </button>
            
            <div className="flex space-x-3">
              <button
                onClick={handleGoBack}
                className="flex-1 flex items-center justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:ring-offset-gray-900 transition duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </button>
              
              <button
                onClick={handleGoHome}
                className="flex-1 py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:ring-offset-gray-900 transition duration-200"
              >
                Home
              </button>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;