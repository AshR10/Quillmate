import { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Lightbulb, 
  Blocks, 
  TheaterIcon, 
  BookOpen, 
  Sparkles,
  Download,
  Feather 
} from "lucide-react";

const modes = ["Story", "Poem", "Microfiction", "Dialogue"];

export function QuillMate() {
  const [activeTab, setActiveTab] = useState("generate");
  const { toast } = useToast();

  // API functions (mock for now - replace with actual API calls)
  const generate = async (mode: string, genre: string, tone: string, inputText: string) => {
    try {
      const data = { mode, input_text: inputText, genre, tone };
      const response = await fetch("https://quillmate-back.onrender.com/generate/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      return result.output;
    } catch (error) {
      return `Error: ${error}`;
    }
  };

  const expand = async (inputText: string, mode: string) => {
    try {
      const data = { mode, input_text: inputText };
      const response = await fetch("https://quillmate-back.onrender.com/expand/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      return result.output;
    } catch (error) {
      return `Error: ${error}`;
    }
  };

  const analyze = async (inputText: string) => {
    try {
      const data = { input_text: inputText, mode: "", genre: "", tone: "" };
      const response = await fetch("https://quillmate-back.onrender.com/analyze/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      return result.output;
    } catch (error) {
      return `Error: ${error}`;
    }
  };

  const enhance = async (inputText: string) => {
    try {
      const data = { input_text: inputText, mode: "", genre: "", tone: "", style: "" };
      const response = await fetch("https://quillmate-back.onrender.com/enhance/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      return result.output;
    } catch (error) {
      return `Error: ${error}`;
    }
  };

  const exportToPDF = async (text: string) => {
  try {
    const response = await fetch("https://quillmate-back.onrender.com/export-pdf/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      throw new Error("Failed to export PDF");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "quillmate_output.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();

    toast({
      title: "Export Successful",
      description: "Your PDF has been downloaded.",
    });

  } catch (error) {
    toast({
      title: "Export Failed",
      description: "There was a problem exporting the PDF.",
      variant: "destructive"
    });
  }
};


  return (
    <div className="min-h-screen bg-gradient-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Feather className="w-12 h-12 text-primary animate-float" />
            <h1 className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              QuillMate
            </h1>
          </div>
          <p className="text-2xl text-muted-foreground font-light">
            AI-Powered Creative Writing Assistant
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 bg-card/50 backdrop-blur-sm p-2 rounded-2xl shadow-card">
            <TabsTrigger 
              value="generate" 
              className="flex items-center gap-2 rounded-xl transition-all duration-300 hover:shadow-soft"
            >
              <Lightbulb className="w-4 h-4" />
              Idea Generator
            </TabsTrigger>
            <TabsTrigger 
              value="expand"
              className="flex items-center gap-2 rounded-xl transition-all duration-300 hover:shadow-soft"
            >
              <Blocks className="w-4 h-4" />
              Text Expansion
            </TabsTrigger>
            <TabsTrigger 
              value="analyze"
              className="flex items-center gap-2 rounded-xl transition-all duration-300 hover:shadow-soft"
            >
              <TheaterIcon className="w-4 h-4" />
              Tone Analyzer
            </TabsTrigger>
            <TabsTrigger 
              value="mimic"
              className="flex items-center gap-2 rounded-xl transition-all duration-300 hover:shadow-soft"
            >
              <BookOpen className="w-4 h-4" />
              Style Mimicry
            </TabsTrigger>
            <TabsTrigger 
              value="enhance"
              className="flex items-center gap-2 rounded-xl transition-all duration-300 hover:shadow-soft"
            >
              <Sparkles className="w-4 h-4" />
              Style Enhancer
            </TabsTrigger>
          </TabsList>

          {/* Idea Generator Tab */}
          <TabsContent value="generate" className="animate-slide-in">
            <IdeaGenerator onGenerate={generate} onExport={exportToPDF} />
          </TabsContent>

          {/* Text Expansion Tab */}
          <TabsContent value="expand" className="animate-slide-in">
            <TextExpansion onExpand={expand} onExport={exportToPDF} />
          </TabsContent>

          {/* Tone Analyzer Tab */}
          <TabsContent value="analyze" className="animate-slide-in">
            <ToneAnalyzer onAnalyze={analyze} onExport={exportToPDF} />
          </TabsContent>

          {/* Style Mimicry Tab */}
          <TabsContent value="mimic" className="animate-slide-in">
            <StyleMimicry onExport={exportToPDF} />
          </TabsContent>

          {/* Style Enhancer Tab */}
          <TabsContent value="enhance" className="animate-slide-in">
            <StyleEnhancer onEnhance={enhance} onExport={exportToPDF} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Individual Tab Components
function IdeaGenerator({ onGenerate, onExport }: { 
  onGenerate: (mode: string, genre: string, tone: string, inputText: string) => Promise<string>;
  onExport: (text: string) => void;
}) {
  const [genre, setGenre] = useState("");
  const [tone, setTone] = useState("");
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("Story");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    const result = await onGenerate(mode, genre, tone, prompt);
    setOutput(result);
    setIsLoading(false);
  };

  return (
    <Card className="bg-gradient-card shadow-card border-0 rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-glow">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Lightbulb className="w-6 h-6 text-primary" />
          Idea Generator
        </CardTitle>
        <CardDescription>
          Generate creative writing ideas based on your preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="genre">Genre</Label>
            <Input
              id="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="e.g., Mystery, Romance, Sci-fi"
              className="rounded-xl border-0 bg-muted/50 focus:bg-background transition-all duration-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Input
              id="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              placeholder="e.g., Dark, Humorous, Serious"
              className="rounded-xl border-0 bg-muted/50 focus:bg-background transition-all duration-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mode">Mode</Label>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger className="rounded-xl border-0 bg-muted/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {modes.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="prompt">Start with...</Label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your writing prompt or initial idea..."
            className="min-h-32 rounded-xl border-0 bg-muted/50 focus:bg-background transition-all duration-300 resize-none"
          />
        </div>

        <Button 
          onClick={handleGenerate}
          disabled={isLoading}
          variant="gradient"
          className="w-full rounded-xl h-12 text-lg font-medium"
        >
          {isLoading ? "Generating..." : "Generate Ideas"}
        </Button>

        {output && (
          <div className="space-y-4 animate-fade-in">
            <Label>Generated Text</Label>
            <Textarea
              value={output}
              readOnly
              className="min-h-48 rounded-xl border-0 bg-muted/30 resize-none"
            />
            <Button 
              onClick={() => onExport(output)}
              variant="outline"
              className="rounded-xl border-primary/20 hover:bg-primary/10 transition-all duration-300"
            >
              <Download className="w-4 h-4 mr-2" />
              Export as PDF
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TextExpansion({ onExpand, onExport }: {
  onExpand: (inputText: string, mode: string) => Promise<string>;
  onExport: (text: string) => void;
}) {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("Story");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleExpand = async () => {
    setIsLoading(true);
    const result = await onExpand(input, mode);
    setOutput(result);
    setIsLoading(false);
  };

  return (
    <Card className="bg-gradient-card shadow-card border-0 rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-glow">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Blocks className="w-6 h-6 text-primary" />
          Text Expansion
        </CardTitle>
        <CardDescription>
          Expand and develop your existing text
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="expansion-input">Your Text</Label>
          <Textarea
            id="expansion-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter the text you'd like to expand..."
            className="min-h-32 rounded-xl border-0 bg-muted/50 focus:bg-background transition-all duration-300 resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expansion-mode">Mode</Label>
          <Select value={mode} onValueChange={setMode}>
            <SelectTrigger className="rounded-xl border-0 bg-muted/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {modes.map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleExpand}
          disabled={isLoading || !input.trim()}
          variant="gradient"
          className="w-full rounded-xl h-12 text-lg font-medium"
        >
          {isLoading ? "Expanding..." : "Expand Text"}
        </Button>

        {output && (
          <div className="space-y-4 animate-fade-in">
            <Label>Expanded Text</Label>
            <Textarea
              value={output}
              readOnly
              className="min-h-48 rounded-xl border-0 bg-muted/30 resize-none"
            />
            <Button 
              onClick={() => onExport(output)}
              variant="outline"
              className="rounded-xl border-primary/20 hover:bg-primary/10 transition-all duration-300"
            >
              <Download className="w-4 h-4 mr-2" />
              Export as PDF
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ToneAnalyzer({ onAnalyze, onExport }: {
  onAnalyze: (inputText: string) => Promise<string>;
  onExport: (text: string) => void;
}) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    setIsLoading(true);
    const result = await onAnalyze(input);
    setOutput(result);
    setIsLoading(false);
  };

  return (
    <Card className="bg-gradient-card shadow-card border-0 rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-glow">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <TheaterIcon className="w-6 h-6 text-primary" />
          Tone & Style Analyzer
        </CardTitle>
        <CardDescription>
          Analyze the tone and style of your writing
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="analyzer-input">Text to Analyze</Label>
          <Textarea
            id="analyzer-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your text here for tone and style analysis..."
            className="min-h-32 rounded-xl border-0 bg-muted/50 focus:bg-background transition-all duration-300 resize-none"
          />
        </div>

        <Button 
          onClick={handleAnalyze}
          disabled={isLoading || !input.trim()}
          variant="gradient"
          className="w-full rounded-xl h-12 text-lg font-medium"
        >
          {isLoading ? "Analyzing..." : "Analyze Tone & Style"}
        </Button>

        {output && (
          <div className="space-y-4 animate-fade-in">
            <Label>Analysis</Label>
            <Textarea
              value={output}
              readOnly
              className="min-h-32 rounded-xl border-0 bg-muted/30 resize-none"
            />
            <Button 
              onClick={() => onExport(output)}
              variant="outline"
              className="rounded-xl border-primary/20 hover:bg-primary/10 transition-all duration-300"
            >
              <Download className="w-4 h-4 mr-2" />
              Export as PDF
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StyleMimicry({ onExport }: {
  onExport: (text: string) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [samplePreview, setSamplePreview] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [sampleUploaded, setSampleUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mimic = async (inputText: string) => {
    try {
      const data = { input_text: inputText, mode: "", genre: "", tone: "", style: "" };
      const response = await fetch("https://quillmate-back.onrender.com/mimic/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      return result.output;
    } catch (error) {
      return `Error: ${error}`;
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    const result = await mimic(prompt);
    setOutput(result);
    setIsLoading(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedTypes = ["text/plain", "application/pdf"];
    const allowedExtensions = [".txt", ".pdf"];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      setUploadStatus("Invalid file type. Only .txt and .pdf are allowed.");
      setSamplePreview(null);
      setSampleUploaded(false);
      return;
    }
    setUploadStatus("Uploading and parsing...");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("https://quillmate-back.onrender.com/upload/", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      setUploadStatus(result.status);
      if (result.preview) {
        setSamplePreview(result.preview);
        setSampleUploaded(true);
      } else {
        setSamplePreview(null);
        setSampleUploaded(false);
      }
    } catch (err) {
      setUploadStatus("Upload failed. Try again.");
      setSamplePreview(null);
      setSampleUploaded(false);
    }
  };

  return (
    <Card className="bg-gradient-card shadow-card border-0 rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-glow">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <BookOpen className="w-6 h-6 text-primary" />
          Style Mimicry
        </CardTitle>
        <CardDescription>
          Upload a sample of your writing (.txt preferred, .pdf experimental), then ask AI to write in your style.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Upload Your Writing Sample (.txt preferred, .pdf experimental)</label>
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.pdf,text/plain,application/pdf"
              onChange={handleFileChange}
              className="hidden"
              id="mimic-upload"
            />
            <Button
              type="button"
              variant="gradient"
              className="rounded-xl h-10 px-6 font-medium"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose File
            </Button>
            <span className="text-xs text-muted-foreground">TXT preferred, PDF experimental</span>
          </div>
          {uploadStatus && <div className="text-sm text-muted-foreground">{uploadStatus}</div>}
          {samplePreview && (
            <div className="mt-2 p-2 bg-muted/30 rounded">
              <div className="text-xs font-bold mb-1">Sample Preview:</div>
              <pre className="text-xs whitespace-pre-wrap max-h-40 overflow-y-auto">{samplePreview}</pre>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="mimic-prompt">Ask AI to write something in your style</Label>
          <Textarea
            id="mimic-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="What would you like the AI to write in your style?"
            className="min-h-32 rounded-xl border-0 bg-muted/50 focus:bg-background transition-all duration-300 resize-none"
          />
        </div>
        <Button 
          onClick={handleGenerate}
          disabled={isLoading || !prompt.trim() || !sampleUploaded}
          variant="gradient"
          className="w-full rounded-xl h-12 text-lg font-medium"
        >
          {isLoading ? "Generating..." : "Generate in Your Style"}
        </Button>
        {output && (
          <div className="space-y-4 animate-fade-in">
            <Label>Mimicked Output</Label>
            <Textarea
              value={output}
              readOnly
              className="min-h-40 rounded-xl border-0 bg-muted/30 resize-none"
            />
            <Button 
              onClick={() => onExport(output)}
              variant="outline"
              className="rounded-xl border-primary/20 hover:bg-primary/10 transition-all duration-300"
            >
              <Download className="w-4 h-4 mr-2" />
              Export as PDF
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StyleEnhancer({ onEnhance, onExport }: {
  onEnhance: (inputText: string) => Promise<string>;
  onExport: (text: string) => void;
}) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [samplePreview, setSamplePreview] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [sampleUploaded, setSampleUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEnhance = async () => {
    setIsLoading(true);
    const result = await onEnhance(input);
    setOutput(result);
    setIsLoading(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedTypes = ["text/plain", "application/pdf"];
    const allowedExtensions = [".txt", ".pdf"];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      setUploadStatus("Invalid file type. Only .txt and .pdf are allowed.");
      setSamplePreview(null);
      setSampleUploaded(false);
      return;
    }
    setUploadStatus("Uploading and parsing...");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("https://quillmate-back.onrender.com/upload/", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      setUploadStatus(result.status);
      if (result.preview) {
        setSamplePreview(result.preview);
        setSampleUploaded(true);
      } else {
        setSamplePreview(null);
        setSampleUploaded(false);
      }
    } catch (err) {
      setUploadStatus("Upload failed. Try again.");
      setSamplePreview(null);
      setSampleUploaded(false);
    }
  };

  return (
    <Card className="bg-gradient-card shadow-card border-0 rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-glow">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Sparkles className="w-6 h-6 text-primary" />
          Style Enhancer
        </CardTitle>
        <CardDescription>
          Upload a sample of your writing (.txt preferred, .pdf experimental), then enter text to enhance in your style.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Upload Your Writing Sample (.txt preferred, .pdf experimental)</label>
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.pdf,text/plain,application/pdf"
              onChange={handleFileChange}
              className="hidden"
              id="enhance-upload"
            />
            <Button
              type="button"
              variant="gradient"
              className="rounded-xl h-10 px-6 font-medium"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose File
            </Button>
            <span className="text-xs text-muted-foreground">TXT preferred, PDF experimental</span>
          </div>
          {uploadStatus && <div className="text-sm text-muted-foreground">{uploadStatus}</div>}
          {samplePreview && (
            <div className="mt-2 p-2 bg-muted/30 rounded">
              <div className="text-xs font-bold mb-1">Sample Preview:</div>
              <pre className="text-xs whitespace-pre-wrap max-h-40 overflow-y-auto">{samplePreview}</pre>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="enhance-input">Your Writing</Label>
          <Textarea
            id="enhance-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter the text you'd like to enhance..."
            className="min-h-32 rounded-xl border-0 bg-muted/50 focus:bg-background transition-all duration-300 resize-none"
          />
        </div>
        <Button
          onClick={handleEnhance}
          disabled={isLoading || !input.trim() || !sampleUploaded}
          variant="gradient"
          className="w-full rounded-xl h-12 text-lg font-medium"
        >
          {isLoading ? "Enhancing..." : "Enhance Style"}
        </Button>
        {output && (
          <div className="space-y-4 animate-fade-in">
            <Label>Enhanced Version</Label>
            <Textarea
              value={output}
              readOnly
              className="min-h-48 rounded-xl border-0 bg-muted/30 resize-none"
            />
            <Button
              onClick={() => onExport(output)}
              variant="outline"
              className="rounded-xl border-primary/20 hover:bg-primary/10 transition-all duration-300"
            >
              <Download className="w-4 h-4 mr-2" />
              Export as PDF
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}