<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\User;

use App\Enums\RoleSystem;

class SystemRole extends Model
{
    protected $table = 'system_roles';
    protected $fillable = ["name", "slug"];
    public $timestamps = false;

    public function users():HasMany {
        return $this->hasMany(User::class, "role_id", "id");
    }

    public static function getRoleId(RoleSystem $enumRole) {
        return self::where("slug", $enumRole->value)->value('id');
    }

}
