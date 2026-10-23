<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LoginHistoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\SupplierController;
use App\Http\Middleware\AdminMiddleware;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Products
    Route::get('/products-low-stock', [ProductController::class, 'lowStock']);
    Route::get('/products-expired', [ProductController::class, 'expired']);
    Route::apiResource('products', ProductController::class);

    // Stock Movements
    Route::get('/stock-movements', [StockController::class, 'index']);
    Route::post('/stock-in', [StockController::class, 'stockIn']);
    Route::post('/stock-out', [StockController::class, 'stockOut']);
    Route::get('/stock-summary', [StockController::class, 'movementSummary']);

    // Suppliers
    Route::apiResource('suppliers', SupplierController::class);

    // Reports
    Route::get('/reports/stock', [ReportController::class, 'stockReport']);
    Route::get('/reports/expiry', [ReportController::class, 'expiryReport']);
    Route::get('/reports/usage', [ReportController::class, 'usageReport']);
    Route::get('/reports/daily-movement', [ReportController::class, 'dailyMovementReport']);

    // Admin only routes
    Route::middleware(AdminMiddleware::class)->group(function () {
        Route::get('/login-history', [LoginHistoryController::class, 'index']);
        Route::post('/register', [AuthController::class, 'register']);
    });
});
