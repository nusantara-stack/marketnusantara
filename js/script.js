// Script untuk toggle menu mobile
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Script untuk Konten Dinamis di Bagian Informasi
        const categoryButtons = document.querySelectorAll('.category-btn');
        const contentPanels = document.querySelectorAll('.content-panel');
        const dynamicTitle = document.getElementById('dynamic-title');
        const dynamicSubtitle = document.getElementById('dynamic-subtitle');

        const subtitles = {
            'content-1': 'Ikuti perkembangan terbaru dari perusahaan dan industri kami.',
            'content-2': 'Perkenalkan para profesional di balik kesuksesan kami.',
            'content-3': 'Jelajahi daftar ripper yang telah kami kurasi untuk Anda.'
        };

        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const targetId = button.dataset.target;
                const buttonText = button.querySelector('span').textContent;
                
                dynamicTitle.textContent = buttonText;
                dynamicSubtitle.textContent = subtitles[targetId];

                contentPanels.forEach(panel => {
                    panel.classList.add('hidden');
                    panel.classList.remove('active');
                });
                
                const targetPanel = document.getElementById(targetId);
                if (targetPanel) {
                    targetPanel.classList.remove('hidden');
                    setTimeout(() => {
                        targetPanel.classList.add('active');
                    }, 10);
                }
            });
        });

        // Script untuk Card Stacking
        const cards = document.querySelectorAll('.product-card');
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
                    transform = 'translateX(calc(-50% + 80%)) scale(0.85)';
                    opacity = '0.5';
                    zIndex = '5';
                } else if (offset === totalCards - 1) {
                    transform = 'translateX(calc(-50% - 80%)) scale(0.85)';
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
                updateStack(newIndex);
            });
        });

        updateStack(0);

        // Security Scripts
        document.addEventListener('contextmenu', event => event.preventDefault());
        document.addEventListener('keydown', function(e) {
            if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C' || e.key === 'J')) || (e.ctrlKey && e.key === 'U')) {
                e.preventDefault();
            }
        });
        
        // Ripper List, Search, and Modal Logic
        const ripperData = [
             { name: 'Pelaku 1', whatsapp: ['wa.me/+6283110877006'], nominal: 'Rp107.154', kasus: 'Scam', ewallet: ['083110877006'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/grhioa.jpg' },
            { name: 'Meisya Putri Arini', whatsapp: ['wa.me/+6283137567672'], nominal: 'Rp15.000', kasus: 'Scam', ewallet: ['081398091300 - Dana', '081398091300 - Gopay', '083133326689 - Gopay', '901185589079 - Seabank (a/n: ESIH)'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/zo46ma.jpg' },
            { name: 'Pelaku 3', whatsapp: ['wa.me/+6283152796642'], nominal: 'Rp8.000', kasus: 'Scam', ewallet: ['901369935890'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/g5j2fa.jpg' },
            { name: 'Pelaku 4', whatsapp: ['wa.me/6281313419236'], nominal: 'Rp30.000', kasus: 'Scam', ewallet: ['085727021478 OVO'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/53lt90.jpg' },
            { name: 'Pelaku 5', whatsapp: ['wa.me/+6289505332944'], nominal: 'Rp10.000', kasus: 'Scam', ewallet: ['089505332944'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/neeu5n.jpg' },
            { name: 'Pelaku 6', whatsapp: ['wa.me/6287844775440'], nominal: '—', kasus: 'Scam', ewallet: ['—'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/pehhig.jpg' },
            { name: 'Endang Sutriyani', whatsapp: ['wa.me/6282299080618'], nominal: 'Rp72.000', kasus: 'Scam', ewallet: ['901948655110'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/zxxyzv.jpg' },
            { name: 'Pelaku 8', whatsapp: ['wa.me/+62857701270438'], nominal: 'Rp16.000', kasus: 'Scam', ewallet: ['089626118020 DANA'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/p1yiz1.jpg' },
            { name: 'Pelaku 9', whatsapp: ['wa.me/6285180967002'], nominal: 'Rp7.000', kasus: 'Scam', ewallet: ['085801020968 DANA'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/c6kkxn.jpg' },
            { name: 'Pelaku 10', whatsapp: ['wa.me/6285194836237'], nominal: 'Rp50.000', kasus: 'Scam', ewallet: ['085727021478 GOPAY'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/puzsyt.jpg' },
            { name: 'Pelaku 11', whatsapp: ['wa.me/6283121498155'], nominal: 'Rp133.000', kasus: 'Scam', ewallet: ['082250494693'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/tz93c7.jpg' },
            { name: 'Pelaku 12', whatsapp: ['wa.me/6283136096285'], nominal: '— (Garapan)', kasus: 'Scam', ewallet: ['—'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/je6uzd.jpg' },
            { name: 'Pelaku 13', whatsapp: ['wa.me/6287719232611'], nominal: '120K (bisa lebih banyak)', kasus: 'Scam', ewallet: ['—'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/t22l04.jpg' },
            { name: 'Pelaku 14', whatsapp: ['wa.me/62895402510585', 'wa.me/62895414376389'], nominal: '30K (bisa lebih banyak)', kasus: 'Scam', ewallet: ['0895384890460'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/ohep24.jpg' },
            { name: 'Pelaku 15', whatsapp: ['wa.me/6281321446734'], nominal: '165K', kasus: 'Scam', ewallet: ['—'], status: 'Terverifikasi ✅', imgSrc: 'https://files.catbox.moe/y0b2k5.jpg' },
        ];
        
        const ripperListContainer = document.querySelector('#ripper-list .grid');
        const ripperSearchInput = document.getElementById('ripper-search');
        const modal = document.getElementById('ripper-modal');
        const modalDetails = document.getElementById('modal-ripper-details');
        const closeModalButton = document.getElementById('close-modal');
        const zoomModal = document.getElementById('image-zoom-modal');
        const zoomedImage = document.getElementById('zoomed-image');
        const closeZoomModalButton = document.getElementById('close-zoom-modal');
        
        let currentRipperIndex = 0;
        let currentFilteredRippers = [];

        function showRipperModal(ripperIndex) {
            currentRipperIndex = ripperIndex;
            const ripper = currentFilteredRippers[currentRipperIndex];
            const ripperId = `GNBL00${ripperData.indexOf(ripper) + 1}`;
            
            const whatsappLinks = ripper.whatsapp.map(link => `<a href="https://${link}" target="_blank" class="text-sky-400 hover:underline">${link.replace('wa.me/', '')}</a><i class="fas fa-copy copy-btn" data-copy-text="${link.replace('wa.me/', '')}"></i>`).join('<br>');
            const ewalletInfo = Array.isArray(ripper.ewallet) ? ripper.ewallet.map(e => `${e}<i class="fas fa-copy copy-btn" data-copy-text="${e}"></i>`).join('<br>') : `${ripper.ewallet}<i class="fas fa-copy copy-btn" data-copy-text="${ripper.ewallet}"></i>`;

            modalDetails.innerHTML = `
                <div class="relative mb-4 cursor-zoom-in">
                    <img src="${ripper.imgSrc}" alt="Bukti Penipuan" class="w-full h-auto rounded-lg max-h-60 object-contain" loading="lazy">
                </div>
                <h3 class="text-2xl font-bold text-sky-300 mb-4">${ripper.name} (${ripperId})</h3>
                <div class="space-y-2 text-gray-300 text-sm">
                    <p><strong class="font-semibold text-sky-400">WhatsApp:</strong><br>${whatsappLinks}</p>
                    <p><strong class="font-semibold text-sky-400">Nominal Kerugian:</strong> ${ripper.nominal}</p>
                    <p><strong class="font-semibold text-sky-400">Kasus:</strong> ${ripper.kasus}</p>
                    <p><strong class="font-semibold text-sky-400">eWallet/No.Rek:</strong><br>${ewalletInfo}</p>
                    <p><strong class="font-semibold text-sky-400">Status:</strong> ${ripper.status}</p>
                </div>
            `;
            modal.classList.remove('hidden');

            modalDetails.querySelector('img').addEventListener('click', () => {
                zoomedImage.src = ripper.imgSrc;
                zoomModal.classList.remove('hidden');
            });
        }

        modalDetails.addEventListener('click', function(event) {
            if (event.target.classList.contains('copy-btn')) {
                const textToCopy = event.target.getAttribute('data-copy-text');
                copyToClipboard(textToCopy);
            }
        });

        function hideRipperModal() {
            modal.classList.add('hidden');
        }

        const listObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('is-visible');
            });
        }, { root: document.querySelector('#ripper-list'), threshold: 0.1 });

        function generateRipperList(filter = '') {
            ripperListContainer.innerHTML = '';
            const lowercasedFilter = filter.toLowerCase();
            currentFilteredRippers = ripperData.filter((ripper, index) => {
                const ripperId = `GNBL00${index + 1}`;
                const noRekString = Array.isArray(ripper.ewallet) ? ripper.ewallet.join(' ') : ripper.ewallet;
                return ripper.name.toLowerCase().includes(lowercasedFilter) || ripperId.toLowerCase().includes(lowercasedFilter) || noRekString.toLowerCase().includes(lowercasedFilter);
            });
            
            currentFilteredRippers.forEach((ripper, index) => {
                const ripperId = `GNBL00${ripperData.indexOf(ripper) + 1}`;
                const ripperBox = document.createElement('div');
                ripperBox.className = 'ripper-box p-2 rounded-lg border animate-in-list';
                ripperBox.style.backgroundColor = 'var(--bg-color)';
                ripperBox.style.borderColor = '#4a5160';
                ripperBox.innerHTML = `
                    <h5 class="font-semibold text-sky-300 text-sm">${ripper.name}</h5>
                    <p class="text-xs text-sky-400 mt-1">ID: ${ripperId}</p>
                    <p class="text-xs text-sky-400 mt-1">Nominal: ${ripper.nominal}</p>
                `;
                ripperBox.addEventListener('click', () => showRipperModal(index));
                ripperListContainer.appendChild(ripperBox);
                listObserver.observe(ripperBox);
            });
        }
        
        document.getElementById('prev-ripper').addEventListener('click', () => showRipperModal((currentRipperIndex - 1 + currentFilteredRippers.length) % currentFilteredRippers.length));
        document.getElementById('next-ripper').addEventListener('click', () => showRipperModal((currentRipperIndex + 1) % currentFilteredRippers.length));
        ripperSearchInput.addEventListener('input', (e) => generateRipperList(e.target.value));
        closeModalButton.addEventListener('click', hideRipperModal);
        closeZoomModalButton.addEventListener('click', () => zoomModal.classList.add('hidden'));
        generateRipperList();

        // Scroll Animation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('is-visible');
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.animate-on-scroll').forEach(target => observer.observe(target));

        // Floating Icons
        const floatingIconsContainer = document.querySelector('.floating-icons');
        const icons = ['fa-bitcoin', 'fa-ethereum', 'fa-monero', 'fa-btc', 'fa-gg-circle', 'fa-digital-ocean', 'fa-rebel', 'fa-empire'];
        for (let i = 0; i < 15; i++) {
            const icon = document.createElement('i');
            icon.className = `fab ${icons[Math.floor(Math.random() * icons.length)]}`;
            Object.assign(icon.style, {
                left: `${Math.random() * 100}vw`,
                animationDuration: `${Math.random() * 15 + 15}s`,
                animationDelay: `${Math.random() * 5}s`,
                fontSize: `${Math.random() * 3 + 1}rem`
            });
            floatingIconsContainer.appendChild(icon);
        }
        
        // Product Modal Logic
        const productModal = document.getElementById('product-modal');
        const closeProductModalButton = document.getElementById('close-product-modal');
        const modalProductDetails = document.getElementById('modal-product-details');
        const productDetailButtons = document.querySelectorAll('.product-card button');
        const productData = [
            { name: 'Nokos Indonesia', price: 'Rp 5.000', imgSrc: 'https://files.catbox.moe/17om8d.jpg', description: 'Dapatkan nomor virtual WhatsApp Indonesia sekali pakai untuk verifikasi aman dan menjaga privasi online Anda.' },
            { name: 'Bikin Website', isTiered: true, tiers: [
                { name: 'Paket Basic', price: 'Rp 250.000', features: ['1 Halaman Landing Page', 'Desain Responsif', 'Domain .com (1 Thn)', 'Hosting (1 Thn)'] },
                { name: 'Paket Bisnis', price: 'Rp 750.000', features: ['Hingga 5 Halaman', 'Desain Premium', 'Domain & Hosting (1 Thn)', 'Integrasi Sosial Media'] },
                { name: 'Paket E-Commerce', price: 'Rp 1.500.000', features: ['Toko Online Penuh', 'Payment Gateway', 'Manajemen Produk', 'Domain & Hosting (1 Thn)'] }
            ]},
            { name: 'Rekber', price: 'Mulai dari Rp 1.000', imgSrc: 'https://files.catbox.moe/ygx3ln.jpg', description: 'Transaksi online aman dengan layanan rekening bersama (rekber) terpercaya kami sebagai penengah.' },
            { name: 'Partnership', price: 'Mulai dari Rp 125.000', imgSrc: 'https://files.catbox.moe/ulqz43.jpg', description: 'Bergabunglah dengan program kemitraan kami dan raih berbagai keuntungan eksklusif serta peluang pertumbuhan bersama.' },
        ];
        let currentProductIndex = 0;
        function showProductModal(index) {
            currentProductIndex = index;
            const product = productData[index];
            let contentHTML = '';
            if (product.isTiered) {
                let tiersHTML = product.tiers.map(tier => `
                    <div class="flex flex-col border border-gray-700 rounded-lg p-4 bg-gray-900/50 flex-1">
                        <h4 class="text-xl font-bold text-sky-400">${tier.name}</h4>
                        <p class="text-2xl font-bold my-3">${tier.price}</p>
                        <ul class="space-y-2 text-sm text-gray-300 mb-4 flex-grow">${tier.features.map(f => `<li class="flex items-center"><i class="fas fa-check-circle text-sky-500 mr-2"></i>${f}</li>`).join('')}</ul>
                        <a href="https://wa.me/+6285218726234" target="_blank" class="mt-auto w-full text-center bg-sky-600 text-white font-bold px-5 py-2 rounded-lg hover:bg-sky-700 transition-colors">Pilih Paket</a>
                    </div>`).join('');
                contentHTML = `<div class="text-center mb-4"><h3 class="text-3xl font-bold text-sky-300">${product.name}</h3><p class="text-gray-400 mt-1">Pilih paket yang paling sesuai untuk kebutuhan Anda.</p></div><div class="flex flex-col md:flex-row gap-4 mt-6">${tiersHTML}</div>`;
            } else {
                contentHTML = `<img src="${product.imgSrc}" alt="${product.name}" class="w-full h-48 object-cover rounded-lg mb-4" loading="lazy"><h3 class="text-2xl font-bold text-sky-300 mb-2">${product.name}</h3><p class="text-gray-300 mb-4">${product.description}</p><div class="flex justify-between items-center"><span class="text-2xl font-bold text-sky-400">${product.price}</span><a href="https://wa.me/+6285218726234" target="_blank" class="bg-sky-600 text-white font-bold px-5 py-2 rounded-lg hover:bg-sky-700 transition-all transform hover:scale-105 inline-flex items-center shadow-lg text-sm"><span>Beli Sekarang</span><i class="fab fa-whatsapp ml-2"></i></a></div>`;
            }
            modalProductDetails.innerHTML = contentHTML;
            productModal.classList.remove('hidden');
        }
        productDetailButtons.forEach((button, index) => button.addEventListener('click', () => showProductModal(index)));
        document.querySelectorAll('.footer-product-link').forEach(link => link.addEventListener('click', (e) => { e.preventDefault(); showProductModal(parseInt(link.dataset.productIndex, 10)); }));
        document.getElementById('prev-product').addEventListener('click', () => showProductModal((currentProductIndex - 1 + productData.length) % productData.length));
        document.getElementById('next-product').addEventListener('click', () => showProductModal((currentProductIndex + 1) % productData.length));
        closeProductModalButton.addEventListener('click', () => productModal.classList.add('hidden'));

        // Counting Animation
        const achievementSection = document.getElementById('achievements');
        if (achievementSection) {
            const startCounter = (el) => {
                const target = parseInt(el.dataset.target, 10);
                const duration = 2000;
                let startTime = null;
                function animation(currentTime) {
                    if (startTime === null) startTime = currentTime;
                    const progress = currentTime - startTime;
                    const currentNumber = Math.min(Math.floor((progress / duration) * target), target);
                    el.innerText = currentNumber.toLocaleString();
                    if (progress < duration) {
                        requestAnimationFrame(animation);
                    } else {
                        el.innerText = target.toLocaleString() + "+";
                    }
                }
                requestAnimationFrame(animation);
                el.classList.add('counted');
            };
            const counterObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const counters = entry.target.querySelectorAll('.counting-number');
                        counters.forEach(counter => {
                            if (!counter.classList.contains('counted')) {
                                startCounter(counter);
                            }
                        });
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.25 });
            counterObserver.observe(achievementSection);
        }

        // FAQ Accordion
        document.querySelectorAll('.faq-question').forEach(q => q.addEventListener('click', () => {
            const answer = q.nextElementSibling; const isActive = q.classList.contains('active');
            document.querySelectorAll('.faq-question').forEach(i => { i.classList.remove('active'); i.nextElementSibling.style.maxHeight = null; });
            if (!isActive) { q.classList.add('active'); answer.style.maxHeight = answer.scrollHeight + "px"; }
        }));
        
        // Modal Handling
        function setupModal(triggerBtnId, modalId, closeBtnId) {
            const triggerBtn = document.getElementById(triggerBtnId);
            const modal = document.getElementById(modalId);
            const closeBtn = document.getElementById(closeBtnId);
            if(triggerBtn && modal && closeBtn) {
                triggerBtn.addEventListener('click', () => modal.classList.remove('hidden'));
                closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
            }
        }
        setupModal('report-scammer-btn', 'report-modal', 'close-report-modal');
        setupModal('submit-testimonial-btn', 'testimonial-modal', 'close-testimonial-modal');

        // Toast Notification
        const toastContainer = document.getElementById('toast-container');
        function showToast(message, type = 'success') {
            const toast = document.createElement('div');
            toast.className = `toast p-4 rounded-lg shadow-lg text-white text-sm ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`;
            toast.textContent = message;
            toastContainer.appendChild(toast);
            setTimeout(() => {
                toast.classList.add('removing');
                toast.addEventListener('animationend', () => toast.remove());
            }, 3000);
        }
        
        // Copy to Clipboard
        function copyToClipboard(text) {
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            showToast(`Teks berhasil disalin: ${text}`);
        }

        // AJAX Form Submission
        function setupFormspreeAjax(formId, successMessage) {
            const form = document.getElementById(formId);
            if (!form) return;
            form.addEventListener("submit", async function(event) {
                event.preventDefault();
                const data = new FormData(event.target);
                showToast('Mengirim...', 'info');
                try {
                    const response = await fetch(event.target.action, { method: form.method, body: data, headers: { 'Accept': 'application/json' } });
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
                    showToast("Oops! Terjadi masalah.", 'error');
                }
            });
        }
        setupFormspreeAjax('contact-form', 'Terima kasih! Pesan Anda telah terkirim.');
        setupFormspreeAjax('report-form', 'Terima kasih! Laporan Anda telah terkirim.');
        setupFormspreeAjax('testimonial-form', 'Terima kasih! Ulasan Anda telah terkirim.');

        // Welcome Popup
        const welcomeModal = document.getElementById('welcome-modal');
        const closeWelcomeModalBtn = document.getElementById('close-welcome-modal');
        document.addEventListener('DOMContentLoaded', () => {
            if (!sessionStorage.getItem('welcomePopupShown')) {
                setTimeout(() => {
                    if(welcomeModal) welcomeModal.classList.remove('hidden');
                    sessionStorage.setItem('welcomePopupShown', 'true');
                }, 1000);
            }
        });
        if (closeWelcomeModalBtn) closeWelcomeModalBtn.addEventListener('click', () => welcomeModal.classList.add('hidden'));
        
        // Back to Top Button
        const backToTopButton = document.getElementById('back-to-top');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
