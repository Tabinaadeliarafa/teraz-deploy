<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tenant extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'room_id',
        'nama',
        'kontak',
        'profile_photo',
        'tanggal_mulai',
        'tanggal_selesai',
        'status',
        'catatan',
    ];

    protected $casts = [
        'tanggal_mulai'   => 'date',
        'tanggal_selesai' => 'date',
    ];

    protected $appends = [];

    // Untuk kebutuhan kalau nanti mau dipakai
    public function getProfilePhotoFullAttribute()
    {
        if ($this->profile_photo && str_starts_with($this->profile_photo, 'http')) {
            return $this->profile_photo;
        }

        return asset('teraZ/default-user.png');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function maintenanceRequests()
    {
        return $this->hasMany(MaintenanceRequest::class);
    }

    // Dipakai kalau butuh URL profile di frontend lain
    public function getProfilePhotoUrlAttribute()
    {
        if ($this->profile_photo && str_starts_with($this->profile_photo, 'http')) {
            return $this->profile_photo;
        }

        return asset('teraZ/testi1.png');
    }
}
