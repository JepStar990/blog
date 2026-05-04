import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, ArrowLeft } from "lucide-react";

interface EditFields {
  title?: string;
  excerpt?: string;
  coverImage?: string;
  content: string;
}

interface Props {
  id: string;
}

export default function DiffReview({ id }: Props) {
  const [, navigate] = useLocation();
  const [original, setOriginal] = useState<EditFields | null>(null);
  const [edited, setEdited] = useState<EditFields | null>(null);

  useEffect(() => {
    const origRaw = sessionStorage.getItem("ai_original");
    const editRaw = sessionStorage.getItem("ai_edited");
    if (!origRaw || !editRaw) {
      navigate(`/admin/posts/${id}`);
      return;
    }
    try {
      setOriginal(JSON.parse(origRaw));
      setEdited(JSON.parse(editRaw));
    } catch {
      // Old format: plain strings
      setOriginal({ content: origRaw });
      setEdited({ content: editRaw });
    }
  }, [id, navigate]);

  const handleAccept = () => {
    sessionStorage.setItem("accept_ai_edit", JSON.stringify(edited));
    sessionStorage.removeItem("ai_original");
    sessionStorage.removeItem("ai_edited");
    navigate(`/admin/posts/${id}`);
  };

  const handleReject = () => {
    sessionStorage.removeItem("ai_original");
    sessionStorage.removeItem("ai_edited");
    navigate(`/admin/posts/${id}`);
  };

  if (!original || !edited) return null;

  const contentLines = () => {
    const origLines = (original.content || "").split("\n");
    const editLines = (edited.content || "").split("\n");
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

  const fieldChanged = (field: keyof EditFields) => {
    return original[field] !== edited[field];
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

      {/* Metadata changes */}
      {(fieldChanged("title") || fieldChanged("excerpt") || fieldChanged("coverImage")) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Metadata Changes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fieldChanged("title") && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Title</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-2 rounded bg-red-50 dark:bg-red-950/20 text-sm line-through">{original.title}</div>
                  <div className="p-2 rounded bg-green-50 dark:bg-green-950/20 text-sm">{edited.title}</div>
                </div>
              </div>
            )}
            {fieldChanged("excerpt") && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Excerpt</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-2 rounded bg-red-50 dark:bg-red-950/20 text-sm line-through">{original.excerpt}</div>
                  <div className="p-2 rounded bg-green-50 dark:bg-green-950/20 text-sm">{edited.excerpt}</div>
                </div>
              </div>
            )}
            {fieldChanged("coverImage") && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Cover Image</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Original</p>
                    {original.coverImage ? (
                      <img src={original.coverImage} alt="" className="w-full h-32 object-cover rounded border opacity-50" />
                    ) : (
                      <span className="text-sm text-muted-foreground">None</span>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Suggested</p>
                    {edited.coverImage ? (
                      <img src={edited.coverImage} alt="" className="w-full h-32 object-cover rounded border border-green-500" />
                    ) : (
                      <span className="text-sm text-muted-foreground">None</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Content diff */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Content Changes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border rounded-md overflow-hidden">
            <div className="flex bg-muted px-2 py-1 text-xs font-medium border-b">
              <div className="w-1/2 px-2">Original</div>
              <div className="w-1/2 px-2">Edited</div>
            </div>
            {contentLines()}
          </div>
        </CardContent>
      </Card>

      {/* Full preview cards for reference */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Original</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm whitespace-pre-wrap font-mono max-h-96 overflow-y-auto">{original.content}</pre>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">AI Edited</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm whitespace-pre-wrap font-mono max-h-96 overflow-y-auto">{edited.content}</pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
