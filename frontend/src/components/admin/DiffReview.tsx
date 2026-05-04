import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, ArrowLeft } from "lucide-react";

interface Props {
  id: string;
}

export default function DiffReview({ id }: Props) {
  const [, navigate] = useLocation();
  const [original, setOriginal] = useState("");
  const [edited, setEdited] = useState("");

  useEffect(() => {
    const orig = sessionStorage.getItem("ai_original");
    const edit = sessionStorage.getItem("ai_edited");
    if (!orig || !edit) {
      navigate(`/admin/posts/${id}`);
      return;
    }
    setOriginal(orig);
    setEdited(edit);
  }, [id, navigate]);

  const handleAccept = () => {
    sessionStorage.setItem("accept_ai_edit", edited);
    sessionStorage.removeItem("ai_original");
    sessionStorage.removeItem("ai_edited");
    navigate(`/admin/posts/${id}`);
  };

  const handleReject = () => {
    sessionStorage.removeItem("ai_original");
    sessionStorage.removeItem("ai_edited");
    navigate(`/admin/posts/${id}`);
  };

  const renderDiffLines = () => {
    const origLines = original.split("\n");
    const editLines = edited.split("\n");
    const maxLen = Math.max(origLines.length, editLines.length);
    const rows = [];

    for (let i = 0; i < maxLen; i++) {
      const origLine = origLines[i] ?? "";
      const editLine = editLines[i] ?? "";
      const isDiff = origLine !== editLine;

      rows.push(
        <div key={i} className={`flex border-b border-border ${isDiff ? "bg-muted/50" : ""}`}>
          <div className={`w-1/2 p-2 font-mono text-xs whitespace-pre-wrap border-r border-border ${isDiff ? "bg-red-50 dark:bg-red-950/20" : ""}`}>
            {isDiff && <span className="text-red-600 dark:text-red-400 mr-1">-</span>}
            {origLine || " "}
          </div>
          <div className={`w-1/2 p-2 font-mono text-xs whitespace-pre-wrap ${isDiff ? "bg-green-50 dark:bg-green-950/20" : ""}`}>
            {isDiff && <span className="text-green-600 dark:text-green-400 mr-1">+</span>}
            {editLine || " "}
          </div>
        </div>
      );
    }
    return rows;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/posts/${id}`)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-2xl font-bold">Review AI Changes</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleReject}>
            <X className="w-4 h-4 mr-2" />
            Reject
          </Button>
          <Button onClick={handleAccept}>
            <Check className="w-4 h-4 mr-2" />
            Accept Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Original</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm whitespace-pre-wrap font-mono">{original}</pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">AI Edited</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm whitespace-pre-wrap font-mono">{edited}</pre>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Line-by-Line Diff</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border rounded-md overflow-hidden">
            <div className="flex bg-muted px-2 py-1 text-xs font-medium border-b">
              <div className="w-1/2 px-2">Original</div>
              <div className="w-1/2 px-2">Edited</div>
            </div>
            {renderDiffLines()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
