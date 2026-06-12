<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

//* Relaciones
use Illuminate\Database\Eloquent\Relations\BelongsTo;

//* Modelos
use App\Models\Announcement;

//* Enums
use App\Enums\UrlType;

class AnnouncementUrl extends Model
{
    protected $table = "announcement_urls";
    protected $fillable = [
        'announcement_id',
        'url',
        'label',
        'type'
    ];

    protected $casts = [
        "type" => UrlType::class
    ];

    public function announcement():BelongsTo {
        return $this->belongsTo(Announcement::class, 'announcement_id', 'id');
    }
}
