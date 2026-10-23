<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Supplier::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%");
        }

        $suppliers = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($suppliers, 200);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact_number' => 'required|string',
            'email' => 'nullable|email',
            'address' => 'required|string',
        ]);

        $supplier = Supplier::create($validated);

        return response()->json([
            'message' => 'Supplier created successfully.',
            'supplier' => $supplier,
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $supplier = Supplier::withCount('products')->findOrFail($id);

        return response()->json([
            'supplier' => $supplier,
        ], 200);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $supplier = Supplier::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact_number' => 'required|string',
            'email' => 'nullable|email',
            'address' => 'required|string',
        ]);

        $supplier->update($validated);

        return response()->json([
            'message' => 'Supplier updated successfully.',
            'supplier' => $supplier,
        ], 200);
    }

    public function destroy($id): JsonResponse
    {
        $supplier = Supplier::findOrFail($id);

        if ($supplier->products()->exists()) {
            return response()->json([
                'message' => 'Cannot delete supplier. It has associated products.',
            ], 409);
        }

        $supplier->delete();

        return response()->json([
            'message' => 'Supplier deleted successfully.',
        ], 200);
    }
}
