<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Payment;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class PaymentController extends Controller
{
    /**
     * GET /api/payments
     * Tenant melihat semua tagihan/pembayaran miliknya
     */
   public function index()
    {
        $tenantId = Auth::user()->id;

        $payments = Payment::where('tenant_id', $tenantId)
            ->orderBy('due_date', 'desc')
            ->get()
            ->map(function ($p) {
                return [
                    'id'           => $p->id,
                    'room_id'      => $p->room_id,
                    'amount'       => $p->amount,
                    'method'       => $p->method,
                    'note'         => $p->note,
                    'status'       => $p->status,
                    'period_year'  => $p->period_year,
                    'period_month' => $p->period_month,
                    'due_date'     => $p->due_date,
                    'created_at'   => $p->created_at,
                    'updated_at'   => $p->updated_at,

                    // ⭐ Tambahan penting
                    'proof_url'    => $p->proof_url,
                ];
            });

        return response()->json($payments);
    }

    /**
     * POST /api/payments
     * Tenant membuat pembayaran / unggah bukti
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_id' => 'required|integer|exists:rooms,id',
            'amount'  => 'required|numeric|min:0',
            'method'  => 'required|string',
            'proof'   => 'nullable|image|mimes:jpeg,png,jpg|max:4096',
            'note'    => 'nullable|string',
        ]);

        $tenantId = Auth::user()->id;

        $proofUrl = null;

        // ✅ UPLOAD KE CLOUDINARY
        if ($request->hasFile('proof')) {
            $uploaded = Cloudinary::upload(
                $request->file('proof')->getRealPath(),
                ['folder' => 'payment_proofs']
            );
            $proofUrl = $uploaded->getSecurePath();
        }

        $payment = Payment::create([
            'tenant_id'    => $tenantId,
            'room_id'      => $validated['room_id'],
            'period_year'  => date('Y'),
            'period_month' => date('m'),
            'due_date'     => now()->endOfMonth(),
            'amount'       => $validated['amount'],
            'method'       => $validated['method'],
            'proof_path'   => $proofUrl, // ✅ URL Cloudinary
            'note'         => $validated['note'] ?? null,
            'status'       => 'pending',
        ]);

        return response()->json([
            'message' => 'Pembayaran berhasil dibuat',
            'payment' => $payment
        ], 201);
    }
}
