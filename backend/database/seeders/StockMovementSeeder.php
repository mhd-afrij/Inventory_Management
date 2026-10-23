<?php

namespace Database\Seeders;

use App\Models\StockMovement;
use Illuminate\Database\Seeder;

class StockMovementSeeder extends Seeder
{
    public function run(): void
    {
        $movements = [
            // Product 1 - Paracetamol
            ['product_id' => 1, 'type' => 'in', 'quantity' => 100, 'reference_number' => 'REF-2024-001', 'notes' => 'Initial stock purchase', 'performed_by' => 1],
            ['product_id' => 1, 'type' => 'in', 'quantity' => 100, 'reference_number' => 'REF-2024-002', 'notes' => 'Restocking from Ceylon Pharma', 'performed_by' => 1],
            ['product_id' => 1, 'type' => 'out', 'quantity' => 25, 'reference_number' => 'REF-2024-003', 'notes' => 'Dispensed to patients', 'performed_by' => 2],
            ['product_id' => 1, 'type' => 'out', 'quantity' => 20, 'reference_number' => 'REF-2024-004', 'notes' => 'Monthly dispensing', 'performed_by' => 2],

            // Product 2 - Amoxicillin
            ['product_id' => 2, 'type' => 'in', 'quantity' => 80, 'reference_number' => 'REF-2024-005', 'notes' => 'First order from Lanka Medical', 'performed_by' => 1],
            ['product_id' => 2, 'type' => 'in', 'quantity' => 70, 'reference_number' => 'REF-2024-006', 'notes' => 'Restock order', 'performed_by' => 1],
            ['product_id' => 2, 'type' => 'out', 'quantity' => 15, 'reference_number' => 'REF-2024-007', 'notes' => 'Doctor prescriptions', 'performed_by' => 2],

            // Product 3 - Cetirizine
            ['product_id' => 3, 'type' => 'in', 'quantity' => 50, 'reference_number' => 'REF-2024-008', 'notes' => 'Allergy season stock', 'performed_by' => 1],
            ['product_id' => 3, 'type' => 'out', 'quantity' => 10, 'reference_number' => 'REF-2024-009', 'notes' => 'Regular dispensing', 'performed_by' => 2],
            ['product_id' => 3, 'type' => 'out', 'quantity' => 8, 'reference_number' => 'REF-2024-010', 'notes' => 'Patient prescriptions', 'performed_by' => 2],

            // Product 4 - Omeprazole
            ['product_id' => 4, 'type' => 'in', 'quantity' => 10, 'reference_number' => 'REF-2024-011', 'notes' => 'Small batch from Royal Health', 'performed_by' => 1],
            ['product_id' => 4, 'type' => 'out', 'quantity' => 5, 'reference_number' => 'REF-2024-012', 'notes' => 'Emergency dispensing', 'performed_by' => 2],

            // Product 5 - Metformin
            ['product_id' => 5, 'type' => 'in', 'quantity' => 100, 'reference_number' => 'REF-2024-013', 'notes' => 'Diabetes medication stock', 'performed_by' => 1],
            ['product_id' => 5, 'type' => 'in', 'quantity' => 20, 'reference_number' => 'REF-2024-014', 'notes' => 'Additional order', 'performed_by' => 1],
            ['product_id' => 5, 'type' => 'out', 'quantity' => 10, 'reference_number' => 'REF-2024-015', 'notes' => 'Monthly diabetes patients', 'performed_by' => 2],

            // Product 6 - Ibuprofen
            ['product_id' => 6, 'type' => 'in', 'quantity' => 60, 'reference_number' => 'REF-2024-016', 'notes' => 'Pain relief stock', 'performed_by' => 1],
            ['product_id' => 6, 'type' => 'out', 'quantity' => 20, 'reference_number' => 'REF-2024-017', 'notes' => 'Patient dispensing', 'performed_by' => 2],
            ['product_id' => 6, 'type' => 'out', 'quantity' => 10, 'reference_number' => 'REF-2024-018', 'notes' => 'Regular usage', 'performed_by' => 2],

            // Product 7 - Azithromycin
            ['product_id' => 7, 'type' => 'in', 'quantity' => 40, 'reference_number' => 'REF-2024-019', 'notes' => 'Antibiotic stock', 'performed_by' => 1],
            ['product_id' => 7, 'type' => 'out', 'quantity' => 8, 'reference_number' => 'REF-2024-020', 'notes' => 'Prescription dispensing', 'performed_by' => 2],

            // Product 8 - Insulin
            ['product_id' => 8, 'type' => 'in', 'quantity' => 30, 'reference_number' => 'REF-2024-021', 'notes' => 'Critical medication restock', 'performed_by' => 1],
            ['product_id' => 8, 'type' => 'in', 'quantity' => 15, 'reference_number' => 'REF-2024-022', 'notes' => 'Additional insulin supply', 'performed_by' => 1],

            // Product 9 - Vitamin B12
            ['product_id' => 9, 'type' => 'in', 'quantity' => 50, 'reference_number' => 'REF-2024-023', 'notes' => 'Vitamin injection stock', 'performed_by' => 1],
            ['product_id' => 9, 'type' => 'out', 'quantity' => 10, 'reference_number' => 'REF-2024-024', 'notes' => 'Patient injections', 'performed_by' => 2],

            // Product 10 - Dexamethasone
            ['product_id' => 10, 'type' => 'in', 'quantity' => 20, 'reference_number' => 'REF-2024-025', 'notes' => 'Steroid injection stock', 'performed_by' => 1],
            ['product_id' => 10, 'type' => 'out', 'quantity' => 5, 'reference_number' => 'REF-2024-026', 'notes' => 'Emergency use', 'performed_by' => 1],

            // Product 11 - Syringes
            ['product_id' => 11, 'type' => 'in', 'quantity' => 300, 'reference_number' => 'REF-2024-027', 'notes' => 'Bulk syringe order', 'performed_by' => 1],
            ['product_id' => 11, 'type' => 'out', 'quantity' => 50, 'reference_number' => 'REF-2024-028', 'notes' => 'Monthly clinic usage', 'performed_by' => 2],
            ['product_id' => 11, 'type' => 'out', 'quantity' => 20, 'reference_number' => 'REF-2024-029', 'notes' => 'Injection supplies', 'performed_by' => 2],

            // Product 12 - Gloves
            ['product_id' => 12, 'type' => 'in', 'quantity' => 20, 'reference_number' => 'REF-2024-030', 'notes' => 'Safety equipment order', 'performed_by' => 1],
        ];

        foreach ($movements as $movement) {
            StockMovement::create($movement);
        }
    }
}
