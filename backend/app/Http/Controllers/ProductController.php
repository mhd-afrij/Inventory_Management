<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::with('supplier');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%")
                    ->orWhere('batch_number', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        $products = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($products, 200);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|in:Medicine,Injection,Consumable,Other',
            'brand' => 'required|string',
            'batch_number' => 'required|string|unique:products,batch_number',
            'expiry_date' => 'required|date|after_or_equal:today',
            'quantity' => 'required|integer|min:0',
            'unit_type' => 'required|in:pcs,ml,mg,bottles,boxes,strips',
            'purchase_price' => 'required|numeric|min:0',
            'selling_price' => 'required|numeric|min:0',
            'supplier_id' => 'required|exists:suppliers,id',
            'low_stock_threshold' => 'nullable|integer|min:1',
        ]);

        $product = Product::create($validated);

        return response()->json([
            'message' => 'Product created successfully.',
            'product' => $product->load('supplier'),
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $product = Product::with('supplier')->findOrFail($id);

        return response()->json([
            'product' => $product,
        ], 200);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|in:Medicine,Injection,Consumable,Other',
            'brand' => 'required|string',
            'batch_number' => 'required|string|unique:products,batch_number,' . $product->id,
            'expiry_date' => 'required|date|after_or_equal:today',
            'quantity' => 'required|integer|min:0',
            'unit_type' => 'required|in:pcs,ml,mg,bottles,boxes,strips',
            'purchase_price' => 'required|numeric|min:0',
            'selling_price' => 'required|numeric|min:0',
            'supplier_id' => 'required|exists:suppliers,id',
            'low_stock_threshold' => 'nullable|integer|min:1',
        ]);

        $product->update($validated);

        return response()->json([
            'message' => 'Product updated successfully.',
            'product' => $product->load('supplier'),
        ], 200);
    }

    public function destroy($id): JsonResponse
    {
        $product = Product::findOrFail($id);

        $hasMovements = StockMovement::where('product_id', $product->id)->exists();

        if ($hasMovements) {
            return response()->json([
                'message' => 'Cannot delete product. It has associated stock movements.',
            ], 409);
        }

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully.',
        ], 200);
    }

    public function lowStock(): JsonResponse
    {
        $products = Product::with('supplier')
            ->whereColumn('quantity', '<=', 'low_stock_threshold')
            ->orderBy('quantity', 'asc')
            ->get();

        return response()->json([
            'products' => $products,
        ], 200);
    }

    public function expired(): JsonResponse
    {
        $products = Product::with('supplier')
            ->where('expiry_date', '<', now()->toDateString())
            ->orderBy('expiry_date', 'asc')
            ->get();

        return response()->json([
            'products' => $products,
        ], 200);
    }
}
