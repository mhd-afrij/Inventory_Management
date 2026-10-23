<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('category', ['Medicine', 'Injection', 'Consumable', 'Other']);
            $table->string('brand')->nullable();
            $table->string('batch_number')->nullable();
            $table->date('expiry_date');
            $table->integer('quantity')->default(0);
            $table->enum('unit_type', ['pcs', 'ml', 'mg', 'bottles', 'boxes', 'strips']);
            $table->decimal('purchase_price', 8, 2);
            $table->decimal('selling_price', 8, 2);
            $table->foreignId('supplier_id')->constrained('suppliers')->onDelete('cascade');
            $table->integer('low_stock_threshold')->default(10);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
