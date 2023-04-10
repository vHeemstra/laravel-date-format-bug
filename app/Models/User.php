<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'first_name',
        'first_names',
        'last_name',
        'initials',
        'gender',
        'date_of_birth',
        'date_of_death',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'first_name' => 'string',
        'first_names' => 'string',
        'last_name' => 'string',
        'initials' => 'string',
        'gender' => 'string',
        'date_of_birth' => 'date:d-m-Y',
        'date_of_death' => 'date:d-m-Y',
    ];

    /**
     * Relationships
     */
    public function relationships(): BelongsToMany
    {
        return $this->belongsToMany(Relationship::class)->withPivot('type');
    }

    // public function attendees()
    // {
    //   return $this->hasManyThrough(
    //     Attendee::class,
    //     OrderItem::class,
    //     'order_id',   // <-. *     Foreign key on the intermediate table...
    //     'id',         //   | | <-. Foreign key on the ending table...
    //     'id',         // --' |   | Local key on the starting table...
    //     'attendee_id' //     * --' Local key on the intermediate table...
    //   );
    //   return $this->hasOneThrough(
    //     Attendee::class,
    //     OrderItem::class,
    //     'order_id',   // <-. *     Foreign key on the intermediate table...
    //     'id',         //   | | <-. Foreign key on the ending table...
    //     'id',         // --' |   | Local key on the starting table...
    //     'attendee_id' //     * --' Local key on the intermediate table...
    //   );
    // }

    public function as_parent(): BelongsToMany
    {
        return $this->belongsToMany(Relationship::class)->wherePivot('type', 'parent');
    }

    public function as_child(): BelongsToMany
    {
        return $this->belongsToMany(Relationship::class)->wherePivot('type', 'child');
    }

    public function as_partner(): BelongsToMany
    {
        return $this->belongsToMany(Relationship::class)->wherePivot('type', 'partner');
    }

    public function as_spouse(): BelongsToMany
    {
        return $this->belongsToMany(Relationship::class)->wherePivot('type', 'spouse');
    }
}
