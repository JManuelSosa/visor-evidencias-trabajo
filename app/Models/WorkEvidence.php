<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

//* Relaciones
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

//* Modelos
use App\Models\User;
use App\Models\Kindergarten;
use App\Models\File;
use App\Models\Comment;
use App\Models\EvidenceStar;

class WorkEvidence extends Model
{
    protected $table = "work_evidence";
    protected $fillable = [
        "name",
        "description",
        "kindergarten_id",
        "created_by"
    ];

    public function author():BelongsTo {
        return $this->belongsTo(User::class, "created_by", "id");
    }

    public function kindergarten():BelongsTo {
        return $this->belongsTo(Kindergarten::class, "kindergarten_id", "id");
    }

    public function files():BelongsToMany {
        return $this->belongsToMany(File::class, 'evidence_files', 'evidence_id', 'file_id')
        ->withPivot(['id', 'name', 'description', 'created_by'])->withTimestamps();
    }

    public function comments():HasMany {
        return $this->hasMany(Comment::class, "evidence_id", "id");
    }

    public function stars():HasMany {
        return $this->hasMany(EvidenceStar::class, 'evidence_id', 'id');
    }
}
