<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\Relation;

class Relationship extends Model
{
    use HasFactory;

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = true;

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'type' => 'string',
    ];

    /**
     * The model's default values for attributes.
     *
     * @var array
     */
    protected $attributes = [
        'type' => '',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'type',
    ];

    /**
     * Relationships
     */

    /**
     * Relationship modifier (scope) to exclude related models with certain IDs.
     *
     * @param  \Illuminate\Database\Eloquent\Relations\BelongsToMany  $relationship
     * @param  int|array|null  $excludeIDs
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    protected function maybeExclude($relationship, $excludeIDs = null): BelongsToMany
    {
        if (!empty($excludeIDs)) {
            $excludeIDs = is_array($excludeIDs) ? $excludeIDs : [$excludeIDs];
            $relationship->whereNotIn(
                $relationship->getQualifiedRelatedPivotKeyName(),
                $excludeIDs
            );
        }

        return $relationship;
    }

    /**
     * Parents
     */
    public function parents($excludeIDs = null): BelongsToMany
    {
        return $this->maybeExclude(
            $this->belongsToMany(User::class)->wherePivot('type', 'parent'),
            $excludeIDs
        );
    }

    /**
     * Children
     */
    public function children($excludeIDs = null): BelongsToMany
    {
        return $this->maybeExclude(
            $this->belongsToMany(User::class)->wherePivot('type', 'child'),
            $excludeIDs
        );
    }

    /**
     * Partners
     */
    public function partners($excludeIDs = null): BelongsToMany
    {
        return $this->maybeExclude(
            $this->belongsToMany(User::class)->wherePivot('type', 'partner'),
            $excludeIDs
        );
    }

    /**
     * Spouses
     */
    public function spouses($excludeIDs = null): BelongsToMany
    {
        return $this->maybeExclude(
            $this->belongsToMany(User::class)->wherePivot('type', 'spouse'),
            $excludeIDs
        );
    }
}
