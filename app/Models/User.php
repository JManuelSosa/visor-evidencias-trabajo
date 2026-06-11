<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

//* Relaciones
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

//* Modelos
use App\Models\SystemRole;
use App\Models\Person;
use App\Models\WorkEvidence;
use App\Models\Zone;
use App\Models\Kindergarten;
use App\Models\Comment;
use App\Models\EvidenceStar;

//* Enums
use App\Enums\SystemRole as SystemRoleEnum;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $table = "users";

    protected $fillable = [
        'public_id',
        'email',
        'password',
        'role_id'
    ];

    protected $hidden = [
        'id',
        'password',
        'remember_token'
    ];
    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed'
        ];
    }

    public function role():BelongsTo {
        return $this->belongsTo(SystemRole::class, 'role_id', 'id');
    }

    public function person():HasOne {
        return $this->hasOne(Person::class, 'user_id', 'id');
    }

    public function zone():HasOne {
        return $this->hasOne(Zone::class, 'supervisor_id', 'id');
    }

    public function evidences():HasMany {
        return $this->hasMany(WorkEvidence::class, 'created_by', 'id');
    }

    public function kindergarten():HasOne {
        return $this->hasOne(Kindergarten::class, 'director_id', 'id');
    }

    public function comments():HasMany {
        return $this->hasMany(Comment::class, 'created_by', 'id');
    }

    public function stars():HasMany {
        return $this->hasMany(EvidenceStar::class, 'user_id', 'id');
    }

    public function hasRole(SystemRoleEnum $roleEnum):bool {
        return $this->role?->slug === $roleEnum->value;
    }
}
