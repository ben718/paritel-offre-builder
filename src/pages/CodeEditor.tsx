
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Code, Save, Play, FolderTree, FileCode, FileText, Settings, RefreshCw } from "lucide-react";

const CodeEditor = () => {
  const { toast } = useToast();
  const [activeFile, setActiveFile] = useState("src/App.tsx");
  
  const files = [
    { path: "src/App.tsx", type: "tsx", label: "App.tsx" },
    { path: "src/main.tsx", type: "tsx", label: "main.tsx" },
    { path: "src/context/AuthContext.tsx", type: "tsx", label: "AuthContext.tsx" },
    { path: "src/components/layout/MainLayout.tsx", type: "tsx", label: "MainLayout.tsx" },
    { path: "src/pages/Dashboard.tsx", type: "tsx", label: "Dashboard.tsx" },
    { path: "src/components/ui/button.tsx", type: "tsx", label: "button.tsx" },
    { path: "src/components/ui/card.tsx", type: "tsx", label: "card.tsx" },
  ];

  const handleSave = () => {
    toast({
      title: "Code enregistré",
      description: "Les modifications ont été enregistrées avec succès.",
      variant: "default",
    });
  };

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Éditeur de Code</h1>
            <p className="text-muted-foreground">
              Modifiez directement le code source de l'application
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
            <Button variant="default" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" /> Enregistrer
            </Button>
            <Button variant="outline">
              <Play className="h-4 w-4 mr-2" /> Aperçu
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-180px)]">
          {/* File explorer sidebar */}
          <div className="col-span-3 border rounded-md overflow-hidden">
            <div className="p-3 border-b bg-muted/40 flex justify-between items-center">
              <h3 className="text-sm font-medium flex items-center">
                <FolderTree className="h-4 w-4 mr-2" /> Explorateur de fichiers
              </h3>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-1 max-h-full overflow-y-auto">
              {files.map((file) => (
                <div
                  key={file.path}
                  className={`flex items-center p-2 text-sm rounded-md cursor-pointer ${
                    activeFile === file.path ? "bg-muted" : "hover:bg-muted/50"
                  }`}
                  onClick={() => setActiveFile(file.path)}
                >
                  {file.type === "tsx" ? (
                    <FileCode className="h-4 w-4 mr-2 text-blue-500" />
                  ) : (
                    <FileText className="h-4 w-4 mr-2 text-gray-500" />
                  )}
                  {file.label}
                </div>
              ))}
            </div>
          </div>

          {/* Code editor main area */}
          <div className="col-span-9 flex flex-col border rounded-md overflow-hidden">
            <div className="p-2 border-b bg-muted/40 flex items-center justify-between">
              <div className="flex items-center">
                <FileCode className="h-4 w-4 mr-2 text-blue-500" />
                <span className="text-sm font-medium">{activeFile}</span>
              </div>
              <div className="flex space-x-2">
                <Select defaultValue="tsx">
                  <SelectTrigger className="h-7 text-xs w-32">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tsx">TypeScript React</SelectItem>
                    <SelectItem value="ts">TypeScript</SelectItem>
                    <SelectItem value="jsx">React JSX</SelectItem>
                    <SelectItem value="js">JavaScript</SelectItem>
                    <SelectItem value="css">CSS</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="sm" className="h-7 px-2">
                  <Code className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1 bg-muted/10 p-0 font-mono overflow-hidden">
              <Textarea
                className="h-full min-h-full font-mono text-sm resize-none bg-transparent border-none focus-visible:ring-0 rounded-none p-4"
                placeholder="// Éditez le code ici"
                defaultValue={`import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

// App component
function App() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="app-container">
      <header>
        {/* Header content */}
        <nav>{/* Navigation links */}</nav>
      </header>
      
      <main>
        {/* Main content */}
        <Outlet />
      </main>
      
      <footer>
        {/* Footer content */}
      </footer>
    </div>
  );
}

export default App;`}
              />
            </div>
            <div className="p-2 border-t bg-muted/40 flex justify-between text-xs text-muted-foreground">
              <div>Ln 24, Col 1</div>
              <div>TypeScript React</div>
              <div>UTF-8</div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CodeEditor;
