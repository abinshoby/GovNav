import React, { useState, useMemo } from 'react';
import { FileText, Copy, Download, Eye, Type } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface JSONSummaryFormatterProps {
  onFormatSuccess?: (formattedData: any) => void;
}

/** Utility: safe JSON parse for strings; returns null on failure */
function safeParse(input: unknown): any | null {
  if (typeof input === "string") {
    try {
      return JSON.parse(input);
    } catch {
      return null;
    }
  }
  return typeof input === "object" && input !== null ? input : null;
}

/**
 * Extract structured data from common OpenAI / tool response shapes.
 */
function extractStructuredData(anyInput: any): any | null {
  if (!anyInput) return null;

  // Direct object
  if (typeof anyInput === 'object' && anyInput !== null && !Array.isArray(anyInput)) {
    return anyInput;
  }

  // OpenAI chat content -> JSON string
  const content = anyInput?.choices?.[0]?.message?.content;
  if (typeof content === "string") {
    const inner = safeParse(content);
    if (inner) return inner;
  }

  // Tool/function arguments -> JSON string
  const toolArgs = anyInput?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
  if (typeof toolArgs === "string") {
    const argsObj = safeParse(toolArgs);
    if (argsObj) return argsObj;
  }

  return null;
}

/**
 * Convert JSON data to markdown format
 */
function convertToMarkdown(data: any): string {
  if (!data) return "No data available";

  let markdown = "";

  // Handle document analysis structure
  if (data.summary || data.keyRegulations || data.documentType || data.riskLevel || data.actionItems) {
    markdown += "# 📄 Document Analysis Report\n\n";

    if (data.summary) {
      markdown += "## 📋 Executive Summary\n\n";
      markdown += `${data.summary}\n\n`;
    }

    if (data.documentType) {
      markdown += "## 📑 Document Type\n\n";
      markdown += `**${data.documentType}**\n\n`;
    }

    if (data.riskLevel) {
      const riskEmoji = data.riskLevel === 'high' ? '🔴' : data.riskLevel === 'medium' ? '🟡' : '🟢';
      markdown += "## ⚠️ Risk Assessment\n\n";
      markdown += `${riskEmoji} **Risk Level:** ${data.riskLevel.toUpperCase()}\n\n`;
    }

    if (data.keyRegulations && Array.isArray(data.keyRegulations)) {
      markdown += "## 📜 Legal Requirements Found\n\n";
      data.keyRegulations.forEach((regulation: string, index: number) => {
        markdown += `### ${index + 1}. ${regulation}\n\n`;
        
        // Parse regulation details if they follow our structured format
        if (regulation.includes('(Jurisdiction:') && regulation.includes(')')) {
          const parts = regulation.split(' - ');
          const title = parts[0];
          const description = parts.slice(1).join(' - ');
          
          if (description) {
            markdown += `${description}\n\n`;
          }
        } else {
          markdown += `• ${regulation}\n\n`;
        }
      });
    }

    if (data.actionItems && Array.isArray(data.actionItems)) {
      markdown += "## ✅ Recommended Actions\n\n";
      data.actionItems.forEach((action: string, index: number) => {
        markdown += `${index + 1}. **${action}**\n\n`;
      });
    }
  } else {
    // Generic data structure
    markdown += "# 📊 Data Summary\n\n";
    markdown += convertObjectToMarkdown(data, 2);
  }

  return markdown;
}

/**
 * Convert a generic object to markdown format
 */
function convertObjectToMarkdown(obj: any, headingLevel: number = 2): string {
  let markdown = "";
  const headingPrefix = "#".repeat(headingLevel);

  for (const [key, value] of Object.entries(obj)) {
    const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    markdown += `${headingPrefix} ${formattedKey}\n\n`;

    if (typeof value === 'string') {
      markdown += `${value}\n\n`;
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      markdown += `**${value}**\n\n`;
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === 'string') {
          markdown += `${index + 1}. ${item}\n`;
        } else {
          markdown += `${index + 1}. ${JSON.stringify(item)}\n`;
        }
      });
      markdown += "\n";
    } else if (typeof value === 'object' && value !== null) {
      markdown += convertObjectToMarkdown(value, headingLevel + 1);
    } else {
      markdown += `${String(value)}\n\n`;
    }
  }

  return markdown;
}

/**
 * Render markdown content with proper styling
 */
function MarkdownRenderer({ content }: { content: string }) {
  // Parse the markdown content and render it as React elements
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentIndex = 0;

  while (currentIndex < lines.length) {
    const line = lines[currentIndex];

    if (line.startsWith('# ')) {
      // H1 heading
      elements.push(
        <h1 key={currentIndex} className="text-2xl font-bold text-gov-navy mb-4 flex items-center gap-2">
          {line.substring(2)}
        </h1>
      );
    } else if (line.startsWith('## ')) {
      // H2 heading
      elements.push(
        <h2 key={currentIndex} className="text-xl font-semibold text-nav-teal mb-3 mt-6 flex items-center gap-2">
          {line.substring(3)}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      // H3 heading
      elements.push(
        <h3 key={currentIndex} className="text-lg font-medium text-gray-800 mb-2 mt-4">
          {line.substring(4)}
        </h3>
      );
    } else if (line.startsWith('• ') || /^\d+\.\s/.test(line)) {
      // List item
      const isNumbered = /^\d+\.\s/.test(line);
      const text = isNumbered ? line.replace(/^\d+\.\s/, '') : line.substring(2);
      
      elements.push(
        <div key={currentIndex} className="flex items-start gap-2 mb-2">
          <span className="text-nav-teal font-medium mt-1">
            {isNumbered ? '→' : '•'}
          </span>
          <span className="text-gray-700 leading-relaxed">{text}</span>
        </div>
      );
    } else if (line.includes('**') && line.trim() !== '') {
      // Bold text
      const parts = line.split('**');
      elements.push(
        <p key={currentIndex} className="text-gray-700 leading-relaxed mb-3">
          {parts.map((part, index) => 
            index % 2 === 1 ? 
              <strong key={index} className="font-semibold text-gov-navy">{part}</strong> : 
              part
          )}
        </p>
      );
    } else if (line.trim() !== '') {
      // Regular paragraph
      elements.push(
        <p key={currentIndex} className="text-gray-700 leading-relaxed mb-3">
          {line}
        </p>
      );
    } else {
      // Empty line - add space
      elements.push(<div key={currentIndex} className="mb-2" />);
    }

    currentIndex++;
  }

  return <div className="space-y-1">{elements}</div>;
}

export default function JSONSummaryFormatter({ onFormatSuccess }: JSONSummaryFormatterProps) {
  const [jsonInput, setJsonInput] = useState("");
  const [formattedData, setFormattedData] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"markdown" | "json">("markdown");

  const markdownContent = useMemo(() => {
    if (!formattedData) return "";
    return convertToMarkdown(formattedData);
  }, [formattedData]);

  const handleFormatJSON = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const structuredData = extractStructuredData(parsed) || parsed;
      
      setFormattedData(structuredData);
      onFormatSuccess?.(structuredData);
      toast.success("JSON formatted successfully!");
    } catch (error) {
      toast.error("Invalid JSON format. Please check your input.");
    }
  };

  const handleCopyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (e) {
      toast.error("Copy failed. Check browser permissions / HTTPS.");
    }
  };

  const handleDownloadMarkdown = () => {
    if (!markdownContent) return;
    const blob = new Blob([markdownContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `govnav-summary-${new Date().toISOString().split("T")[0]}.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
    toast.success("Markdown file downloaded!");
  };

  const handleDownloadJSON = () => {
    if (!formattedData) return;
    const dataStr = JSON.stringify(formattedData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `govnav-summary-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
    toast.success("JSON file downloaded!");
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-gov-navy" />
            <span>JSON Summary Formatter</span>
          </CardTitle>
          <p className="text-gray-600">
            Paste your OpenAI API response JSON here to get a beautifully formatted, human-readable summary
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              JSON Input
            </label>
            <Textarea
              placeholder="Paste your OpenAI JSON response here..."
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="min-h-[150px] font-mono text-sm"
            />
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={handleFormatJSON}
              className="bg-gov-navy hover:bg-gov-navy/90"
              disabled={!jsonInput.trim()}
            >
              <Type className="w-4 h-4 mr-2" />
              Format as Markdown
            </Button>

            {jsonInput.trim() && (
              <Button
                variant="outline"
                onClick={() => handleCopyToClipboard(jsonInput)}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Input
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Output Section */}
      {formattedData && (
        <>
          {/* View Controls */}
          <div className="flex items-center justify-between">
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "markdown" | "json")}>
              <TabsList>
                <TabsTrigger value="markdown" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Formatted View
                </TabsTrigger>
                <TabsTrigger value="json" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Raw JSON
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex space-x-2">
              {viewMode === "markdown" && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyToClipboard(markdownContent)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Markdown
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadMarkdown}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download MD
                  </Button>
                </>
              )}
              {viewMode === "json" && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyToClipboard(JSON.stringify(formattedData, null, 2))}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy JSON
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadJSON}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download JSON
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Content Display */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  {viewMode === "markdown" ? "📖 Formatted Summary" : "🔧 Raw JSON Data"}
                </span>
                <Badge variant="outline">
                  {viewMode === "markdown" ? "Human Readable" : "Technical"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {viewMode === "markdown" ? (
                <div className="prose prose-sm max-w-none">
                  <MarkdownRenderer content={markdownContent} />
                </div>
              ) : (
                <pre className="bg-gray-50 rounded-lg p-4 overflow-x-auto text-sm font-mono whitespace-pre-wrap border">
                  {JSON.stringify(formattedData, null, 2)}
                </pre>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Usage Tips */}
      {!formattedData && (
        <Card className="bg-gradient-to-r from-blue-50 to-nav-teal/5 border-nav-teal/20">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <FileText className="w-6 h-6 text-nav-teal mt-1" />
              <div>
                <h4 className="font-medium text-gray-900 mb-2">How to Use the Formatter</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Copy the JSON response from your AI analysis</li>
                  <li>• Paste it into the input field above</li>
                  <li>• Click "Format as Markdown" to get a beautiful, readable summary</li>
                  <li>• Use the tabs to switch between formatted and raw views</li>
                  <li>• Download or copy the results for your reports</li>
                </ul>
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-800">
                    💡 <strong>Tip:</strong> This formatter works especially well with OpenAI document analysis responses,
                    converting complex JSON data into professional, citizen-friendly reports with proper formatting,
                    headings, and bullet points.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}