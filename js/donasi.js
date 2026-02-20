document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. INJEKSI CSS ANIMASI KE HEAD
    // ==========================================
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
        @keyframes donasiBounceIn {
            0% { opacity: 0; transform: scale(0.8) translateY(30px); }
            60% { opacity: 1; transform: scale(1.02) translateY(-5px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes donasiBounceOut {
            0% { opacity: 1; transform: scale(1) translateY(0); }
            100% { opacity: 0; transform: scale(0.8) translateY(30px); }
        }
        @keyframes donasiFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
        }
        @keyframes alienPeek {
            0% { transform: translateY(40px) rotate(15deg) scale(0.5); opacity: 0; }
            50% { transform: translateY(-10px) rotate(-5deg) scale(1.1); opacity: 1; }
            100% { transform: translateY(0) rotate(-10deg) scale(1); opacity: 1; }
        }
        @keyframes scanLine {
            0% { top: -10%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 110%; opacity: 0; }
        }
        
        .donasi-modal-enter {
            animation: donasiBounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .donasi-modal-leave {
            animation: donasiBounceOut 0.3s ease-in forwards;
        }
        .donasi-floating {
            animation: donasiFloat 4s ease-in-out infinite;
        }
        .alien-animate {
            animation: alienPeek 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.3s forwards;
            opacity: 0; /* Awalnya sembunyi sebelum animasi jalan */
        }
        .qr-scan-line {
            position: absolute;
            left: 0;
            width: 100%;
            height: 3px;
            background: rgba(34, 211, 238, 0.8);
            box-shadow: 0 0 10px rgba(34, 211, 238, 0.8), 0 0 20px rgba(34, 211, 238, 0.4);
            z-index: 10;
            animation: scanLine 2s linear infinite;
        }
    `;
    document.head.appendChild(styleSheet);

    // ==========================================
    // 2. INJEKSI HTML MODAL & CUSTOM ALERT
    // ==========================================
    const modalHTML = `
        <!-- Custom Alert (Toast) -->
        <div id="donasi-custom-alert" class="fixed top-6 left-1/2 -translate-x-1/2 z-[150] bg-red-500/10 border border-red-500/50 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-3 shadow-[0_0_20px_rgba(239,68,68,0.2)] transform -translate-y-24 opacity-0 transition-all duration-300">
            <svg class="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span class="text-white text-sm font-semibold tracking-wide" id="donasi-alert-msg">Pesan Alert</span>
        </div>

        <div id="donasi-modal-container" class="fixed inset-0 z-[120] hidden flex items-center justify-center p-4">
            <!-- Backdrop -->
            <div id="donasi-modal-backdrop" class="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 opacity-0"></div>
            
            <!-- Wrapper untuk Animasi Floating -->
            <div id="donasi-modal-wrapper" class="relative w-full max-w-md donasi-floating">
                
                <!-- Mascot Alien Mengintip -->
                <div id="donasi-alien" class="absolute -top-16 -right-4 w-24 h-24 z-0 pointer-events-none transform rotate-[-10deg]">
                    <svg viewBox="0 0 100 100" class="w-full h-full drop-shadow-[0_0_15px_rgba(167,139,250,0.5)] overflow-visible">
                        <path d="M50,15 C30,15 15,35 15,60 C15,85 50,95 50,95 C50,95 85,85 85,60 C85,35 70,15 50,15 Z" fill="#94a3b8" />
                        <ellipse cx="35" cy="50" rx="10" ry="15" transform="rotate(-15 35 50)" fill="black"/>
                        <ellipse cx="65" cy="50" rx="10" ry="15" transform="rotate(15 65 50)" fill="black"/>
                        <!-- Mata glow -->
                        <circle cx="38" cy="48" r="2" fill="white"/>
                        <circle cx="62" cy="48" r="2" fill="white"/>
                    </svg>
                    <!-- Chat Bubble -->
                    <div class="absolute top-2 -left-16 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-[10px] font-bold text-cyan-300 shadow-lg">
                        Support us!
                    </div>
                </div>

                <!-- Modal Content -->
                <div id="donasi-modal-content" class="relative bg-[#0d0f14]/90 backdrop-blur-xl border border-cyan-500/30 rounded-3xl w-full shadow-[0_0_50px_rgba(34,211,238,0.1)] overflow-hidden z-10">
                    
                    <!-- Glow Effect Background -->
                    <div class="absolute -top-20 -left-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-[50px] pointer-events-none"></div>
                    <div class="absolute -bottom-20 -right-20 w-40 h-40 bg-violet-500/20 rounded-full blur-[50px] pointer-events-none"></div>

                    <!-- Header -->
                    <div class="flex items-center justify-between p-5 border-b border-white/5 relative z-10">
                        <h2 class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400 flex items-center gap-2">
                            <svg class="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            Donasi Server
                        </h2>
                        <button id="btn-close-donasi" class="text-gray-400 hover:text-white transition-all hover:rotate-90 bg-white/5 hover:bg-white/10 p-2 rounded-xl">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    <div class="p-6 relative z-10">
                        <!-- STEP 1: Input Nominal -->
                        <div id="donasi-input-step" class="w-full">
                            <p class="text-sm text-gray-400 mb-6 text-center">Setiap donasi membantu Market Nusantara tetap hidup dan bebas hambatan.</p>
                            
                            <div class="relative mb-6 group">
                                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 font-bold transition-transform group-focus-within:scale-110">Rp</span>
                                <input type="number" id="donasi-amount" class="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-black text-2xl focus:outline-none focus:border-cyan-400 focus:bg-cyan-500/5 transition-all placeholder-gray-700 shadow-inner text-center tracking-wider" placeholder="0">
                            </div>
                            
                            <!-- Tombol Shortcut Baru (5K, 10K, 20K) -->
                            <div class="grid grid-cols-3 gap-3 mb-8">
                                <button class="btn-nominal border border-white/5 bg-white/5 hover:bg-cyan-500/20 hover:border-cyan-500/50 hover:text-cyan-300 hover:-translate-y-1 text-gray-300 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg" data-amount="5000">5K</button>
                                <button class="btn-nominal border border-white/5 bg-white/5 hover:bg-cyan-500/20 hover:border-cyan-500/50 hover:text-cyan-300 hover:-translate-y-1 text-gray-300 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg" data-amount="10000">10K</button>
                                <button class="btn-nominal border border-white/5 bg-white/5 hover:bg-violet-500/20 hover:border-violet-500/50 hover:text-violet-300 hover:-translate-y-1 text-gray-300 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg relative overflow-hidden" data-amount="20000">
                                    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:animate-[scanLine_1.5s_infinite]"></div>
                                    20K
                                </button>
                            </div>

                            <button id="btn-generate-qr" class="w-full py-4 rounded-2xl font-black text-black uppercase tracking-widest relative overflow-hidden group shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-transform hover:scale-[1.02]" style="background: linear-gradient(135deg, #22d3ee 0%, #a78bfa 100%);">
                                <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                <span class="relative z-10 flex items-center justify-center gap-2">
                                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                                    Generate QRIS
                                </span>
                            </button>
                        </div>

                        <!-- STEP 2: Loading Animasi -->
                        <div id="donasi-loading-step" class="w-full hidden flex flex-col items-center justify-center py-10">
                            <div class="relative w-20 h-20 mb-6 flex items-center justify-center">
                                <div class="absolute inset-0 border-4 border-transparent border-t-cyan-400 border-b-violet-400 rounded-full animate-spin"></div>
                                <div class="absolute inset-2 border-4 border-transparent border-l-cyan-300 border-r-violet-300 rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
                                <svg class="w-6 h-6 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <p class="text-cyan-400 font-bold tracking-widest uppercase text-sm animate-pulse">Menyiapkan QRIS...</p>
                        </div>

                        <!-- STEP 3: Tampil QR Code -->
                        <div id="donasi-qr-step" class="w-full hidden flex flex-col items-center">
                            <div class="relative bg-white p-3 rounded-2xl mb-5 shadow-[0_0_30px_rgba(255,255,255,0.15)] overflow-hidden group">
                                <img id="qris-image" src="" alt="QRIS Code" class="w-48 h-48 object-contain relative z-0">
                                <!-- Efek Scan Hologram -->
                                <div class="qr-scan-line"></div>
                            </div>
                            
                            <p class="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Total Donasi</p>
                            <h3 id="qris-total-amount" class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white mb-6 tracking-tighter">Rp 0</h3>
                            
                            <div class="w-full flex items-center gap-3 text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-4 py-3 rounded-xl mb-6 text-center justify-center">
                                <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>Otomatis masuk. Silakan scan di E-Wallet/M-Banking Anda.</span>
                            </div>

                            <button id="btn-selesai-donasi" class="w-full py-3 rounded-xl font-bold text-gray-300 border border-gray-600 hover:bg-white/5 hover:text-white hover:border-gray-400 transition-all">
                                Tutup & Selesai
                            </button>
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
    const btnBuka = document.getElementById('btn-buka-donasi');
    const modalContainer = document.getElementById('donasi-modal-container');
    const backdrop = document.getElementById('donasi-modal-backdrop');
    const modalWrapper = document.getElementById('donasi-modal-wrapper');
    const alienMascot = document.getElementById('donasi-alien');
    const btnClose = document.getElementById('btn-close-donasi');
    
    const stepInput = document.getElementById('donasi-input-step');
    const stepLoading = document.getElementById('donasi-loading-step');
    const stepQR = document.getElementById('donasi-qr-step');

    const inputAmount = document.getElementById('donasi-amount');
    const btnGenerate = document.getElementById('btn-generate-qr');
    const btnSelesai = document.getElementById('btn-selesai-donasi');
    const btnsNominal = document.querySelectorAll('.btn-nominal');

    const qrisImage = document.getElementById('qris-image');
    const qrisTotal = document.getElementById('qris-total-amount');

    const customAlert = document.getElementById('donasi-custom-alert');
    const alertMsg = document.getElementById('donasi-alert-msg');

    // ==========================================
    // 4. VARIABEL & HELPER FUNGSI QRIS
    // ==========================================
    const BASE_QRIS = "00020101021126570011ID.DANA.WWW011893600915399828441702099982844170303UMI51440014ID.CO.QRIS.WWW0215ID10254344192930303UMI5204899953033605802ID5916MARKET NUSANTARA6004010961054336463042601";
    
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

    function generateDynamicQRIS(staticQris, nominal) {
        let qrisTanpaCRC = staticQris.slice(0, -8);
        let nominalStr = nominal.toString();
        let panjangNominal = nominalStr.length.toString().padStart(2, '0');
        let tagNominal = `54${panjangNominal}${nominalStr}`;
        let payloadBaru = qrisTanpaCRC + tagNominal + "6304";
        let crcBaru = calculateCRC16(payloadBaru);
        return payloadBaru + crcBaru;
    }

    function getRandomHexColor() {
        const letters = '0123456789ABCDEF';
        let color = '';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Custom Alert Logic (Toast)
    let alertTimeout;
    const showCustomAlert = (message) => {
        alertMsg.innerText = message;
        customAlert.classList.remove('-translate-y-24', 'opacity-0');
        customAlert.classList.add('translate-y-0', 'opacity-100');
        
        clearTimeout(alertTimeout);
        alertTimeout = setTimeout(() => {
            customAlert.classList.remove('translate-y-0', 'opacity-100');
            customAlert.classList.add('-translate-y-24', 'opacity-0');
        }, 3000);
    };

    // ==========================================
    // 5. LOGIKA UI & ANIMASI MODAL
    // ==========================================
    const openModal = (e) => {
        if (e) e.preventDefault();
        
        // Reset state
        stepInput.classList.remove('hidden');
        stepLoading.classList.add('hidden');
        stepQR.classList.add('hidden');
        inputAmount.value = '';
        
        // Show container
        modalContainer.classList.remove('hidden');
        
        // Trigger animations
        setTimeout(() => {
            backdrop.classList.remove('opacity-0');
            backdrop.classList.add('opacity-100');
            
            modalWrapper.classList.remove('donasi-modal-leave');
            modalWrapper.classList.add('donasi-modal-enter');
            
            // Trigger alien animation
            alienMascot.classList.remove('alien-animate');
            void alienMascot.offsetWidth; // trigger reflow
            alienMascot.classList.add('alien-animate');
        }, 10);
    };

    const closeModal = () => {
        // Reverse animations
        backdrop.classList.remove('opacity-100');
        backdrop.classList.add('opacity-0');
        
        modalWrapper.classList.remove('donasi-modal-enter');
        modalWrapper.classList.add('donasi-modal-leave');
        alienMascot.classList.remove('alien-animate');

        // Wait for animation to finish before hiding container
        setTimeout(() => {
            modalContainer.classList.add('hidden');
        }, 300); // 300ms matches donasiBounceOut duration
    };

    // Event Listeners
    if (btnBuka) btnBuka.addEventListener('click', openModal);
    btnClose.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    btnSelesai.addEventListener('click', closeModal); // Tombol selesai kini menutup modal

    // Mencegah modal tertutup jika form didalamnya diklik
    document.getElementById('donasi-modal-content').addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Auto-isi nominal jika tombol shortcut diklik
    btnsNominal.forEach(btn => {
        btn.addEventListener('click', () => {
            // Efek visual klik
            btn.classList.add('scale-95');
            setTimeout(() => btn.classList.remove('scale-95'), 150);
            
            inputAmount.value = btn.getAttribute('data-amount');
            // Fokus otomatis ke input agar glow aktif
            inputAmount.focus();
        });
    });

    // ==========================================
    // 6. EVENT: KLIK GENERATE QRIS LOKAL
    // ==========================================
    btnGenerate.addEventListener('click', () => {
        const amount = parseInt(inputAmount.value);
        
        if (isNaN(amount) || amount < 1000) {
            showCustomAlert("⚠️ Nominal donasi minimal adalah Rp 1.000");
            // Efek goyang (shake) ringan pada input
            inputAmount.classList.add('translate-x-1');
            setTimeout(() => inputAmount.classList.replace('translate-x-1', '-translate-x-1'), 100);
            setTimeout(() => inputAmount.classList.replace('-translate-x-1', 'translate-x-0'), 200);
            return;
        }

        // Transisi ke Loading
        stepInput.style.opacity = '0';
        setTimeout(() => {
            stepInput.classList.add('hidden');
            stepInput.style.opacity = '1';
            
            stepLoading.classList.remove('hidden');
            stepLoading.style.opacity = '0';
            setTimeout(() => stepLoading.style.opacity = '1', 50);
        }, 300);

        // Simulasi loading 1.5s agar animasi loading terlihat
        setTimeout(() => {
            const dynamicQrisString = generateDynamicQRIS(BASE_QRIS, amount);
            const randomColor = getRandomHexColor();
            const logoUrl = "https://i.postimg.cc/gjK5khcj/20260214-004901.png";
            
            const qrImageUrl = `https://quickchart.io/qr?text=${encodeURIComponent(dynamicQrisString)}&dark=%23${randomColor}&centerImageUrl=${encodeURIComponent(logoUrl)}&centerImageSize=0.2&size=500&ecLevel=H`;

            qrisImage.src = qrImageUrl;
            qrisTotal.textContent = `Rp ${amount.toLocaleString('id-ID')}`;

            // Transisi ke QR Code
            stepLoading.style.opacity = '0';
            setTimeout(() => {
                stepLoading.classList.add('hidden');
                stepLoading.style.opacity = '1';
                
                stepQR.classList.remove('hidden');
                // Hapus efek alien saat qr muncul agar lebih fokus
                alienMascot.style.opacity = '0'; 
            }, 300);
            
        }, 1500);
    });
});
