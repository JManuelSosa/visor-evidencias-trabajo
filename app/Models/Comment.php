<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

//* Relaciones
use Illuminate\Database\Eloquent\Relations\BelongsTo;

//* Modelos
use App\Models\User;
use App\Models\WorkEvidence;

class Comment extends Model
{
    protected $table = 'comments';
    protected $fillable = ['content', 'created_by', 'evidence_id'];

    public function author():BelongsTo {
        return $this->belongsTo(User::class, "created_by", "id");
    }

    public function evidence():BelongsTo {
        return $this->belongsTo(WorkEvidence::class, "evidence_id", "id");
    }
}
