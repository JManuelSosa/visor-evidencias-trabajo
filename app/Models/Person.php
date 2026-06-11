<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

//* Relaciones
use Illuminate\Database\Eloquent\Relations\BelongsTo;

//* Modelos
use App\Models\User;
use App\Models\File;


class Person extends Model
{
    protected $table = "people";
    protected $fillable = [
        'name',
        'paternal_last_name',
        'maternal_last_name',
        'phone',
        'user_id',
        'photo_id'
    ];

    public function user():BelongsTo {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function photo():BelongsTo {
        return $this->belongsTo(File::class, 'photo_id', 'id');
    }

    protected function fullName():Attribute {
        return Attribute::make(get:fn() => $this->getFullName());
    }

    protected function getFullName():string {
        $parts = [
            $this->name,
            $this->paternal_last_name,
            $this->maternal_last_name
        ];

        return implode(' ', array_filter($parts));
    }
}
