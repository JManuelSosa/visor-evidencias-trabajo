<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\Hash;

//* Modelos
use App\Models\User;
use App\Models\Person;

use App\Models\SystemRole;
use App\Enums\SystemRole as RoleEnum;
use Exception;

class RootSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rootEmail = env('ROOT_ADMIN_EMAIL');
        $rootPassword = env('ROOT_ADMIN_PASSWORD');

        if($rootEmail && $rootPassword){

            $rootRoleId = SystemRole::where('slug', RoleEnum::Root->value)->value('id');

            if(!$rootRoleId) throw new Exception("Rol root todavía no disponible en BD");

            $root = User::firstOrCreate(["email" => $rootEmail],[
                "password" => Hash::make($rootPassword),
                "role_id" => $rootRoleId
            ]);

            $root->markEmailAsVerified();

            $person = Person::firstOrCreate(["user_id" => $root->id],[
                "name" => "root",
                "paternal_last_name" => "the god of platform",
            ]);
        }
    }
}
