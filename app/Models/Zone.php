<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

//* Modelos
use App\Models\User;
use App\Models\Kindergarten;

class Zone extends Model
{
    protected $table = "zones";
    protected $fillable = ["name", "supervisor_id"];
    public $timestamps = false;

    public function supervisor():BelongsTo {
        return $this->belongsTo(User::class, "supervisor_id", "id");
    }

    public function kindergartens():HasMany {
        return $this->hasMany(Kindergarten::class, 'zone_id', 'id');
    }
}
