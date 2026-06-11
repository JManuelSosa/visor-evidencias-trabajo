<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

//* Relaciones
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
//* Modelos
use App\Models\User;
use App\Models\Zone;
use App\Models\WorkEvidence;


class Kindergarten extends Model
{
    protected $table = "kindergartens";
    protected $fillable = ["name", "cct", "zone_id", "director_id"];
    public $timestamps = false;

    public function director():BelongsTo {
        return $this->belongsTo(User::class, 'director_id', 'id');
    }

    public function zone():BelongsTo {
        return $this->belongsTo(Zone::class, 'zone_id', 'id');
    }

    public function evidences():HasMany {
        return $this->hasMany(WorkEvidence::class, 'kindergarten_id', 'id');
    }
}
