
import React, { useState } from 'react';
import { Moon, Sun, Copy, Download, TreePine, Table, Code } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import JsonTree from "@/components/JsonTree";
import JsonTable from "@/components/JsonTable";

const Index = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [parsedJson, setParsedJson] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [darkMode, setDarkMode] = useState(false);
  const [activeView, setActiveView] = useState('tree');
  const { toast } = useToast();

  const handleJsonChange = (value: string) => {
    setJsonInput(value);
    if (value.trim()) {
      try {
        const parsed = JSON.parse(value);
        setParsedJson(parsed);
        setError('');
      } catch (err) {
        setError('Invalid JSON format');
        setParsedJson(null);
      }
    } else {
      setParsedJson(null);
      setError('');
    }
  };

  const copyToClipboard = (data: string) => {
    navigator.clipboard.writeText(data);
    toast({
      title: "Copied to clipboard",
      description: "JSON data has been copied to your clipboard",
    });
  };

  const downloadJson = () => {
    if (!parsedJson) return;
    
    const blob = new Blob([JSON.stringify(parsedJson, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'schema.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "JSON file has been downloaded",
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const sampleJson = `{
  "name": "John Doe",
  "age": 30,
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "country": "USA"
  },
  "hobbies": ["reading", "coding", "traveling"],
  "isActive": true,
  "metadata": {
    "createdAt": "2024-01-01",
    "tags": ["user", "premium"]
  }
}`;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Code className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">SchemaScope</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleDarkMode}
              className="flex items-center space-x-2"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span>{darkMode ? 'Light' : 'Dark'}</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code className="h-5 w-5" />
                <span>JSON Input</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste your JSON here..."
                value={jsonInput}
                onChange={(e) => handleJsonChange(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
              />
              {error && (
                <div className="text-red-500 text-sm font-medium">{error}</div>
              )}
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleJsonChange(sampleJson)}
                >
                  Load Sample
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleJsonChange('')}
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Visualization Section */}
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <TreePine className="h-5 w-5" />
                  <span>Schema Visualization</span>
                </CardTitle>
                {parsedJson && (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(JSON.stringify(parsedJson, null, 2))}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadJson}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {parsedJson ? (
                <Tabs value={activeView} onValueChange={setActiveView}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="tree" className="flex items-center space-x-2">
                      <TreePine className="h-4 w-4" />
                      <span>Tree View</span>
                    </TabsTrigger>
                    <TabsTrigger value="table" className="flex items-center space-x-2">
                      <Table className="h-4 w-4" />
                      <span>Table View</span>
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="tree" className="mt-4">
                    <JsonTree data={parsedJson} />
                  </TabsContent>
                  <TabsContent value="table" className="mt-4">
                    <JsonTable data={parsedJson} />
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Paste JSON data to visualize its structure</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
