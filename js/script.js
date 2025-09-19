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

            // --- KALKULATOR HARGA ---
            const calcElements = {
                packageCards: document.querySelectorAll('#calc-packages > div'),
                features: document.querySelectorAll('#calc-features input[type="checkbox"]'),
                summaryList: document.getElementById('summary-list'),
                totalPrice: document.getElementById('total-price'),
                loadMoreBtn: document.getElementById('load-more-features'),
                seeLessBtn: document.getElementById('see-less-features'),
                moreFeatures: document.getElementById('more-features'),
                startBtn: document.getElementById('start-simulation-btn'),
                closeBtn: document.getElementById('close-simulation-btn'),
                contentWrapper: document.getElementById('calculator-content')
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
                        card.classList.toggle('border-sky-500', isSelected);
                        card.classList.toggle('border-slate-700', !isSelected);
                        card.classList.toggle('bg-sky-500/10', isSelected);
                    });
                }

                function calculatePrice() {
                    let total = 0;
                    let summaryHTML = '';

                    // Base Package
                    const basePackage = packageDetails[selectedPackage];
                    total += basePackage.price;
                    summaryHTML += `<li><span>${basePackage.name}</span> <span class="float-right font-semibold">${formatRupiah(basePackage.price.toString())}</span></li>`;
                    
                    // Additional Features
                    calcElements.features.forEach(feature => {
                        if (feature.checked) {
                            const featureCost = featurePrices[feature.value];
                            total += featureCost;
                            summaryHTML += `<li><span>+ ${feature.nextElementSibling.lastElementChild.textContent}</span> <span class="float-right">${formatRupiah(featureCost.toString())}</span></li>`;
                        }
                    });

                    calcElements.summaryList.innerHTML = summaryHTML;
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

                // Load More / See Less Logic
                if (calcElements.loadMoreBtn && calcElements.seeLessBtn && calcElements.moreFeatures) {
                    calcElements.loadMoreBtn.addEventListener('click', () => {
                        calcElements.moreFeatures.classList.remove('hidden');
                        calcElements.loadMoreBtn.classList.add('hidden');
                        calcElements.seeLessBtn.classList.remove('hidden');
                    });

                    calcElements.seeLessBtn.addEventListener('click', () => {
                        calcElements.moreFeatures.classList.add('hidden');
                        calcElements.seeLessBtn.classList.add('hidden');
                        calcElements.loadMoreBtn.classList.remove('hidden');
                    });
                }

                // Mobile Calculator Toggle Logic
                if (calcElements.startBtn && calcElements.contentWrapper && calcElements.closeBtn) {
                    const startBtnContainer = calcElements.startBtn.parentElement;
                    
                    calcElements.startBtn.addEventListener('click', () => {
                        calcElements.contentWrapper.classList.remove('hidden');
                        startBtnContainer.classList.add('hidden');
                    });

                    calcElements.closeBtn.addEventListener('click', () => {
                        calcElements.contentWrapper.classList.add('hidden');
                        startBtnContainer.classList.remove('hidden');
                        document.getElementById('kalkulator').scrollIntoView({ behavior: 'smooth', block: 'center' });
                    });
                }

                // Initial calculation and UI setup
                updateCalculatorUI();
                calculatePrice();
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
                const icons = ['fa-bitcoin', 'fa-ethereum', 'fa-monero', 'fa-btc', 'fa-gg-circle', 'fa-digital-ocean', 'fa-rebel', 'fa-empire'];
                for (let i = 0; i < 15; i++) {
                    const icon = document.createElement('i');
                    icon.className = `fab ${icons[Math.floor(Math.random() * icons.length)]}`;
                    Object.assign(icon.style, {
                        left: `${Math.random() * 100}vw`,
                        animationDuration: `${Math.random() * 15 + 15}s`,
                        animationDelay: `${Math.random() * 5}s`,
                        fontSize: `${Math.random() * 2 + 1}rem` // Sedikit diperkecil
                    });
                    floatingIconsContainer.appendChild(icon);
                }
            }
            
            // --- DATA LIST RIPPER & MODAL ---
            const ripperData = [
                { name: 'Pelaku 1', whatsapp: ['wa.me/+6283110877006'], nominal: 'Rp107.154', kasus: 'Scam', ewallet: ['083110877006'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/grhioa.jpg' },
                { name: 'Meisya Putri Arini', whatsapp: ['wa.me/+6283137567672'], nominal: 'Rp15.000', kasus: 'Scam', ewallet: ['081398091300 - Dana', '081398091300 - Gopay', '083133326689 - Gopay', '901185589079 - Seabank (a/n: ESIH)'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/zo46ma.jpg' },
                { name: 'Pelaku 3', whatsapp: ['wa.me/+6283152796642'], nominal: 'Rp8.000', kasus: 'Scam', ewallet: ['901369935890'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/g5j2fa.jpg' },
                { name: 'Pelaku 4', whatsapp: ['wa.me/6281313419236'], nominal: 'Rp30.000', kasus: 'Scam', ewallet: ['085727021478 OVO'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/53lt90.jpg' },
                { name: 'Pelaku 5', whatsapp: ['wa.me/+6289505332944'], nominal: 'Rp10.000', kasus: 'Scam', ewallet: ['089505332944'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/neeu5n.jpg' },
                { name: 'Pelaku 6', whatsapp: ['wa.me/6287844775440'], nominal: '— (Garapan)', kasus: 'Scam', ewallet: ['—'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/pehhig.jpg' },
                { name: 'Endang Sutriyani', whatsapp: ['wa.me/6282299080618'], nominal: 'Rp72.000', kasus: 'Scam', ewallet: ['901948655110'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/zxxyzv.jpg' },
                { name: 'Pelaku 8', whatsapp: ['wa.me/+62857701270438'], nominal: 'Rp16.000', kasus: 'Scam', ewallet: ['089626118020 DANA'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/p1yiz1.jpg' },
                { name: 'Pelaku 9', whatsapp: ['wa.me/6285180967002'], nominal: 'Rp7.000', kasus: 'Scam', ewallet: ['085801020968 DANA'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/c6kkxn.jpg' },
                { name: 'Pelaku 10', whatsapp: ['wa.me/6285194836237'], nominal: 'Rp50.000', kasus: 'Scam', ewallet: ['085727021478 GOPAY'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/puzsyt.jpg' },
                { name: 'Pelaku 11', whatsapp: ['wa.me/6283121498155'], nominal: 'Rp133.000', kasus: 'Scam', ewallet: ['082250494693'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/tz93c7.jpg' },
                { name: 'Pelaku 12', whatsapp: ['wa.me/6283136096285'], nominal: '— (Garapan)', kasus: 'Scam', ewallet: ['—'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/je6uzd.jpg' },
                { name: 'Pelaku 13', whatsapp: ['wa.me/6287719232611'], nominal: '120000', kasus: 'Scam', ewallet: ['—'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/t22l04.jpg' },
                { name: 'Pelaku 14', whatsapp: ['wa.me/62895402510585', 'wa.me/62895414376389'], nominal: '30000', kasus: 'Scam', ewallet: ['0895384890460'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/ohep24.jpg' },
                { name: 'Pelaku 15', whatsapp: ['wa.me/6281321446734'], nominal: '165000', kasus: 'Scam', ewallet: ['—'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/y0b2k5.jpg' },
                { name: 'Aris Setiawan', whatsapp: ['wa.me/+6285191205379'], nominal: '— (Garapan)', kasus: 'Scam', ewallet: ['—'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/v4trgt.jpg' },
            ];
            
            const ripperListContainer = document.querySelector('#ripper-list .grid');
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

            function parseLoss(nominalString) {
                if (typeof nominalString !== 'string') return 0;
                const number = parseInt(nominalString.replace(/[^0-9]/g, ''), 10);
                return isNaN(number) ? 0 : number;
            }

            function showRipperModal(ripperIndex) {
                currentRipperIndex = ripperIndex;
                const ripper = currentFilteredRippers[currentRipperIndex];
                const ripperId = `GNBL00${ripper.originalIndex + 1}`;
                
                const whatsappLinks = ripper.whatsapp.map(link => `<a href="https://${link}" target="_blank" class="text-sky-400 hover:underline">${link.replace('wa.me/', '')}</a><i class="fas fa-copy copy-btn" data-copy-text="${link.replace('wa.me/', '')}"></i>`).join('<br>');
                const ewalletInfo = Array.isArray(ripper.ewallet) ? ripper.ewallet.map(e => `<div>${e}<i class="fas fa-copy copy-btn" data-copy-text="${e}"></i></div>`).join('') : `<div>${ripper.ewallet}<i class="fas fa-copy copy-btn" data-copy-text="${ripper.ewallet}"></i></div>`;

                modalRipperDetails.innerHTML = `
                    <div class="text-center pb-4 border-b border-sky-500/20">
                        <img src="${ripper.imgSrc}" alt="Avatar Pelaku" class="w-24 h-24 rounded-full mx-auto mb-3 border-4 border-red-500/50 object-cover" loading="lazy">
                        <h3 class="text-2xl font-bold text-sky-300">${ripper.name}</h3>
                        <p class="text-sm text-slate-400 font-mono">${ripperId}</p>
                    </div>
                    
                    <div class="space-y-4 text-slate-300 text-sm mt-4">
                        <div class="flex items-start"><i class="fab fa-whatsapp w-5 mt-1 text-sky-400"></i><div class="pl-3 flex-1"><strong class="font-semibold text-white">WhatsApp:</strong><div class="text-slate-400">${whatsappLinks}</div></div></div>
                        <div class="flex items-start"><i class="fas fa-wallet w-5 mt-1 text-sky-400"></i><div class="pl-3 flex-1"><strong class="font-semibold text-white">eWallet/No.Rek:</strong><div class="text-slate-400">${ewalletInfo}</div></div></div>
                        <div class="flex items-start"><i class="fas fa-file-alt w-5 mt-1 text-sky-400"></i><div class="pl-3 flex-1"><strong class="font-semibold text-white">Kasus:</strong><div class="text-slate-400">${ripper.kasus}</div></div></div>
                        <div class="flex items-start"><i class="fas fa-coins w-5 mt-1 text-sky-400"></i><div class="pl-3 flex-1"><strong class="font-semibold text-white">Nominal Kerugian:</strong><div class="text-slate-400">${formatRupiah(ripper.nominal)}</div></div></div>
                        <div class="flex items-start"><i class="fas fa-check-circle w-5 mt-1 text-sky-400"></i><div class="pl-3 flex-1"><strong class="font-semibold text-white">Status:</strong><div class="text-slate-400">${ripper.status}</div></div></div>
                    </div>

                    <div class="mt-4 pt-4 border-t border-slate-700/50">
                        <button id="toggle-proof-btn" class="hero-btn w-full text-sm bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-700 transition-colors">
                            <span>Lihat Bukti Laporan</span><i class="fas fa-chevron-down ml-2 text-xs transition-transform"></i>
                        </button>
                        <div id="proof-container" class="hidden mt-4">
                             <img src="${ripper.imgSrc}" alt="Bukti Penipuan" class="w-full h-auto rounded-lg cursor-zoom-in" loading="lazy">
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

            function generateRipperList(rippers) {
                ripperListContainer.innerHTML = '';

                if (rippers.length === 0) {
                    ripperListContainer.innerHTML = `
                        <div class="col-span-1 md:col-span-2 text-center py-12">
                            <i class="fas fa-search-minus text-5xl text-slate-600 mb-4"></i>
                            <h4 class="text-xl font-bold text-white">Data Tidak Ditemukan</h4>
                            <p class="text-slate-400 mt-2">Coba gunakan kata kunci lain untuk mencari data penipu.</p>
                        </div>
                    `;
                    return;
                }

                rippers.forEach((ripper, index) => {
                    const ripperId = `GNBL00${ripper.originalIndex + 1}`;
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
                    const ripperId = `gnbl00${ripper.originalIndex + 1}`;
                    const noRekString = Array.isArray(ripper.ewallet) ? ripper.ewallet.join(' ') : ripper.ewallet;
                    return ripper.name.toLowerCase().includes(filterText) || ripperId.includes(filterText) || noRekString.toLowerCase().includes(filterText);
                });

                generateRipperList(currentFilteredRippers);
            }
            
            document.querySelectorAll('#ripper-sort-buttons button').forEach(button => {
                button.addEventListener('click', () => {
                    document.querySelector('#ripper-sort-buttons .active').classList.remove('active');
                    button.classList.add('active');
                    currentSort = button.dataset.sort;
                    updateRipperDisplay();
                });
            });

            ripperSearchInput.addEventListener('input', updateRipperDisplay);
            
            // --- EVENT LISTENER UNTUK NAVIGASI MODAL RIPPER ---
            document.getElementById('prev-ripper').addEventListener('click', () => {
                if (currentFilteredRippers.length === 0) return;
                const newIndex = (currentRipperIndex - 1 + currentFilteredRippers.length) % currentFilteredRippers.length;
                showRipperModal(newIndex);
            });
            document.getElementById('next-ripper').addEventListener('click', () => {
                if (currentFilteredRippers.length === 0) return;
                const newIndex = (currentRipperIndex + 1) % currentFilteredRippers.length;
                showRipperModal(newIndex);
            });

            function calculateTotalLoss() {
                const totalLoss = ripperData.reduce((total, ripper) => {
                    if (typeof ripper.nominal === 'string') {
                        const value = parseFloat(ripper.nominal.replace(/[^0-9]/g, ''));
                        return total + (isNaN(value) ? 0 : value);
                    }
                    return total;
                }, 0);
                
                document.getElementById('total-loss-amount').textContent = `Rp ${totalLoss.toLocaleString('id-ID')},-`;
                document.getElementById('total-reports').textContent = ripperData.length;
                if (ripperData.length > 0) {
                    document.getElementById('latest-report-name').textContent = ripperData[ripperData.length - 1].name;
                }
            }
            
            updateRipperDisplay(); // Initial call
            calculateTotalLoss();

            // --- DATA PRODUK & MODAL ---
            const productModal = document.getElementById('product-modal');
            const productModalContent = document.getElementById('product-modal-content');
            const modalProductDetails = document.getElementById('modal-product-details');
            const productData = [
                 { name: 'Nokos Indonesia', price: 'Mulai dari Rp 5.000', imgSrc: 'https://files.catbox.moe/17om8d.jpg', description: 'Dapatkan nomor virtual WhatsApp Indonesia sekali pakai untuk verifikasi aman dan menjaga privasi online Anda. Proses cepat dan instan.' },
                 { name: 'Jasa Website (Front-End)', isTiered: true, tiers: [
                     { name: 'Paket Reguler', price: 'Rp 250.000', features: ['Desain Responsif', 'Setup Domain & Hosting', '2x Revisi Desain', 'Garansi 1 Bulan'] },
                     { name: 'Paket Premium', price: 'Rp 750.000', popular: true, features: ['Semua di Paket Reguler', 'Desain Premium & Kustom', 'Animasi Interaktif', '5x Revisi Desain', 'Garansi 3 Bulan'] },
                     { name: 'Paket VIP', price: 'Rp 1.500.000', features: ['Semua di Paket Premium', 'Fitur Interaktif Lanjutan', 'Optimasi Kecepatan', 'Revisi Tanpa Batas', 'Dukungan Prioritas'] }
                 ]},
                 { name: 'Jasa Rekber', price: 'Fee Mulai dari Rp 1.000', imgSrc: 'https://files.catbox.moe/ygx3ln.jpg', description: 'Transaksi online aman dengan layanan rekening bersama (rekber) terpercaya kami sebagai penengah. Cepat, mudah, dan biaya terjangkau.' },
                 { name: 'Partnership', price: 'Mulai dari Rp 125.000', imgSrc: 'https://files.catbox.moe/ulqz43.jpg', description: 'Bergabunglah dengan program kemitraan kami dan raih berbagai keuntungan eksklusif serta peluang pertumbuhan bersama. Dapatkan visibilitas lebih luas.' },
            ];
            let currentProductIndex = 0;
            function showProductModal(index) {
                currentProductIndex = index;
                const product = productData[index];
                let contentHTML = '';

                // Sesuaikan ukuran modal berdasarkan tipe produk
                productModalContent.classList.toggle('max-w-5xl', product.isTiered);
                productModalContent.classList.toggle('max-w-3xl', !product.isTiered);

                if (product.isTiered) {
                    let tiersHTML = product.tiers.map(tier => `
                        <div class="relative flex flex-col border-2 ${tier.popular ? 'border-sky-500' : 'border-slate-700'} rounded-lg p-6 bg-slate-900/50 flex-1 transition-all duration-300 hover:border-sky-500 hover:scale-105">
                            ${tier.popular ? `<div class="absolute top-0 -right-1 bg-sky-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg rounded-tr-md z-10 shadow-lg shadow-sky-500/20">POPULER</div>` : ''}
                            <h4 class="text-xl font-bold ${tier.popular ? 'text-sky-400' : 'text-white'}">${tier.name}</h4>
                            <p class="text-3xl font-bold my-4 text-white">${tier.price}</p>
                            <ul class="space-y-3 text-sm text-slate-300 mb-6 flex-grow border-t border-slate-700 pt-4">
                                ${tier.features.map(f => `<li class="flex items-start"><i class="fas fa-check-circle text-sky-500 mr-3 mt-1 flex-shrink-0"></i><span>${f}</span></li>`).join('')}
                            </ul>
                            <a href="https://wa.me/+6285218726234" target="_blank" class="hero-btn mt-auto w-full text-center ${tier.popular ? 'bg-sky-600 hover:bg-sky-700' : 'bg-slate-700 hover:bg-slate-600'} text-white font-bold px-5 py-2.5 rounded-lg">Pilih Paket</a>
                        </div>`).join('');
                    contentHTML = `<div class="text-center mb-8"><h3 class="text-3xl font-bold text-sky-300">${product.name}</h3><p class="text-slate-400 mt-1">Pilih paket yang paling sesuai untuk kebutuhan Anda.</p></div><div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">${tiersHTML}</div>`;
                } else {
                    contentHTML = `
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div>
                                <img src="${product.imgSrc}" alt="${product.name}" class="w-full h-auto rounded-lg shadow-lg shadow-black/30">
                            </div>
                            <div>
                                <h3 class="text-3xl font-bold text-sky-300 mb-2">${product.name}</h3>
                                <p class="text-2xl font-bold text-white mb-4">${product.price}</p>
                                <div class="border-t border-slate-700 my-4"></div>
                                <p class="text-slate-300 mb-6">${product.description}</p>
                                <a href="https://wa.me/+6285218726234" target="_blank" class="hero-btn w-full block text-center md:w-auto bg-sky-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-sky-700 inline-flex items-center justify-center shadow-lg text-sm">
                                    <span>Pesan Sekarang</span>
                                    <i class="fab fa-whatsapp ml-2 btn-icon"></i>
                                </a>
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
            const startCounter = (el) => {
                const target = parseInt(el.dataset.target, 10);
                let current = 0;
                const increment = target / 100;
                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        el.innerText = Math.ceil(current).toLocaleString();
                        requestAnimationFrame(updateCounter);
                    } else {
                        el.innerText = target.toLocaleString() + "+";
                    }
                };
                updateCounter();
                el.classList.add('counted');
            };
            const counterObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.querySelectorAll('.counting-number, #social-proof-counter').forEach(counter => {
                            if (!counter.classList.contains('counted')) {
                                startCounter(counter);
                            }
                        });
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            counterObserver.observe(document.getElementById('achievements'));
            counterObserver.observe(document.getElementById('beranda'));

            // --- FAQ ACCORDION ---
            document.querySelectorAll('.faq-question').forEach(q => q.addEventListener('click', () => {
                const faqItem = q.parentElement;
                const answer = q.nextElementSibling;
                const isActive = faqItem.classList.contains('active');
                
                document.querySelectorAll('.faq-item.active').forEach(activeItem => {
                    if (activeItem !== faqItem) {
                        activeItem.classList.remove('active');
                        activeItem.querySelector('.faq-answer').style.maxHeight = null;
                    }
                });

                faqItem.classList.toggle('active', !isActive);
                answer.style.maxHeight = !isActive ? answer.scrollHeight + "px" : null;
            }));

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
                navigator.clipboard.writeText(text).then(() => {
                    showToast(`Teks berhasil disalin: ${text}`);
                    if (iconElement) {
                        const originalClass = iconElement.className;
                        iconElement.className = 'fas fa-check text-green-500';
                        setTimeout(() => iconElement.className = originalClass, 2000);
                    }
                }).catch(() => showToast('Gagal menyalin teks', 'error'));
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

            // --- POPUP SELAMAT DATANG ---
            if (!sessionStorage.getItem('welcomePopupShown')) {
                setTimeout(() => {
                    const welcomeModal = document.getElementById('welcome-modal');
                    if(welcomeModal) welcomeModal.classList.remove('hidden');
                    sessionStorage.setItem('welcomePopupShown', 'true');
                }, 1500);
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
            
            // --- SWIPER JS INITIALIZATION ---
            new Swiper('.testimonial-swiper', {
                slidesPerView: 1, spaceBetween: 30, loop: true,
                autoplay: { delay: 4000, disableOnInteraction: false },
                pagination: { el: '.swiper-pagination', clickable: true },
                breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } },
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
            document.querySelectorAll('#partner-list > div').forEach(card => {
                card.addEventListener('click', () => {
                    const partner = partnerData[card.dataset.partnerIndex];
                    document.getElementById('modal-partner-details').innerHTML = `
                        <div class="text-center">
                            <img class="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-sky-500 object-cover" src="${partner.avatar}" alt="${partner.name}" loading="lazy">
                            <h3 class="text-2xl font-bold text-sky-300">${partner.name}</h3>
                            <p class="text-slate-400">${partner.categoryText}</p>
                        </div>
                        <div class="border-t border-slate-700 my-4"></div>
                        <p class="text-slate-300 text-sm">${partner.fullDescription}</p>
                    `;
                    document.getElementById('partner-detail-modal').classList.remove('hidden');
                });
            });

            // --- LOGIKA BERITA ---
            const newsData = [
                { 
                    title: "Promo Merdeka Digital: Diskon 50% Jasa Website!",
                    date: "20 Sep 2025",
                    category: "PROMO",
                    categoryColor: "bg-rose-500",
                    thumbnail: "https://files.catbox.moe/4f05u8.jpg",
                    fullContent: "Wujudkan website impian Anda sekarang! Dalam rangka merayakan kemerdekaan digital, kami memberikan diskon spesial sebesar 50% untuk semua paket jasa pembuatan website (Front-End). Dapatkan website modern, cepat, dan responsif dengan setengah harga. Promo ini terbatas, hubungi kami sekarang juga sebelum kehabisan!"
                },
                { 
                    title: "Update Besar: Fitur Komunitas Disqus & Perombakan UI!",
                    date: "20 Sep 2025",
                    category: "UPDATE",
                    categoryColor: "bg-purple-500",
                    thumbnail: "https://files.catbox.moe/24f1q2.jpg",
                    fullContent: "Kami sangat gembira mengumumkan dua pembaruan besar! Pertama, kami telah mengintegrasikan Disqus untuk membangun komunitas yang lebih hidup. Kini Anda bisa berdiskusi dan memberikan ulasan langsung di halaman kami. Kedua, kami terus melakukan improvisasi besar-besaran pada antarmuka (UI) untuk memberikan pengalaman yang lebih modern, cepat, dan memanjakan mata. Terima kasih atas dukungan Anda!"
                },
                { 
                    title: "Pembaruan Besar: Tampilan Baru & Fitur Canggih di Market Nusantara!",
                    date: "19 Sep 2025",
                    category: "UPDATE",
                    categoryColor: "bg-purple-500",
                    thumbnail: "https://files.catbox.moe/24f1q2.jpg",
                    fullContent: "Kami sangat antusias mengumumkan pembaruan terbesar tahun ini! Market Nusantara kini hadir dengan desain antarmuka yang lebih modern, cepat, dan intuitif. Kami telah merombak total bagian 'Pencapaian' dan 'FAQ' menjadi lebih visual dan interaktif. Rasakan pengalaman browsing yang lebih menyenangkan dan efisien. Terima kasih atas dukungan Anda!"
                },
                { 
                    title: "3 Cara Cerdas Menggunakan Nomor Virtual Untuk Keamanan",
                    date: "18 Sep 2025",
                    category: "TIPS",
                    categoryColor: "bg-green-500",
                    thumbnail: "https://files.catbox.moe/17om8d.jpg",
                    fullContent: "Tingkatkan keamanan digital Anda dengan nomor virtual (Nokos)!\n\n1. **Belanja Online Aman:** Daftarkan akun di e-commerce tanpa memberikan nomor pribadi Anda untuk menghindari spam promosi.\n2. **Privasi Media Sosial:** Gunakan nokos untuk verifikasi akun media sosial baru agar data pribadi Anda tidak terhubung langsung.\n3. **Mendaftar Layanan Digital:** Coba layanan atau aplikasi baru tanpa khawatir nomor Anda akan disalahgunakan untuk tujuan marketing."
                },
                {
                    title: "Diskon Kilat! Dapatkan Nokos dengan Potongan Hingga 50%",
                    date: "17 Sep 2025",
                    category: "PROMO",
                    categoryColor: "bg-rose-500",
                    thumbnail: "https://files.catbox.moe/17om8d.jpg",
                    fullContent: "Kabar gembira! Khusus untuk Anda, kami mengadakan promo kilat untuk layanan Nokos (Nomor Virtual). Dapatkan potongan harga hingga 50% untuk setiap pembelian hingga tanggal 20 September 2025. Amankan privasi online Anda sekarang juga dengan harga terbaik!"
                },
                {
                    title: "Situs Diperbarui! Tampilan & Interaksi Lebih Modern",
                    date: "16 Sep 2025",
                    category: "UPDATE",
                    categoryColor: "bg-purple-500",
                    thumbnail: "https://files.catbox.moe/24f1q2.jpg",
                    fullContent: "Market Nusantara baru saja mendapatkan pembaruan besar! Kami telah menyempurnakan tampilan visual, menambahkan efek interaktif pada tombol, membuat testimoni bergerak otomatis, dan banyak lagi. Semua ini kami lakukan untuk memberikan pengalaman terbaik bagi Anda. Selamat menjelajah!"
                },
                {
                    title: "Pembaruan Tampilan & Fitur Keamanan",
                    date: "15 Sep 2025",
                    category: "UPDATE",
                    categoryColor: "bg-blue-500",
                    thumbnail: "https://files.catbox.moe/24f1q2.jpg",
                    fullContent: "Kami dengan bangga mengumumkan pembaruan besar pada tampilan situs Market Nusantara. Selain itu, kami juga memperkenalkan fitur 'Mitra Terverifikasi' untuk membantu Anda menemukan partner bisnis yang aman dan terpercaya. Jelajahi sekarang dan rasakan pengalaman yang lebih baik!"
                },
                {
                    title: "Promo Spesial Jasa Rekber Selama Bulan September",
                    date: "15 Sep 2025",
                    category: "PROMO",
                    categoryColor: "bg-yellow-500",
                    thumbnail: "https://files.catbox.moe/ygx3ln.jpg",
                    fullContent: "Nikmati promo spesial untuk layanan Rekening Bersama (Rekber) kami! Selama bulan September, dapatkan potongan biaya layanan hingga 50% untuk semua transaksi. Ini adalah kesempatan terbaik untuk bertransaksi dengan aman dan hemat. Jangan lewatkan!"
                },
                {
                    title: "5 Tips Mengenali Ciri-Ciri Penipu Online",
                    date: "15 Sep 2025",
                    category: "TIPS",
                    categoryColor: "bg-green-500",
                    thumbnail: "https://files.catbox.moe/tbms70.jpg",
                    fullContent: "Keamanan adalah prioritas. Berikut adalah 5 tips cepat untuk mengenali ciri-ciri penipu online: 1. Harga terlalu murah untuk menjadi kenyataan. 2. Memaksa untuk transfer cepat. 3. Menggunakan nomor rekening pribadi, bukan atas nama bisnis. 4. Profil media sosial yang mencurigakan. 5. Menolak menggunakan layanan Rekber. Selalu waspada!"
                }
            ];

            const newsListContainer = document.getElementById('news-list');
            newsListContainer.innerHTML = newsData.map((item, index) => `
                <div class="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer group news-item" data-index="${index}">
                    <img src="${item.thumbnail}" alt="${item.title}" class="w-24 h-24 object-cover rounded-md flex-shrink-0" loading="lazy">
                    <div class="flex-grow">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="text-xs font-bold px-2 py-0.5 rounded-full text-white ${item.categoryColor}">${item.category}</span>
                            <span class="text-xs text-slate-400">${item.date}</span>
                        </div>
                        <h5 class="font-semibold text-white group-hover:text-sky-400 transition-colors">${item.title}</h5>
                    </div>
                    <i class="fas fa-arrow-right text-slate-600 group-hover:text-sky-400 transition-colors self-center"></i>
                </div>`).join('');
            
            document.querySelectorAll('.news-item').forEach(item => {
                item.addEventListener('click', () => {
                    const news = newsData[item.dataset.index];
                    document.getElementById('modal-news-details').innerHTML = `
                        <img src="${news.thumbnail}" alt="${news.title}" class="w-full h-48 object-cover rounded-lg mb-4" loading="lazy">
                        <div class="flex items-center gap-3 mb-2">
                            <span class="text-sm font-bold px-3 py-1 rounded-full text-white ${news.categoryColor}">${news.category}</span>
                            <span class="text-sm text-slate-400">${news.date}</span>
                        </div>
                        <h3 class="text-2xl font-bold text-sky-300 mb-4">${news.title}</h3>
                        <p class="text-slate-300 whitespace-pre-line">${news.fullContent}</p>
                    `;
                    document.getElementById('news-modal').classList.remove('hidden');
                });
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

        }); // END DOMContentLoaded