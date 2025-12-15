"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  MoreVertical,
  Download,
  Eye,
  Trash2,
  Share2,
  FileText,
  ImageIcon,
  FileSpreadsheet,
  File,
  Folder,
} from "lucide-react"
import type { FileUpload } from "@/lib/types"
import { cn } from "@/lib/utils"

interface DocumentListProps {
  documents: FileUpload[]
  viewMode?: "grid" | "list"
  onDownload?: (doc: FileUpload) => void
  onDelete?: (id: string) => void
  onView?: (doc: FileUpload) => void
}

export function DocumentList({ documents, viewMode = "grid", onDownload, onDelete, onView }: DocumentListProps) {
  const getFileIcon = (mimeType: string, fileName: string) => {
    if (mimeType.startsWith("image/")) return <ImageIcon className="h-8 w-8 text-blue-500" />
    if (mimeType.includes("spreadsheet") || fileName.endsWith(".xlsx") || fileName.endsWith(".csv"))
      return <FileSpreadsheet className="h-8 w-8 text-emerald-500" />
    if (mimeType.includes("pdf")) return <FileText className="h-8 w-8 text-red-500" />
    return <File className="h-8 w-8 text-amber-500" />
  }

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      photo: "bg-blue-500/10 text-blue-600 border-blue-500/30",
      id_proof: "bg-purple-500/10 text-purple-600 border-purple-500/30",
      certificate: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
      result: "bg-amber-500/10 text-amber-600 border-amber-500/30",
      other: "bg-muted text-muted-foreground",
    }
    return colors[category] || colors.other
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <Folder className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
        <p className="text-muted-foreground">No documents uploaded yet</p>
      </div>
    )
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-2">
        {documents.map((doc) => (
          <Card key={doc.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-3">
              <div className="flex items-center gap-4">
                {getFileIcon(doc.mimeType, doc.originalName)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{doc.originalName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={cn("text-xs", getCategoryBadge(doc.category))}>{doc.category}</Badge>
                    <span className="text-xs text-muted-foreground">{formatSize(doc.size)}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(doc.uploadedAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onView?.(doc)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDownload?.(doc)}>
                    <Download className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => onDelete?.(doc.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {documents.map((doc) => (
        <Card key={doc.id} className="hover:shadow-md transition-shadow group">
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center">
              <div className="p-4 rounded-lg bg-muted mb-3 group-hover:bg-muted/80 transition-colors">
                {getFileIcon(doc.mimeType, doc.originalName)}
              </div>
              <p className="font-medium text-sm truncate w-full">{doc.originalName}</p>
              <Badge className={cn("text-xs mt-2", getCategoryBadge(doc.category))}>{doc.category}</Badge>
              <p className="text-xs text-muted-foreground mt-2">{formatSize(doc.size)}</p>
            </div>
            <div className="flex items-center justify-center gap-1 mt-3 pt-3 border-t opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onView?.(doc)}>
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onDownload?.(doc)}>
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={() => onDelete?.(doc.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
