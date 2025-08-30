import React, { useState, useCallback } from "react";
import {
  Upload,
  File,
  FileText,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  Brain,
  Download,
  Key,
  Type,
  Send,
  Copy,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ScrollArea } from "./ui/scroll-area";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner@2.0.3";
import APIKeyConfig from "./APIKeyConfig";
import OpenAIService from "./OpenAIService";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "uploading" | "processing" | "completed" | "error";
  progress: number;
  summary?: string;
  keyRegulations?: string[];
  documentType?: string;
  riskLevel?: "low" | "medium" | "high";
  actionItems?: string[];
  error?: string;
}

interface FileUploadSummarizerProps {
  onRegulationSearch?: (query: string) => void;
}

/**
 * Render analysis results in beautiful markdown format
 */
function AnalysisRenderer({ file }: { file: UploadedFile }) {
  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCopyAnalysis = async () => {
    const analysisText = generateAnalysisMarkdown(file);
    try {
      await navigator.clipboard.writeText(analysisText);
      toast.success("Analysis copied to clipboard!");
    } catch (e) {
      toast.error("Copy failed. Check browser permissions.");
    }
  };

  const handleDownloadAnalysis = () => {
    const analysisText = generateAnalysisMarkdown(file);
    const blob = new Blob([analysisText], {
      type: "text/markdown",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `analysis-${file.name.replace(/\.[^/.]+$/, "")}-${new Date().toISOString().split("T")[0]}.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
    toast.success("Analysis report downloaded!");
  };

  // Helper function to extract summary text from JSON string
  const extractSummaryText = (summary: string): string => {
    // If it's already a plain string (not JSON), return it
    if (!summary.trim().startsWith('{') && !summary.trim().startsWith('[')) {
      return summary;
    }
    
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(summary);
      if (parsed.summary) {
        return parsed.summary;
      }
      // If no summary property, return the whole parsed object as string
      return JSON.stringify(parsed, null, 2);
    } catch (error) {
      // If parsing fails, try to extract summary manually using regex
      const summaryMatch = summary.match(/"summary":\s*"([^"]+)"/);
      if (summaryMatch) {
        return summaryMatch[1];
      }
      
      // If all else fails, return the original string
      return summary;
    }
  };

  const generateAnalysisMarkdown = (
    file: UploadedFile,
  ): string => {
    let markdown = `# 📄 Document Analysis: ${file.name}\n\n`;

    if (file.documentType) {
      markdown += `**📑 Document Type:** ${file.documentType}\n\n`;
    }

    if (file.riskLevel) {
      const riskEmoji =
        file.riskLevel === "high"
          ? "🔴"
          : file.riskLevel === "medium"
            ? "🟡"
            : "🟢";
      markdown += `**⚠️ Risk Assessment:** ${riskEmoji} ${file.riskLevel.toUpperCase()}\n\n`;
    }

    if (file.summary) {
      const summaryText = extractSummaryText(file.summary);
      markdown += `## 📋 Executive Summary\n\n${summaryText}\n\n`;
    }

    if (file.keyRegulations && file.keyRegulations.length > 0) {
      markdown += `## 📜 Legal Requirements Identified\n\n`;
      file.keyRegulations.forEach((regulation, index) => {
        markdown += `${index + 1}. **${regulation}**\n`;
      });
      markdown += "\n";
    }

    if (file.actionItems && file.actionItems.length > 0) {
      markdown += `## ✅ Recommended Actions\n\n`;
      file.actionItems.forEach((action, index) => {
        markdown += `${index + 1}. ${action}\n`;
      });
      markdown += "\n";
    }

    return markdown;
  };

  // Parse and render markdown content
  const renderMarkdownContent = () => {
    const elements: React.ReactNode[] = [];
    let keyIndex = 0;

    // Document header with type and risk level
    elements.push(
      <div
        key={keyIndex++}
        className="border-b border-gray-200 pb-4 mb-6"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gov-navy flex items-center gap-2">
            📄 Document Analysis
          </h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyAnalysis}
              className="text-xs hover:bg-nav-teal hover:text-white"
            >
              <Copy className="w-3 h-3 mr-1" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadAnalysis}
              className="text-xs hover:bg-gov-navy hover:text-white"
            >
              <Download className="w-3 h-3 mr-1" />
              Download
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {file.documentType && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">
                Document Type:
              </span>
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                📑 {file.documentType}
              </Badge>
            </div>
          )}

          {file.riskLevel && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">
                Risk Level:
              </span>
              <Badge
                className={`${getRiskLevelColor(file.riskLevel)} border-0`}
              >
                {file.riskLevel === "high"
                  ? "🔴"
                  : file.riskLevel === "medium"
                    ? "🟡"
                    : "🟢"}{" "}
                {file.riskLevel.toUpperCase()}
              </Badge>
            </div>
          )}
        </div>
      </div>,
    );

    // Executive Summary
    if (file.summary) {
      const summaryText = extractSummaryText(file.summary);
      elements.push(
        <div key={keyIndex++} className="mb-6">
          <h4 className="text-md font-semibold text-nav-teal mb-3 flex items-center gap-2">
            📋 Executive Summary
          </h4>
          <div className="bg-white border border-nav-teal/20 rounded-lg p-5 shadow-sm">
            <div className="prose prose-sm max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {summaryText
                  .split("\n")
                  .map((paragraph, idx) =>
                    paragraph.trim() ? (
                      <p key={idx} className="mb-3 last:mb-0">
                        {paragraph.trim()}
                      </p>
                    ) : null,
                  )}
              </div>
            </div>
          </div>
        </div>,
      );
    }

    // Legal Requirements
    if (file.keyRegulations && file.keyRegulations.length > 0) {
      elements.push(
        <div key={keyIndex++} className="mb-6">
          <h4 className="text-md font-semibold text-gov-navy mb-3 flex items-center gap-2">
            📜 Legal Requirements Identified
            <Badge className="bg-gov-navy/10 text-gov-navy border-gov-navy/20">
              {file.keyRegulations.length} found
            </Badge>
          </h4>
          <div className="space-y-3">
            {file.keyRegulations.map((regulation, index) => {
              // Parse regulation to extract more information if formatted
              const hasJurisdiction =
                regulation.includes("(Jurisdiction:") ||
                regulation.includes("(Effective:");
              const parts = regulation.split(" - ");
              const title = parts[0];
              const details = parts.slice(1).join(" - ");

              return (
                <div
                  key={index}
                  className="bg-white border border-yellow-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 bg-accent-yellow rounded-full flex items-center justify-center text-sm font-semibold text-gov-navy">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-1">
                        {title}
                      </div>
                      {details && (
                        <div className="text-sm text-gray-600 leading-relaxed">
                          {details}
                        </div>
                      )}
                      {hasJurisdiction && (
                        <div className="mt-2 flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                          >
                            📍 Jurisdictional Requirement
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>,
      );
    }

    // Action Items
    if (file.actionItems && file.actionItems.length > 0) {
      elements.push(
        <div key={keyIndex++} className="mb-4">
          <h4 className="text-md font-semibold text-green-700 mb-3 flex items-center gap-2">
            ✅ Recommended Actions
            <Badge className="bg-green-100 text-green-700 border-green-200">
              {file.actionItems.length} steps
            </Badge>
          </h4>
          <div className="space-y-3">
            {file.actionItems.map((action, index) => {
              // Determine priority based on keywords
              const isUrgent =
                action.toLowerCase().includes("immediately") ||
                action.toLowerCase().includes("urgent");
              const isImportant =
                action.toLowerCase().includes("must") ||
                action.toLowerCase().includes("required");

              return (
                <div
                  key={index}
                  className="bg-white border border-green-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold ${
                        isUrgent
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 leading-relaxed">
                        {action}
                      </p>
                      {(isUrgent || isImportant) && (
                        <div className="mt-2 flex gap-2">
                          {isUrgent && (
                            <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">
                              ⚡ Urgent
                            </Badge>
                          )}
                          {isImportant && !isUrgent && (
                            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs">
                              ⚠️ Important
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>,
      );
    }

    return <div className="space-y-1">{elements}</div>;
  };

  return renderMarkdownContent();
}

export default function FileUploadSummarizer({
  onRegulationSearch,
}: FileUploadSummarizerProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [apiKey, setApiKey] = useState("");
  const [openAIService, setOpenAIService] =
    useState<OpenAIService | null>(null);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textContent, setTextContent] = useState("");

  const acceptedTypes = {
    "application/pdf": ".pdf",
    "text/plain": ".txt",
    "text/csv": ".csv",
    // Note: Word docs require server-side processing
  };

  const handleAPIKeySet = (key: string) => {
    setApiKey(key);
    if (key) {
      setOpenAIService(new OpenAIService({ apiKey: key }));
    } else {
      setOpenAIService(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      parseFloat((bytes / Math.pow(k, i)).toFixed(2)) +
      " " +
      sizes[i]
    );
  };

  const generateFallbackSummary = (fileName: string) => {
    const summaries = [
      {
        summary:
          "Document analysis unavailable. Please configure OpenAI API key for intelligent document processing and compliance review.",
        keyRegulations: [
          "Business Registration Requirements",
          "Employment Standards Compliance",
        ],
        documentType: "Unknown document",
        riskLevel: "medium" as const,
        actionItems: [
          "Configure AI analysis",
          "Manual compliance review required",
        ],
      },
    ];

    return summaries[0];
  };

  const processFile = async (
    file: UploadedFile,
    actualFile: File,
  ) => {
    try {
      // Show upload progress
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise((resolve) =>
          setTimeout(resolve, 200),
        );
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id
              ? {
                  ...f,
                  progress,
                  status:
                    progress < 100 ? "uploading" : "processing",
                }
              : f,
          ),
        );
      }

      let analysisResult;

      if (openAIService) {
        // Real AI processing with OpenAI
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id
              ? { ...f, status: "processing", progress: 100 }
              : f,
          ),
        );

        // Add special handling for PDF files to show extraction status
        if (actualFile.type === "application/pdf") {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === file.id
                ? { ...f, status: "processing", progress: 100 }
                : f,
            ),
          );
        }

        analysisResult =
          await openAIService.analyzeDocument(actualFile);
      } else {
        // Fallback to basic analysis
        analysisResult = generateFallbackSummary(file.name);
      }

      setFiles((prev) =>
        prev.map((f) =>
          f.id === file.id
            ? {
                ...f,
                status: "completed",
                summary: analysisResult.summary,
                keyRegulations: analysisResult.keyRegulations,
                documentType: analysisResult.documentType,
                riskLevel: analysisResult.riskLevel,
                actionItems: analysisResult.actionItems,
              }
            : f,
        ),
      );
    } catch (error) {
      console.error("File processing error:", error);
      let errorMessage = "Failed to process document";

      if (error instanceof Error) {
        errorMessage = error.message;

        // Provide more specific error messages for different issues
        if (
          error.message.includes("PDF") ||
          error.message.includes("pdf")
        ) {
          // Don't modify PDF error messages - they already contain helpful guidance
          errorMessage = error.message;
        } else if (error.message.includes("API")) {
          errorMessage = `API Error: ${error.message}. Please check your OpenAI API key and try again.`;
        } else if (
          error.message.includes("network") ||
          error.message.includes("fetch")
        ) {
          errorMessage =
            "Network error. Please check your internet connection and try again.";
        }
      }

      setFiles((prev) =>
        prev.map((f) =>
          f.id === file.id
            ? {
                ...f,
                status: "error",
                error: errorMessage,
              }
            : f,
        ),
      );
    }
  };

  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024; // 10MB limit
    const allowedTypes = Object.keys(acceptedTypes);
    const fileName = file.name.toLowerCase();

    if (file.size > maxSize) {
      return `File size too large. Maximum size is 10MB.`;
    }

    // Special handling for PDF files
    if (
      file.type === "application/pdf" ||
      fileName.endsWith(".pdf")
    ) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit for PDFs
        return `PDF files must be smaller than 5MB for text extraction.`;
      }
      return null; // PDF is allowed
    }

    // Check for other allowed types
    if (
      !allowedTypes.includes(file.type) &&
      !fileName.endsWith(".txt") &&
      !fileName.endsWith(".csv")
    ) {
      return `Unsupported file type. Please use PDF (text-based), TXT, or CSV files.`;
    }

    return null;
  };

  const handleFileUpload = useCallback(
    (uploadedFiles: FileList) => {
      const fileArray = Array.from(uploadedFiles);
      const validFiles: File[] = [];
      const invalidFiles: string[] = [];

      // Validate each file
      fileArray.forEach((file) => {
        const error = validateFile(file);
        if (error) {
          invalidFiles.push(`${file.name}: ${error}`);
        } else {
          validFiles.push(file);
        }
      });

      // Show errors for invalid files
      if (invalidFiles.length > 0) {
        console.warn("Invalid files:", invalidFiles);
        invalidFiles.forEach((error) => {
          toast.error(`Upload failed: ${error}`);
        });
      }

      // Process valid files
      if (validFiles.length > 0) {
        const newFiles: UploadedFile[] = validFiles.map(
          (file) => ({
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: file.size,
            type: file.type,
            status: "uploading",
            progress: 0,
          }),
        );

        setFiles((prev) => [...prev, ...newFiles]);

        // Show success message
        const fileText =
          validFiles.length === 1 ? "file" : "files";
        toast.success(
          `${validFiles.length} ${fileText} added for analysis`,
        );

        // Process each valid file
        newFiles.forEach((fileData, index) => {
          processFile(fileData, validFiles[index]);
        });
      }
    },
    [openAIService],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    // Only set drag over to false if we're leaving the main container
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (
      x < rect.left ||
      x >= rect.right ||
      y < rect.top ||
      y >= rect.bottom
    ) {
      setIsDragOver(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      if (!apiKey) return;

      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles.length > 0) {
        handleFileUpload(droppedFiles);
      }
    },
    [handleFileUpload, apiKey],
  );

  const handleFileInput = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!apiKey) return;

    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files);
    }
  };

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleTextAnalysis = async () => {
    if (!textContent.trim() || !openAIService) return;

    const textFile: UploadedFile = {
      id: Math.random().toString(36).substr(2, 9),
      name: "Pasted Text",
      size: textContent.length,
      type: "text/plain",
      status: "uploading",
      progress: 0,
    };

    setFiles((prev) => [...prev, textFile]);

    try {
      // Create a virtual File object from the text
      const blob = new Blob([textContent], {
        type: "text/plain",
      });
      const virtualFile = new File([blob], "pasted-text.txt", {
        type: "text/plain",
      });

      await processFile(textFile, virtualFile);
      setTextContent("");
      setShowTextInput(false);
    } catch (error) {
      console.error("Text analysis error:", error);
    }
  };

  const retryFile = (fileId: string) => {
    const fileToRetry = files.find((f) => f.id === fileId);
    if (!fileToRetry) return;

    // Reset file status and retry processing
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId
          ? {
              ...f,
              status: "uploading",
              progress: 0,
              error: undefined,
            }
          : f,
      ),
    );

    // We need to store the original File object to retry
    // For now, we'll show an error asking the user to re-upload
    setTimeout(() => {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                status: "error",
                error:
                  "Please remove this file and upload it again to retry.",
              }
            : f,
        ),
      );
    }, 1000);
  };

  const searchRegulation = (regulation: string) => {
    if (onRegulationSearch) {
      onRegulationSearch(regulation);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.includes("pdf"))
      return <FileText className="w-5 h-5 text-red-500" />;
    if (type.includes("text"))
      return <FileText className="w-5 h-5 text-green-500" />;
    if (type.includes("csv"))
      return <FileText className="w-5 h-5 text-blue-500" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const getRiskLevelColor = (riskLevel?: string) => {
    switch (riskLevel) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "uploading":
      case "processing":
        return (
          <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
        );
      case "completed":
        return (
          <CheckCircle className="w-4 h-4 text-green-500" />
        );
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* API Key Configuration */}
      <APIKeyConfig
        onAPIKeySet={handleAPIKeySet}
        currentAPIKey={apiKey}
      />

      {/* File Upload Area */}
      <Card
        className={`border-2 border-dashed transition-all duration-200 ${
          !apiKey
            ? "border-gray-200 opacity-75"
            : isDragOver
              ? "border-nav-teal bg-nav-teal/5 scale-[1.01]"
              : "border-gray-300 hover:border-nav-teal hover:bg-gray-50/50"
        }`}
      >
        <CardContent
          className="p-8"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="text-center">
            <div
              className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
                isDragOver ? "bg-nav-teal/20" : "bg-gray-100"
              }`}
            >
              <Upload
                className={`w-8 h-8 transition-colors ${
                  isDragOver ? "text-nav-teal" : "text-gray-400"
                }`}
              />
            </div>

            <h3
              className={`text-lg font-medium mb-2 transition-colors ${
                isDragOver ? "text-nav-teal" : "text-gray-900"
              }`}
            >
              {isDragOver
                ? "Drop Files to Analyze"
                : "Upload Documents for AI Analysis"}
            </h3>
            <p
              className={`text-sm mb-4 transition-colors ${
                isDragOver
                  ? "text-nav-teal font-medium"
                  : "text-gray-600"
              }`}
            >
              {isDragOver
                ? "Drop your files here to analyze them!"
                : apiKey
                  ? "Drag and drop your PDF documents, contracts, or text files here"
                  : "Configure your OpenAI API key above to enable intelligent document analysis"}
            </p>

            <div className="space-y-2 mb-4">
              <p className="text-xs text-gray-500">
                Supported formats:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {Object.values(acceptedTypes).map((type) => (
                  <Badge
                    key={type}
                    variant="outline"
                    className="text-xs"
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    const fileInput = document.getElementById(
                      "file-upload",
                    ) as HTMLInputElement;
                    if (fileInput) fileInput.click();
                  }}
                  className="bg-nav-teal hover:bg-nav-teal/90"
                  disabled={!apiKey}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Files
                </Button>

                <Button
                  variant="outline"
                  onClick={() =>
                    setShowTextInput(!showTextInput)
                  }
                  disabled={!apiKey}
                  className="border-nav-teal text-nav-teal hover:bg-nav-teal hover:text-white"
                >
                  <Type className="w-4 h-4 mr-2" />
                  Paste Text
                </Button>
              </div>

              <input
                id="file-upload"
                type="file"
                multiple
                accept={Object.keys(acceptedTypes).join(",")}
                onChange={handleFileInput}
                className="hidden"
                disabled={!apiKey}
              />

              <div className="flex items-center space-x-2 text-xs text-gray-500">
                {apiKey ? (
                  <>
                    <Brain className="w-4 h-4 text-nav-teal" />
                    <span>
                      OpenAI will analyze and summarize your
                      documents
                    </span>
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4 text-gray-400" />
                    <span>
                      API key required for AI analysis
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Text Input Alternative */}
      {showTextInput && apiKey && (
        <Card className="border-nav-teal/30">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Type className="w-5 h-5 text-nav-teal" />
              <span>Paste Text for Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your document text here... (contracts, policies, regulations, etc.)"
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              className="min-h-32 resize-vertical"
              maxLength={10000}
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500">
                {textContent.length}/10,000 characters
              </p>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowTextInput(false)}
                  size="sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleTextAnalysis}
                  disabled={
                    !textContent.trim() ||
                    textContent.length < 50
                  }
                  className="bg-nav-teal hover:bg-nav-teal/90"
                  size="sm"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Analyze Text
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Uploaded Files */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-nav-teal" />
              <span>Document Analysis</span>
              <Badge className="bg-nav-teal/10 text-nav-teal">
                {files.length}{" "}
                {files.length === 1 ? "file" : "files"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-96">
              <div className="space-y-4">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    {/* File Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(file.type)}
                        <div>
                          <h4 className="font-medium text-gray-900 truncate">
                            {file.name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(file.status)}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {(file.status === "uploading" ||
                      file.status === "processing") && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">
                            {file.status === "uploading"
                              ? "Uploading..."
                              : file.type.includes("pdf") ||
                                  file.name
                                    .toLowerCase()
                                    .endsWith(".pdf")
                                ? "Extracting text from PDF..."
                                : "AI Processing..."}
                          </span>
                          <span className="text-gray-600">
                            {file.progress}%
                          </span>
                        </div>
                        <Progress
                          value={file.progress}
                          className="h-2"
                        />
                        {file.status === "processing" &&
                          (file.type.includes("pdf") ||
                            file.name
                              .toLowerCase()
                              .endsWith(".pdf")) && (
                            <p className="text-xs text-gray-500">
                              📄 Reading PDF content... This
                              works best with text-based PDFs
                            </p>
                          )}
                      </div>
                    )}

                    {/* AI Analysis Report */}
                    {file.status === "completed" &&
                      file.summary && (
                        <div className="bg-white border-2 border-nav-teal/20 rounded-xl p-6 shadow-lg">
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-nav-teal/10 rounded-lg">
                                <Brain className="w-5 h-5 text-nav-teal" />
                              </div>
                              <div>
                                <h5 className="font-semibold text-gray-900">
                                  {apiKey
                                    ? "AI-Powered Analysis Report"
                                    : "Basic Analysis Report"}
                                </h5>
                                <p className="text-xs text-gray-500">
                                  Professional document
                                  compliance review
                                </p>
                              </div>
                            </div>
                            <Badge className="bg-gradient-to-r from-nav-teal to-gov-navy text-white border-0 px-3 py-1">
                              📊 Professional Report
                            </Badge>
                          </div>

                          {/* Render the beautiful markdown analysis */}
                          <AnalysisRenderer file={file} />

                          {/* Interactive Legal Requirements Section */}
                          {file.keyRegulations &&
                            file.keyRegulations.length > 0 && (
                              <div className="pt-6 border-t border-gray-200 bg-gradient-to-r from-blue-50 to-nav-teal/5 -mx-6 px-6 pb-6 mt-6 rounded-b-xl">
                                <h6 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                  🔍 Search Related Requirements
                                  in Database
                                </h6>
                                <div className="flex flex-wrap gap-3">
                                  {file.keyRegulations.map(
                                    (regulation, index) => (
                                      <Button
                                        key={index}
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          searchRegulation(
                                            regulation,
                                          )
                                        }
                                        className="h-9 text-xs bg-white hover:bg-nav-teal hover:text-white hover:border-nav-teal transition-all duration-200 shadow-sm border-gray-300"
                                      >
                                        <span className="mr-2">
                                          🔎
                                        </span>
                                        {regulation.length > 30
                                          ? `${regulation.substring(0, 30)}...`
                                          : regulation}
                                      </Button>
                                    ),
                                  )}
                                </div>
                                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                  <p className="text-xs text-blue-800 flex items-center gap-2">
                                    <span>💡</span>
                                    <span>
                                      <strong>
                                        Quick Access:
                                      </strong>{" "}
                                      Click any requirement
                                      above to search the full
                                      government database and
                                      find complete regulations,
                                      forms, and compliance
                                      guides.
                                    </span>
                                  </p>
                                </div>
                              </div>
                            )}
                        </div>
                      )}

                    {/* Error State */}
                    {file.status === "error" && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-red-800">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              Processing Error
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => retryFile(file.id)}
                            className="h-6 text-xs border-red-300 text-red-600 hover:bg-red-50"
                          >
                            Retry
                          </Button>
                        </div>
                        <p className="text-sm text-red-600 mt-1">
                          {file.error ||
                            "Failed to process the document. Please try again."}
                        </p>
                        {(file.type === "application/pdf" ||
                          file.name
                            .toLowerCase()
                            .endsWith(".pdf")) && (
                          <div className="text-xs text-red-500 mt-2 space-y-1">
                            <p className="font-medium">
                              💡 PDF Processing Tips:
                            </p>
                            <ul className="list-disc list-inside space-y-0.5 text-red-400">
                              <li>
                                PDFs with scanned images cannot
                                be processed
                              </li>
                              <li>
                                Password-protected PDFs are not
                                supported
                              </li>
                              <li>
                                Try copying text from PDF and
                                pasting into a .txt file
                              </li>
                              <li>
                                Use online PDF-to-text
                                converters as an alternative
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Usage Tips */}
      <Card className="bg-gradient-to-r from-blue-50 to-nav-teal/5 border-nav-teal/20">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Brain className="w-6 h-6 text-nav-teal mt-1" />
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                How Document Analysis Works
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  • Configure your OpenAI API key for
                  intelligent analysis
                </li>
                <li>
                  • Upload PDF, text files, or CSV documents
                </li>
                <li>
                  • OpenAI analyzes content and identifies legal
                  requirements and compliance obligations
                </li>
                <li>
                  • Get detailed summaries, risk assessments,
                  and action items
                </li>
                <li>
                  • Click on suggested requirements to search
                  the database
                </li>
              </ul>
              {!apiKey && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-800">
                    💡 <strong>Tip:</strong> With your OpenAI
                    API key, you'll get comprehensive document
                    analysis including PDF text extraction, risk
                    assessment, specific requirement matching,
                    and actionable next steps.
                  </p>
                </div>
              )}
              {apiKey && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-xs text-blue-800 space-y-1">
                    <p>
                      <strong>📄 File Support:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-0.5 text-blue-700">
                      <li>
                        <strong>
                          Text files (.txt, .csv):
                        </strong>{" "}
                        Full support ✅
                      </li>
                      <li>
                        <strong>PDF files (.pdf):</strong>{" "}
                        Text-based PDFs only ⚠️
                      </li>
                    </ul>
                    <p className="text-blue-600 mt-2">
                      <strong>Note:</strong> PDFs with scanned
                      images or heavy formatting may not process
                      correctly. When in doubt, copy and paste
                      content into a text file for best results.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}