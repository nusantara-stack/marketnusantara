document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. INJEKSI CSS ANIMASI KE HEAD
    // ==========================================
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
        @keyframes calcBounceIn {
            0% { opacity: 0; transform: scale(0.8) translateY(30px); }
            60% { opacity: 1; transform: scale(1.02) translateY(-5px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes calcBounceOut {
            0% { opacity: 1; transform: scale(1) translateY(0); }
            100% { opacity: 0; transform: scale(0.8) translateY(30px); }
        }
        
        .calc-modal-enter {
            animation: calcBounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .calc-modal-leave {
            animation: calcBounceOut 0.3s ease-in forwards;
        }
    `;
    document.head.appendChild(styleSheet);

    // ==========================================
    // 2. INJEKSI HTML MODAL KALKULATOR
    // ==========================================
    const modalHTML = `
        <div id="calc-modal-container" class="fixed inset-0 z-[120] hidden flex items-center justify-center p-4">
            <!-- Backdrop -->
            <div id="calc-modal-backdrop" class="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 opacity-0"></div>
            
            <!-- Wrapper -->
            <div id="calc-modal-wrapper" class="relative w-full max-w-md">
                
                <!-- Modal Content -->
                <div class="relative bg-[#0d0f14]/90 backdrop-blur-xl border border-violet-500/30 rounded-3xl w-full shadow-[0_0_50px_rgba(139,92,246,0.1)] overflow-hidden z-10">
                    
                    <!-- Glow Effect Background -->
                    <div class="absolute -top-20 -right-20 w-40 h-40 bg-violet-500/20 rounded-full blur-[50px] pointer-events-none"></div>
                    <div class="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-[50px] pointer-events-none"></div>

                    <!-- Header -->
                    <div class="flex items-center justify-between p-5 border-b border-white/5 relative z-10">
                        <h2 class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 flex items-center gap-2">
                            <svg class="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                            Kalkulator Rekber
                        </h2>
                        <button id="btn-close-calc" class="text-gray-400 hover:text-white transition-all hover:rotate-90 bg-white/5 hover:bg-white/10 p-2 rounded-xl">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    <div class="p-6 relative z-10">
                        <p class="text-sm text-gray-400 mb-6 text-center">Hitung estimasi total transfer termasuk fee admin Market Nusantara secara otomatis.</p>
                        
                        <!-- Input Harga Barang -->
                        <div class="mb-6">
                            <label class="block text-violet-400 text-[10px] font-bold mb-2 tracking-widest uppercase">Harga Barang / Transaksi</label>
                            <div class="relative group">
                                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-violet-400 font-bold transition-transform group-focus-within:scale-110">Rp</span>
                                <input type="number" id="calc-input-amount" class="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-black text-2xl focus:outline-none focus:border-violet-400 focus:bg-violet-500/5 transition-all placeholder-gray-700 shadow-inner tracking-wider" placeholder="0">
                            </div>
                        </div>
                        
                        <!-- Rincian Biaya -->
                        <div class="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
                            <div class="flex justify-between items-center mb-3">
                                <span class="text-sm text-gray-400">Harga Barang</span>
                                <span class="font-semibold text-white" id="calc-display-harga">Rp 0</span>
                            </div>
                            <div class="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
                                <span class="text-sm text-gray-400 flex items-center gap-1">
                                    Fee Admin <span class="text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full ml-1">10%</span>
                                </span>
                                <span class="font-semibold text-cyan-400" id="calc-display-fee">+ Rp 0</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-sm font-bold text-white uppercase tracking-wider">Total Transfer</span>
                                <span class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 tracking-tighter" id="calc-display-total">Rp 0</span>
                            </div>
                        </div>

                        <!-- Info Banner -->
                        <div class="w-full flex items-start gap-3 text-xs text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 px-4 py-3 rounded-xl">
                            <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>Fee admin 10% berlaku merata untuk semua transaksi. Gunakan hasil hitungan ini untuk transfer ke rekening bersama.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Masukkan modal ke body HTML
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // ==========================================
    // 3. AMBIL ELEMEN DOM
    // ==========================================
    // CATATAN: Pastikan Anda menambahkan tombol dengan id "btn-buka-kalkulator" di HTML Anda
    const btnBuka = document.getElementById('btn-buka-kalkulator'); 
    
    const modalContainer = document.getElementById('calc-modal-container');
    const backdrop = document.getElementById('calc-modal-backdrop');
    const modalWrapper = document.getElementById('calc-modal-wrapper');
    const btnClose = document.getElementById('btn-close-calc');
    
    const inputAmount = document.getElementById('calc-input-amount');
    const displayHarga = document.getElementById('calc-display-harga');
    const displayFee = document.getElementById('calc-display-fee');
    const displayTotal = document.getElementById('calc-display-total');

    // ==========================================
    // 4. LOGIKA PERHITUNGAN (REAL-TIME)
    // ==========================================
    const FEE_PERCENTAGE = 0.10; // 10%

    const formatRupiah = (angka) => {
        return 'Rp ' + angka.toLocaleString('id-ID');
    };

    const hitungKalkulator = () => {
        let harga = parseInt(inputAmount.value);
        
        if (isNaN(harga) || harga < 0) {
            harga = 0;
        }

        const fee = Math.floor(harga * FEE_PERCENTAGE);
        const total = harga + fee;

        displayHarga.textContent = formatRupiah(harga);
        displayFee.textContent = '+ ' + formatRupiah(fee);
        displayTotal.textContent = formatRupiah(total);
    };

    // Event listener setiap kali user mengetik
    inputAmount.addEventListener('input', hitungKalkulator);

    // ==========================================
    // 5. LOGIKA UI & ANIMASI MODAL
    // ==========================================
    const openModal = (e) => {
        if (e) e.preventDefault();
        
        // Reset state
        inputAmount.value = '';
        hitungKalkulator(); // Reset display ke Rp 0
        
        // Show container
        modalContainer.classList.remove('hidden');
        
        // Trigger animations
        setTimeout(() => {
            backdrop.classList.remove('opacity-0');
            backdrop.classList.add('opacity-100');
            
            modalWrapper.classList.remove('calc-modal-leave');
            modalWrapper.classList.add('calc-modal-enter');
            
            // Auto focus ke input saat dibuka
            inputAmount.focus();
        }, 10);
    };

    const closeModal = () => {
        // Reverse animations
        backdrop.classList.remove('opacity-100');
        backdrop.classList.add('opacity-0');
        
        modalWrapper.classList.remove('calc-modal-enter');
        modalWrapper.classList.add('calc-modal-leave');

        // Wait for animation to finish before hiding container
        setTimeout(() => {
            modalContainer.classList.add('hidden');
        }, 300); // Sesuai durasi calcBounceOut
    };

    // Event Listeners (Gunakan querySelectorAll agar bisa dipanggil dari banyak tombol jika perlu)
    const btnBukaElements = document.querySelectorAll('#btn-buka-kalkulator, .btn-buka-kalkulator');
    btnBukaElements.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    btnClose.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);

    // Mencegah modal tertutup jika form didalamnya diklik
    modalWrapper.addEventListener('click', (e) => {
        e.stopPropagation();
    });
});
