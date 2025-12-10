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

    // frontend akan menerima AUTO field ini
    protected $appends = ['profile_photo_url'];

    /**
     * Akses URL foto profil
     */
    public function getProfilePhotoUrlAttribute()
    {
        // Jika tidak punya foto → kirim null, nanti frontend handle fallback
        if (!$this->profile_photo) {
            return null;
        }

        // Jika sudah berupa URL Cloudinary → return langsung
        if (str_starts_with($this->profile_photo, 'http')) {
            return $this->profile_photo;
        }

        // fallback storage lokal (tidak akan dipakai di Railway)
        return asset('storage/' . $this->profile_photo);
    }

    // Relations
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
}
