"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, type File, X, CheckCircle, AlertCircle, ImageIcon, FileText, FileSpreadsheet } from "lucide-react"
import { cn } from "@/lib/utils"
import { gsap } from "gsap"

interface UploadedFile {
  id: string
  file: File
  progress: number
  status: "uploading" | "completed" | "error"
  error?: string
}

interface FileDropzoneProps {
  accept?: string
  maxSize?: number // in MB
  maxFiles?: number
  onUpload?: (files: File[]) => void
  category?: string
}

export function FileDropzone({
  accept = "*",
  maxSize = 10,
  maxFiles = 5,
  onUpload,
  category = "document",
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const dropzoneRef = useRef<HTMLDivElement>(null)

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <ImageIcon className="h-5 w-5 text-blue-500" />
    if (file.type.includes("spreadsheet") || file.name.endsWith(".xlsx") || file.name.endsWith(".csv"))
      return <FileSpreadsheet className="h-5 w-5 text-emerald-500" />
    return <FileText className="h-5 w-5 text-amber-500" />
  }

  const simulateUpload = useCallback((fileId: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 30
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setUploadedFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, progress: 100, status: "completed" } : f)),
        )
      } else {
        setUploadedFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, progress } : f)))
      }
    }, 300)
  }, [])

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return

      const newFiles: UploadedFile[] = []

      Array.from(files)
        .slice(0, maxFiles - uploadedFiles.length)
        .forEach((file) => {
          if (file.size > maxSize * 1024 * 1024) {
            newFiles.push({
              id: Math.random().toString(36).substr(2, 9),
              file,
              progress: 0,
              status: "error",
              error: `File exceeds ${maxSize}MB limit`,
            })
          } else {
            const id = Math.random().toString(36).substr(2, 9)
            newFiles.push({
              id,
              file,
              progress: 0,
              status: "uploading",
            })
            setTimeout(() => simulateUpload(id), 100)
          }
        })

      setUploadedFiles((prev) => [...prev, ...newFiles])
      onUpload?.(newFiles.filter((f) => f.status !== "error").map((f) => f.file))
    },
    [maxFiles, maxSize, uploadedFiles.length, onUpload, simulateUpload],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
    if (dropzoneRef.current) {
      gsap.to(dropzoneRef.current, { scale: 1.02, duration: 0.2 })
    }
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (dropzoneRef.current) {
      gsap.to(dropzoneRef.current, { scale: 1, duration: 0.2 })
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (dropzoneRef.current) {
        gsap.to(dropzoneRef.current, { scale: 1, duration: 0.2 })
      }
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles],
  )

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id))
  }

  return (
    <div className="space-y-4">
      <div
        ref={dropzoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={maxFiles > 1}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-2">
          <div className={cn("p-4 rounded-full transition-colors", isDragging ? "bg-primary/10" : "bg-muted")}>
            <Upload className={cn("h-8 w-8", isDragging ? "text-primary" : "text-muted-foreground")} />
          </div>
          <div>
            <p className="font-medium">{isDragging ? "Drop files here" : "Drag & drop files here"}</p>
            <p className="text-sm text-muted-foreground mt-1">or click to browse (max {maxSize}MB per file)</p>
          </div>
          <Button variant="outline" size="sm" className="mt-2 bg-transparent" type="button">
            Browse Files
          </Button>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((uploadedFile) => (
            <Card key={uploadedFile.id}>
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  {getFileIcon(uploadedFile.file)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">{uploadedFile.file.name}</p>
                      <div className="flex items-center gap-2">
                        {uploadedFile.status === "completed" && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                        {uploadedFile.status === "error" && <AlertCircle className="h-4 w-4 text-red-500" />}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeFile(uploadedFile.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {uploadedFile.status === "uploading" && (
                      <Progress value={uploadedFile.progress} className="h-1 mt-2" />
                    )}
                    {uploadedFile.error && <p className="text-xs text-red-500 mt-1">{uploadedFile.error}</p>}
                    <p className="text-xs text-muted-foreground mt-1">
                      {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
