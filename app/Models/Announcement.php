<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

//* Modelos
use App\Models\User;
use App\Models\AnnouncementUrl;
use App\Models\File;

class Announcement extends Model
{
    protected $table = 'announcements';
    protected $fillable = [
        'title',
        'content',
        'created_by'
    ];

    public function author():BelongsTo {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }

    public function urls():HasMany {
        return $this->hasMany(AnnouncementUrl::class, 'announcement_id', 'id');
    }

    public function files():BelongsToMany {
        return $this->belongsToMany(File::class, 'announcement_files', 'announcement_id', 'file_id')->withTimestamps();
    }
}
