document.addEventListener('DOMContentLoaded', () => {

            // --- MENU MOBILE ---
            const mobileMenuButton = document.getElementById('mobile-menu-button');
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenuButton && mobileMenu) {
                mobileMenuButton.addEventListener('click', () => {
                    mobileMenu.classList.toggle('hidden');
                });
                // Tutup menu mobile saat link diklik
                mobileMenu.addEventListener('click', (e) => {
                    if (e.target.tagName === 'A') {
                        mobileMenu.classList.add('hidden');
                    }
                })
            }

            // --- HERO IMAGE SCROLLER ---
            const scrollers = document.querySelectorAll(".scroller");
            if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                addAnimation();
            }
            function addAnimation() {
                scrollers.forEach((scroller) => {
                    scroller.setAttribute("data-animated", true);
                    const scrollerInner = scroller.querySelector(".scroller-inner");
                    const scrollerContent = Array.from(scrollerInner.children);
                    scrollerContent.forEach((item) => {
                        const duplicatedItem = item.cloneNode(true);
                        duplicatedItem.setAttribute("aria-hidden", true);
                        scrollerInner.appendChild(duplicatedItem);
                    });
                });
            }

            // --- ANIMASI SAAT SCROLL ---
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                    }
                });
            }, { threshold: 0.1 });
            document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));


            // --- PUSAT INFORMASI ---
            const categoryButtons = document.querySelectorAll('.category-btn');
            const contentPanels = document.querySelectorAll('.content-panel');

            categoryButtons.forEach(button => {
                button.addEventListener('click', () => {
                    categoryButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    
                    const targetId = button.dataset.target;

                    contentPanels.forEach(panel => {
                        panel.classList.toggle('hidden', panel.id !== targetId);
                        panel.classList.toggle('active', panel.id === targetId);
                    });
                });
            });

            // --- STACK KARTU PRODUK ---
            const cards = document.querySelectorAll('.product-card');
            if (cards.length > 0) {
                let activeIndex = 0;

                function updateStack(clickedIndex) {
                    activeIndex = clickedIndex;
                    const totalCards = cards.length;

                    cards.forEach((card, i) => {
                        const offset = (i - activeIndex + totalCards) % totalCards;
                        
                        let transform = '', opacity = '0', zIndex = '1';

                        if (offset === 0) {
                            transform = 'translateX(-50%) scale(1)';
                            opacity = '1';
                            zIndex = '10';
                        } else if (offset === 1) {
                            transform = 'translateX(calc(-50% + 80%)) scale(0.85) rotate(5deg)';
                            opacity = '0.5';
                            zIndex = '5';
                        } else if (offset === totalCards - 1) {
                            transform = 'translateX(calc(-50% - 80%)) scale(0.85) rotate(-5deg)';
                            opacity = '0.5';
                            zIndex = '5';
                        } else {
                            const direction = (offset > totalCards / 2) ? -1 : 1;
                            transform = `translateX(calc(-50% + ${direction * 100}%)) scale(0.7)`;
                        }

                        card.style.transform = transform;
                        card.style.opacity = opacity;
                        card.style.zIndex = zIndex;
                    });
                }
                
                cards.forEach((card) => {
                    card.addEventListener('click', () => {
                        const newIndex = parseInt(card.dataset.index, 10);
                        if (activeIndex !== newIndex) {
                            updateStack(newIndex);
                        } else {
                            showProductModal(newIndex);
                        }
                    });
                });

                const nextBtn = document.getElementById('next-card-btn');
                const prevBtn = document.getElementById('prev-card-btn');

                if(nextBtn) nextBtn.addEventListener('click', () => {
                    updateStack((activeIndex + 1) % cards.length);
                });

                if(prevBtn) prevBtn.addEventListener('click', () => {
                    updateStack((activeIndex - 1 + cards.length) % cards.length);
                });

                if(cards.length > 0) updateStack(0);
            }

            // --- LOGIKA TAB KALKULATOR UTAMA (WEBSITE vs REKBER) ---
            const mainCalcTabs = document.querySelectorAll('#calculator-tabs .calc-main-tab-btn');
            const mainCalcTabPanels = document.querySelectorAll('#kalkulator .calculator-tab-panel');

            mainCalcTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    mainCalcTabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');

                    const targetId = tab.dataset.target;
                    mainCalcTabPanels.forEach(panel => {
                        panel.classList.toggle('hidden', panel.id !== targetId);
                    });
                });
            });

            // --- KALKULATOR HARGA ---
            const calcElements = {
                packageCards: document.querySelectorAll('#calc-packages > div'),
                features: document.querySelectorAll('#calc-features input[type="checkbox"]'),
                summaryList: document.getElementById('summary-list'),
                totalPrice: document.getElementById('total-price'),
                startBtn: document.getElementById('start-simulation-btn'),
                closeBtn: document.getElementById('close-simulation-btn'),
                contentWrapper: document.getElementById('calculator-content'),
                toggleFeaturesBtn: document.getElementById('toggle-features-btn')
            };

            const packageDetails = {
                reguler: { name: 'Paket Reguler', price: 250000 },
                premium: { name: 'Paket Premium', price: 750000 },
                vip: { name: 'Paket VIP', price: 1500000 }
            };

            const featurePrices = {
                'desain-logo': 350000,
                'integrasi-sosmed': 200000,
                'cms': 800000,
                'seo-lanjutan': 500000,
                'konten-writing': 450000,
                'optimasi-kecepatan': 600000
            };

            if(calcElements.packageCards.length > 0) {
                let selectedPackage = 'premium'; // Default selection

                function updateCalculatorUI() {
                    calcElements.packageCards.forEach(card => {
                        const isSelected = card.dataset.package === selectedPackage;
                        card.classList.toggle('active', isSelected);
                    });
                }

                function calculatePrice() {
                    let total = 0;
                    let summaryHTML = '';

                    // Base Package
                    const basePackage = packageDetails[selectedPackage];
                    total += basePackage.price;
                    summaryHTML += `<li class="flex justify-between"><span>${basePackage.name}</span> <span class="font-semibold">${formatRupiah(basePackage.price.toString())}</span></li>`;
                    
                    // Additional Features
                    let featuresAdded = false;
                    calcElements.features.forEach(feature => {
                        if (feature.checked) {
                            featuresAdded = true;
                            const featureCost = featurePrices[feature.value];
                            const featureName = feature.closest('label').querySelector('[data-feature-name]').dataset.featureName;
                            total += featureCost;
                            summaryHTML += `<li class="flex justify-between text-slate-400"><span>+ ${featureName}</span> <span>${formatRupiah(featureCost.toString())}</span></li>`;
                        }
                    });

                    if (!featuresAdded) {
                         summaryHTML += `<li class="placeholder text-slate-500 italic text-center pt-8">Pilih fitur tambahan...</li>`;
                    }

                    calcElements.summaryList.innerHTML = summaryHTML;
                    calcElements.summaryList.querySelectorAll('li').forEach((li, index) => {
                        li.style.animationDelay = `${index * 0.07}s`;
                    });
                    calcElements.totalPrice.textContent = formatRupiah(total.toString());
                }

                // Event Listeners
                calcElements.packageCards.forEach(card => {
                    card.addEventListener('click', () => {
                        selectedPackage = card.dataset.package;
                        updateCalculatorUI();
                        calculatePrice();
                    });
                });

                calcElements.features.forEach(checkbox => checkbox.addEventListener('change', calculatePrice));
                
                // Initial calculation and UI setup
                updateCalculatorUI();
                calculatePrice();

                // --- Kontrol Tampil/Sembunyi Kalkulator Mobile ---
                if (calcElements.startBtn && calcElements.closeBtn && calcElements.contentWrapper) {
                    calcElements.startBtn.addEventListener('click', () => {
                        calcElements.contentWrapper.classList.remove('hidden');
                        calcElements.contentWrapper.classList.add('grid');
                        calcElements.startBtn.classList.add('hidden');
                    });

                    calcElements.closeBtn.addEventListener('click', () => {
                        calcElements.contentWrapper.classList.add('hidden');
                        calcElements.contentWrapper.classList.remove('grid');
                        calcElements.startBtn.classList.remove('hidden');
                    });
                }
                
                // --- Kontrol Show More/Less Fitur Mobile ---
                if (calcElements.toggleFeaturesBtn) {
                    const moreFeatures = document.querySelectorAll('#calc-features .more-feature');
                    calcElements.toggleFeaturesBtn.addEventListener('click', () => {
                        const icon = calcElements.toggleFeaturesBtn.querySelector('i');
                        const text = calcElements.toggleFeaturesBtn.querySelector('span');
                        const isHidden = moreFeatures[0].classList.contains('hidden');
                        
                        moreFeatures.forEach(feature => {
                            feature.classList.toggle('hidden');
                            feature.classList.toggle('flex'); // Use flex to show it
                        });

                        if (isHidden) {
                            text.textContent = 'Tampilkan Lebih Sedikit';
                            icon.style.transform = 'rotate(180deg)';
                        } else {
                            text.textContent = 'Tampilkan Lebih Banyak';
                            icon.style.transform = 'rotate(0deg)';
                        }
                    });
                }
            }

            // --- LOGIKA TAB KALKULATOR MOBILE ---
            const calcTabsContainer = document.getElementById('calc-tabs-mobile');
            if (calcTabsContainer) {
                const calcTabButtons = calcTabsContainer.querySelectorAll('button');
                const calcTabPanels = document.querySelectorAll('#calculator-content .calc-tab-panel');

                calcTabButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        // Only run logic on mobile viewports
                        if (window.innerWidth < 1024) { 
                            calcTabButtons.forEach(btn => btn.classList.remove('active'));
                            button.classList.add('active');
                            
                            const targetTab = button.dataset.tab;
                            calcTabPanels.forEach(panel => {
                                panel.classList.toggle('hidden', panel.id !== `calc-tab-${targetTab}`);
                            });
                        }
                    });
                });
            }


            // --- LOGIKA KALKULATOR REKBER ---
            const rekberNominalInput = document.getElementById('rekber-nominal');
            const rekberFeeOptions = document.querySelectorAll('#rekber-fee-options .rekber-option-btn');
            const rekberFeeExplanation = document.getElementById('rekber-fee-explanation');
            const rekberFeeResult = document.getElementById('rekber-fee-result');
            const rekberBuyerPays = document.getElementById('rekber-buyer-pays');
            const rekberSellerReceives = document.getElementById('rekber-seller-receives');

            if (rekberNominalInput) {
                let feeType = 'inc'; // default
                const FEE_PERCENTAGE = 0.05;

                function calculateRekberFee() {
                    const nominalValue = parseFloat(rekberNominalInput.value.replace(/[^0-9,]/g, '')) || 0;
                    
                    let fee = 0;
                    let buyerPays = 0;
                    let sellerReceives = 0;

                    if (feeType === 'inc') {
                        fee = nominalValue * FEE_PERCENTAGE;
                        buyerPays = nominalValue;
                        sellerReceives = nominalValue - fee;
                    } else { // 'ex'
                        fee = nominalValue * FEE_PERCENTAGE;
                        buyerPays = nominalValue + fee;
                        sellerReceives = nominalValue;
                    }

                    rekberFeeResult.textContent = formatRupiah(fee.toString());
                    rekberBuyerPays.textContent = formatRupiah(buyerPays.toString());
                    rekberSellerReceives.textContent = formatRupiah(sellerReceives.toString());
                }

                rekberNominalInput.addEventListener('input', (e) => {
                    const rawValue = e.target.value.replace(/[^0-9]/g, '');
                    const numberValue = parseInt(rawValue, 10);
                    
                    if (!isNaN(numberValue)) {
                        const cursorPosition = e.target.selectionStart;
                        const oldLength = e.target.value.length;
                        const formattedValue = new Intl.NumberFormat('id-ID').format(numberValue);
                        e.target.value = formattedValue;
                        const newLength = e.target.value.length;
                        // Adjust cursor position
                        e.target.setSelectionRange(cursorPosition + (newLength - oldLength), cursorPosition + (newLength - oldLength));
                    } else {
                        e.target.value = '';
                    }
                    calculateRekberFee();
                });

                rekberFeeOptions.forEach(button => {
                    button.addEventListener('click', () => {
                        rekberFeeOptions.forEach(btn => btn.classList.remove('active'));
                        button.classList.add('active');
                        feeType = button.dataset.type;
                        
                        if (feeType === 'inc') {
                            rekberFeeExplanation.textContent = 'Fee dipotong dari nominal transaksi (dana diterima penjual berkurang).';
                        } else {
                            rekberFeeExplanation.textContent = 'Fee ditambahkan di atas nominal transaksi (pembeli membayar lebih).';
                        }

                        calculateRekberFee();
                    });
                });

                // Initial calculation
                calculateRekberFee();
            }

            // --- KEAMANAN SEDERHANA ---
            document.addEventListener('contextmenu', event => event.preventDefault());
            document.addEventListener('keydown', function(e) {
                if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C' || e.key === 'J')) || (e.ctrlKey && e.key === 'U')) {
                    e.preventDefault();
                }
            });

            // --- IKON MENGAMBANG ---
            const floatingIconsContainer = document.querySelector('.floating-icons');
            if (floatingIconsContainer) {
                const icons = [
                    { class: 'fa-bitcoin', type: 'fab' }, 
                    { class: 'fa-ethereum', type: 'fab' },
                    { class: 'fa-litecoin-sign', type: 'fas' },
                    { class: 'fa-monero', type: 'fab' },
                    { class: 'fa-ripple', type: 'fab' },
                    { class: 'fa-btc', type: 'fab' },
                    { class: 'fa-gg', type: 'fab' },
                    { class: 'fa-dollar-sign', type: 'fas' }
                ];
                for (let i = 0; i < 20; i++) { // Jumlah ikon ditambahkan
                    const icon = document.createElement('i');
                    const iconData = icons[Math.floor(Math.random() * icons.length)];
                    icon.className = `${iconData.type} ${iconData.class}`;
                    Object.assign(icon.style, {
                        left: `${Math.random() * 100}vw`,
                        animationDuration: `${Math.random() * 15 + 20}s`, // Durasi diperlambat
                        animationDelay: `${Math.random() * 5}s`,
                        fontSize: `${Math.random() * 1.5 + 1.5}rem` // Ukuran sedikit diperbesar
                    });
                    floatingIconsContainer.appendChild(icon);
                }
            }
            
            // --- DATA LIST RIPPER & MODAL ---
            const ripperData = [
                { name: 'Pelaku 1', whatsapp: ['wa.me/6283110877006'], nominal: 'Rp107.154', kasus: 'Scam', ewallet: ['083110877006'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/grhioa.jpg' },
                { name: 'Meisya Putri Arini', whatsapp: ['wa.me/6283137567672'], nominal: 'Rp15.000', kasus: 'Scam', ewallet: ['081398091300 - Dana', '081398091300 - Gopay', '083133326689 - Gopay', '901185589079 - Seabank (a/n: ESIH)'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/zo46ma.jpg' },
                { name: 'Pelaku 3', whatsapp: ['wa.me/6283152796642'], nominal: 'Rp8.000', kasus: 'Scam', ewallet: ['901369935890'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/g5j2fa.jpg' },
                { name: 'Pelaku 4', whatsapp: ['wa.me/6281313419236'], nominal: 'Rp30.000', kasus: 'Scam', ewallet: ['085727021478 OVO'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/53lt90.jpg' },
                { name: 'Pelaku 5', whatsapp: ['wa.me/6289505332944'], nominal: 'Rp10.000', kasus: 'Scam', ewallet: ['089505332944'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/neeu5n.jpg' },
                { name: 'Pelaku 6', whatsapp: ['wa.me/6287844775440'], nominal: 'Tidak Diketahui', kasus: 'Scam', ewallet: ['—'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/pehhig.jpg' },
                { name: 'Endang Sutriyani', whatsapp: ['wa.me/6282299080618'], nominal: 'Rp72.000', kasus: 'Scam', ewallet: ['901948655110'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/zxxyzv.jpg' },
                { name: 'Pelaku 8', whatsapp: ['wa.me/62857701270438'], nominal: 'Rp16.000', kasus: 'Scam', ewallet: ['089626118020 DANA'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/p1yiz1.jpg' },
                { name: 'Pelaku 9', whatsapp: ['wa.me/6285180967002'], nominal: 'Rp7.000', kasus: 'Scam', ewallet: ['085801020968 DANA'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/c6kkxn.jpg' },
                { name: 'Pelaku 10', whatsapp: ['wa.me/6285194836237'], nominal: 'Rp50.000', kasus: 'Scam', ewallet: ['085727021478 GOPAY'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/puzsyt.jpg' },
                { name: 'Pelaku 11', whatsapp: ['wa.me/6283121498155'], nominal: 'Rp133.000', kasus: 'Scam', ewallet: ['082250494693'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/tz93c7.jpg' },
                { name: 'Pelaku 12', whatsapp: ['wa.me/6283136096285'], nominal: 'Tidak Diketahui', kasus: 'Scam', ewallet: ['—'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/je6uzd.jpg' },
                { name: 'Pelaku 13', whatsapp: ['wa.me/6287719232611'], nominal: '120000', kasus: 'Scam', ewallet: ['—'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/t22l04.jpg' },
                { name: 'Pelaku 14', whatsapp: ['wa.me/62895402510585', 'wa.me/62895414376389'], nominal: '30000', kasus: 'Scam', ewallet: ['0895384890460'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/ohep24.jpg' },
                { name: 'Pelaku 15', whatsapp: ['wa.me/6281321446734'], nominal: '165000', kasus: 'Scam', ewallet: ['—'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/y0b2k5.jpg' },
                { name: 'Aris Setiawan', whatsapp: ['wa.me/6285191205379'], nominal: 'Tidak Diketahui', kasus: 'Scam', ewallet: ['—'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/v4trgt.jpg' },
                { name: 'Kurniawan', whatsapp: ['wa.me/6287887952962', 'wa.me/6283110363042', 'wa.me/6281523991160', 'wa.me/6285718935362', 'wa.me/6285720025538', 'wa.me/6285966507641', 'wa.me/6287729188938'], nominal: '10000', kasus: 'Scam', ewallet: ['087729188938 - Dana'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/2rb3m7.jpg' },
            ];
            
            const ripperListContainer = document.querySelector('#ripper-list > div');
            const ripperSearchInput = document.getElementById('ripper-search');
            const ripperModal = document.getElementById('ripper-modal');
            const modalRipperDetails = document.getElementById('modal-ripper-details');
            
            let currentRipperIndex = 0;
            let currentFilteredRippers = [];
            let currentSort = 'newest';
            ripperData.forEach((item, index) => item.originalIndex = index);

            // --- FUNGSI BANTU FORMAT RUPIAH ---
            function formatRupiah(value) {
                if (typeof value !== 'string') return 'N/A';
                const number = parseInt(value.replace(/[^0-9]/g, ''), 10);
                if (isNaN(number)) {
                    return value; // Kembalikan string asli jika bukan angka (misal: '— (Garapan)')
                }
                return new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0
                }).format(number);
            }

            // --- FUNGSI BARU UNTUK MENGHITUNG STATISTIK RIPPER ---
            function updateRipperStats() {
                const totalLossAmountEl = document.getElementById('total-loss-amount');
                const totalReportsEl = document.getElementById('total-reports');
                const latestReportNameEl = document.getElementById('latest-report-name');

                if (totalLossAmountEl && totalReportsEl && latestReportNameEl) {
                    const totalLoss = ripperData.reduce((sum, ripper) => sum + parseLoss(ripper.nominal), 0);
                    totalLossAmountEl.textContent = formatRupiah(totalLoss.toString());
                    totalReportsEl.textContent = ripperData.length.toString();
                    
                    if (ripperData.length > 0) {
                        const latestRipper = [...ripperData].sort((a,b) => b.originalIndex - a.originalIndex)[0];
                        latestReportNameEl.textContent = latestRipper.name;
                    }
                }
            }

            function parseLoss(nominalString) {
                if (typeof nominalString !== 'string') return 0;
                const number = parseInt(nominalString.replace(/[^0-9]/g, ''), 10);
                return isNaN(number) ? 0 : number;
            }

            function showRipperModal(ripperIndex) {
                currentRipperIndex = ripperIndex;
                const ripper = currentFilteredRippers[currentRipperIndex];
                const ripperId = `GNBL${ripper.originalIndex + 1}`;
                
                const whatsappLinks = ripper.whatsapp.map(link => `<div><a href="https://${link}" target="_blank" class="text-sky-400 hover:underline">${link.replace('wa.me/', '')}</a><i class="fas fa-copy copy-btn" data-copy-text="${link.replace('wa.me/', '')}"></i></div>`).join('');
                const ewalletInfo = Array.isArray(ripper.ewallet) ? ripper.ewallet.map(e => `<div>${e}<i class="fas fa-copy copy-btn" data-copy-text="${e}"></i></div>`).join('') : `<div>${ripper.ewallet}<i class="fas fa-copy copy-btn" data-copy-text="${ripper.ewallet}"></i></div>`;

                modalRipperDetails.innerHTML = `
                    <div class="ripper-modal-header">
                        <h3 class="title">Berkas Kasus: ${ripperId}</h3>
                        <div class="status-badge"><i class="fas fa-exclamation-triangle"></i><span>Data Terverifikasi</span></div>
                    </div>
                    
                    <div class="p-6">
                        <div class="text-center mb-6">
                            <img src="${ripper.imgSrc}" alt="Avatar Pelaku" class="w-24 h-24 rounded-full mx-auto mb-3 border-4 border-red-500/50 object-cover" loading="lazy">
                            <h3 class="text-2xl font-bold text-sky-300">${ripper.name}</h3>
                        </div>

                        <div class="ripper-detail-grid grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                            <!-- Data Pelaku -->
                            <div class="detail-item">
                                <div class="icon"><i class="fab fa-whatsapp"></i></div>
                                <div class="content">
                                    <div class="label">WhatsApp</div>
                                    <div class="value">${whatsappLinks}</div>
                                </div>
                            </div>
                            <div class="detail-item">
                                <div class="icon"><i class="fas fa-wallet"></i></div>
                                <div class="content">
                                    <div class="label">eWallet/No.Rek</div>
                                    <div class="value">${ewalletInfo}</div>
                                </div>
                            </div>
                            
                            <!-- Detail Kasus -->
                             <div class="detail-item">
                                <div class="icon"><i class="fas fa-file-alt"></i></div>
                                <div class="content">
                                    <div class="label">Jenis Kasus</div>
                                    <div class="value">${ripper.kasus}</div>
                                </div>
                            </div>
                             <div class="detail-item">
                                <div class="icon"><i class="fas fa-coins"></i></div>
                                <div class="content">
                                    <div class="label">Total Kerugian</div>
                                    <div class="value loss text-lg">${formatRupiah(ripper.nominal)}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="my-6 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent"></div>

                        <div>
                            <button id="toggle-proof-btn" class="hero-btn w-full text-sm bg-red-600/80 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-red-600 transition-colors">
                                <span>Lihat Bukti Laporan</span><i class="fas fa-chevron-down ml-2 text-xs transition-transform"></i>
                            </button>
                            <div id="proof-container" class="hidden mt-4 border border-slate-700 rounded-lg overflow-hidden">
                                 <img src="${ripper.imgSrc}" alt="Bukti Penipuan" class="w-full h-auto cursor-zoom-in" loading="lazy">
                            </div>
                        </div>
                    </div>
                `;
                ripperModal.classList.remove('hidden');

                const toggleBtn = modalRipperDetails.querySelector('#toggle-proof-btn');
                const proofContainer = modalRipperDetails.querySelector('#proof-container');
                const proofIcon = toggleBtn.querySelector('i');

                toggleBtn.addEventListener('click', () => {
                    const isHidden = proofContainer.classList.toggle('hidden');
                    toggleBtn.querySelector('span').textContent = isHidden ? 'Lihat Bukti Laporan' : 'Sembunyikan Bukti';
                    proofIcon.classList.toggle('fa-chevron-down', isHidden);
                    proofIcon.classList.toggle('fa-chevron-up', !isHidden);
                });

                proofContainer.querySelector('img').addEventListener('click', (e) => {
                    document.getElementById('zoomed-image').src = e.target.src;
                    document.getElementById('image-zoom-modal').classList.remove('hidden');
                });
            }

            // --- FUNGSI NAVIGASI MODAL RIPPER (BARU) ---
            const prevRipperBtn = document.getElementById('prev-ripper');
            const nextRipperBtn = document.getElementById('next-ripper');

            if (prevRipperBtn && nextRipperBtn) {
                prevRipperBtn.addEventListener('click', () => {
                    if (currentFilteredRippers.length > 0) {
                        const newIndex = (currentRipperIndex - 1 + currentFilteredRippers.length) % currentFilteredRippers.length;
                        showRipperModal(newIndex);
                    }
                });

                nextRipperBtn.addEventListener('click', () => {
                    if (currentFilteredRippers.length > 0) {
                        const newIndex = (currentRipperIndex + 1) % currentFilteredRippers.length;
                        showRipperModal(newIndex);
                    }
                });
            }

            function generateRipperList(rippers) {
                ripperListContainer.innerHTML = '';

                if (rippers.length === 0) {
                    ripperListContainer.innerHTML = `
                        <div class="col-span-full text-center py-12">
                            <i class="fas fa-search-minus text-5xl text-slate-600 mb-4"></i>
                            <h4 class="text-xl font-bold text-white">Data Tidak Ditemukan</h4>
                            <p class="text-slate-400 mt-2">Coba gunakan kata kunci lain untuk mencari data penipu.</p>
                        </div>
                    `;
                    return;
                }

                rippers.forEach((ripper, index) => {
                    const ripperId = `GNBL${ripper.originalIndex + 1}`;
                    const ripperBox = document.createElement('div');
                    const formattedNominal = formatRupiah(ripper.nominal);
                    ripperBox.className = 'ripper-box bg-slate-800/50 p-3 rounded-lg border border-slate-700 hover:border-sky-500 hover:bg-slate-800 transition-all duration-300 cursor-pointer';
                    ripperBox.innerHTML = `
                        <div class="flex items-center gap-4">
                            <div class="flex-shrink-0 w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                                <i class="fas fa-user-secret text-red-400"></i>
                            </div>
                            <div class="flex-grow overflow-hidden">
                                <h5 class="font-semibold text-sky-300 text-sm truncate">${ripper.name}</h5>
                                <p class="text-xs text-slate-400 mt-1 font-mono">${ripperId}</p>
                            </div>
                            <div class="text-right flex-shrink-0">
                                <p class="text-sm font-bold text-red-400">${formattedNominal}</p>
                            </div>
                        </div>
                    `;
                    ripperBox.addEventListener('click', () => showRipperModal(index));
                    ripperListContainer.appendChild(ripperBox);
                });
            }
            
            function updateRipperDisplay() {
                let sortedData = [...ripperData];
                switch(currentSort) {
                    case 'oldest':
                        sortedData.sort((a, b) => a.originalIndex - b.originalIndex);
                        break;
                    case 'loss-desc':
                        sortedData.sort((a, b) => parseLoss(b.nominal) - parseLoss(a.nominal));
                        break;
                    case 'loss-asc':
                        sortedData.sort((a, b) => parseLoss(a.nominal) - parseLoss(b.nominal));
                        break;
                    case 'newest':
                    default:
                         sortedData.sort((a, b) => b.originalIndex - a.originalIndex);
                        break;
                }

                const filterText = ripperSearchInput.value.toLowerCase();
                currentFilteredRippers = sortedData.filter((ripper, index) => {
                    const ripperId = `gnbl${ripper.originalIndex + 1}`;
                    const noRekString = Array.isArray(ripper.ewallet) ? ripper.ewallet.join(' ') : ripper.ewallet;
                    return ripper.name.toLowerCase().includes(filterText) || ripperId.includes(filterText) || noRekString.toLowerCase().includes(filterText);
                });

                generateRipperList(currentFilteredRippers);
            }
            
            // Menambahkan event listener untuk input pencarian
            if (ripperSearchInput) {
                ripperSearchInput.addEventListener('input', updateRipperDisplay);
            }
            
            // Memanggil fungsi-fungsi ini saat halaman dimuat agar data langsung tampil
            updateRipperStats();
            updateRipperDisplay();

            // --- Logic for the new custom dropdown ---
            const dropdownWrapper = document.getElementById('custom-dropdown-wrapper');
            if(dropdownWrapper) {
                const trigger = document.getElementById('dropdown-trigger');
                const menu = document.getElementById('dropdown-menu');
                const options = menu.querySelectorAll('.custom-dropdown-option');
                const triggerIcon = trigger.querySelector('.option-icon');
                const triggerText = trigger.querySelector('.trigger-text-content');

                trigger.addEventListener('click', () => {
                    menu.classList.toggle('open');
                    trigger.classList.toggle('open');
                });

                options.forEach(option => {
                    option.addEventListener('click', (e) => {
                        e.preventDefault();
                        if (!option.classList.contains('active')) {
                            options.forEach(opt => opt.classList.remove('active'));
                            option.classList.add('active');
                            
                            const selectedIcon = option.querySelector('.option-icon');
                            triggerIcon.className = selectedIcon.className; // Salin semua kelas dari ikon yang dipilih
                            triggerText.textContent = option.textContent.trim();

                            currentSort = option.dataset.sort;
                            updateRipperDisplay();
                        }
                        menu.classList.remove('open');
                        trigger.classList.remove('open');
                    });
                });

                // Close dropdown when clicking outside
                window.addEventListener('click', (e) => {
                    if (!dropdownWrapper.contains(e.target)) {
                         menu.classList.remove('open');
                         trigger.classList.remove('open');
                    }
                });
            }

            // --- FUNGSI & DATA TIM KAMI ---
            const teamData = [
                {
                    name: 'Parhan MP',
                    role: 'Founder & Lead Developer',
                    imgSrc: 'https://files.catbox.moe/u0189n.jpg',
                    level: 'lead',
                    bio: 'Dengan pengalaman bertahun-tahun dalam pengembangan web, saya berdedikasi untuk menciptakan solusi digital yang aman, efisien, dan modern.'
                },
                {
                    name: 'Wella Marliana',
                    role: 'UI/UX Designer',
                    imgSrc: 'https://files.catbox.moe/g2o3fv.jpg',
                    level: 'core'
                },
                {
                    name: 'Steven Wang',
                    role: 'Project Manager',
                    imgSrc: 'https://files.catbox.moe/ovzccp.jpg',
                    level: 'core'
                },
                {
                    name: 'R Raffi',
                    role: 'Marketing & SEO Specialist',
                    imgSrc: 'https://files.catbox.moe/ezgsth.jpg',
                    level: 'core'
                },
                {
                    name: 'Liu Han',
                    role: 'Customer Support',
                    imgSrc: 'https://files.catbox.moe/b6oj1q.jpg',
                    level: 'core'
                }
            ];

            function generateTeamCards() {
                const founderContainer = document.getElementById('team-founder-container');
                const coreContainer = document.getElementById('team-core-container');

                if (!founderContainer || !coreContainer) return;

                founderContainer.innerHTML = '';
                coreContainer.innerHTML = '';

                teamData.forEach(member => {
                    if (member.level === 'lead') {
                        const founderCardHTML = `
                            <div class="team-founder-card rounded-xl shadow-lg w-full max-w-2xl">
                                <div class="grid md:grid-cols-3 items-center">
                                    <div class="p-6 md:p-0">
                                        <img src="${member.imgSrc}" alt="Foto ${member.name}" class="w-32 h-32 md:w-full md:h-full object-cover rounded-full md:rounded-none md:rounded-l-xl mx-auto" loading="lazy">
                                    </div>
                                    <div class="md:col-span-2 px-6 pb-6 md:py-6 md:pr-6">
                                    <h4 class="text-xl font-bold text-white text-center md:text-left">${member.name}</h4>
                                    <p class="text-md text-sky-400 text-center md:text-left">${member.role}</p>
                                    <p class="text-sm text-slate-300 mt-3 text-center md:text-left italic border-l-2 border-sky-500/50 pl-3">"${member.bio}"</p>
                                </div>
                            </div>
                        </div>
                        `;
                        founderContainer.innerHTML = founderCardHTML;
                    } else {
                        const memberCardHTML = `
                            <div class="team-member-card rounded-lg text-center">
                                <div class="img-wrapper h-64">
                                    <img src="${member.imgSrc}" alt="Foto ${member.name}" class="w-full h-full object-cover object-top" loading="lazy">
                                </div>
                                <div class="team-member-info p-5">
                                    <h5 class="font-semibold text-white">${member.name}</h5>
                                    <p class="text-xs text-sky-400">${member.role}</p>
                                </div>
                            </div>
                        `;
                        coreContainer.innerHTML += memberCardHTML;
                    }
                });
            }

            generateTeamCards();

            // --- DATA PRODUK & MODAL ---
            const productModal = document.getElementById('product-modal');
            const productModalContent = document.getElementById('product-modal-content');
            const modalProductDetails = document.getElementById('modal-product-details');
            const productData = [
                 { name: 'Nokos Indonesia', price: 'Mulai dari Rp 5.000', imgSrc: 'https://files.catbox.moe/17om8d.jpg', description: 'Dapatkan nomor virtual WhatsApp Indonesia sekali pakai untuk verifikasi aman dan menjaga privasi online Anda. Proses cepat dan instan.', features: ['Aktivasi Instan', 'Privasi Terjamin', 'Tanpa Aplikasi Tambahan', 'Sekali Pakai (One-Time Use)'] },
                 { name: 'Jasa Website (Front-End)', isTiered: true, tiers: [
                     { name: 'Paket Reguler', price: 'Rp 250.000', features: ['Desain Responsif', 'Setup Domain & Hosting', '2x Revisi Desain', 'Garansi 1 Bulan'] },
                     { name: 'Paket Premium', price: 'Rp 750.000', popular: true, features: ['Semua di Paket Reguler', 'Desain Premium & Kustom', 'Animasi Interaktif', '5x Revisi Desain', 'Garansi 3 Bulan'] },
                     { name: 'Paket VIP', price: 'Rp 1.500.000', features: ['Semua di Paket Premium', 'Fitur Interaktif Lanjutan', 'Optimasi Kecepatan', 'Revisi Tanpa Batas', 'Dukungan Prioritas'] }
                 ]},
                 { name: 'Jasa Rekber', price: 'Fee Mulai dari Rp 1.000', imgSrc: 'https://files.catbox.moe/ygx3ln.jpg', description: 'Transaksi online aman dengan layanan rekening bersama (rekber) terpercaya kami sebagai penengah. Cepat, mudah, dan biaya terjangkau.', features: ['Proses Cepat & Mudah', 'Fee Sangat Terjangkau', 'Mediator Terpercaya', 'Keamanan Dana Terjamin'] },
                 { name: 'Partnership', price: 'Mulai dari Rp 125.000', imgSrc: 'https://files.catbox.moe/ulqz43.jpg', description: 'Bergabunglah dengan program kemitraan kami dan raih berbagai keuntungan eksklusif serta peluang pertumbuhan bersama. Dapatkan visibilitas lebih luas.', features: ['Visibilitas Luas', 'Label Terverifikasi', 'Dukungan Penuh dari Tim', 'Peluang Pertumbuhan Bisnis'] },
            ];
            let currentProductIndex = 0;
            function showProductModal(index) {
                currentProductIndex = index;
                const product = productData[index];
                let contentHTML = '';

                // Sesuaikan ukuran modal berdasarkan tipe produk (ukuran diperkecil lagi agar fit)
                productModalContent.classList.toggle('max-w-4xl', product.isTiered);
                productModalContent.classList.toggle('max-w-xl', !product.isTiered);
                // Hapus class lama untuk memastikan tidak ada konflik
                productModalContent.classList.remove('max-w-5xl', 'max-w-3xl', 'max-w-2xl');

                if (product.isTiered) {
                    let tiersHTML = product.tiers.map(tier => `
                        <div class="relative flex flex-col product-tier-card ${tier.popular ? 'popular' : ''} rounded-xl p-5 pt-8 flex-1">
                            ${tier.popular ? `
                                <div class="absolute -top-2 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold uppercase z-20 tag-premium-popular">
                                    <i class="fas fa-fire-alt mr-1.5"></i>Terlaris
                                </div>
                            ` : ''}
                            <h4 class="text-lg font-bold ${tier.popular ? 'text-sky-400' : 'text-white'}">${tier.name}</h4>
                            <p class="text-2xl font-extrabold my-3 text-white">${tier.price}</p>
                            <ul class="space-y-2 text-sm text-slate-300 mb-6 flex-grow border-t border-slate-700 pt-4">
                                ${tier.features.map(f => `<li class="flex items-start"><i class="fas fa-check-circle text-sky-500 mr-2.5 mt-1 flex-shrink-0"></i><span>${f}</span></li>`).join('')}
                            </ul>
                            <a href="https://wa.me/+6285218726234" target="_blank" class="hero-btn mt-auto w-full text-center ${tier.popular ? 'bg-sky-600 hover:bg-sky-700' : 'bg-slate-700 hover:bg-slate-600'} text-white font-bold px-5 py-2.5 rounded-lg text-sm">Pilih Paket</a>
                        </div>`).join('');
                    contentHTML = `
                    <div class="text-center mb-6">
                        <h3 class="text-2xl font-bold gradient-text animated-gradient-text">${product.name}</h3>
                        <p class="text-slate-400 mt-2 text-sm">Pilih paket yang paling sesuai untuk kebutuhan Anda.</p>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">${tiersHTML}</div>`;
                } else {
                    contentHTML = `
                        <div class="flex flex-col md:flex-row md:items-start text-left gap-8">
                            <div class="flex-shrink-0 mx-auto md:mx-0">
                                <img src="${product.imgSrc}" alt="${product.name}" class="w-40 h-40 rounded-lg shadow-2xl shadow-black/50 object-cover">
                            </div>
                            <div class="flex-grow w-full">
                                <h3 class="text-2xl font-bold text-white mb-2">${product.name}</h3>
                                <p class="text-xl font-bold text-sky-400 mb-4">${product.price}</p>
                                <p class="text-slate-300 mb-4 leading-relaxed text-sm">${product.description}</p>
                                
                                <div class="border-t border-slate-800 my-4"></div>
                                
                                <h4 class="font-semibold text-white mb-3 text-sm">Fitur Utama:</h4>
                                <ul class="space-y-2 text-slate-300 mb-6 text-sm">
                                    ${product.features.map(f => `
                                    <li class="flex items-center justify-start">
                                        <div class="w-7 h-7 rounded-full bg-sky-500/10 flex items-center justify-center mr-3 flex-shrink-0 border border-sky-500/20">
                                            <i class="fas fa-check text-sky-400 text-xs"></i>
                                        </div>
                                        <span>${f}</span>
                                    </li>`).join('')}
                                </ul>
                                <div class="flex justify-start">
                                    <a href="https://wa.me/+6285218726234" target="_blank" class="hero-btn w-full sm:w-auto bg-sky-600 text-white font-bold px-5 py-2.5 rounded-lg hover:bg-sky-700 inline-flex items-center justify-center shadow-lg text-sm">
                                        <span>Pesan Sekarang</span>
                                        <i class="fab fa-whatsapp ml-2 btn-icon"></i>
                                    </a>
                                </div>
                            </div>
                        </div>`;
                }
                modalProductDetails.innerHTML = contentHTML;
                productModal.classList.remove('hidden');
            }
            document.querySelectorAll('.product-card button, .footer-product-link').forEach(el => {
                const index = parseInt(el.closest('[data-index],[data-product-index]').dataset.index || el.closest('[data-index],[data-product-index]').dataset.productIndex, 10);
                el.addEventListener('click', (e) => { e.preventDefault(); showProductModal(index); });
            });
            document.getElementById('prev-product').addEventListener('click', () => showProductModal((currentProductIndex - 1 + productData.length) % productData.length));
            document.getElementById('next-product').addEventListener('click', () => showProductModal((currentProductIndex + 1) % productData.length));
            
            // --- ANIMASI HITUNG ---
            const counterObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const counter = entry.target;
                        const targetValue = counter.dataset.target; // Get value as string

                        // Hanya proses jika data-target ada dan merupakan angka
                        if (targetValue && !isNaN(targetValue)) {
                            const target = +targetValue;
                            const isAchievementCounter = counter.classList.contains('counting-number-re');
                            
                            // Langsung tampilkan angka tanpa animasi
                            counter.innerText = target.toLocaleString('id-ID') + (isAchievementCounter ? '+' : '');
                        }
                        // Jika tidak ada data-target, biarkan teks HTML asli

                        observer.unobserve(counter);
                    }
                });
            }, { threshold: 0.8 });

            document.querySelectorAll('.counting-number-re, #social-proof-counter').forEach(counter => {
                counterObserver.observe(counter);
            });


            // --- FAQ ACCORDION ---
            const faqList = document.getElementById('faq-list');
            if(faqList) {
                faqList.addEventListener('click', (e) => {
                    const questionButton = e.target.closest('.faq-question');
                    if (!questionButton) return;

                    const faqItem = questionButton.parentElement;
                    const answer = questionButton.nextElementSibling;
                    const isActive = faqItem.classList.contains('active');
                    
                    // Close other active items
                    faqList.querySelectorAll('.faq-item.active').forEach(activeItem => {
                        if (activeItem !== faqItem) {
                            activeItem.classList.remove('active');
                            activeItem.querySelector('.faq-answer').style.maxHeight = null;
                        }
                    });

                    // Toggle current item
                    faqItem.classList.toggle('active', !isActive);
                    answer.style.maxHeight = !isActive ? answer.scrollHeight + "px" : null;
                });

                // --- FAQ Search and Filter ---
                const searchInput = document.getElementById('faq-search');
                const categoryButtons = document.querySelectorAll('#faq-categories .faq-category-btn');
                const faqItems = faqList.querySelectorAll('.faq-item');
                const noResultsMsg = document.getElementById('faq-no-results');
                let activeFilter = 'all';

                function filterAndSearchFAQs() {
                    const searchTerm = searchInput.value.toLowerCase();
                    let hasVisibleItems = false;

                    faqItems.forEach(item => {
                        const category = item.dataset.category;
                        const questionText = item.querySelector('.faq-question span').textContent.toLowerCase();
                        const answerText = item.querySelector('.faq-answer p').textContent.toLowerCase();

                        const categoryMatch = activeFilter === 'all' || category === activeFilter;
                        const searchMatch = questionText.includes(searchTerm) || answerText.includes(searchTerm);

                        if (categoryMatch && searchMatch) {
                            item.style.display = 'block';
                            hasVisibleItems = true;
                        } else {
                            item.style.display = 'none';
                        }
                    });

                    noResultsMsg.classList.toggle('hidden', hasVisibleItems);
                }

                searchInput.addEventListener('input', filterAndSearchFAQs);

                categoryButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        categoryButtons.forEach(btn => btn.classList.remove('active'));
                        button.classList.add('active');
                        activeFilter = button.dataset.filter;
                        filterAndSearchFAQs();
                    });
                });
            }


            // --- LOGIKA SUB-TAB PROSES LAYANAN ---
            const serviceProcessTabs = document.querySelectorAll('#service-process-tabs .subtab-btn');
            const serviceProcessContents = document.querySelectorAll('.service-process-content');

            serviceProcessTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    serviceProcessTabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');

                    const targetId = tab.dataset.target;
                    serviceProcessContents.forEach(content => {
                        content.classList.toggle('hidden', content.id !== targetId);
                    });
                });
            });

            // --- LOGIKA SUB-TAB RIPPER ---
            const ripperSubtabs = document.querySelectorAll('#ripper-subtabs .subtab-btn');
            const ripperSubtabPanels = document.querySelectorAll('.ripper-subtab-panel');

             ripperSubtabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    ripperSubtabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');

                    const targetId = tab.dataset.target;
                    ripperSubtabPanels.forEach(content => {
                        content.classList.toggle('hidden', content.id !== targetId);
                    });
                });
            });
            
            // --- LOGIKA ALAT PENGECEKAN KEAMANAN ---
            const securityCheckDropdown = document.getElementById('security-check-dropdown');
            if (securityCheckDropdown) {
                const trigger = document.getElementById('security-check-dropdown-trigger');
                const menu = document.getElementById('security-check-dropdown-menu');
                const options = menu.querySelectorAll('.custom-dropdown-option');
                const triggerIcon = trigger.querySelector('.option-icon');
                const triggerText = trigger.querySelector('.trigger-text-content');
                const checkInput = document.getElementById('security-check-input');
                let currentCheckType = 'rekening'; // Default

                trigger.addEventListener('click', () => {
                    menu.classList.toggle('open');
                    trigger.classList.toggle('open');
                });

                options.forEach(option => {
                    option.addEventListener('click', (e) => {
                        e.preventDefault();
                        if (!option.classList.contains('active')) {
                            options.forEach(opt => opt.classList.remove('active'));
                            option.classList.add('active');
                            
                            const selectedIconClass = option.dataset.icon;
                            triggerIcon.className = `fas ${selectedIconClass} option-icon`;
                            triggerText.textContent = option.textContent.trim();
                            checkInput.placeholder = option.dataset.placeholder;
                            currentCheckType = option.dataset.value;
                        }
                        menu.classList.remove('open');
                        trigger.classList.remove('open');
                    });
                });

                window.addEventListener('click', (e) => {
                    if (!securityCheckDropdown.contains(e.target)) {
                        menu.classList.remove('open');
                        trigger.classList.remove('open');
                    }
                });

                const checkBtn = document.getElementById('security-check-btn');
                const resultContainer = document.getElementById('security-check-result');

                checkBtn.addEventListener('click', () => {
                    const inputValue = checkInput.value.trim();
                    const buttonText = checkBtn.querySelector('.button-text');
                    const buttonSpinner = checkBtn.querySelector('.button-spinner');

                    if (!inputValue) {
                        showToast('Harap masukkan nomor untuk diperiksa.', 'error');
                        return;
                    }
                    
                    const normalizedInput = inputValue.replace(/[^0-9]/g, '');

                    // --- VALIDASI BARU ---
                    if (currentCheckType === 'whatsapp') {
                        if (!normalizedInput.startsWith('62')) {
                            showToast('Nomor WhatsApp wajib diawali dengan format 62.', 'error');
                            return;
                        }
                        if (normalizedInput.length < 10) {
                            showToast('Nomor WhatsApp minimal terdiri dari 10 digit.', 'error');
                            return;
                        }
                    }

                    if (currentCheckType === 'rekening') {
                        if (normalizedInput.length < 8) {
                            showToast('Nomor Rekening minimal terdiri dari 8 digit.', 'error');
                            return;
                        }
                    }
                    // --- AKHIR VALIDASI BARU ---

                    buttonText.classList.add('hidden');
                    buttonSpinner.classList.remove('hidden');
                    checkBtn.disabled = true;
                    resultContainer.classList.remove('visible');

                    setTimeout(() => {
                        let foundRipper = null;
                        
                        if (currentCheckType === 'rekening') {
                            foundRipper = ripperData.find(ripper => {
                                const ewallets = Array.isArray(ripper.ewallet) ? ripper.ewallet : [ripper.ewallet];
                                return ewallets.some(ew => ew.replace(/[^0-9]/g, '').includes(normalizedInput));
                            });
                        } else { // whatsapp
                             foundRipper = ripperData.find(ripper => {
                                return ripper.whatsapp.some(wa => wa.replace(/[^0-9]/g, '').includes(normalizedInput));
                            });
                        }
                        
                        let resultHTML = '';
                        if (foundRipper) {
                            const foundIndex = currentFilteredRippers.findIndex(r => r.originalIndex === foundRipper.originalIndex);
                            resultHTML = `
                                <div class="result-card result-card-found p-4 rounded-lg">
                                    <i class="fas fa-exclamation-triangle result-icon result-icon-found"></i>
                                    <div class="flex-grow">
                                        <h4 class="font-bold text-white text-sm">Data Ditemukan!</h4>
                                        <p class="text-xs text-slate-300">Nomor ini terindikasi terkait dengan laporan penipuan atas nama <strong>${foundRipper.name}</strong>.</p>
                                    </div>
                                    <button class="view-report-btn hero-btn bg-red-600 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-red-700 text-xs" data-ripper-index="${foundIndex}">
                                        Lihat Laporan
                                    </button>
                                </div>
                            `;
                        } else {
                            resultHTML = `
                                <div class="result-card result-card-safe p-4 rounded-lg">
                                    <i class="fas fa-check-circle result-icon result-icon-safe"></i>
                                    <div>
                                        <h4 class="font-bold text-white text-sm">Tidak Ditemukan di Database</h4>
                                        <p class="text-xs text-slate-300">Nomor ini tidak ada dalam daftar ripper kami. <strong class="text-amber-300 block mt-1">Ingat: Tidak terdaftar bukan berarti 100% aman.</strong> Database ini hanya berisi data yang telah dilaporkan. Tetap waspada.</p>
                                    </div>
                                </div>
                            `;
                        }
                        
                        resultContainer.innerHTML = resultHTML;
                        resultContainer.classList.add('visible');

                        const viewReportBtn = resultContainer.querySelector('.view-report-btn');
                        if (viewReportBtn) {
                            viewReportBtn.addEventListener('click', (e) => {
                                const indexToShow = parseInt(e.target.dataset.ripperIndex, 10);
                                if(indexToShow > -1) {
                                     showRipperModal(indexToShow);
                                } else {
                                    showToast('Laporan tidak ditemukan di daftar saat ini. Coba hapus filter pencarian.', 'error');
                                }
                            });
                        }
                        
                        buttonText.classList.remove('hidden');
                        buttonSpinner.classList.add('hidden');
                        checkBtn.disabled = false;
                    }, 1500);
                });
            }

            // --- FUNGSI MODAL GENERIC ---
            const allModals = document.querySelectorAll('.modal-view');
            function setupModal(triggerId, modalId, closeId) {
                const trigger = document.getElementById(triggerId);
                const modal = document.getElementById(modalId);
                const close = document.getElementById(closeId);

                // Selalu pasang listener untuk tombol tutup jika ada
                if (modal && close) {
                    close.addEventListener('click', () => modal.classList.add('hidden'));
                }

                // Pasang listener untuk tombol pemicu HANYA jika ada
                if (trigger && modal) {
                    trigger.addEventListener('click', () => modal.classList.remove('hidden'));
                }
            }
            setupModal('report-scammer-btn', 'report-modal', 'close-report-modal');
            setupModal('submit-testimonial-btn', 'testimonial-modal', 'close-testimonial-modal');
            setupModal('register-partner-btn', 'partner-modal', 'close-partner-modal');
            setupModal(null, 'ripper-modal', 'close-modal');
            setupModal(null, 'product-modal', 'close-product-modal');
            setupModal(null, 'news-modal', 'close-news-modal');
            setupModal(null, 'partner-detail-modal', 'close-partner-detail-modal');
            setupModal(null, 'image-zoom-modal', 'close-zoom-modal');
            setupModal(null, 'welcome-modal', 'close-welcome-modal');
            setupModal('privacy-policy-link', 'privacy-policy-modal', 'close-privacy-modal');
            setupModal('terms-conditions-link', 'terms-conditions-modal', 'close-terms-modal');


            // --- NOTIFIKASI TOAST ---
            function showToast(message, type = 'success') {
                const toastContainer = document.getElementById('toast-container');
                const toast = document.createElement('div');
                const icon = type === 'success' ? 'fa-check-circle' : 'fa-times-circle';
                toast.className = `toast p-4 rounded-lg shadow-lg text-white text-sm flex items-center ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`;
                toast.innerHTML = `<i class="fas ${icon} mr-3"></i> ${message}`;
                toastContainer.appendChild(toast);
                setTimeout(() => {
                    toast.classList.add('removing');
                    toast.addEventListener('animationend', () => toast.remove());
                }, 3000);
            }
            
            // --- COPY KE CLIPBOARD ---
            function copyToClipboard(text, iconElement) {
                const textArea = document.createElement("textarea");
                textArea.value = text;
                
                // Hindari gangguan visual dan scroll
                textArea.style.top = "0";
                textArea.style.left = "0";
                textArea.style.position = "fixed";

                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                try {
                    const successful = document.execCommand('copy');
                    if (successful) {
                        showToast(`Teks berhasil disalin: ${text}`);
                        if (iconElement) {
                            const originalClass = iconElement.className;
                            iconElement.className = 'fas fa-check text-green-500';
                            setTimeout(() => {
                                // Pastikan elemen masih ada sebelum mengubah kembali kelasnya
                                if (document.body.contains(iconElement)) {
                                   iconElement.className = originalClass;
                                }
                            }, 2000);
                        }
                    } else {
                         showToast('Gagal menyalin teks.', 'error');
                    }
                } catch (err) {
                    showToast('Gagal menyalin teks.', 'error');
                }

                document.body.removeChild(textArea);
            }
            document.body.addEventListener('click', (e) => {
                if (e.target.classList.contains('copy-btn')) {
                    copyToClipboard(e.target.dataset.copyText, e.target);
                }
            });

            // --- SUBMISI FORM AJAX ---
            function setupFormspreeAjax(formId, successMessage) {
                const form = document.getElementById(formId);
                if (!form) return;
                form.addEventListener("submit", async function(event) {
                    event.preventDefault();

                    // Custom validation for contact form dropdown
                    if (formId === 'contact-form') {
                        const subjectInput = document.getElementById('subject-value');
                        const subjectTrigger = document.getElementById('contact-dropdown-trigger');
                        if (!subjectInput.value) {
                            showToast('Harap pilih topik pesan.', 'error');
                            subjectTrigger.classList.add('invalid');
                            subjectTrigger.focus();
                            return; 
                        } else {
                             subjectTrigger.classList.remove('invalid');
                        }
                    }

                    const button = form.querySelector('button[type="submit"]');
                    const buttonText = button.querySelector('.button-text');
                    const buttonSpinner = button.querySelector('.button-spinner');
                    button.disabled = true;
                    if(buttonText) buttonText.classList.add('hidden');
                    if(buttonSpinner) buttonSpinner.classList.remove('hidden');

                    try {
                        const response = await fetch(event.target.action, { method: form.method, body: new FormData(event.target), headers: { 'Accept': 'application/json' } });
                        if (response.ok) {
                            showToast(successMessage, 'success');
                            form.reset();
                            const parentModal = form.closest('.modal-view');
                            if(parentModal) parentModal.classList.add('hidden');
                        } else {
                            const data = await response.json();
                            const errorMsg = data.errors ? data.errors.map(e => e.message).join(", ") : "Oops! Terjadi masalah.";
                            showToast(errorMsg, 'error');
                        }
                    } catch (error) {
                        showToast("Oops! Terjadi masalah koneksi.", 'error');
                    } finally {
                        button.disabled = false;
                        if(buttonText) buttonText.classList.remove('hidden');
                        if(buttonSpinner) buttonSpinner.classList.add('hidden');
                    }
                });
            }
            setupFormspreeAjax('contact-form', 'Terima kasih! Pesan Anda telah terkirim.');
            setupFormspreeAjax('report-form', 'Terima kasih! Laporan Anda telah terkirim.');
            setupFormspreeAjax('testimonial-form', 'Terima kasih! Ulasan Anda telah terkirim.');
            setupFormspreeAjax('partner-form', 'Terima kasih! Pengajuan Anda akan kami tinjau.');
            setupFormspreeAjax('newsletter-form', 'Terima kasih telah berlangganan!');

            // --- Logika untuk Dropdown Kontak ---
            const contactDropdownWrapper = document.getElementById('contact-dropdown-wrapper');
            if(contactDropdownWrapper) {
                const trigger = document.getElementById('contact-dropdown-trigger');
                const menu = document.getElementById('contact-dropdown-menu');
                const options = menu.querySelectorAll('.custom-dropdown-option');
                const triggerText = trigger.querySelector('span');
                const hiddenInput = document.getElementById('subject-value');

                trigger.addEventListener('click', () => {
                    menu.classList.toggle('open');
                    trigger.classList.toggle('open');
                    trigger.classList.remove('invalid'); // Remove invalid state on interaction
                });

                 options.forEach(option => {
                    option.addEventListener('click', (e) => {
                        e.preventDefault();
                        triggerText.textContent = option.textContent;
                        hiddenInput.value = option.dataset.value;
                        // Trigger input event for live validation feedback
                        hiddenInput.dispatchEvent(new Event('input')); 

                        menu.classList.remove('open');
                        trigger.classList.remove('open');
                    });
                });

                window.addEventListener('click', (e) => {
                    if (!contactDropdownWrapper.contains(e.target)) {
                        menu.classList.remove('open');
                        trigger.classList.remove('open');
                    }
                });
            }

            // --- POPUP SELAMAT DATANG ---
            const welcomeModal = document.getElementById('welcome-modal');
            const closeWelcomeBtn = document.getElementById('close-welcome-modal');
            const dismissCheckbox = document.getElementById('dismiss-welcome');

            if (welcomeModal && closeWelcomeBtn && dismissCheckbox) {
                // Periksa apakah popup ditutup permanen ATAU sudah tampil di sesi ini
                if (!localStorage.getItem('welcomePopupPermanentDismiss') && !sessionStorage.getItem('welcomePopupShown')) {
                    setTimeout(() => {
                        welcomeModal.classList.remove('hidden');
                        sessionStorage.setItem('welcomePopupShown', 'true');
                    }, 1500);
                }

                const closeAndDismiss = () => {
                    if (dismissCheckbox.checked) {
                        localStorage.setItem('welcomePopupPermanentDismiss', 'true');
                    }
                    welcomeModal.classList.add('hidden');
                };

                closeWelcomeBtn.addEventListener('click', closeAndDismiss);

                // Tutup juga saat link di dalam popup diklik
                welcomeModal.querySelectorAll('a').forEach(link => {
                    link.addEventListener('click', closeAndDismiss);
                });
            }
            
            // --- TOMBOL KEMBALI KE ATAS ---
            const backToTopButton = document.getElementById('back-to-top');
            if (backToTopButton) {
                window.addEventListener('scroll', () => {
                    backToTopButton.classList.toggle('visible', window.scrollY > 300);
                });
                backToTopButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            }
            
            // --- FUNGSI & DATA TESTIMONI ---
            const testimonialData = [
                { name: 'Andi Wijaya', role: 'Pengusaha', stars: 5, avatar: 'https://placehold.co/48x48/38bdf8/ffffff?text=AW', quote: "Layanan pembuatan websitenya luar biasa! Timnya profesional dan hasilnya melebihi ekspektasi saya. Sangat direkomendasikan." },
                { name: 'Sari Kumala', role: 'Freelancer', stars: 5, avatar: 'https://placehold.co/48x48/38bdf8/ffffff?text=SK', quote: "Rekber di Market Nusantara sangat membantu transaksi saya. Prosesnya cepat, aman, dan biayanya sangat terjangkau. Terima kasih!" },
                { name: 'Dodi Hermawan', role: 'Mahasiswa', stars: 5, avatar: 'https://placehold.co/48x48/38bdf8/ffffff?text=DH', quote: "Butuh nomor untuk verifikasi dan langsung dapat dari sini. Prosesnya instan dan harganya murah banget. Sangat berguna!" },
                { name: 'Budi Prasetyo', role: 'Afiliasi Pemasaran', stars: 5, avatar: 'https://placehold.co/48x48/38bdf8/ffffff?text=BP', quote: "Program partnership-nya sangat menguntungkan. Saya bisa mendapatkan penghasilan tambahan dengan mudah. Support system-nya juga responsif!" },
                { name: 'Cindy Lim', role: 'Pemilik Toko Online', stars: 5, avatar: 'https://placehold.co/48x48/38bdf8/ffffff?text=CL', quote: "Sangat puas dengan website yang dibuatkan. Desainnya modern dan loading-nya cepat. Penjualan saya langsung meningkat!" }
            ];

            function generateTestimonials() {
                const swiperWrapper = document.querySelector('.testimonial-swiper .swiper-wrapper');
                if (!swiperWrapper) return;

                let slidesHTML = '';
                testimonialData.forEach(testimonial => {
                    const starsHTML = Array(testimonial.stars).fill('<i class="fas fa-star text-amber-400"></i>').join('') + Array(5 - testimonial.stars).fill('<i class="far fa-star text-amber-400"></i>').join('');
                    
                    slidesHTML += `
                        <div class="swiper-slide h-auto">
                            <div class="testimonial-card p-6 rounded-xl relative overflow-hidden">
                                <i class="fas fa-quote-left quote-icon"></i>
                                <div class="card-content">
                                    <div class="mb-4">${starsHTML}</div>
                                    <p class="card-text text-slate-300 italic text-sm mb-6">${testimonial.quote}</p>
                                    <div class="mt-auto flex items-center">
                                        <img src="${testimonial.avatar}" class="w-12 h-12 rounded-full object-cover border-2 border-slate-700" alt="${testimonial.name}" loading="lazy">
                                        <div class="ml-4">
                                            <h4 class="font-semibold text-white">${testimonial.name}</h4>
                                            <p class="text-sm text-slate-400">${testimonial.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                });
                swiperWrapper.innerHTML = slidesHTML;
            }
            
            generateTestimonials(); // Panggil fungsi untuk membuat slide

            // --- SWIPER JS INITIALIZATION ---
            new Swiper('.testimonial-swiper', {
                slidesPerView: 1, 
                spaceBetween: 30, 
                loop: true,
                autoplay: { 
                    delay: 4000, 
                    disableOnInteraction: false 
                },
                pagination: { 
                    el: '.testimonial-swiper .swiper-pagination', 
                    clickable: true 
                },
                navigation: {
                    nextEl: '.swiper-button-next-custom',
                    prevEl: '.swiper-button-prev-custom',
                },
                breakpoints: { 
                    768: { slidesPerView: 2 }, 
                    1024: { slidesPerView: 3 } 
                },
            });

            // --- LOGIKA PARTNER ---
            const partnerData = [
                { name: 'Digital Store', category: 'toko-online', categoryText: 'Toko Online', avatar: 'https://placehold.co/96x96/1e293b/ffffff?text=DS', description: 'Menyediakan berbagai macam produk digital dengan transaksi aman.', fullDescription: 'Digital Store adalah pelopor dalam penjualan produk digital terverifikasi. Dari lisensi software hingga item game, kami memastikan setiap transaksi berjalan lancar dan aman. Kami bangga menjadi mitra Market Nusantara untuk menjangkau audiens yang lebih luas.', socials: { website: '#', instagram: '#' } },
                { name: 'Artisan Graphics', category: 'jasa-desain', categoryText: 'Jasa Desain Grafis', avatar: 'https://placehold.co/96x96/1e293b/ffffff?text=AG', description: 'Layanan desain logo, branding, dan ilustrasi profesional.', fullDescription: 'Artisan Graphics terdiri dari tim desainer berbakat yang berfokus pada pembuatan identitas visual yang kuat untuk brand Anda. Kami percaya bahwa desain yang baik adalah investasi. Verifikasi dari Market Nusantara adalah bukti komitmen kami terhadap kualitas.', socials: { website: '#', instagram: '#' } }
            ];
            document.querySelectorAll('.partner-filter-btn').forEach(button => {
                button.addEventListener('click', () => {
                    document.querySelectorAll('.partner-filter-btn').forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    const filter = button.dataset.filter;
                    document.querySelectorAll('#partner-list > div').forEach(partner => {
                        partner.style.display = (filter === 'all' || partner.dataset.category === filter) ? 'block' : 'none';
                    });
                });
            });
            document.querySelectorAll('#partner-list .partner-card').forEach(card => {
                card.addEventListener('click', () => {
                    const partner = partnerData[card.dataset.partnerIndex];
                    document.getElementById('modal-partner-details').innerHTML = `
                        <div class="p-8">
                            <!-- Info Utama -->
                            <div class="flex flex-col items-center text-center">
                                <img class="w-28 h-28 rounded-full mb-4 border-4 border-slate-700 object-cover shadow-lg" src="${partner.avatar}" alt="${partner.name}" loading="lazy">
                                <div class="relative inline-flex items-center gap-2">
                                    <h3 class="text-2xl font-bold text-sky-300">${partner.name}</h3>
                                    <div class="text-green-400 text-lg" title="Mitra Terverifikasi">
                                        <i class="fas fa-check-circle"></i>
                                    </div>
                                </div>
                                <p class="text-slate-400 text-sm">${partner.categoryText}</p>
                            </div>

                            <!-- Divider -->
                            <div class="my-6 h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent"></div>
                            
                            <!-- Deskripsi -->
                            <div>
                                <h4 class="font-semibold text-white mb-2">Tentang Mitra</h4>
                                <p class="text-slate-300 text-sm">${partner.fullDescription}</p>
                            </div>
                            
                            <!-- Divider -->
                            <div class="my-6 h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent"></div>

                            <!-- Tautan Sosial Media -->
                            <div>
                                <h4 class="font-semibold text-white mb-4 text-center">Hubungi Mitra</h4>
                                <div class="flex justify-center gap-4">
                                    <a href="${partner.socials.website}" target="_blank" class="social-link-btn">
                                        <i class="fas fa-globe mr-2"></i> Website
                                    </a>
                                    <a href="${partner.socials.instagram}" target="_blank" class="social-link-btn">
                                        <i class="fab fa-instagram mr-2"></i> Instagram
                                    </a>
                                </div>
                            </div>
                        </div>
                    `;
                    document.getElementById('partner-detail-modal').classList.remove('hidden');
                });
            });

            // Tambahkan listener untuk tombol pendaftaran di slot kosong
            document.querySelectorAll('.register-partner-trigger').forEach(button => {
                button.addEventListener('click', () => {
                     document.getElementById('partner-modal').classList.remove('hidden');
                });
            });

            // --- LOGIKA BERITA ---
            const newsData = [
                 { 
                    title: "Program Mitra Diperbarui: Raih Keuntungan Lebih Besar!",
                    date: "21 Sep 2025",
                    category: "update",
                    tag: { text: "UPDATE", class: "tag-update", icon: "fas fa-bullhorn" },
                    thumbnail: "https://files.catbox.moe/ulqz43.jpg",
                    fullContent: "Kabar baik untuk para mitra kami! Program Partnership telah kami perbarui dengan skema keuntungan yang lebih menarik dan benefit eksklusif. Kini, Anda bisa mendapatkan visibilitas yang lebih luas dan dukungan penuh dari tim kami untuk mengembangkan bisnis Anda bersama Market Nusantara. Segera pelajari pembaruan ini di halaman mitra!"
                },
                { 
                    title: "Promo Akhir Pekan: Biaya Rekber Hanya Rp 1.000!",
                    date: "21 Sep 2025",
                    category: "promo",
                    tag: { text: "PROMO", class: "tag-promo", icon: "fas fa-percent" },
                    thumbnail: "https://files.catbox.moe/ygx3ln.jpg",
                    fullContent: "Transaksi aman tidak perlu mahal! Khusus akhir pekan ini, nikmati promo spesial biaya layanan Rekber hanya Rp 1.000 untuk semua nominal transaksi. Ini adalah kesempatan terbaik untuk mengamankan jual-beli online Anda tanpa khawatir. Ajak teman Anda dan nikmati transaksinya!"
                },
                { 
                    title: "5 Tanda Anda Berurusan dengan Penjual Terpercaya",
                    date: "20 Sep 2025",
                    category: "tips",
                    tag: { text: "TIPS", class: "tag-tips", icon: "fas fa-lightbulb" },
                    thumbnail: "https://files.catbox.moe/tbms70.jpg",
                    fullContent: "Belanja online dengan lebih percaya diri! Kenali 5 tanda penjual yang dapat dipercaya:\n1. Memiliki reputasi dan ulasan yang baik.\n2. Profil yang jelas dan informatif.\n3. Komunikasi yang responsif dan profesional.\n4. Menyediakan foto produk asli dan detail.\n5. **Selalu bersedia menggunakan jasa Rekber.** Jangan ragu untuk meminta penggunaan Rekber demi keamanan transaksi Anda."
                },
                { 
                    title: "Promo Merdeka Digital: Diskon 50% Jasa Website!",
                    date: "20 Sep 2025",
                    category: "promo",
                    tag: { text: "PROMO", class: "tag-promo", icon: "fas fa-percent" },
                    thumbnail: "https://files.catbox.moe/4f05u8.jpg",
                    fullContent: "Wujudkan website impian Anda sekarang! Dalam rangka merayakan kemerdekaan digital, kami memberikan diskon spesial sebesar 50% untuk semua paket jasa pembuatan website (Front-End). Dapatkan website modern, cepat, dan responsif dengan setengah harga. Promo ini terbatas, hubungi kami sekarang juga sebelum kehabisan!"
                },
                { 
                    title: "Update Besar: Fitur Komunitas Disqus & Perombakan UI!",
                    date: "20 Sep 2025",
                    category: "update",
                    tag: { text: "UPDATE", class: "tag-update", icon: "fas fa-bullhorn" },
                    thumbnail: "https://files.catbox.moe/24f1q2.jpg",
                    fullContent: "Kami sangat gembira mengumumkan dua pembaruan besar! Pertama, kami telah mengintegrasikan Disqus untuk membangun komunitas yang lebih hidup. Kini Anda bisa berdiskusi dan memberikan ulasan langsung di halaman kami. Kedua, kami terus melakukan improvisasi besar-besaran pada antarmuka (UI) untuk memberikan pengalaman yang lebih modern, cepat, dan memanjakan mata. Terima kasih atas dukungan Anda!"
                },
                { 
                    title: "Pembaruan Besar: Tampilan Baru & Fitur Canggih di Market Nusantara!",
                    date: "19 Sep 2025",
                    category: "update",
                    tag: { text: "BARU", class: "tag-baru", icon: "fas fa-star" },
                    thumbnail: "https://files.catbox.moe/24f1q2.jpg",
                    fullContent: "Kami sangat antusias mengumumkan pembaruan terbesar tahun ini! Market Nusantara kini hadir dengan desain antarmuka yang lebih modern, cepat, dan intuitif. Kami telah merombak total bagian 'Pencapaian' dan 'FAQ' menjadi lebih visual dan interaktif. Rasakan pengalaman browsing yang lebih menyenangkan dan efisien. Terima kasih atas dukungan Anda!"
                },
                { 
                    title: "3 Cara Cerdas Menggunakan Nomor Virtual Untuk Keamanan",
                    date: "18 Sep 2025",
                    category: "tips",
                    tag: { text: "TIPS", class: "tag-tips", icon: "fas fa-lightbulb" },
                    thumbnail: "https://files.catbox.moe/17om8d.jpg",
                    fullContent: "Tingkatkan keamanan digital Anda dengan nomor virtual (Nokos)!\n\n1. **Belanja Online Aman:** Daftarkan akun di e-commerce tanpa memberikan nomor pribadi Anda untuk menghindari spam promosi.\n2. **Privasi Media Sosial:** Gunakan nokos untuk verifikasi akun media sosial baru agar data pribadi Anda tidak terhubung langsung.\n3. **Mendaftar Layanan Digital:** Coba layanan atau aplikasi baru tanpa khawatir nomor Anda akan disalahgunakan untuk tujuan marketing."
                },
                {
                    title: "Diskon Kilat! Dapatkan Nokos dengan Potongan Hingga 50%",
                    date: "17 Sep 2025",
                    category: "promo",
                    tag: { text: "PROMO", class: "tag-promo", icon: "fas fa-percent" },
                    thumbnail: "https://files.catbox.moe/17om8d.jpg",
                    fullContent: "Kabar gembira! Khusus untuk Anda, kami mengadakan promo kilat untuk layanan Nokos (Nomor Virtual). Dapatkan potongan harga hingga 50% untuk setiap pembelian hingga tanggal 20 September 2025. Amankan privasi online Anda sekarang juga dengan harga terbaik!"
                },
                {
                    title: "Situs Diperbarui! Tampilan & Interaksi Lebih Modern",
                    date: "16 Sep 2025",
                    category: "update",
                    tag: { text: "UPDATE", class: "tag-update", icon: "fas fa-bullhorn" },
                    thumbnail: "https://files.catbox.moe/24f1q2.jpg",
                    fullContent: "Market Nusantara baru saja mendapatkan pembaruan besar! Kami telah menyempurnakan tampilan visual, menambahkan efek interaktif pada tombol, membuat testimoni bergerak otomatis, dan banyak lagi. Semua ini kami lakukan untuk memberikan pengalaman terbaik bagi Anda. Selamat menjelajah!"
                },
                {
                    title: "Peringatan Keamanan: Waspada Terhadap Akun Palsu!",
                    date: "15 Sep 2025",
                    category: "penting",
                    tag: { text: "PENTING", class: "tag-penting", icon: "fas fa-exclamation-triangle" },
                    thumbnail: "https://files.catbox.moe/tbms70.jpg",
                    fullContent: "Peringatan untuk semua pelanggan setia Market Nusantara! Telah beredar akun-akun palsu yang mengatasnamakan kami. Harap selalu pastikan Anda bertransaksi melalui kontak resmi yang tertera di website ini. Kami tidak bertanggung jawab atas transaksi di luar kontak resmi. Tetap waspada!"
                },
                {
                    title: "Promo Spesial Jasa Rekber Selama Bulan September",
                    date: "15 Sep 2025",
                    category: "promo",
                    tag: { text: "PROMO", class: "tag-promo", icon: "fas fa-percent" },
                    thumbnail: "https://files.catbox.moe/ygx3ln.jpg",
                    fullContent: "Nikmati promo spesial untuk layanan Rekening Bersama (Rekber) kami! Selama bulan September, dapatkan potongan biaya layanan hingga 50% untuk semua transaksi. Ini adalah kesempatan terbaik untuk bertransaksi dengan aman dan hemat. Jangan lewatkan!"
                },
                {
                    title: "5 Tips Mengenali Ciri-Ciri Penipu Online",
                    date: "15 Sep 2025",
                    category: "tips",
                    tag: { text: "TIPS", class: "tag-tips", icon: "fas fa-lightbulb" },
                    thumbnail: "https://files.catbox.moe/tbms70.jpg",
                    fullContent: "Keamanan adalah prioritas. Berikut adalah 5 tips cepat untuk mengenali ciri-ciri penipu online: 1. Harga terlalu murah untuk menjadi kenyataan. 2. Memaksa untuk transfer cepat. 3. Menggunakan nomor rekening pribadi, bukan atas nama bisnis. 4. Profil media sosial yang mencurigakan. 5. Menolak menggunakan layanan Rekber. Selalu waspada!"
                }
            ];

            const newsListContainer = document.getElementById('news-list');
            const newsFilterButtons = document.querySelectorAll('#news-filters .news-filter-btn');

            function generateNewsList(data) {
                newsListContainer.innerHTML = data.map((item, originalIndex) => `
                    <div class="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer group news-item" data-index="${newsData.indexOf(item)}">
                        <img src="${item.thumbnail}" alt="${item.title}" class="w-24 h-24 object-cover rounded-md flex-shrink-0" loading="lazy">
                        <div class="flex-grow">
                            <div class="flex items-center gap-2 mb-1">
                                <div class="tag ${item.tag.class}"><i class="${item.tag.icon}"></i><span>${item.tag.text}</span></div>
                                <span class="text-xs text-slate-400">${item.date}</span>
                            </div>
                            <h5 class="font-semibold text-white group-hover:text-sky-400 transition-colors">${item.title}</h5>
                        </div>
                        <i class="fas fa-arrow-right text-slate-600 group-hover:text-sky-400 transition-colors self-center"></i>
                    </div>`).join('');
            }

            // Initial news list generation
            generateNewsList(newsData);
            
            // Filter logic
            newsFilterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    newsFilterButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    const filter = button.dataset.filter;
                    const filteredData = filter === 'all' ? newsData : newsData.filter(item => item.category === filter);
                    generateNewsList(filteredData);
                });
            });

            newsListContainer.addEventListener('click', (e) => {
                const newsItem = e.target.closest('.news-item');
                if (newsItem) {
                    const news = newsData[newsItem.dataset.index];
                    const shareUrl = window.location.href;
                    const shareText = encodeURIComponent(`"${news.title}" - Baca selengkapnya di Market Nusantara!`);
                    document.getElementById('modal-news-details').innerHTML = `
                        <div>
                            <!-- Header dengan Gambar Latar Belakang -->
                            <div class="h-56 bg-cover bg-center rounded-t-xl relative flex flex-col justify-end p-6" style="background-image: url('${news.thumbnail}')">
                                <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-t-xl"></div>
                                <div class="relative">
                                    <div class="tag ${news.tag.class} !text-xs !px-2.5 !py-1 mb-2"><i class="${news.tag.icon} mr-1.5"></i><span>${news.tag.text}</span></div>
                                    <h3 class="text-2xl font-bold text-white leading-tight shadow-text">${news.title}</h3>
                                    <p class="text-sm text-slate-300 mt-1">${news.date}</p>
                                </div>
                            </div>

                            <!-- Konten Berita -->
                            <div class="p-6">
                                <p class="text-slate-300 whitespace-pre-line text-sm leading-relaxed">${news.fullContent}</p>
                            </div>

                            <!-- Divider -->
                            <div class="px-6">
                                <div class="h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent"></div>
                            </div>

                            <!-- Bagian Bagikan -->
                            <div class="p-6 text-center">
                                <h4 class="font-semibold text-white mb-4 text-sm">Bagikan Berita Ini</h4>
                                <div class="flex justify-center gap-4">
                                    <a href="https://api.whatsapp.com/send?text=${shareText} ${shareUrl}" target="_blank" class="share-btn" title="Bagikan ke WhatsApp"><i class="fab fa-whatsapp"></i></a>
                                    <a href="https://www.facebook.com/sharer/sharer.php?u=${shareUrl}" target="_blank" class="share-btn" title="Bagikan ke Facebook"><i class="fab fa-facebook-f"></i></a>
                                    <a href="https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}" target="_blank" class="share-btn" title="Bagikan ke Twitter"><i class="fab fa-twitter"></i></a>
                                </div>
                            </div>
                        </div>
                    `;
                    document.getElementById('news-modal').classList.remove('hidden');
                }
            });
            
            // --- NAVIGASI KEYBOARD UNTUK MODAL ---
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') allModals.forEach(modal => modal.classList.add('hidden'));
                if (!productModal.classList.contains('hidden')) {
                    if(e.key === 'ArrowLeft') document.getElementById('prev-product').click();
                    if(e.key === 'ArrowRight') document.getElementById('next-product').click();
                }
                if (!ripperModal.classList.contains('hidden')) {
                    if(e.key === 'ArrowLeft') document.getElementById('prev-ripper').click();
                    if(e.key === 'ArrowRight') document.getElementById('next-ripper').click();
                }
            });

            // --- VALIDASI FORM LIVE ---
            document.querySelectorAll('form .form-input').forEach(input => {
                input.addEventListener('input', () => {
                    const valid = input.checkValidity();
                    input.classList.toggle('valid', valid);
                    input.classList.toggle('invalid', !valid);
                });
            });

            // --- EFEK GLOW SAAT MOUSE BERGERAK ---
            document.body.addEventListener('mousemove', e => {
                document.querySelectorAll('.card-hover-effect').forEach(card => {
                    const rect = card.getBoundingClientRect();
                    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                });
            });

            // --- SCROLL PROGRESS & NAVBAR ACTIVE STATE ---
            const progressBar = document.getElementById('scroll-progress-bar');
            const sections = document.querySelectorAll('main section[id]');
            const mainNav = document.querySelector('header nav');
            const navIndicator = document.getElementById('nav-indicator');
            const navLinks = document.querySelectorAll('header nav a');
            const mobileNavLinks = document.querySelectorAll('#mobile-menu a');

            function moveIndicatorTo(target) {
                if (!target || !navIndicator) return;
                navIndicator.style.width = `${target.offsetWidth}px`;
                navIndicator.style.left = `${target.offsetLeft}px`;
                navIndicator.style.height = `${target.offsetHeight}px`;
                navIndicator.style.opacity = '1';
            }

            function onScroll() {
                // 1. Update Progress Bar
                const scrollTotal = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrollPosition = document.documentElement.scrollTop;
                const progress = (scrollPosition / scrollTotal) * 100;
                if(progressBar) progressBar.style.width = `${progress}%`;

                // 2. Update Active Nav Link
                let currentSectionId = '';
                let activeLinkElement = null;
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    // Offset by header height + a little extra
                    if (scrollPosition >= sectionTop - 150) {
                        currentSectionId = section.getAttribute('id');
                    }
                });

                const setActiveLink = (links) => {
                    links.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${currentSectionId}`) {
                            link.classList.add('active');
                            if(links === navLinks) {
                                activeLinkElement = link;
                            }
                        }
                    });
                };
                
                setActiveLink(navLinks);
                setActiveLink(mobileNavLinks);

                // Pindahkan indikator ke link yang aktif karena scroll
                moveIndicatorTo(activeLinkElement);
            }
            
            // --- Event listener untuk efek hover pada navbar ---
            if (mainNav) {
                navLinks.forEach(link => {
                    link.addEventListener('mouseenter', (e) => moveIndicatorTo(e.target));
                });
                mainNav.addEventListener('mouseleave', () => {
                    // Saat mouse keluar, kembalikan indikator ke link yang sedang aktif
                    const activeLink = mainNav.querySelector('a.active');
                    moveIndicatorTo(activeLink);
                });
            }

            window.addEventListener('scroll', onScroll);
            // Pindahkan panggilan awal ke event 'load' untuk memastikan semua elemen telah dirender
            // onScroll();
            
            // --- NOTIFIKASI SOCIAL PROOF DINAMIS (DITINGKATKAN) ---
            const socialProofContainer = document.getElementById('social-proof-container');
            if (socialProofContainer) {
                const kotaIndonesia = [
                    'Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Bekasi', 'Depok', 'Tangerang', 
                    'Palembang', 'Semarang', 'Makassar', 'Batam', 'Pekanbaru', 'Bogor', 'Bandar Lampung', 
                    'Padang', 'Malang', 'Denpasar', 'Samarinda', 'Tasikmalaya', 'Banjarmasin', 
                    'Balikpapan', 'Pontianak', 'Serang', 'Jambi', 'Cimahi', 'Manado', 'Kupang', 
                    'Yogyakarta', 'Cilegon', 'Ambon', 'Mataram', 'Jayapura', 'Cirebon', 'Solo'
                ];

                const socialProofData = [
                    { icon: 'fa-check-circle', text: 'Transaksi <strong>Rekber</strong> dari <strong>{kota}</strong> telah berhasil diselesaikan.', weight: 10 },
                    { icon: 'fa-whatsapp', type: 'fab', text: 'Pembelian <strong>Nokos</strong> baru saja berhasil dilakukan dari <strong>{kota}</strong>.', weight: 10 },
                    { icon: 'fa-user-shield', text: 'Laporan penipu baru saja diverifikasi oleh tim kami.', weight: 3 },
                    { icon: 'fa-star', text: 'Ulasan bintang 5 baru diterima untuk layanan Jasa Website.', weight: 5 },
                    { icon: 'fa-calculator', text: 'Seseorang dari <strong>{kota}</strong> sedang menggunakan <strong>Kalkulator Biaya</strong> kami.', weight: 8 },
                    { icon: 'fa-handshake', text: 'Seorang pengguna dari <strong>{kota}</strong> baru mendaftar sebagai mitra.', weight: 4 },
                    { icon: 'fa-comments', text: 'Ulasan baru ditambahkan di halaman diskusi.', weight: 2 }
                ];

                function getWeightedRandomProof() {
                    const totalWeight = socialProofData.reduce((sum, item) => sum + (item.weight || 1), 0);
                    let random = Math.random() * totalWeight;
                    for (const item of socialProofData) {
                        const weight = item.weight || 1;
                        if (random < weight) return item;
                        random -= weight;
                    }
                    return socialProofData[socialProofData.length - 1]; // Fallback
                }

                function generateRandomTimeAgo() {
                    const chance = Math.random();
                    if (chance < 0.15) { // 15% chance for "just now"
                        return "beberapa saat yang lalu";
                    } else if (chance < 0.60) { // 45% chance for minutes
                        const minutes = Math.floor(Math.random() * 59) + 1;
                        return `${minutes} menit yang lalu`;
                    } else if (chance < 0.90) { // 30% chance for hours
                        const hours = Math.floor(Math.random() * 23) + 1;
                        return `${hours} jam yang lalu`;
                    } else { // 10% chance for days
                        const days = Math.floor(Math.random() * 6) + 1;
                        return `${days} hari yang lalu`;
                    }
                }

                function showRandomSocialProof() {
                    let proofTemplate = getWeightedRandomProof();
                    let proofText = proofTemplate.text;

                    if (proofText.includes('{kota}')) {
                        const randomCity = kotaIndonesia[Math.floor(Math.random() * kotaIndonesia.length)];
                        proofText = proofText.replace('{kota}', randomCity);
                    }

                    const randomTime = generateRandomTimeAgo();
                    
                    const notification = document.createElement('div');
                    notification.className = 'social-proof-notification';
                    
                    const iconType = proofTemplate.type || 'fas';

                    notification.innerHTML = `
                        <div class="social-proof-icon">
                            <i class="${iconType} ${proofTemplate.icon}"></i>
                        </div>
                        <div>
                            <p class="text-sm text-white font-medium">${proofText}</p>
                            <p class="text-xs text-slate-400">${randomTime}</p>
                        </div>
                        <div class="social-proof-progress"></div>
                    `;
                    
                    socialProofContainer.appendChild(notification);
                    
                    setTimeout(() => notification.classList.add('enter'), 100);

                    setTimeout(() => {
                        notification.classList.remove('enter');
                        notification.classList.add('leave');
                    }, 5000);

                    setTimeout(() => notification.remove(), 5500);
                }

                setTimeout(() => {
                    showRandomSocialProof();
                    setInterval(showRandomSocialProof, 8000);
                }, 4000);
            }

        }); // END DOMContentLoaded