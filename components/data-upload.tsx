"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type DataUploadProps = {}

export function DataUpload({}: DataUploadProps) {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const { toast } = useToast()

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files
      if (!files || files.length === 0) return

      setIsUploading(true)
      setUploadProgress(0)

      try {
        for (let i = 0; i < files.length; i++) {
          const file = files[i]

          // Simulate upload progress
          for (let progress = 0; progress <= 100; progress += 10) {
            setUploadProgress(progress)
            await new Promise((resolve) => setTimeout(resolve, 100))
          }

          // Process the file
          await processFile(file)
          setUploadedFiles((prev) => [...prev, file.name])
        }

        toast({
          title: "Upload Complete",
          description: `Successfully uploaded ${files.length} file(s)`,
        })
      } catch (error) {
        toast({
          title: "Upload Failed",
          description: "There was an error uploading your files",
          variant: "destructive",
        })
      } finally {
        setIsUploading(false)
        setUploadProgress(0)
      }
    },
    [toast],
  )

  const processFile = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Upload failed")
    }

    return response.json()
  }

  const loadSampleData = async () => {
    setIsUploading(true)
    try {
      const response = await fetch("/api/load-sample-data", {
        method: "POST",
      })

      if (response.ok) {
        setUploadedFiles(["train.csv", "validation.csv"])
        toast({
          title: "Sample Data Loaded",
          description: "Training and validation datasets are ready",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load sample data",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Data Upload
          </CardTitle>
          <CardDescription>Upload your training and validation CSV files for the promotion model</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <div className="space-y-2">
              <Label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-lg font-medium">Choose files to upload</span>
                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </Label>
              <p className="text-sm text-gray-500">Drag and drop CSV files here, or click to browse</p>
            </div>
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          <div className="flex gap-4">
            <Button onClick={loadSampleData} variant="outline" disabled={isUploading}>
              Load Sample Data
            </Button>
          </div>

          {uploadedFiles.length > 0 && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Files uploaded:</strong> {uploadedFiles.join(", ")}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expected Data Schema</CardTitle>
          <CardDescription>Your CSV files should contain the following columns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Tanggal</span>
                <span className="text-gray-500">Date</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Produk</span>
                <span className="text-gray-500">String</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Kategori</span>
                <span className="text-gray-500">String</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Brand</span>
                <span className="text-gray-500">String</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Harga_Jual</span>
                <span className="text-gray-500">Number</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Diskon</span>
                <span className="text-gray-500">Number</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Jumlah_Terjual</span>
                <span className="text-gray-500">String</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Stok_Harian</span>
                <span className="text-gray-500">Number</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Stok_Aging</span>
                <span className="text-gray-500">String</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Jenis_Promo</span>
                <span className="text-gray-500">String</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Musim</span>
                <span className="text-gray-500">String</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Cuaca</span>
                <span className="text-gray-500">String</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
