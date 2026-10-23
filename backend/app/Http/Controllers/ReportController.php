<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockMovement;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function stockReport(Request $request): JsonResponse
    {
        $query = Product::with('supplier:id,name');

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%")
                    ->orWhere('batch_number', 'like', "%{$search}%");
            });
        }

        $products = $query->orderBy('name')->get();

        return response()->json([
            'products' => $products,
        ], 200);
    }

    public function expiryReport(Request $request): JsonResponse
    {
        $days = $request->input('days', 30);
        $today = Carbon::today();
        $cutoff = Carbon::today()->addDays($days);

        $allProducts = Product::where('expiry_date', '<', $cutoff)->orderBy('expiry_date', 'asc')->get();

        $expired = $allProducts->filter(function ($product) use ($today) {
            return $product->expiry_date->lt($today);
        });

        $expiringInDays = $allProducts->filter(function ($product) use ($today, $cutoff) {
            return $product->expiry_date->gte($today) && $product->expiry_date->lte($cutoff);
        });

        return response()->json([
            'expired' => $expired,
            'expiring_soon' => $expiringInDays,
            'total_expired' => $expired->count(),
            'total_expiring_soon' => $expiringInDays->count(),
        ], 200);
    }

    public function usageReport(Request $request): JsonResponse
    {
        $request->validate([
            'date_from' => 'required|date',
            'date_to' => 'required|date|after_or_equal:date_from',
        ]);

        $movements = StockMovement::whereBetween('created_at', [
            Carbon::parse($request->date_from)->startOfDay(),
            Carbon::parse($request->date_to)->endOfDay(),
        ])->get();

        $grouped = $movements->groupBy('product_id')->map(function ($items) {
            $product = $items->first()->product;
            $totalIn = $items->where('type', 'in')->sum('quantity');
            $totalOut = $items->where('type', 'out')->sum('quantity');

            return [
                'product_id' => $product->id,
                'product_name' => $product->name,
                'total_in' => $totalIn,
                'total_out' => $totalOut,
                'net_change' => $totalIn - $totalOut,
            ];
        })->values();

        return response()->json([
            'usage' => $grouped,
        ], 200);
    }

    public function dailyMovementReport(Request $request): JsonResponse
    {
        $request->validate([
            'date_from' => 'required|date',
            'date_to' => 'required|date|after_or_equal:date_from',
        ]);

        $startDate = Carbon::parse($request->date_from)->startOfDay();
        $endDate = Carbon::parse($request->date_to)->endOfDay();

        $movements = StockMovement::whereBetween('created_at', [$startDate, $endDate])->get();

        $daily = [];
        $current = $startDate->copy()->startOfDay();

        while ($current->lte($endDate)) {
            $dateStr = $current->toDateString();
            $dayMovements = $movements->filter(function ($m) use ($dateStr) {
                return $m->created_at->setTimezone(config('app.timezone'))->toDateString() === $dateStr;
            });

            $daily[] = [
                'date' => $dateStr,
                'stock_in' => $dayMovements->where('type', 'in')->sum('quantity'),
                'stock_out' => $dayMovements->where('type', 'out')->sum('quantity'),
            ];

            $current->addDay();
        }

        return response()->json([
            'daily_movements' => $daily,
        ], 200);
    }
}
