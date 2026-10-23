<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockMovement;
use App\Models\Supplier;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $todayStart = Carbon::today()->startOfDay();
        $todayEnd = Carbon::today()->endOfDay();

        $totalProducts = Product::count();
        $totalStockValue = Product::selectRaw('COALESCE(SUM(quantity * purchase_price), 0) as total')->value('total');
        $lowStockCount = Product::whereColumn('quantity', '<=', 'low_stock_threshold')->count();
        $expiredCount = Product::where('expiry_date', '<', $todayStart)->count();
        $totalSuppliers = Supplier::count();

        $totalStockInToday = StockMovement::where('type', 'in')
            ->whereBetween('created_at', [$todayStart, $todayEnd])
            ->sum('quantity');
        $totalStockOutToday = StockMovement::where('type', 'out')
            ->whereBetween('created_at', [$todayStart, $todayEnd])
            ->sum('quantity');

        $recentActivities = StockMovement::with(['product:id,name', 'user:id,name'])
            ->latest()
            ->limit(10)
            ->get();

        $lowStockProducts = Product::with('supplier')
            ->whereColumn('quantity', '<=', 'low_stock_threshold')
            ->orderBy('quantity', 'asc')
            ->limit(5)
            ->get();

        $expiredProducts = Product::with('supplier')
            ->where('expiry_date', '<', $todayStart)
            ->orderBy('expiry_date', 'asc')
            ->limit(5)
            ->get();

        $categoryDistribution = Product::select('category')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('category')
            ->get();

        return response()->json([
            'total_products' => $totalProducts,
            'total_stock_value' => (float) $totalStockValue,
            'low_stock_count' => $lowStockCount,
            'expired_count' => $expiredCount,
            'total_suppliers' => $totalSuppliers,
            'total_stock_in_today' => (int) $totalStockInToday,
            'total_stock_out_today' => (int) $totalStockOutToday,
            'recent_activities' => $recentActivities,
            'low_stock_products' => $lowStockProducts,
            'expired_products' => $expiredProducts,
            'category_distribution' => $categoryDistribution,
        ], 200);
    }
}
