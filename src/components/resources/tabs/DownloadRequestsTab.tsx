"use client";

import { useState } from "react";
import { Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User as UserType } from "@/hooks/useAuth";

interface DownloadRequestsTabProps {
  resourcePath: string;
  user: UserType;
}

export default function DownloadRequestsTab({  }: DownloadRequestsTabProps) {
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">("pending");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">
          <Download className="mr-2 inline-block h-5 w-5" />
          Download Requests
        </h3>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      <div className="flex border-b">
        <button
          className={`border-b-2 px-4 py-2 text-sm font-medium ${
            activeTab === "pending"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("pending")}
        >
          Pending
        </button>
        <button
          className={`border-b-2 px-4 py-2 text-sm font-medium ${
            activeTab === "approved"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("approved")}
        >
          Approved
        </button>
        <button
          className={`border-b-2 px-4 py-2 text-sm font-medium ${
            activeTab === "rejected"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("rejected")}
        >
          Rejected
        </button>
      </div>

      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
        <Download className="mb-4 h-12 w-12 text-gray-400" />
        <h3 className="mb-1 text-lg font-medium text-gray-900">No Download Requests</h3>
        <p className="text-sm text-gray-500">
          {activeTab === "pending"
            ? "There are no pending download requests for this resource."
            : activeTab === "approved"
            ? "There are no approved download requests for this resource."
            : "There are no rejected download requests for this resource."}
        </p>
      </div>
    </div>
  );
}