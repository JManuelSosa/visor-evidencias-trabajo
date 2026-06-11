<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

//* Relaciones
use Illuminate\Database\Eloquent\Relations\BelongsTo;

//* Modelos
use App\Models\User;
use App\Models\WorkEvidence;

class EvidenceStar extends Model
{
    protected $table = 'evidence_stars';
    protected $primaryKey = null;
    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'evidence_id'
    ];

    const UPDATED_AT = null;

    public function user():BelongsTo {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function evidence():BelongsTo {
        return $this->belongsTo(WorkEvidence::class, 'evidence_id', 'id');
    }
}
