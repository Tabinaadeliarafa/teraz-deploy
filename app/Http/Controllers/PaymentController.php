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
        $request->validate([
            'payment_id' => 'required|exists:payments,id',
            'payment_method' => 'required|in:cash,transfer,qris',
            'reference' => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
            'notes' => 'nullable|string|max:500',
        ]);

        $tenant = Tenant::where('user_id', $request->user()->id)->firstOrFail();

        $payment = Payment::findOrFail($request->payment_id);

        if ($payment->tenant_id !== $tenant->id) {
            return back()->with('error', 'Akses ditolak.');
        }

        $referenceUrl = null;

        if ($request->hasFile('reference')) {
            $uploaded = Cloudinary::upload(
                $request->file('reference')->getRealPath(),
                ['folder' => 'payment_proofs']
            );

            $referenceUrl = $uploaded->getSecurePath();
        }

        $payment->update([
            'status' => 'paid',
            'payment_method' => $request->payment_method,
            'reference' => $referenceUrl,
            'notes' => $request->notes,
            'payment_date' => now(),
            'paid_at' => now(),
        ]);

        return back()->with('success', 'Pembayaran berhasil dikonfirmasi.');
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
