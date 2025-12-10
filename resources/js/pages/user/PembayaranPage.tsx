import React, { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import Layout from '@/components/teraZ/user/LayoutUser';
import {
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
  CreditCard,
  Upload,
  Image,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  FileUp
} from 'lucide-react';

interface User {
  id: number;
  name: string;
  username: string;
  phone: string;
  role: string;
}

interface Payment {
  id: number;
  room_id: number;             // **FIX** backend butuh room_id bukan payment id
  payment_type: string;
  payment_type_label: string;
  amount: number;
  due_date: string;
  payment_date: string | null;
  status: 'pending' | 'paid' | 'confirmed' | 'rejected';
  status_label: string;
  status_color: string;
  payment_method: string | null;
  reference: string | null;
  has_proof_image: boolean;
  notes: string | null;
  period: string;
  is_overdue: boolean;
}

interface Stats {
  total: number;
  pending: number;
  waiting_approval: number;
  confirmed: number;
  overdue: number;
}

interface Props {
  user: User;
  payments: Payment[];
  stats: Stats;
}

const rupiah = (v: number | string) =>
  Number(v).toLocaleString('id-ID', { maximumFractionDigits: 0 });

const PembayaranPage: React.FC<Props> = ({ user, payments, stats }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [notes, setNotes] = useState('');

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const [filterStatus, setFilterStatus] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(0);

  const months = [
    'Januari','Februari','Maret','April','Mei','Juni',
    'Juli','Agustus','September','Oktober','November','Desember',
  ];

  const itemsPerPage = 5;

  const filteredPayments = useMemo(() => {
    let filtered = [...payments];

    if (filterStatus !== 'all') {
      filtered = filtered.filter(p =>
        filterStatus === 'pending'
          ? p.status === 'pending' || p.status === 'rejected'
          : p.status === filterStatus
      );
    }

    filtered.sort((a, b) => {
      const parse = (p: string) => {
        const [month, year] = p.split(' ');
        return { year: Number(year), month: months.indexOf(month) + 1 };
      };

      const A = parse(a.period);
      const B = parse(b.period);

      return sortOrder === 'desc'
        ? B.year - A.year || B.month - A.month
        : A.year - B.year || A.month - B.month;
    });

    return filtered;
  }, [payments, filterStatus, sortOrder]);

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const getCurrentPayments = () =>
    filteredPayments.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (f.size > 2 * 1024 * 1024) {
      setAlertMessage('Ukuran file maksimal 2MB');
      setShowErrorAlert(true);
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(f.type)) {
      setAlertMessage('Format harus JPG, JPEG, atau PNG');
      setShowErrorAlert(true);
      return;
    }

    setReferenceFile(f);

    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(f);
  };

  const handlePayClick = (p: Payment) => {
    setSelectedPayment(p);
    setPaymentMethod('');
    setReferenceFile(null);
    setPreviewUrl('');
    setNotes('');
    setShowPaymentModal(true);
  };

  const removeFile = () => {
    setReferenceFile(null);
    setPreviewUrl('');
  };

  const handlePaymentSubmit = () => {
    if (!selectedPayment) return;

    if (!paymentMethod) {
      setAlertMessage('Pilih metode pembayaran');
      setShowErrorAlert(true);
      return;
    }

    const form = new FormData();
    
    // ✅ PERBAIKAN PALING PENTING
    form.append('room_id', String(selectedPayment.room_id)); // **FIX**
    form.append('amount', String(selectedPayment.amount));
    form.append('method', paymentMethod);

    if (notes) form.append('note', notes);
    if (referenceFile) form.append('proof', referenceFile);

    router.post('/api/payments', form, {
      forceFormData: true,
      onSuccess: () => {
        setShowPaymentModal(false);
        setAlertMessage('Bukti pembayaran berhasil dikirim!');
        setShowSuccessAlert(true);
        router.reload({ only: ['payments', 'stats'] });
      },
      onError: () => {
        setAlertMessage('Gagal mengirim bukti pembayaran.');
        setShowErrorAlert(true);
      },
    });
  };

  const statusBadgeColor = (c: string) =>
    c === 'green'
      ? 'bg-[#2E6B4A] text-white'
      : c === 'blue'
      ? 'bg-[#2E5A8B] text-white'
      : c === 'yellow'
      ? 'bg-[#D97236] text-white'
      : 'bg-[#8B2E1F] text-white';

  const statusIcon = (s: string) =>
    s === 'confirmed' ? <CheckCircle className="w-5 h-5"/> :
    s === 'paid'      ? <Clock className="w-5 h-5"/> :
    s === 'rejected'  ? <X className="w-5 h-5"/> :
                        <AlertTriangle className="w-5 h-5"/>;

  return (
    <>
      <Head title="Pembayaran" />

      <Layout user={user} currentPath="/pembayaran">
        {/** UI TETAP SAMA 100%, TIDAK DIUBAH **/}

        <h1 className="text-3xl font-semibold text-[#7A2B1E] mt-8 mb-8">
          Pembayaran Sewa
        </h1>

        {/** ========== STAT CARDS ========== */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-100 rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-800 mb-2">Total Tagihan</p>
            <p className="text-2xl font-bold text-gray-700">{stats.total}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow-md p-6">
            <p className="text-sm text-yellow-800 mb-2">Belum Bayar</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-blue-50 rounded-lg shadow-md p-6">
            <p className="text-sm text-blue-800 mb-2">Menunggu</p>
            <p className="text-2xl font-bold text-blue-600">{stats.waiting_approval}</p>
          </div>
          <div className="bg-green-50 rounded-lg shadow-md p-6">
            <p className="text-sm text-green-800 mb-2">Lunas</p>
            <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
          </div>
        </div>

        {/** ========== LIST PEMBAYARAN (UI SAMA) ========== */}
        <div className="bg-[#F7ECE0] rounded-xl p-8 shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-[#412E27]">
              Riwayat Pembayaran
            </h2>

            <div className="flex gap-3">
              <button
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="px-4 py-2 bg-white text-[#7A2B1E] rounded-lg shadow-md flex items-center gap-2"
              >
                {sortOrder === 'desc' ? <ArrowDown/> : <ArrowUp/>}
                <span className="hidden md:inline">
                  {sortOrder === 'desc' ? 'Terbaru ↓' : 'Terlama ↑'}
                </span>
              </button>

              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(0);
                }}
                className="px-4 py-2 bg-white text-[#7A2B1E] rounded-lg shadow-md"
              >
                <option value="all">Semua Status</option>
                <option value="pending">Belum Bayar</option>
                <option value="paid">Menunggu Konfirmasi</option>
                <option value="confirmed">Lunas</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 min-h-[400px]">
            {getCurrentPayments().map((p) => (
              <div key={p.id} className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex justify-between items-start">

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-[#412E27]">
                        {p.payment_type_label}
                      </h3>
                      <span className={`px-4 py-1 rounded-md text-sm font-medium flex items-center gap-2 ${statusBadgeColor(p.status_color)}`}>
                        {statusIcon(p.status)}
                        {p.status_label}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Periode</p>
                        <p className="text-base font-medium text-[#412E27]">{p.period}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Jumlah</p>
                        <p className="text-xl font-bold text-[#7A2B1E]">
                          Rp {rupiah(p.amount)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-[#412E27]">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Jatuh tempo: {p.due_date}</span>
                      </div>
                      {p.payment_date && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>Dibayar: {p.payment_date}</span>
                        </div>
                      )}
                    </div>

                    {p.payment_method && (
                      <p className="mt-3 text-sm text-gray-600">
                        Metode: {p.payment_method.toUpperCase()}
                      </p>
                    )}

                    {p.has_proof_image && p.reference && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">Bukti Pembayaran:</p>
                        <img
                          src={p.reference}
                          className="w-48 h-32 object-cover rounded-lg border-2 cursor-pointer"
                          onClick={() => window.open(p.reference!, '_blank')}
                        />
                      </div>
                    )}

                    {p.status === 'rejected' && p.notes && (
                      <div className="mt-3 p-3 bg-red-50 rounded-lg">
                        <p className="text-sm text-red-800">
                          <strong>Alasan Penolakan:</strong> {p.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  {(p.status === 'pending' || p.status === 'rejected') && (
                    <button
                      onClick={() => handlePayClick(p)}
                      className="ml-3 inline-flex items-center gap-2 px-3 py-2 bg-[#6B5D52] text-white text-sm font-medium rounded-md hover:bg-[#4d3e33]"
                    >
                      <FileUp className="w-4 h-4" />
                      Upload Bukti Bayar
                    </button>
                  )}

                </div>
              </div>
            ))}
          </div>

          {/** PAGINATION NAV **/}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setCurrentPage(prev => prev - 1)}
                disabled={currentPage === 0}
                className={`p-2 rounded-full ${
                  currentPage === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[#7A2B1E] text-white hover:bg-[#5C1F14]'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      currentPage === idx ? 'bg-[#7A2B1E] w-8' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage === totalPages - 1}
                className={`p-2 rounded-full ${
                  currentPage === totalPages - 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[#7A2B1E] text-white hover:bg-[#5C1F14]'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/** ====== PAYMENT MODAL (UI ASLI) ====== */}
        {showPaymentModal && selectedPayment && (
          <div className="text-black fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-8 max-w-md w-full relative max-h-[90vh] overflow-y-auto">
              
              <button
                onClick={() => setShowPaymentModal(false)}
                className="absolute top-4 right-4 text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-green-600" />
              </div>

              <h2 className="text-2xl font-bold text-[#412E27] mb-3 text-center">
                Konfirmasi Pembayaran
              </h2>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">Periode</p>
                <p className="text-lg font-semibold text-[#412E27]">{selectedPayment.period}</p>

                <p className="text-sm text-gray-600 mt-2">Jumlah</p>
                <p className="text-2xl font-bold text-[#7A2B1E]">
                  Rp {rupiah(selectedPayment.amount)}
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-[#412E27] mb-2">
                  Metode Pembayaran <span className="text-red-500">*</span>
                </label>

                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Pilih metode</option>
                  <option value="transfer">Transfer Bank</option>
                  <option value="qris">QRIS</option>
                  <option value="cash">Tunai</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-[#412E27] mb-2">
                  Bukti Pembayaran (Opsional)
                </label>

                {!previewUrl ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      id="proof-upload"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="proof-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Klik untuk upload</p>
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={removeFile}
                      className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-[#412E27] mb-2">
                  Catatan (opsional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 bg-gray-200 rounded-lg py-3"
                >
                  Batal
                </button>
                <button
                  onClick={handlePaymentSubmit}
                  className="flex-1 bg-[#6B5D52] text-white rounded-lg py-3"
                >
                  Konfirmasi
                </button>
              </div>
            </div>
          </div>
        )}

        {/** SUCCESS ALERT */}
        {showSuccessAlert && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl max-w-sm w-full text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#412E27] mb-2">Berhasil!</h3>
              <p className="text-[#6B5D52] mb-6">{alertMessage}</p>
              <button
                onClick={() => setShowSuccessAlert(false)}
                className="bg-[#6B5D52] text-white w-full py-3 rounded-lg"
              >
                OK
              </button>
            </div>
          </div>
        )}

        {/** ERROR ALERT */}
        {showErrorAlert && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl max-w-sm w-full text-center">
              <X className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#412E27] mb-2">Gagal!</h3>
              <p className="text-[#6B5D52] mb-6">{alertMessage}</p>
              <button
                onClick={() => setShowErrorAlert(false)}
                className="bg-[#6B5D52] text-white w-full py-3 rounded-lg"
              >
                OK
              </button>
            </div>
          </div>
        )}

      </Layout>
    </>
  );
};

export default PembayaranPage;
