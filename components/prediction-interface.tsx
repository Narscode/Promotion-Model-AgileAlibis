"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Target, TrendingUp, Package } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PredictionResult {
  predictedSales: number
  confidence: number
  recommendations: string[]
  optimalDiscount: number
  expectedRevenue: number
}

export function PredictionInterface() {
  const [formData, setFormData] = useState({
    produk: "",
    kategori: "",
    brand: "",
    harga_jual: "",
    diskon: "",
    stok_harian: "",
    stok_aging: "",
    jenis_promo: "",
    musim: "",
    cuaca: "",
    event_lokal: "",
  })

  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const makePrediction = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock prediction result
      const mockResult: PredictionResult = {
        predictedSales: Math.floor(Math.random() * 100) + 20,
        confidence: 0.85 + Math.random() * 0.1,
        recommendations: [
          "Consider increasing discount by 5% to boost sales",
          "This product performs well during current season",
          "Stock levels are optimal for predicted demand",
        ],
        optimalDiscount: Number.parseFloat(formData.diskon) + Math.random() * 1000,
        expectedRevenue: (Number.parseFloat(formData.harga_jual) || 0) * (Math.floor(Math.random() * 100) + 20),
      }

      setPrediction(mockResult)
      toast({
        title: "Prediction Complete",
        description: "Sales prediction has been generated successfully",
      })
    } catch (error) {
      toast({
        title: "Prediction Failed",
        description: "There was an error generating the prediction",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = formData.produk && formData.kategori && formData.harga_jual

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Sales Prediction</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Generate sales predictions and optimization recommendations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Product Information
            </CardTitle>
            <CardDescription>Enter product details for prediction</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="produk">Product Name</Label>
                <Input
                  id="produk"
                  value={formData.produk}
                  onChange={(e) => handleInputChange("produk", e.target.value)}
                  placeholder="e.g., Biskuit X"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kategori">Category</Label>
                <Select value={formData.kategori} onValueChange={(value) => handleInputChange("kategori", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Biskuit">Biskuit</SelectItem>
                    <SelectItem value="Soda">Soda</SelectItem>
                    <SelectItem value="Snack">Snack</SelectItem>
                    <SelectItem value="Minuman">Minuman</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Select value={formData.brand} onValueChange={(value) => handleInputChange("brand", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Brand1">Brand1</SelectItem>
                    <SelectItem value="Brand2">Brand2</SelectItem>
                    <SelectItem value="Brand3">Brand3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="harga_jual">Sales Price</Label>
                <Input
                  id="harga_jual"
                  type="number"
                  value={formData.harga_jual}
                  onChange={(e) => handleInputChange("harga_jual", e.target.value)}
                  placeholder="e.g., 34200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="diskon">Discount Amount</Label>
                <Input
                  id="diskon"
                  type="number"
                  value={formData.diskon}
                  onChange={(e) => handleInputChange("diskon", e.target.value)}
                  placeholder="e.g., 6200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stok_harian">Daily Stock</Label>
                <Input
                  id="stok_harian"
                  type="number"
                  value={formData.stok_harian}
                  onChange={(e) => handleInputChange("stok_harian", e.target.value)}
                  placeholder="e.g., 162"
                />
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jenis_promo">Promotion Type</Label>
                <Select value={formData.jenis_promo} onValueChange={(value) => handleInputChange("jenis_promo", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select promotion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tidak Ada Promo">No Promotion</SelectItem>
                    <SelectItem value="Diskon Nominal">Nominal Discount</SelectItem>
                    <SelectItem value="Diskon Persen">Percentage Discount</SelectItem>
                    <SelectItem value="Buy 1 Get 1">Buy 1 Get 1</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="musim">Season</Label>
                <Select value={formData.musim} onValueChange={(value) => handleInputChange("musim", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select season" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="Libur Nasional">National Holiday</SelectItem>
                    <SelectItem value="Ramadan">Ramadan</SelectItem>
                    <SelectItem value="Lebaran">Lebaran</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cuaca">Weather</Label>
                <Select value={formData.cuaca} onValueChange={(value) => handleInputChange("cuaca", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select weather" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cerah">Sunny</SelectItem>
                    <SelectItem value="Mendung">Cloudy</SelectItem>
                    <SelectItem value="Hujan">Rainy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event_lokal">Local Event</Label>
                <Select value={formData.event_lokal} onValueChange={(value) => handleInputChange("event_lokal", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tidak Ada">No Event</SelectItem>
                    <SelectItem value="Konser">Concert</SelectItem>
                    <SelectItem value="Pameran">Exhibition</SelectItem>
                    <SelectItem value="Festival">Festival</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={makePrediction}
              disabled={!isFormValid || isLoading}
              className="w-full flex items-center gap-2"
            >
              <Target className="w-4 h-4" />
              {isLoading ? "Generating Prediction..." : "Generate Prediction"}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {prediction && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Prediction Results
                  </CardTitle>
                  <CardDescription>AI-generated sales forecast and insights</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {prediction.predictedSales}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Predicted Sales</div>
                    </div>

                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {(prediction.confidence * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Confidence</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Optimal Discount</span>
                      <Badge variant="outline">₹{prediction.optimalDiscount.toFixed(0)}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Expected Revenue</span>
                      <Badge variant="outline">₹{prediction.expectedRevenue.toLocaleString()}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                  <CardDescription>AI-powered optimization suggestions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {prediction.recommendations.map((rec, index) => (
                      <Alert key={index}>
                        <AlertDescription>{rec}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {!prediction && (
            <Card>
              <CardHeader>
                <CardTitle>Prediction Results</CardTitle>
                <CardDescription>Results will appear here after generating prediction</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8">
                <Target className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">
                  Fill in the product information and click "Generate Prediction" to see results
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
