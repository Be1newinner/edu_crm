"use client"

import { useState, useEffect } from "react"
import { FileDropzone } from "@/components/uploads/file-dropzone"
import { DocumentList } from "@/components/uploads/document-list"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, LayoutGrid, List, FolderOpen, ImageIcon, FileText, FileSpreadsheet, HardDrive } from "lucide-react"
import { api } from "@/lib/api"
import type { FileUpload } from "@/lib/types"
import { toast } from "sonner"

export default function UploadsPage() {
  const [documents, setDocuments] = useState<FileUpload[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await api.uploads.getAll()
        setDocuments(response.data || [])
      } catch (error) {
        console.error("Failed to fetch documents:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchDocuments()
  }, [])

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.originalName.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  // Calculate storage stats
  const totalSize = documents.reduce((sum, doc) => sum + doc.size, 0)
  const imageCount = documents.filter((d) => d.mimeType.startsWith("image/")).length
  const docCount = documents.filter((d) => d.mimeType.includes("pdf") || d.mimeType.includes("document")).length
  const spreadsheetCount = documents.filter(
    (d) => d.mimeType.includes("spreadsheet") || d.originalName.endsWith(".xlsx") || d.originalName.endsWith(".csv"),
  ).length

  const storageStats = [
    {
      label: "Total Files",
      value: documents.length,
      icon: FolderOpen,
      color: "text-primary bg-primary/10",
    },
    {
      label: "Images",
      value: imageCount,
      icon: ImageIcon,
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      label: "Documents",
      value: docCount,
      icon: FileText,
      color: "text-red-500 bg-red-500/10",
    },
    {
      label: "Spreadsheets",
      value: spreadsheetCount,
      icon: FileSpreadsheet,
      color: "text-emerald-500 bg-emerald-500/10",
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">File Uploads</h1>
          <p className="text-muted-foreground">Manage documents and files</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <HardDrive className="h-4 w-4" />
          <span>{(totalSize / 1024 / 1024).toFixed(2)} MB used</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {storageStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Files</TabsTrigger>
          <TabsTrigger value="upload">Upload New</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1">
              <div className="relative max-w-sm flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search files..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="photo">Photos</SelectItem>
                  <SelectItem value="id_proof">ID Proofs</SelectItem>
                  <SelectItem value="certificate">Certificates</SelectItem>
                  <SelectItem value="result">Results</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-1 border rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <DocumentList
            documents={filteredDocuments}
            viewMode={viewMode}
            onDownload={(doc) => toast.success(`Downloading ${doc.originalName}`)}
            onDelete={(id) => {
              setDocuments((prev) => prev.filter((d) => d.id !== id))
              toast.success("File deleted successfully")
            }}
            onView={(doc) => toast.info(`Opening ${doc.originalName}`)}
          />
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Documents</CardTitle>
              <CardDescription>
                Drag and drop files or click to browse. Supported formats: PDF, Images, Documents, Spreadsheets.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileDropzone
                accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png,.gif"
                maxSize={10}
                maxFiles={10}
                onUpload={(files) => {
                  toast.success(`${files.length} file(s) uploaded successfully`)
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
