<?php
namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

//* Modelos
use App\Models\SystemRole;

//* Enums
use App\Enums\RoleSystem as EnumRole;

class SystemRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $enumRoles = EnumRole::values();

        foreach($enumRoles as $role){
            SystemRole::firstOrCreate(["name" => $role, "slug" => $role]);
        }
    }
}
