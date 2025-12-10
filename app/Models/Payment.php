<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'payment_type',
        'amount',
        'due_date',
        'payment_date',
        'status',
        'payment_method',
        'payment_proof',
        'reference',
        'notes',
        'period_month',
        'period_year',
        'paid_at',
        'last_notified_at',
    ];

    protected $appends = [
        'payment_proof_url',
        'status_label',
        'status_color',
        'period_name',
    ];

    protected $casts = [
        'amount'           => 'decimal:2',
        'due_date'         => 'date',
        'payment_date'     => 'date',
        'paid_at'          => 'datetime',
        'last_notified_at' => 'datetime',
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    // URL bukti pembayaran (Cloudinary)
    public function getPaymentProofUrlAttribute()
    {
        if ($this->reference && str_starts_with($this->reference, 'http')) {
            return $this->reference;
        }

        return null;
    }

    public function getStatusLabelAttribute()
    {
        return match ($this->status) {
            'pending'   => 'Belum Bayar',
            'paid'      => 'Menunggu Konfirmasi',
            'confirmed' => 'Lunas',
            'rejected'  => 'Ditolak',
            'overdue'   => 'Terlambat',
            default     => 'Tidak Diketahui',
        };
    }

    public function getStatusColorAttribute()
    {
        return match ($this->status) {
            'confirmed' => 'green',
            'paid'      => 'blue',
            'pending'   => 'yellow',
            'rejected'  => 'red',
            'overdue'   => 'red',
            default     => 'gray',
        };
    }

    public function getPeriodNameAttribute(): string
    {
        if (!$this->period_month || !$this->period_year) {
            return '-';
        }

        $months = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
            5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
            9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember',
        ];

        return $months[$this->period_month] . ' ' . $this->period_year;
    }

    public function scopeNeedReminder($query)
    {
        $today = Carbon::today();

        return $query->where('status', 'pending')
            ->whereDate('due_date', '<=', $today)
            ->where(function ($q) use ($today) {
                $q->whereNull('last_notified_at')
                    ->orWhereDate('last_notified_at', '<', $today);
            });
    }

    public function isOverdue(): bool
    {
        if (in_array($this->status, ['paid', 'confirmed'])) {
            return false;
        }

        return Carbon::parse($this->due_date)->isPast();
    }
}
