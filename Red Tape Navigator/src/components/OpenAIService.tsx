interface OpenAIConfig {
  apiKey: string;
  model?: string;
}

interface DocumentAnalysis {
  summary: string;
  keyRegulations: string[];
  documentType: string;
  riskLevel: 'low' | 'medium' | 'high';
  actionItems: string[];
}

export class OpenAIService {
  private apiKey: string;
  private model: string;
  private baseUrl: string = 'https://api.openai.com/v1';

  constructor(config: OpenAIConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || 'gpt-4o-mini';
  }

  // Extract text content from different file types
  private async extractTextFromFile(file: File): Promise<string> {
    const fileType = file.type;
    const fileName = file.name.toLowerCase();
    
    if (fileType === 'text/plain' || fileType === 'text/csv' || fileName.endsWith('.txt') || fileName.endsWith('.csv')) {
      return await file.text();
    } 
    else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      // Try PDF extraction with comprehensive fallback
      return await this.handlePDFExtraction(file);
    }
    else if (fileType.includes('word') || fileType.includes('document') || fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
      throw new Error(
        'Word documents require conversion to text format. ' +
        'Please open your document and save it as a .txt file, or copy and paste the content into a text file.'
      );
    }
    else {
      // Try to read as text for unknown types
      try {
        const text = await file.text();
        if (text.trim().length > 0) {
          return text;
        }
        throw new Error('File appears to be empty');
      } catch (error) {
        throw new Error(
          'Unsupported file format. Please use one of these formats:\n' +
          '• Plain text files (.txt)\n' +
          '• CSV files (.csv)\n' +
          '• PDF files (.pdf) - text-based only\n\n' +
          'For other formats, please convert to plain text first.'
        );
      }
    }
  }

  // Comprehensive PDF handling with multiple fallback strategies
  private async handlePDFExtraction(file: File): Promise<string> {
    const maxFileSize = 5 * 1024 * 1024; // 5MB limit for PDF processing
    
    if (file.size > maxFileSize) {
      throw new Error(
        'PDF file is too large (>5MB) for processing. ' +
        'Please try a smaller file or convert to text format.'
      );
    }

    try {
      // First attempt: Try with PDF.js
      return await this.extractTextWithPDFJS(file);
    } catch (pdfError) {
      console.warn('PDF.js failed:', pdfError);
      
      // Second attempt: Try simple binary analysis (very limited)
      try {
        return await this.extractTextFromPDFSimple(file);
      } catch (simpleError) {
        console.warn('Simple PDF extraction failed:', simpleError);
        
        // Final fallback: Provide helpful error message
        throw new Error(
          'Unable to extract text from this PDF file. This could be because:\n\n' +
          '• The PDF contains scanned images instead of text\n' +
          '• The PDF is password-protected or encrypted\n' +
          '• The PDF uses unsupported formatting\n\n' +
          'Please try one of these alternatives:\n' +
          '• Open the PDF and copy/paste the text into a .txt file\n' +
          '• Use an online PDF-to-text converter\n' +
          '• Save the PDF as plain text from your PDF viewer'
        );
      }
    }
  }

  // Simple PDF text extraction (very basic, for fallback only)
  private async extractTextFromPDFSimple(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Try multiple text decodings
    let rawText = '';
    try {
      const decoder = new TextDecoder('utf-8', { fatal: false });
      rawText = decoder.decode(uint8Array);
    } catch {
      try {
        const decoder = new TextDecoder('latin1', { fatal: false });
        rawText = decoder.decode(uint8Array);
      } catch {
        throw new Error('Unable to decode PDF content');
      }
    }
    
    // Enhanced text pattern matching for PDFs
    const textPatterns = [
      // Look for text between parentheses (common in PDF encoding)
      /\([^)]+\)/g,
      // Look for text after 'Tj' operators (PDF text showing operators)
      /\([^)]*\)\s*Tj/g,
      // Look for general readable text patterns
      /[A-Za-z]{3,}(?:\s+[A-Za-z]{2,})*/g,
      // Look for words with numbers (like dates, regulations)
      /[A-Za-z]+\s*\d+|[A-Za-z]{2,}/g
    ];
    
    let extractedText = '';
    
    for (const pattern of textPatterns) {
      const matches = rawText.match(pattern);
      if (matches && matches.length > 0) {
        const text = matches
          .map(match => match.replace(/[()]/g, '').trim())
          .filter(match => match.length > 2 && !/^[\x00-\x1F\x7F-\x9F]+$/.test(match))
          .join(' ');
        
        if (text.length > extractedText.length) {
          extractedText = text;
        }
      }
    }
    
    // Clean up the extracted text
    extractedText = extractedText
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s.,;:!?-]/g, '')
      .trim();
    
    if (extractedText.length < 50) {
      throw new Error('Insufficient readable text found in PDF. This PDF may contain mostly images or use complex formatting that requires specialized tools.');
    }
    
    return extractedText;
  }

  // Extract text from PDF using PDF.js with fallback handling
  private async extractTextFromPDF(file: File): Promise<string> {
    try {
      // Try PDF.js approach first
      return await this.extractTextWithPDFJS(file);
    } catch (pdfJsError) {
      console.warn('PDF.js extraction failed, trying fallback approach:', pdfJsError);
      
      // Fallback: Try to use a simpler approach or provide helpful error
      throw new Error(
        'PDF text extraction is not available in this environment. ' +
        'Please convert your PDF to a text file (.txt) or copy and paste the content. ' +
        'You can use online PDF-to-text converters or save the PDF as plain text from your PDF viewer.'
      );
    }
  }

  // Main PDF.js extraction method
  private async extractTextWithPDFJS(file: File): Promise<string> {
    try {
      // Dynamically import PDF.js
      const pdfjsLib = await import('pdfjs-dist');
      
      // Try multiple worker configuration strategies
      const workerUrls = [
        `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`,
        `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`,
        'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js',
        'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js'
      ];
      
      // Try to configure worker with fallbacks
      let workerConfigured = false;
      for (const workerUrl of workerUrls) {
        try {
          pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
          workerConfigured = true;
          break;
        } catch (e) {
          console.warn(`Failed to set worker URL: ${workerUrl}`, e);
        }
      }
      
      if (!workerConfigured) {
        // Last resort: try without explicit worker configuration
        delete (pdfjsLib.GlobalWorkerOptions as any).workerSrc;
      }
      
      const arrayBuffer = await file.arrayBuffer();
      
      // Configure PDF loading with error handling
      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        useWorkerFetch: false,
        isEvalSupported: false,
        useSystemFonts: true,
        disableWorker: false, // Allow worker but with fallback
        verbosity: 0 // Reduce console noise
      });
      
      const pdf = await loadingTask.promise;
      let fullText = '';
      
      // Extract text from each page (limit to first 10 pages for performance)
      const maxPages = Math.min(pdf.numPages, 10);
      
      for (let i = 1; i <= maxPages; i++) {
        try {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => {
              // Handle different text item types
              if (typeof item === 'object' && item.str) {
                return item.str;
              }
              return '';
            })
            .filter(str => str.trim().length > 0)
            .join(' ');
          
          if (pageText.trim()) {
            fullText += pageText + '\n\n';
          }
        } catch (pageError) {
          console.warn(`Failed to extract text from page ${i}:`, pageError);
          // Continue with other pages
        }
      }
      
      // Clean up the extracted text
      fullText = fullText
        .replace(/\s+/g, ' ')
        .replace(/\n\s*\n/g, '\n')
        .trim();
      
      if (fullText.length === 0) {
        throw new Error('No readable text found in PDF. The PDF may contain only images or be encrypted.');
      }
      
      if (fullText.length < 10) {
        throw new Error('Very little text extracted from PDF. The document may be image-based.');
      }
      
      return fullText;
      
    } catch (error) {
      console.error('PDF.js extraction error:', error);
      
      // Provide specific error messages
      if (error instanceof Error) {
        if (error.message.includes('worker') || error.message.includes('Worker') || error.message.includes('module specifier') || error.message.includes('fetch')) {
          // Try one more time with worker disabled
          try {
            return await this.extractTextWithPDFJSNoWorker(file);
          } catch (workerlessError) {
            console.error('PDF.js without worker also failed:', workerlessError);
            throw new Error('PDF processing service is unavailable. Please convert your PDF to text format or copy/paste the content.');
          }
        }
        if (error.message.includes('Invalid PDF')) {
          throw new Error('Invalid or corrupted PDF file. Please try a different file.');
        }
        if (error.message.includes('encrypted')) {
          throw new Error('Password-protected PDFs are not supported. Please use an unprotected PDF.');
        }
        throw error;
      }
      
      throw new Error('Failed to process PDF file. Please convert to text format.');
    }
  }

  // PDF.js extraction without worker (fallback method)
  private async extractTextWithPDFJSNoWorker(file: File): Promise<string> {
    try {
      // Dynamically import PDF.js
      const pdfjsLib = await import('pdfjs-dist');
      
      // Disable worker entirely
      pdfjsLib.GlobalWorkerOptions.workerSrc = '';
      
      const arrayBuffer = await file.arrayBuffer();
      
      // Configure PDF loading without worker
      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        useWorkerFetch: false,
        isEvalSupported: false,
        useSystemFonts: true,
        disableWorker: true, // Force disable worker
        verbosity: 0
      });
      
      const pdf = await loadingTask.promise;
      let fullText = '';
      
      // Extract text from each page (limit to first 5 pages for performance without worker)
      const maxPages = Math.min(pdf.numPages, 5);
      
      for (let i = 1; i <= maxPages; i++) {
        try {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => {
              if (typeof item === 'object' && item.str) {
                return item.str;
              }
              return '';
            })
            .filter(str => str.trim().length > 0)
            .join(' ');
          
          if (pageText.trim()) {
            fullText += pageText + '\n\n';
          }
        } catch (pageError) {
          console.warn(`Failed to extract text from page ${i}:`, pageError);
        }
      }
      
      // Clean up the extracted text
      fullText = fullText
        .replace(/\s+/g, ' ')
        .replace(/\n\s*\n/g, '\n')
        .trim();
      
      if (fullText.length === 0) {
        throw new Error('No readable text found in PDF. The PDF may contain only images or be encrypted.');
      }
      
      if (fullText.length < 10) {
        throw new Error('Very little text extracted from PDF. The document may be image-based.');
      }
      
      return fullText;
      
    } catch (error) {
      console.error('PDF.js no-worker extraction error:', error);
      throw new Error('PDF text extraction failed even without worker. Please convert to text format.');
    }
  }

  // Analyze text content directly with OpenAI
  async analyzeText(textContent: string): Promise<string> {
    try {
      if (textContent.trim().length === 0) {
        throw new Error('Text content appears to be empty.');
      }

      // Prepare the prompt for OpenAI
      const systemPrompt = `You are an expert compliance advisor helping citizens understand legal requirements. Analyze the provided text and identify relevant laws, compliance requirements, and regulatory obligations that affect ordinary people and businesses.

Focus on these areas:
- Business licensing and permits
- Employment and labor requirements
- Health and safety standards
- Environmental compliance obligations
- Zoning and building requirements
- Tax and financial obligations
- Industry-specific requirements

For each requirement identified, present information in simple, accessible language that ordinary citizens can understand. Include specific dates, jurisdiction bodies, and essential details.

Present your analysis in a clear, human-readable format using markdown where appropriate. Use bulleted lists, headers, and clear sections. Do not use the term "government regulation" - instead use terms like "legal requirement", "compliance obligation", "statutory requirement", or "mandatory standard".`;

      const userPrompt = `Please analyze this text and identify all legal requirements, compliance obligations, and statutory standards that apply to citizens and businesses. Present each requirement in simple terms with relevant dates, jurisdiction bodies, and practical guidance:\n\n${textContent}`;

      // Make API call to OpenAI
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.3,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No response received from OpenAI');
      }

      return content;
    } catch (error) {
      console.error('Text analysis error:', error);
      throw error;
    }
  }

  // Analyze document content with OpenAI
  async analyzeDocument(file: File): Promise<DocumentAnalysis> {
    try {
      // Extract text content
      const textContent = await this.extractTextFromFile(file);
      
      if (textContent.trim().length === 0) {
        throw new Error('Document appears to be empty or could not be read.');
      }

      // Prepare the prompt for OpenAI
      const systemPrompt = `You are an expert compliance advisor helping citizens understand legal requirements. Analyze the provided document and identify relevant laws, compliance requirements, and regulatory obligations that affect ordinary people and businesses.

Focus on these areas:
- Business licensing and permits
- Employment and labor requirements
- Health and safety standards
- Environmental compliance obligations
- Zoning and building requirements
- Tax and financial obligations
- Industry-specific requirements

For each requirement identified, present information in simple, accessible language that ordinary citizens can understand. Include specific dates, jurisdiction bodies, and essential details.

Provide your analysis in the following JSON format:
{
  "summary": "A clear, practical explanation of what this document means for compliance (2-3 paragraphs in simple terms). Don't give me json here. It should be markdown renderable.",
  "keyRegulations": ["List of specific requirements that apply - each should include: requirement name, jurisdiction body, key dates if applicable, and essential details for citizens (5-8 items max)"],
  "documentType": "Brief description of what type of document this is",
  "riskLevel": "low|medium|high - based on compliance complexity",
  "actionItems": ["Specific, actionable next steps with dates and responsible authorities where applicable (3-5 items max)"]
}

Format each keyRegulation entry as: "Requirement Name (Jurisdiction: Authority Name, Effective: Date if applicable) - Brief practical explanation of what citizens must do"

Use formal but accessible language. Present all information as bulleted lists where appropriate. Do not use the term "government regulation" - instead use terms like "legal requirement", "compliance obligation", "statutory requirement", or "mandatory standard".`;

      const userPrompt = `Please analyze this document and identify all legal requirements, compliance obligations, and statutory standards that apply to citizens and businesses. Present each requirement in simple terms with relevant dates, jurisdiction bodies, and practical guidance:\n\n${textContent}`;

      // Make API call to OpenAI
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.3,
          max_tokens: 1500,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No response received from OpenAI');
      }

      // Parse the JSON response
      try {
        const analysis = JSON.parse(content);
        
        // Validate the response structure
        if (!analysis.summary || !Array.isArray(analysis.keyRegulations)) {
          throw new Error('Invalid response format from AI');
        }

        return {
          summary: analysis.summary,
          keyRegulations: analysis.keyRegulations || [],
          documentType: analysis.documentType || 'Unknown document type',
          riskLevel: analysis.riskLevel || 'medium',
          actionItems: analysis.actionItems || []
        };
      } catch (parseError) {
        // If JSON parsing fails, extract information manually
        return {
          summary: content.substring(0, 300) + '...',
          keyRegulations: this.extractRegulationsFromText(content),
          documentType: 'Document analysis',
          riskLevel: 'medium',
          actionItems: ['Review full analysis', 'Consult with regulatory expert']
        };
      }
    } catch (error) {
      console.error('Document analysis error:', error);
      throw error;
    }
  }

  // Fallback method to extract requirements from unstructured text
  private extractRegulationsFromText(text: string): string[] {
    const commonRequirements = [
      'Business License', 'Food Service Permit', 'Building Permit', 
      'Employment Standards', 'Health Department Approval', 'Fire Safety Clearance',
      'Zoning Compliance', 'Environmental Assessment', 'Tax Registration'
    ];
    
    const foundRequirements: string[] = [];
    const lowerText = text.toLowerCase();
    
    commonRequirements.forEach(requirement => {
      if (lowerText.includes(requirement.toLowerCase()) || 
          lowerText.includes(requirement.split(' ')[0].toLowerCase())) {
        foundRequirements.push(requirement);
      }
    });
    
    return foundRequirements.slice(0, 6); // Limit to 6 items
  }

  // Test API key validity
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Create a default instance to be used throughout the app
let defaultInstance: OpenAIService | null = null;

// Get the default instance (will be initialized with API key when available)
export const getOpenAIService = (): OpenAIService => {
  if (!defaultInstance) {
    // Try to get API key from localStorage
    const storedApiKey = typeof window !== 'undefined' ? localStorage.getItem('openai-api-key') : '';
    if (storedApiKey) {
      defaultInstance = new OpenAIService({ apiKey: storedApiKey });
    } else {
      throw new Error('OpenAI API key not configured. Please set your API key in the AI Agent settings.');
    }
  }
  return defaultInstance;
};

// Allow updating the API key
export const updateOpenAIService = (apiKey: string) => {
  defaultInstance = new OpenAIService({ apiKey });
};

// For convenience, export a service instance
export const openAIService = {
  analyzeText: (text: string) => getOpenAIService().analyzeText(text),
  analyzeDocument: (file: File) => getOpenAIService().analyzeDocument(file),
  testConnection: () => getOpenAIService().testConnection(),
};

export default OpenAIService;