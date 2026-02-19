document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. INJEKSI HTML MODAL DONASI KE DALAM BODY
    // ==========================================
    const modalHTML = `
        <div id="donasi-modal-container" class="fixed inset-0 z-[120] hidden flex items-center justify-center p-4">
            <!-- Backdrop -->
            <div id="donasi-modal-backdrop" class="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"></div>
            
            <!-- Modal Content -->
            <div id="donasi-modal-content" class="relative bg-[#0f1115] border border-cyan-500/30 rounded-2xl w-full max-w-md shadow-[0_0_40px_rgba(34,211,238,0.15)] overflow-hidden transform transition-all">
                
                <!-- Header -->
                <div class="flex items-center justify-between p-5 border-b border-white/10 bg-white/5">
                    <h2 class="text-xl font-bold text-white flex items-center gap-2">
                        <svg class="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Donasi Server
                    </h2>
                    <button id="btn-close-donasi" class="text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-1.5 rounded-lg">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <div class="p-6">
                    <!-- STEP 1: Input Nominal -->
                    <div id="donasi-input-step" class="w-full">
                        <p class="text-sm text-gray-400 mb-4 text-center">Dukung terus perkembangan Market Nusantara. Donasi Anda sangat berarti untuk biaya operasional server.</p>
                        
                        <div class="relative mb-6">
                            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rp</span>
                            <input type="number" id="donasi-amount" class="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white font-bold text-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder-gray-600" placeholder="Masukkan nominal...">
                        </div>
                        
                        <div class="grid grid-cols-3 gap-3 mb-6">
                            <button class="btn-nominal border border-white/10 bg-white/5 hover:bg-cyan-500/20 hover:border-cyan-500/50 text-white py-2 rounded-lg text-sm font-semibold transition-colors" data-amount="10000">10K</button>
                            <button class="btn-nominal border border-white/10 bg-white/5 hover:bg-cyan-500/20 hover:border-cyan-500/50 text-white py-2 rounded-lg text-sm font-semibold transition-colors" data-amount="20000">20K</button>
                            <button class="btn-nominal border border-white/10 bg-white/5 hover:bg-cyan-500/20 hover:border-cyan-500/50 text-white py-2 rounded-lg text-sm font-semibold transition-colors" data-amount="50000">50K</button>
                        </div>

                        <button id="btn-generate-qr" class="w-full py-3 rounded-xl font-bold text-black uppercase tracking-wider relative overflow-hidden group" style="background: linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%);">
                            <span class="relative z-10 flex items-center justify-center gap-2">
                                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                                Generate QRIS
                            </span>
                        </button>
                    </div>

                    <!-- STEP 2: Loading Animasi -->
                    <div id="donasi-loading-step" class="w-full hidden flex flex-col items-center justify-center py-8">
                        <div class="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
                        <p class="text-cyan-400 font-semibold animate-pulse">Membuat QRIS Dinamis...</p>
                        <p class="text-xs text-gray-500 mt-2">Mohon tunggu sebentar</p>
                    </div>

                    <!-- STEP 3: Tampil QR Code -->
                    <div id="donasi-qr-step" class="w-full hidden flex flex-col items-center">
                        <div class="bg-white p-3 rounded-xl mb-4 relative shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                            <img id="qris-image" src="" alt="QRIS Code" class="w-48 h-48 object-contain">
                        </div>
                        
                        <p class="text-sm text-gray-400 mb-1">Total Donasi</p>
                        <h3 id="qris-total-amount" class="text-3xl font-black text-cyan-400 mb-4 tracking-tight">Rp 0</h3>
                        
                        <div class="w-full flex items-center gap-3 text-xs text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 px-4 py-3 rounded-lg mb-6 text-center justify-center">
                            <span>Scan menggunakan aplikasi E-Wallet/M-Banking Anda.</span>
                        </div>

                        <button id="btn-konfirmasi-wa" class="w-full py-3 mb-3 rounded-xl font-bold text-white flex items-center justify-center gap-2" style="background: #25D366; hover:bg-[#128C7E]; transition: background 0.3s;">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.487 5.235 3.487 8.413.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.269.655 4.502 1.908 6.387l-.473 1.724 1.743-.459z"/></svg>
                            Saya Sudah Bayar (Konfirmasi WA)
                        </button>

                        <button id="btn-reset-donasi" class="text-sm text-gray-400 hover:text-white transition-colors border-b border-gray-600 hover:border-white pb-0.5">
                            Kembali
                        </button>
                    </div>

                </div>
            </div>
        </div>
    `;

    // Masukkan modal ke body HTML
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // ==========================================
    // 2. AMBIL ELEMEN DOM
    // ==========================================
    const btnBuka = document.getElementById('btn-buka-donasi');
    const modalContainer = document.getElementById('donasi-modal-container');
    const backdrop = document.getElementById('donasi-modal-backdrop');
    const btnClose = document.getElementById('btn-close-donasi');
    
    const stepInput = document.getElementById('donasi-input-step');
    const stepLoading = document.getElementById('donasi-loading-step');
    const stepQR = document.getElementById('donasi-qr-step');

    const inputAmount = document.getElementById('donasi-amount');
    const btnGenerate = document.getElementById('btn-generate-qr');
    const btnReset = document.getElementById('btn-reset-donasi');
    const btnsNominal = document.querySelectorAll('.btn-nominal');
    const btnKonfirmasiWA = document.getElementById('btn-konfirmasi-wa');

    const qrisImage = document.getElementById('qris-image');
    const qrisTotal = document.getElementById('qris-total-amount');

    // ==========================================
    // 3. VARIABEL & HELPER FUNGSI QRIS
    // ==========================================
    
    // String QRIS Statis Anda (Berdasarkan gambar yang dikirim)
    const BASE_QRIS = "00020101021126570011ID.DANA.WWW011893600915399828441702099982844170303UMI51440014ID.CO.QRIS.WWW0215ID10254344192930303UMI5204899953033605802ID5916MARKET NUSANTARA6004010961054336463042601";
    
    // Nomor WA Admin untuk konfirmasi
    const ADMIN_WA = "6281330730466";

    // Fungsi menghitung CRC16 (Standar QRIS EMVCo)
    function calculateCRC16(payload) {
        let crc = 0xFFFF;
        for (let i = 0; i < payload.length; i++) {
            crc ^= payload.charCodeAt(i) << 8;
            for (let j = 0; j < 8; j++) {
                if ((crc & 0x8000) !== 0) {
                    crc = (crc << 1) ^ 0x1021;
                } else {
                    crc <<= 1;
                }
            }
        }
        return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
    }

    // Fungsi menyuntikkan nominal ke QRIS Statis
    function generateDynamicQRIS(staticQris, nominal) {
        // Hapus CRC lama di paling belakang (Tag 63 = "6304" + "xxxx" = 8 karakter)
        let qrisTanpaCRC = staticQris.slice(0, -8);
        
        let nominalStr = nominal.toString();
        let panjangNominal = nominalStr.length.toString().padStart(2, '0');
        
        // Tag 54 adalah tag untuk Transaction Amount di standar EMVCo/QRIS
        let tagNominal = `54${panjangNominal}${nominalStr}`;
        
        // Susun ulang payload dan tambahkan tag awal CRC (6304)
        let payloadBaru = qrisTanpaCRC + tagNominal + "6304";
        
        // Hitung ulang CRC dari payload baru
        let crcBaru = calculateCRC16(payloadBaru);
        
        return payloadBaru + crcBaru;
    }

    // Helper: Warna Hex Acak untuk tampilan QR
    function getRandomHexColor() {
        const letters = '0123456789ABCDEF';
        let color = '';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // ==========================================
    // 4. LOGIKA UI (BUKA/TUTUP MODAL & RESET)
    // ==========================================
    const openModal = (e) => {
        if (e) e.preventDefault();
        modalContainer.classList.remove('hidden');
        resetModal();
    };

    const closeModal = () => {
        modalContainer.classList.add('hidden');
    };

    const resetModal = () => {
        stepInput.classList.remove('hidden');
        stepLoading.classList.add('hidden');
        stepQR.classList.add('hidden');
        inputAmount.value = '';
    };

    // Pasang Event Listeners untuk UI
    if (btnBuka) btnBuka.addEventListener('click', openModal);
    btnClose.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    btnReset.addEventListener('click', resetModal);

    // Mencegah modal tertutup jika form didalamnya diklik
    document.getElementById('donasi-modal-content').addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Auto-isi nominal jika tombol shortcut diklik
    btnsNominal.forEach(btn => {
        btn.addEventListener('click', () => {
            inputAmount.value = btn.getAttribute('data-amount');
        });
    });

    // ==========================================
    // 5. EVENT: KLIK GENERATE QRIS LOKAL
    // ==========================================
    let currentDonationAmount = 0;

    btnGenerate.addEventListener('click', () => {
        const amount = parseInt(inputAmount.value);
        
        if (isNaN(amount) || amount < 1000) {
            alert("⚠️ Nominal donasi minimal adalah Rp 1.000");
            return;
        }

        currentDonationAmount = amount;

        // Tampilkan animasi loading singkat
        stepInput.classList.add('hidden');
        stepLoading.classList.remove('hidden');

        // Simulasi loading 800ms agar UI terlihat halus (transisi)
        setTimeout(() => {
            // 1. Suntik nominal ke QRIS statis Anda
            const dynamicQrisString = generateDynamicQRIS(BASE_QRIS, amount);
            
            // 2. Generate Gambar QR (via QuickChart)
            const randomColor = getRandomHexColor();
            const logoUrl = "https://i.postimg.cc/gjK5khcj/20260214-004901.png";
            
            const qrImageUrl = `https://quickchart.io/qr?text=${encodeURIComponent(dynamicQrisString)}&dark=%23${randomColor}&centerImageUrl=${encodeURIComponent(logoUrl)}&centerImageSize=0.2&size=500&ecLevel=H`;

            // Update UI dengan Gambar dan Text Total
            qrisImage.src = qrImageUrl;
            qrisTotal.textContent = `Rp ${amount.toLocaleString('id-ID')}`;

            // Pindah ke tampilan QR Code
            stepLoading.classList.add('hidden');
            stepQR.classList.remove('hidden');
            
        }, 800);
    });

    // ==========================================
    // 6. EVENT: KONFIRMASI KE WHATSAPP
    // ==========================================
    btnKonfirmasiWA.addEventListener('click', () => {
        const pesan = `Halo Admin Market Nusantara, saya baru saja melakukan donasi dukungan server sebesar *Rp ${currentDonationAmount.toLocaleString('id-ID')}*. Berikut adalah bukti transfer saya: (Silakan lampirkan gambar)`;
        const linkWA = `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(pesan)}`;
        
        window.open(linkWA, '_blank');
        closeModal();
    });
});
