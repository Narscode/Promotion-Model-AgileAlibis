import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Simulate data analysis
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const analysisResults = {
      totalProducts: 1234,
      avgSales: 45231,
      activePromos: 23,
      dataPoints: 15847,
      categoryDistribution: {
        Biskuit: 400,
        Soda: 300,
        Snack: 300,
        Minuman: 200,
      },
      salesTrends: [
        { month: "Jan", sales: 4000, discount: 2400 },
        { month: "Feb", sales: 3000, discount: 1398 },
        { month: "Mar", sales: 2000, discount: 9800 },
        { month: "Apr", sales: 2780, discount: 3908 },
        { month: "May", sales: 1890, discount: 4800 },
        { month: "Jun", sales: 2390, discount: 3800 },
      ],
      promoEffectiveness: [
        { promo: "Diskon Nominal", effectiveness: 85 },
        { promo: "Diskon Persen", effectiveness: 72 },
        { promo: "Buy 1 Get 1", effectiveness: 68 },
        { promo: "Tidak Ada Promo", effectiveness: 45 },
      ],
    }

    return NextResponse.json(analysisResults)
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze data" }, { status: 500 })
  }
}
