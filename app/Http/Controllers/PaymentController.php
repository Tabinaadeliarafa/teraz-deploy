<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Inertia\Inertia;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class PaymentController extends Controller
{
    /**
     * Display tenant's payment list
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $tenant = Tenant::where('user_id', $user->id)
            ->orWhere('nama', $user->name)
            ->orWhere('kontak', $user->phone)
            ->first();

        if (!$tenant) {
            return redirect()->route('dashboard')->with('error', 'Data tenant tidak ditemukan.');
        }

        $payments = Payment::where('tenant_id', $tenant->id)
            ->orderByDesc('period_year')
            ->orderByDesc('period_month')
            ->get()
            ->map(function ($payment) {
                $referenceUrl = $payment->reference; // sekarang berisi URL Cloudinary

                return [
                    'id'                 => $payment->id,
                    'payment_type'       => $payment->payment_type,
                    'payment_type_label' => $this->mapPaymentType($payment->payment_type),
                    'amount'             => $payment->amount,
                    'due_date'           => $payment->due_date->format('d M Y'),
                    'payment_date'       => $payment->payment_date?->format('d M Y'),
                    'status'             => $payment->status,
                    'status_label'       => $payment->status_label,
                    'status_color'       => $payment->status_color,
                    'payment_method'     => $payment->payment_method,
                    'reference'          => $referenceUrl,
                    'has_proof_image'    => (bool) $payment->reference,
                    'notes'              => $payment->notes,
                    'period'             => $payment->period_name,
                    'is_overdue'         => $payment->isOverdue(),
                ];
            });

        $stats = [
            'total'            => $payments->count(),
            'pending'          => $payments->where('status', 'pending')->count(),
            'waiting_approval' => $payments->where('status', 'paid')->count(),
            'confirmed'        => $payments->where('status', 'confirmed')->count(),
            'overdue'          => $payments->where('is_overdue', true)->count(),
        ];

        return Inertia::render('user/PembayaranPage', [
            'user' => [
                'id'       => $user->id,
                'name'     => $tenant->nama ?? $user->name,
                'username' => $user->username,
                'phone'    => $user->phone,
                'role'     => $user->role,
                'room'     => $tenant->room->nomor_kamar ?? null,
            ],
            'payments' => $payments,
            'stats'    => $stats,
        ]);
    }

    /**
     * Tenant mengisi / update detail pembayaran (bukan create tagihan)
     */
    public function confirm(Request $request)
    {
        $user = $request->user();

        $tenant = Tenant::where('user_id', $user->id)
            ->orWhere('nama', $user->name)
            ->orWhere('kontak', $user->phone)
            ->first();

        if (!$tenant) {
            return back()->with('error', 'Data tenant tidak ditemukan.');
        }

        // Terima beberapa kemungkinan nama field bukti bayar
        $validated = $request->validate([
            'payment_id'      => 'required|exists:payments,id',
            'payment_method'  => 'required|in:cash,transfer,qris',
            'reference'       => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
            'payment_proof'   => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
            'proof'           => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
            'notes'           => 'nullable|string|max:500',
        ]);

        $payment = Payment::findOrFail($validated['payment_id']);

        if ($payment->tenant_id !== $tenant->id) {
            return back()->with('error', 'Akses ditolak.');
        }

        if (!in_array($payment->status, ['pending', 'rejected'])) {
            return back()->with('error', 'Pembayaran ini sudah dikonfirmasi atau sedang diproses.');
        }

        // Cari file yang dikirim (apapun nama fieldnya)
        $file = $request->file('reference')
            ?? $request->file('payment_proof')
            ?? $request->file('proof');

        $referenceUrl = $payment->reference; // default: pakai yang lama kalau tidak upload baru

        if ($file) {
            // Upload ke Cloudinary
            $uploaded = Cloudinary::upload(
                $file->getRealPath(),
                ['folder' => 'payment_proofs']
            );

            $referenceUrl = $uploaded->getSecurePath();
        }

        // Update payment
        $payment->update([
            'status'         => 'paid',
            'payment_method' => $validated['payment_method'],
            'reference'      => $referenceUrl,
            'notes'          => $validated['notes'] ?? null,
            'payment_date'   => now(),
            'paid_at'        => now(),
        ]);

        return back()->with('success', 'Pembayaran berhasil dikonfirmasi. Menunggu verifikasi admin.');
    }

    /**
     * Map payment type to Indonesian label
     */
    private function mapPaymentType($type): string
    {
        return match ($type) {
            'rent'        => 'Sewa Bulanan',
            'deposit'     => 'Deposit',
            'utilities'   => 'Utilitas',
            'maintenance' => 'Maintenance',
            default       => 'Lainnya',
        };
    }
}
