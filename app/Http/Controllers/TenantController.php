<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use App\Models\Room;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Support\Facades\Auth;

class TenantController extends Controller
{
    /**
     * Admin – Menampilkan semua penyewa
     */
    public function index()
    {
        $tenants = Tenant::with(['room', 'user'])->get()->map(function ($tenant) {
            return [
                'id' => $tenant->id,
                'name' => $tenant->nama,
                'username' => $tenant->user ? $tenant->user->email : $tenant->kontak,
                'phone' => $tenant->kontak,
                'roomNumber' => $tenant->room ? $tenant->room->nomor_kamar : '-',
                'status' => $this->mapPaymentStatus($tenant),

                // Foto Cloudinary
                'profile_photo_url' => $tenant->profile_photo_url,

                'start_date' => optional($tenant->tanggal_mulai)->format('Y-m-d'),
                'end_date'   => optional($tenant->tanggal_selesai)->format('Y-m-d'),
                'tenant_status' => $tenant->status,
            ];
        });

        $rooms = Room::where('status', 'tersedia')->get();

        return Inertia::render('admin/ManajemenPenghuniAdminPage', [
            'tenants' => $tenants,
            'availableRooms' => $rooms,
        ]);
    }

    /**
     * Admin – Tambah penyewa baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'kontak' => 'required|string|max:50',
            'email' => 'nullable|email|unique:users,email',
            'room_id' => 'required|exists:rooms,id',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after:tanggal_mulai',
            'catatan' => 'nullable|string',
        ]);

        // Jika email diberikan, buat akun user otomatis
        $userId = null;
        if (!empty($validated['email'])) {
            $user = User::create([
                'name' => $validated['nama'],
                'username' => $validated['nama'],
                'email' => $validated['email'],
                'role' => 'tenant',
                'password' => Hash::make('password123'),
            ]);
            $userId = $user->id;
        }

        // Buat tenant baru
        Tenant::create([
            'user_id' => $userId,
            'room_id' => $validated['room_id'],
            'nama' => $validated['nama'],
            'kontak' => $validated['kontak'],
            'tanggal_mulai' => $validated['tanggal_mulai'],
            'tanggal_selesai' => $validated['tanggal_selesai'],
            'status' => 'aktif',
            'catatan' => $validated['catatan'] ?? null,
        ]);

        // Update status kamar
        Room::where('id', $validated['room_id'])->update(['status' => 'terisi']);

        return redirect()->back()->with('success', 'Tenant added successfully.');
    }

    /**
     * Admin – Show detail penyewa
     */
    public function show($id)
    {
        $tenant = Tenant::with(['room', 'user', 'payments'])->findOrFail($id);

        return response()->json([
            'tenant' => $tenant,
            'payment_history' => $tenant->payments()->orderBy('created_at', 'desc')->get(),
        ]);
    }

    /**
     * Admin – Update data penyewa
     */
    public function update(Request $request, $id)
    {
        $tenant = Tenant::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'nullable|string|max:255',
            'phone' => 'required|string|max:50',
            'status' => 'required|in:Lunas,Terlambat,Menunggu',
        ]);

        // Update tenant
        $tenant->update([
            'nama' => $validated['name'],
            'kontak' => $validated['phone'],
        ]);

        // Jika dia punya akun user → update juga
        if ($tenant->user) {
            $tenant->user->update([
                'name' => $validated['name'],
            ]);
        }

        return redirect()->back()->with('success', 'Tenant updated successfully.');
    }

    /**
     * User – Halaman profil penyewa
     */
    public function profile()
    {
        $user = auth()->user();
        $tenant = Tenant::where('user_id', $user->id)->firstOrFail();

        return Inertia::render('user/ProfilePage', [
            'user' => $user,
            'tenant' => [
                'id' => $tenant->id,
                'profile_photo_url' => $tenant->profile_photo_url,
                'updated_at' => $tenant->updated_at,
                'room' => $tenant->room,
            ],
        ]);
    }

    /**
     * User – Update foto profil (Cloudinary)
     */
    public function updateProfilePhoto(Request $request)
    {
        $request->validate([
            'profile_photo' => 'required|image|mimes:jpeg,png,jpg|max:4096',
        ]);

        $user = Auth::user();
        $tenant = Tenant::where('user_id', $user->id)->firstOrFail();

        // Hapus foto lama jika Cloudinary URL
        if ($tenant->profile_photo && str_starts_with($tenant->profile_photo, 'http')) {
            $publicId = pathinfo(parse_url($tenant->profile_photo, PHP_URL_PATH), PATHINFO_FILENAME);
            Cloudinary::destroy("profile_photos/" . $publicId);
        }

        // Upload baru
        $uploaded = Cloudinary::upload(
            $request->file('profile_photo')->getRealPath(),
            ['folder' => 'profile_photos']
        );

        $tenant->update([
            'profile_photo' => $uploaded->getSecurePath(),
            'updated_at' => now(),
        ]);

        return back()->with('success', 'Foto profil berhasil diperbarui.');
    }

    /**
     * Admin – Update foto penyewa tertentu
     */
    public function updatePhotoById(Request $request, $id)
    {
        $tenant = Tenant::findOrFail($id);

        $request->validate([
            'profile_photo' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        // Hapus jika storage lokal (jika masih ada sisa)
        if (
            $tenant->profile_photo &&
            !str_starts_with($tenant->profile_photo, 'http') &&
            Storage::disk('public')->exists($tenant->profile_photo)
        ) {
            Storage::disk('public')->delete($tenant->profile_photo);
        }

        // Upload Cloudinary
        $uploaded = Cloudinary::upload(
            $request->file('profile_photo_url')->getRealPath(),
            ['folder' => 'profile_photos_url']
        );

        $tenant->update([
            'profile_photo' => $uploaded->getSecurePath(),
            'updated_at' => now(),
        ]);

        return back()->with('success', 'Foto profil tenant berhasil diperbarui.');
    }

    /**
     * Admin – Hapus penyewa
     */
    public function destroy($id)
    {
        $tenant = Tenant::findOrFail($id);

        $roomId = $tenant->room_id;

        // Hapus foto jika Cloudinary
        if ($tenant->profile_photo && str_starts_with($tenant->profile_photo, 'http')) {
            $publicId = pathinfo(parse_url($tenant->profile_photo, PHP_URL_PATH), PATHINFO_FILENAME);
            Cloudinary::destroy("profile_photos/" . $publicId);
        }

        $tenant->delete();

        // Cek apakah kamar bisa dikembalikan ke "tersedia"
        $stillActive = Tenant::where('room_id', $roomId)->where('status', 'aktif')->exists();
        if (!$stillActive) {
            Room::where('id', $roomId)->update(['status' => 'tersedia']);
        }

        return redirect()->back()->with('success', 'Tenant removed successfully.');
    }

    /**
     * Payment status logic
     */
    private function mapPaymentStatus($tenant)
    {
        if ($tenant->payments()->where('status', 'overdue')->exists()) {
            return 'Terlambat';
        }

        if ($tenant->payments()->where('status', 'pending')->exists()) {
            return 'Menunggu';
        }

        return 'Lunas';
    }
}
