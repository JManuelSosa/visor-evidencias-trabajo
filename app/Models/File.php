<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

//* Relaciones
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

//* Modelos
use App\Models\Person;
use App\Models\User;
use App\Models\WorkEvidence;

//* Enums
use App\Enums\FileStatus;

//* Services
use App\Services\FileStorage\FilesR2Service;

class File extends Model
{
    protected $table = "files";

    protected $fillable = [
        'filename',
        'storage_path',
        'file_size_bytes',
        'mime_type',
        'file_type',
        'uploaded_by',
        'file_status',
    ];

    protected $casts = [
        'file_size_bytes' => 'integer',
        'uploaded_at' => 'datetime',
        'file_status' => FileStatus::class,
    ];

    public function person():HasOne {
        return $this->hasOne(Person::class, "photo_id", "id");
    }

    public function uploader():BelongsTo {
        return $this->belongsTo(User::class, "uploaded_by", "id");
    }

    public function evidences():BelongsToMany {
        return $this->belongsToMany(WorkEvidence::class, "evidence_files", "file_id", "evidence_id")
        ->withPivot(['id', 'name', 'description', 'created_by'])->withTimestamps();
    }

    protected function publicUrl():Attribute {
        return Attribute::make(get: fn() => app(FilesR2Service::class)->getPublicUrl($this->storage_path));
    }
}
