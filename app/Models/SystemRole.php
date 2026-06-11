<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\User;

class SystemRole extends Model
{
    protected $table = 'system_roles';
    protected $fillable = ["name", "slug"];
    public $timestamps = false;

    public function users():HasMany {
        return $this->hasMany(User::class, "role_id", "id");
    }

}
