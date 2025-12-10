<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class UserController extends Controller
{
    /**
     * Halaman profil tenant/user.
     */
    public function profile(Request $request)
    {
        $u = $request->user();

        // Cari tenant pakai user_id langsung (lebih aman)
        $tenant = Tenant::with('room')
            ->where('user_id', $u->id)
            ->latest('id')
            ->first();

        if (!$tenant) {
            return redirect()->route('dashboard')->with('error', 'Data tenant tidak ditemukan.');
        }

        $unpaidCount = $tenant->payments()
            ->where('status', 'pending')
            ->count();

        $unpaidMonths = $tenant->payments()
            ->where('status', 'pending')
            ->get()
            ->groupBy(function ($p) {
                return sprintf('%04d-%02d', $p->period_year, $p->period_month);
            })
            ->map(function ($items, $month) {
                return [
                    'month'     => $month,
                    'monthName' => Carbon::parse($month . '-01')->translatedFormat('F Y'),
                    'total'     => $items->sum('amount'),
                ];
            })
            ->values();

        $rejectedPayments = $tenant->payments()
            ->where('status', 'rejected')
            ->orderBy('period_year')
            ->orderBy('period_month')
            ->get()
            ->map(function ($p) {
                return [
                    'month'     => sprintf('%04d-%02d', $p->period_year, $p->period_month),
                    'monthName' => Carbon::create($p->period_year, $p->period_month, 1)->translatedFormat('F Y'),
                    'reason'    => $p->notes ?? 'Tidak ada alasan',
                ];
            });

        // Map data room
        $room = $tenant->room ? [
            'number'        => $tenant->room->nomor_kamar,
            'type'          => $tenant->room->tipe,
            'monthly_rent'  => $tenant->room->harga,
            'status'        => $tenant->room->status,
        ] : null;

        // Map data kontrak
        $contract = [
            'start_date'      => optional($tenant->tanggal_mulai)->format('Y-m-d'),
            'end_date'        => optional($tenant->tanggal_selesai)->format('Y-m-d'),
            'duration_months' => ($tenant->tanggal_mulai && $tenant->tanggal_selesai)
                ? \Illuminate\Support\Carbon::parse($tenant->tanggal_mulai)
                    ->diffInMonths(\Illuminate\Support\Carbon::parse($tenant->tanggal_selesai))
                : null,
            'status'          => $tenant->status,
            'note'            => $tenant->catatan,
        ];

        // Foto profil dengan cache busting (Cloudinary URL atau default)
        $profilePhoto = asset('teraZ/testi1.png');
        if ($tenant->profile_photo && str_starts_with($tenant->profile_photo, 'http')) {
            $profilePhoto = $tenant->profile_photo . '?v=' . strtotime($tenant->updated_at);
        }

        return Inertia::render('user/ProfilePage', [
            'user' => [
                'id'       => $u->id,
                'name'     => $tenant->nama ?? $u->name,
                'username' => $tenant->user?->email ?? $u->username,
                'phone'    => $tenant->kontak,
                'role'     => $u->role,
                'room'     => $tenant->room->nomor_kamar ?? null,
            ],
            'tenant' => [
                'id'            => $tenant->id,
                'profile_photo' => $profilePhoto,
            ],
            'room'            => $room,
            'contract'        => $contract,
            'unpaidCount'     => $unpaidCount,
            'unpaidMonths'    => $unpaidMonths,
            'rejectedPayments'=> $rejectedPayments,
        ]);
    }

    /**
     * Update profile photo (tenant yang sedang login)
     */
    public function updateProfilePhoto(Request $request)
    {
        $request->validate([
            'profile_photo' => 'required|image|mimes:jpeg,jpg,png|max:2048',
        ]);

        $tenant = Tenant::where('user_id', $request->user()->id)->firstOrFail();

        $uploaded = Cloudinary::upload(
            $request->file('profile_photo')->getRealPath(),
            ['folder' => 'profile_photos']
        );

        $tenant->update([
            'profile_photo' => $uploaded->getSecurePath(),
        ]);

        return back()->with('success', 'Foto profil berhasil diperbarui.');
    }


    /**
     * Dashboard admin.
     */
    public function adminDashboard(Request $request)
    {
        $u = $request->user();

        return Inertia::render('admin/DashboardAdminPage', [
            'user' => [
                'id'   => $u->id,
                'name' => $u->name,
            ],
        ]);
    }

    /**
     * API endpoint: Return user profile as JSON
     */
    public function me(Request $request)
    {
        $u = $request->user();

        $tenant = Tenant::with('room')
            ->where('user_id', $u->id)
            ->latest('id')
            ->first();

        $profilePhoto = asset('teraZ/testi1.png');
        if ($tenant && $tenant->profile_photo && str_starts_with($tenant->profile_photo, 'http')) {
            $profilePhoto = $tenant->profile_photo . '?v=' . strtotime($tenant->updated_at);
        }

        return response()->json([
            'user' => [
                'id'       => $u->id,
                'name'     => $u->name,
                'username' => $u->username,
                'phone'    => $u->phone,
                'role'     => $u->role,
            ],
            'tenant' => [
                'id'            => $tenant->id ?? null,
                'profile_photo' => $profilePhoto,
            ],
            'room' => $tenant && $tenant->room ? [
                'number'        => $tenant->room->nomor_kamar,
                'type'          => $tenant->room->tipe,
                'monthly_rent'  => $tenant->room->harga,
                'status'        => $tenant->room->status,
            ] : null,
            'contract' => $tenant ? [
                'start_date'      => optional($tenant->tanggal_mulai)->format('Y-m-d'),
                'end_date'        => optional($tenant->tanggal_selesai)->format('Y-m-d'),
                'duration_months' => ($tenant->tanggal_mulai && $tenant->tanggal_selesai)
                    ? \Illuminate\Support\Carbon::parse($tenant->tanggal_mulai)
                        ->diffInMonths(\Illuminate\Support\Carbon::parse($tenant->tanggal_selesai))
                    : null,
                'status'          => $tenant->status,
                'note'            => $tenant->catatan,
            ] : null,
        ]);
    }
}
