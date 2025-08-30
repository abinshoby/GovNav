import React, { useState } from 'react';
import { Key, Eye, EyeOff, CheckCircle, XCircle, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import OpenAIService from './OpenAIService';

interface APIKeyConfigProps {
  onAPIKeySet: (apiKey: string) => void;
  currentAPIKey?: string;
}

export default function APIKeyConfig({ onAPIKeySet, currentAPIKey }: APIKeyConfigProps) {
  const [apiKey, setApiKey] = useState(currentAPIKey || '');
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateAPIKey = async (key: string) => {
    if (!key.trim()) {
      setValidationStatus('idle');
      return;
    }

    setIsValidating(true);
    setErrorMessage('');

    try {
      const openAIService = new OpenAIService({ apiKey: key });
      const isValid = await openAIService.testConnection();
      
      if (isValid) {
        setValidationStatus('valid');
        onAPIKeySet(key);
      } else {
        setValidationStatus('invalid');
        setErrorMessage('Invalid API key or connection failed');
      }
    } catch (error) {
      setValidationStatus('invalid');
      setErrorMessage('Failed to validate API key');
    } finally {
      setIsValidating(false);
    }
  };

  const handleKeyChange = (value: string) => {
    setApiKey(value);
    setValidationStatus('idle');
    setErrorMessage('');
  };

  const handleValidate = () => {
    validateAPIKey(apiKey);
  };

  const getStatusIcon = () => {
    if (isValidating) {
      return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
    }
    
    switch (validationStatus) {
      case 'valid':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'invalid':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Key className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (validationStatus) {
      case 'valid':
        return 'border-green-300 bg-green-50';
      case 'invalid':
        return 'border-red-300 bg-red-50';
      default:
        return 'border-gray-300';
    }
  };

  return (
    <Card className={`border-2 ${getStatusColor()} transition-colors`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Key className="w-5 h-5 text-nav-teal" />
          <span>OpenAI API Configuration</span>
          {validationStatus === 'valid' && (
            <Badge className="bg-green-100 text-green-800">
              Connected
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="api-key" className="text-sm font-medium text-gray-700">
            OpenAI API Key
          </label>
          <div className="relative">
            <Input
              id="api-key"
              type={showKey ? 'text' : 'password'}
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => handleKeyChange(e.target.value)}
              className="pr-20"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              {getStatusIcon()}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowKey(!showKey)}
                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          
          {errorMessage && (
            <div className="flex items-center space-x-2 text-sm text-red-600">
              <AlertTriangle className="w-4 h-4" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        <div className="flex space-x-3">
          <Button
            onClick={handleValidate}
            disabled={!apiKey.trim() || isValidating}
            className="bg-nav-teal hover:bg-nav-teal/90"
          >
            {isValidating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Validating...
              </>
            ) : (
              'Validate & Connect'
            )}
          </Button>
          
          {validationStatus === 'valid' && (
            <Button
              variant="outline"
              onClick={() => {
                setApiKey('');
                setValidationStatus('idle');
                onAPIKeySet('');
              }}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              Disconnect
            </Button>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">How to get your OpenAI API Key:</span>
          </div>
          <ol className="text-sm text-blue-700 space-y-1 ml-6 list-decimal">
            <li>Visit <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-800">platform.openai.com/api-keys</a></li>
            <li>Sign in to your OpenAI account</li>
            <li>Click "Create new secret key"</li>
            <li>Copy and paste the key above</li>
          </ol>
          <p className="text-xs text-blue-600 mt-2">
            💡 Your API key is stored locally and never sent to our servers. Only OpenAI will receive it for document analysis.
          </p>
        </div>

        {validationStatus === 'valid' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                API key validated successfully! You can now upload documents for AI analysis.
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}