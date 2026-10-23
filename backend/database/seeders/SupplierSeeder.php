<?php

namespace Database\Seeders;

use App\Models\Supplier;
use Illuminate\Database\Seeder;

class SupplierSeeder extends Seeder
{
    public function run(): void
    {
        $suppliers = [
            [
                'name' => 'Ceylon Pharma Distributors',
                'contact_number' => '+94112345678',
                'email' => 'info@ceylonpharma.lk',
                'address' => '45 Galle Road, Colombo 03, Sri Lanka',
            ],
            [
                'name' => 'Lanka Medical Supplies',
                'contact_number' => '+94112987654',
                'email' => 'sales@lankamedical.lk',
                'address' => '12 Station Road, Kandy, Sri Lanka',
            ],
            [
                'name' => 'Royal Health Distributors',
                'contact_number' => '+94112567890',
                'email' => 'orders@royalhealth.lk',
                'address' => '78 Main Street, Galle, Sri Lanka',
            ],
            [
                'name' => 'Island Pharmaceutical Ltd',
                'contact_number' => '+94112345012',
                'email' => 'contact@islandpharma.lk',
                'address' => '23 Temple Lane, Colombo 07, Sri Lanka',
            ],
            [
                'name' => 'MedSource International',
                'contact_number' => '+94112456789',
                'email' => 'info@medsource.lk',
                'address' => '56 Lake Drive, Colombo 08, Sri Lanka',
            ],
        ];

        foreach ($suppliers as $supplier) {
            Supplier::create($supplier);
        }
    }
}
