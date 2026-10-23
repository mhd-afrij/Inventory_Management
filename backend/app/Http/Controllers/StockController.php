<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockMovement;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StockController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = StockMovement::with(['product', 'user']);

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('product_id')) {
            $query->where('product_id', $request->product_id);
        }

        if ($request->filled('date_from')) {
            $query->where('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->where('created_at', '<=', Carbon::parse($request->date_to)->endOfDay());
        }

        $movements = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($movements, 200);
    }

    public function stockIn(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $product = Product::findOrFail($validated['product_id']);

            $previousQuantity = $product->quantity;
            $newQuantity = $previousQuantity + $validated['quantity'];

            $referenceNumber = $this->generateReferenceNumber('SI');

            $movement = StockMovement::create([
                'product_id' => $validated['product_id'],
                'type' => 'in',
                'quantity' => $validated['quantity'],
                'reference_number' => $referenceNumber,
                'notes' => $validated['notes'] ?? null,
                'performed_by' => $request->user()->id,
            ]);

            $product->update(['quantity' => $newQuantity]);

            $response = [
                'message' => 'Stock in recorded successfully.',
                'movement' => $movement->load(['product', 'user']),
            ];

            if ($previousQuantity < $product->low_stock_threshold && $newQuantity >= $product->low_stock_threshold) {
                $response['note'] = 'Product stock is now above the low stock threshold.';
            }

            return response()->json($response, 201);
        });
    }

    public function stockOut(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $product = Product::findOrFail($validated['product_id']);

            if ($product->quantity < $validated['quantity']) {
                return response()->json([
                    'message' => 'Insufficient stock. Available: ' . $product->quantity . ', requested: ' . $validated['quantity'],
                ], 422);
            }

            $newQuantity = $product->quantity - $validated['quantity'];
            $referenceNumber = $this->generateReferenceNumber('SO');

            $movement = StockMovement::create([
                'product_id' => $validated['product_id'],
                'type' => 'out',
                'quantity' => $validated['quantity'],
                'reference_number' => $referenceNumber,
                'notes' => $validated['notes'] ?? null,
                'performed_by' => $request->user()->id,
            ]);

            $product->update(['quantity' => $newQuantity]);

            return response()->json([
                'message' => 'Stock out recorded successfully.',
                'movement' => $movement->load(['product', 'user']),
            ], 201);
        });
    }

    public function movementSummary(): JsonResponse
    {
        $todayStart = Carbon::today()->startOfDay();
        $todayEnd = Carbon::today()->endOfDay();
        $startOfWeek = Carbon::now()->startOfWeek()->startOfDay();
        $startOfMonth = Carbon::now()->startOfMonth()->startOfDay();

        $todayStockIn = StockMovement::where('type', 'in')
            ->whereBetween('created_at', [$todayStart, $todayEnd])
            ->sum('quantity');
        $todayStockOut = StockMovement::where('type', 'out')
            ->whereBetween('created_at', [$todayStart, $todayEnd])
            ->sum('quantity');
        $todayMovements = StockMovement::whereBetween('created_at', [$todayStart, $todayEnd])->count();
        $weekMovements = StockMovement::where('created_at', '>=', $startOfWeek)->count();
        $monthMovements = StockMovement::where('created_at', '>=', $startOfMonth)->count();

        return response()->json([
            'stock_in_today' => (int) $todayStockIn,
            'stock_out_today' => (int) $todayStockOut,
            'today' => $todayMovements,
            'this_week' => $weekMovements,
            'this_month' => $monthMovements,
        ], 200);
    }

    private function generateReferenceNumber(string $prefix): string
    {
        $date = Carbon::now()->format('Ymd');
        $count = StockMovement::where('reference_number', 'like', "{$prefix}-{$date}-%")
            ->count() + 1;

        return sprintf("%s-%s-%04d", $prefix, $date, $count);
    }
}
