"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Play, CheckCircle, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TrainingMetrics {
  accuracy: number
  precision: number
  recall: number
  f1Score: number
  loss: number
}

export function ModelTraining() {
  const [isTraining, setIsTraining] = useState(false)
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [currentEpoch, setCurrentEpoch] = useState(0)
  const [totalEpochs, setTotalEpochs] = useState(100)
  const [modelType, setModelType] = useState("random_forest")
  const [metrics, setMetrics] = useState<TrainingMetrics | null>(null)
  const [trainingComplete, setTrainingComplete] = useState(false)
  const { toast } = useToast()

  const startTraining = async () => {
    setIsTraining(true)
    setTrainingProgress(0)
    setCurrentEpoch(0)
    setTrainingComplete(false)

    try {
      // Simulate training process
      for (let epoch = 1; epoch <= totalEpochs; epoch++) {
        setCurrentEpoch(epoch)
        setTrainingProgress((epoch / totalEpochs) * 100)

        // Simulate API call for each epoch
        await new Promise((resolve) => setTimeout(resolve, 50))

        // Update metrics periodically
        if (epoch % 10 === 0) {
          setMetrics({
            accuracy: 0.85 + Math.random() * 0.1,
            precision: 0.82 + Math.random() * 0.1,
            recall: 0.79 + Math.random() * 0.1,
            f1Score: 0.8 + Math.random() * 0.1,
            loss: 0.3 - (epoch / totalEpochs) * 0.2 + Math.random() * 0.05,
          })
        }
      }

      setTrainingComplete(true)
      toast({
        title: "Training Complete",
        description: "Model has been successfully trained and is ready for predictions",
      })
    } catch (error) {
      toast({
        title: "Training Failed",
        description: "There was an error during model training",
        variant: "destructive",
      })
    } finally {
      setIsTraining(false)
    }
  }

  const saveModel = async () => {
    try {
      const response = await fetch("/api/save-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modelType, metrics }),
      })

      if (response.ok) {
        toast({
          title: "Model Saved",
          description: "Model has been saved successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save the model",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Model Training</h2>
          <p className="text-gray-600 dark:text-gray-300">Train machine learning models for promotion optimization</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Training Configuration
              </CardTitle>
              <CardDescription>Configure your model training parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="model-type">Model Type</Label>
                  <Select value={modelType} onValueChange={setModelType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select model type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="random_forest">Random Forest</SelectItem>
                      <SelectItem value="gradient_boosting">Gradient Boosting</SelectItem>
                      <SelectItem value="neural_network">Neural Network</SelectItem>
                      <SelectItem value="svm">Support Vector Machine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="epochs">Training Epochs</Label>
                  <Input
                    id="epochs"
                    type="number"
                    value={totalEpochs}
                    onChange={(e) => setTotalEpochs(Number.parseInt(e.target.value))}
                    min="10"
                    max="1000"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={startTraining} disabled={isTraining} className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  {isTraining ? "Training..." : "Start Training"}
                </Button>

                {trainingComplete && (
                  <Button onClick={saveModel} variant="outline">
                    Save Model
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {isTraining && (
            <Card>
              <CardHeader>
                <CardTitle>Training Progress</CardTitle>
                <CardDescription>
                  Epoch {currentEpoch} of {totalEpochs}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={trainingProgress} />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Progress: {trainingProgress.toFixed(1)}%</span>
                  <span>ETA: {Math.ceil((totalEpochs - currentEpoch) * 0.05)} seconds</span>
                </div>
              </CardContent>
            </Card>
          )}

          {trainingComplete && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Training completed successfully!</strong> Your model is ready for predictions.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Model Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Status</span>
                <Badge variant={trainingComplete ? "default" : isTraining ? "secondary" : "outline"}>
                  {trainingComplete ? "Ready" : isTraining ? "Training" : "Not Trained"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Model Type</span>
                <span className="text-sm font-medium">{modelType.replace("_", " ").toUpperCase()}</span>
              </div>

              {currentEpoch > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">Current Epoch</span>
                  <span className="text-sm font-medium">
                    {currentEpoch}/{totalEpochs}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {metrics && (
            <Card>
              <CardHeader>
                <CardTitle>Training Metrics</CardTitle>
                <CardDescription>Current model performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Accuracy</span>
                  <span className="text-sm font-medium">{(metrics.accuracy * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Precision</span>
                  <span className="text-sm font-medium">{(metrics.precision * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Recall</span>
                  <span className="text-sm font-medium">{(metrics.recall * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">F1 Score</span>
                  <span className="text-sm font-medium">{(metrics.f1Score * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Loss</span>
                  <span className="text-sm font-medium">{metrics.loss.toFixed(3)}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
