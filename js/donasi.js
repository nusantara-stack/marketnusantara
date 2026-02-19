/*
  donasi.js - Fitur Generate QRIS Donasi Market Nusantara
  Terintegrasi dengan tema website utama.
*/

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject struktur HTML Modal ke dalam Body saat halaman dimuat
    const modalHTML = `
        <div id="donasi-modal-container" class="fixed inset-0 z-[120] opacity-0 pointer-events-none transition-opacity duration-300 flex items-center justify-center p-4">
            <!-- Backdrop Blur -->
            <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" id="donasi-backdrop"></div>
            
            <!-- Konten Modal -->
            <div class="relative bg-[var(--color-surface-1)] border border-[var(--color-cyan)]/30 rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.15)] w-full max-w-sm transform scale-95 transition-transform duration-300 p-6 flex flex-col items-center text-center overflow-hidden" id="donasi-modal-content">
                
                <!-- Efek Glow di background modal -->
                <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-24 bg-[var(--color-cyan)]/10 blur-2xl pointer-events-none"></div>

                <button id="close-donasi-btn" class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>

                <div class="p-3 bg-[var(--color-cyan)]/10 rounded-full border border-[var(--color-cyan)]/30 mb-4 z-10">
                    <svg class="w-8 h-8 text-[var(--color-cyan)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>

                <h2 class="text-2xl font-bold text-white mb-2 z-10">Dukung Server</h2>
                <p class="text-sm text-[var(--color-text-secondary)] mb-6 z-10">Bantu Market Nusantara terus berkembang dengan berdonasi untuk biaya server.</p>

                <!-- STEP 1: Input Nominal -->
                <div id="donasi-input-step" class="w-full z-10">
                    <div class="mb-4 text-left">
                        <label class="block text-[var(--color-cyan)] text-[10px] font-bold mb-2 tracking-widest uppercase">Nominal Donasi (Min. Rp 4.000)</label>
                        <div class="relative">
                            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rp</span>
                            <input type="number" id="donasi-amount" min="4000" class="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white font-semibold focus:outline-none focus:border-[var(--color-cyan)] focus:ring-1 focus:ring-[var(--color-cyan)] transition-all placeholder-gray-600" placeholder="10000">
                        </div>
                    </div>
                    <button id="btn-generate-qr" class="btn-shine w-full py-3 rounded-xl font-bold text-black shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:scale-105 transition-transform" style="background: var(--color-gradient-main);">
                        Buat QRIS Donasi
                    </button>
                </div>

                <!-- STEP 2: Loading Animasi -->
                <div id="donasi-loading-step" class="w-full hidden py-6 z-10">
                    <div class="w-12 h-12 border-4 border-[var(--color-cyan)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p class="text-[var(--color-cyan)] animate-pulse font-semibold">Mengamankan QRIS...</p>
                    <p class="text-xs text-gray-500 mt-2">Menghubungkan ke payment gateway</p>
                </div>

                <!-- STEP 3: Tampil QRIS -->
                <div id="donasi-qr-step" class="w-full hidden z-10 flex flex-col items-center">
                    <div class="bg-white p-2 rounded-xl inline-block mb-4 relative shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                        <!-- Gambar QR akan dimuat ke sini -->
                        <img id="qris-image" src="" alt="QRIS Donasi" class="w-48 h-48 object-contain">
                    </div>
                    
                    <p class="text-xs text-[var(--color-text-secondary)] uppercase tracking-widest font-bold">Total Donasi</p>
                    <p class="text-2xl font-black text-white mb-3" id="qris-total-amount">Rp 0</p>
                    
                    <div class="flex items-center gap-2 text-xs text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-lg mb-5">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>Berlaku 15 menit. Silakan scan di m-Banking/E-Wallet.</span>
                    </div>

                    <button id="btn-reset-donasi" class="text-sm text-gray-400 hover:text-white transition-colors border-b border-gray-600 hover:border-white pb-0.5">
                        Buat Donasi Baru
                    </button>
                </div>

                <!-- STEP 4: Sukses (Baru ditambahkan) -->
                <div id="donasi-success-step" class="w-full hidden z-10 flex flex-col items-center py-4">
                    <div class="w-20 h-20 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                        <svg class="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h3 class="text-2xl font-bold text-white mb-2">Donasi Berhasil!</h3>
                    <p class="text-sm text-gray-400 mb-6 text-center">Terima kasih banyak atas dukungan Anda untuk pengembangan Market Nusantara.</p>
                    <button id="btn-close-success" class="btn-shine w-full py-3 rounded-xl font-bold text-black" style="background: var(--color-cyan);">
                        Selesai
                    </button>
                </div>

            </div>
        </div>
    `;

    // Masukkan modal ke halaman
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // 2. Definisi Elemen & Setup Logika
    const btnBukaDonasi = document.getElementById('btn-buka-donasi');
    const modalContainer = document.getElementById('donasi-modal-container');
    const modalContent = document.getElementById('donasi-modal-content');
    const backdrop = document.getElementById('donasi-backdrop');
    const btnClose = document.getElementById('close-donasi-btn');
    
    const stepInput = document.getElementById('donasi-input-step');
    const stepLoading = document.getElementById('donasi-loading-step');
    const stepQR = document.getElementById('donasi-qr-step');
    const stepSuccess = document.getElementById('donasi-success-step');

    const inputAmount = document.getElementById('donasi-amount');
    const btnGenerate = document.getElementById('btn-generate-qr');
    const btnReset = document.getElementById('btn-reset-donasi');
    const btnCloseSuccess = document.getElementById('btn-close-success');

    const qrisImage = document.getElementById('qris-image');
    const qrisTotal = document.getElementById('qris-total-amount');

    // Kredensial Cashify
    const LICENSE_KEY = "cashify_afe70077e47a9927efb1543fb0be52a12df6ce250097a0b862f35ccef7d1c33e";
    const QRIS_ID = "fa8bceaf-dc9a-4478-b654-a7ec87afd682";
    let checkStatusInterval = null;

    // --- Helper: Warna Hex Acak ---
    const getRandomHexColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    // --- Kontrol Tampilan Modal ---
    const openModal = () => {
        modalContainer.classList.remove('opacity-0', 'pointer-events-none');
        modalContent.classList.remove('scale-95');
        resetModal();
        // Tutup sidebar mobile jika sedang terbuka saat klik donasi
        document.body.classList.remove('mobile-sidebar-open');
    };

    const closeModal = () => {
        modalContainer.classList.add('opacity-0', 'pointer-events-none');
        modalContent.classList.add('scale-95');
    };

    const resetModal = () => {
        stepInput.classList.remove('hidden');
        stepLoading.classList.add('hidden');
        stepQR.classList.add('hidden');
        if (stepSuccess) stepSuccess.classList.add('hidden');
        inputAmount.value = '';
        if (checkStatusInterval) clearInterval(checkStatusInterval);
    };

    // --- Event Listeners ---
    if(btnBukaDonasi) {
        btnBukaDonasi.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    }

    btnClose.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    btnReset.addEventListener('click', resetModal);
    if (btnCloseSuccess) btnCloseSuccess.addEventListener('click', closeModal);

    // Mencegah modal tertutup kalau konten di-klik
    modalContent.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // --- Logika Generate QR Code via Cashify API ---
    btnGenerate.addEventListener('click', async () => {
        const amount = parseInt(inputAmount.value);
        
        // Validasi input
        if (isNaN(amount) || amount < 4000) {
            alert("⚠️ Nominal donasi minimal adalah Rp 4.000");
            return;
        }

        // Tampilkan animasi loading
        stepInput.classList.add('hidden');
        stepLoading.classList.remove('hidden');

        try {
            // 1. Request Generate QR ke Cashify
            const response = await fetch('https://cashify.my.id/api/generate/v2/qris', {
                method: 'POST',
                headers: { 
                    'x-license-key': LICENSE_KEY, 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({
                    qr_id: QRIS_ID,
                    amount: amount,
                    useUniqueCode: true, 
                    packageIds: ["id.dana", "id.gopay.wallet", "com.telkom.indonesia.linkaja", "id.ovo", "com.shopee.id"],
                    expiredInMinutes: 15,
                    qrType: "dynamic",
                    paymentMethod: "qris",
                    useQris: true
                })
            });

            const res = await response.json();
            
            if (res.status !== 200) {
                throw new Error(res.message || "Gagal membuat QRIS");
            }

            const { transactionId, totalAmount, qr_string } = res.data;
            
            // 2. Generate Gambar QR (QuickChart)
            const randomColor = getRandomHexColor();
            const logoUrl = "https://i.postimg.cc/gjK5khcj/20260214-004901.png";
            const qrImageUrl = `https://quickchart.io/qr?text=${encodeURIComponent(qr_string)}&dark=%23${randomColor}&centerImageUrl=${encodeURIComponent(logoUrl)}&centerImageSize=0.2&size=500&ecLevel=H`;

            // Update UI dengan QR dan Total
            qrisImage.src = qrImageUrl;
            qrisTotal.textContent = `Rp ${totalAmount.toLocaleString('id-ID')}`;

            // Pindah ke step tampilan QR
            stepLoading.classList.add('hidden');
            stepQR.classList.remove('hidden');

            // 3. Polling Cek Status Pembayaran (Setiap 8 detik)
            let isPaid = false;
            checkStatusInterval = setInterval(async () => {
                try {
                    const checkReq = await fetch('https://cashify.my.id/api/generate/check-status', {
                        method: 'POST',
                        headers: { 
                            'x-license-key': LICENSE_KEY, 
                            'Content-Type': 'application/json' 
                        },
                        body: JSON.stringify({ transactionId: transactionId })
                    });
                    
                    const checkRes = await checkReq.json();
                    const currentStatus = checkRes.data?.status;

                    if (currentStatus === "paid" || currentStatus === "success") {
                        if (isPaid) return; 
                        isPaid = true;
                        clearInterval(checkStatusInterval);

                        // Tampilkan UI Sukses
                        stepQR.classList.add('hidden');
                        stepSuccess.classList.remove('hidden');
                    }
                } catch (err) {
                    console.log("Polling error (diabaikan):", err);
                }
            }, 8000);

            // Auto stop polling setelah 15 menit (Expired QRIS)
            setTimeout(() => { 
                if (checkStatusInterval) clearInterval(checkStatusInterval); 
            }, 15 * 60 * 1000);

        } catch (error) {
            console.error("Cashify Error:", error);
            alert("Terjadi kesalahan teknis saat menghubungi server pembayaran. Silakan coba lagi nanti.");
            resetModal();
        }
    });
});
