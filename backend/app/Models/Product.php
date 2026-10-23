<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'brand',
        'batch_number',
        'expiry_date',
        'quantity',
        'unit_type',
        'purchase_price',
        'selling_price',
        'supplier_id',
        'low_stock_threshold',
    ];

    protected $casts = [
        'expiry_date' => 'date',
        'purchase_price' => 'decimal:2',
        'selling_price' => 'decimal:2',
        'quantity' => 'integer',
        'low_stock_threshold' => 'integer',
    ];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }

    public function isExpired(): bool
    {
        return $this->expiry_date->isPast();
    }

    public function isLowStock(): bool
    {
        return $this->quantity <= $this->low_stock_threshold;
    }
}
