"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Brain, BarChart3, Database } from "lucide-react"
import { DataUpload } from "@/components/data-upload"
import { ModelTraining } from "@/components/model-training"
import { PredictionInterface } from "@/components/prediction-interface"
import { DataAnalysis } from "@/components/data-analysis"

export default function PromotionModelApp() {
  const [activeTab, setActiveTab] = useState("upload")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Promotion Model ML Platform</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Advanced machine learning platform for retail promotion optimization and sales prediction
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Data Upload
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="training" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Model Training
            </TabsTrigger>
            <TabsTrigger value="prediction" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Predictions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <DataUpload />
          </TabsContent>

          <TabsContent value="analysis">
            <DataAnalysis />
          </TabsContent>

          <TabsContent value="training">
            <ModelTraining />
          </TabsContent>

          <TabsContent value="prediction">
            <PredictionInterface />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
