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
                    // Add a slight delay to re-trigger animation
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
                
                let transform = '';
                let opacity = '0';
                let zIndex = '1';

                if (offset === 0) {
                    // Active card
                    transform = 'translateX(-50%) scale(1)';
                    opacity = '1';
                    zIndex = '10';
                } else if (offset === 1) {
                    // Right card
                    transform = 'translateX(calc(-50% + 80%)) scale(0.85)';
                    opacity = '0.5';
                    zIndex = '5';
                } else if (offset === totalCards - 1) {
                    // Left card
                    transform = 'translateX(calc(-50% - 80%)) scale(0.85)';
                    opacity = '0.5';
                    zIndex = '5';
                } else {
                    // Hidden cards
                    const direction = (offset > totalCards / 2) ? -1 : 1;
                    transform = `translateX(calc(-50% + ${direction * 100}%)) scale(0.7)`;
                    opacity = '0';
                    zIndex = '1';
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

        // Initial setup
        updateStack(0);

        // Security Scripts to block inspect element, etc.
        document.addEventListener('contextmenu', event => event.preventDefault());
        document.addEventListener('keydown', function(e) {
            if (e.key === 'F12' ||
                (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                (e.ctrlKey && e.shiftKey && e.key === 'C') ||
                (e.ctrlKey && e.shiftKey && e.key === 'J') ||
                (e.ctrlKey && e.key === 'U')) {
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

        function showRipperModal(ripper, ripperId) {
            const whatsappLinks = ripper.whatsapp.map(link => `<a href="https://${link}" target="_blank" class="text-sky-400 hover:underline">${link}</a>`).join('<br>');
            const ewalletInfo = Array.isArray(ripper.ewallet) ? ripper.ewallet.join('<br>') : ripper.ewallet;

            modalDetails.innerHTML = `
                <div class="relative mb-4 cursor-zoom-in">
                    <div class="loader-container absolute inset-0 flex items-center justify-center rounded-lg" style="background-color: var(--bg-color);">
                        <div class="loader"></div>
                    </div>
                    <img src="${ripper.imgSrc}" alt="Bukti Penipuan" class="w-full h-auto rounded-lg max-h-60 object-contain opacity-0 transition-opacity duration-300">
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

            const imageInModal = modalDetails.querySelector('img');
            const loader = modalDetails.querySelector('.loader-container');
            
            imageInModal.onload = () => {
                loader.classList.add('hidden');
                imageInModal.classList.remove('opacity-0');
            };
            imageInModal.onerror = () => {
                loader.innerHTML = '<p class="text-red-400">Gagal memuat gambar</p>';
            };

            imageInModal.addEventListener('click', () => {
                zoomedImage.src = ripper.imgSrc;
                zoomModal.classList.remove('hidden');
            });
        }

        function hideRipperModal() {
            modal.classList.add('hidden');
        }

        const listObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                } else {
                    entry.target.classList.remove('is-visible');
                }
            });
        }, {
            root: document.querySelector('#ripper-list'),
            threshold: 0.1
        });

        function generateRipperList(filter = '') {
            ripperListContainer.innerHTML = '';
            const lowercasedFilter = filter.toLowerCase();

            ripperData.forEach((ripper, index) => {
                const ripperId = `GNBL00${index + 1}`;
                const noRekString = Array.isArray(ripper.ewallet) ? ripper.ewallet.join(' ') : ripper.ewallet;
                if (ripper.name.toLowerCase().includes(lowercasedFilter) || ripperId.toLowerCase().includes(lowercasedFilter) || noRekString.toLowerCase().includes(lowercasedFilter)) {
                    const ripperBox = document.createElement('div');
                    ripperBox.className = 'ripper-box p-2 rounded-lg border animate-in-list';
                    ripperBox.style.backgroundColor = 'var(--second-bg-color)';
                    ripperBox.style.borderColor = '#4a5160';
                    ripperBox.innerHTML = `
                        <h5 class="font-semibold text-sky-300 text-sm">${ripper.name}</h5>
                        <p class="text-xs text-sky-400 mt-1">ID: ${ripperId}</p>
                        <p class="text-xs text-sky-400 mt-1">Nominal: ${ripper.nominal}</p>
                    `;
                    ripperBox.addEventListener('click', () => {
                        showRipperModal(ripper, ripperId);
                    });
                    ripperListContainer.appendChild(ripperBox);
                    listObserver.observe(ripperBox);
                }
            });
        }

        ripperSearchInput.addEventListener('input', (e) => {
            generateRipperList(e.target.value);
        });
        
        closeModalButton.addEventListener('click', hideRipperModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideRipperModal();
            }
        });

        closeZoomModalButton.addEventListener('click', () => zoomModal.classList.add('hidden'));
        zoomModal.addEventListener('click', (e) => {
            if(e.target === zoomModal) {
                 zoomModal.classList.add('hidden');
            }
        });

        // Initial list generation
        generateRipperList();

        // Scroll Animation Script for main sections
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                } else {
                    entry.target.classList.remove('is-visible');
                }
            });
        }, {
            threshold: 0.1 // Trigger when 10% of the element is visible
        });

        const targets = document.querySelectorAll('.animate-on-scroll');
        targets.forEach(target => {
            observer.observe(target);
        });

        // Floating Icons Script
        const floatingIconsContainer = document.querySelector('.floating-icons');
        const icons = ['fa-bitcoin', 'fa-ethereum', 'fa-monero', 'fa-btc', 'fa-gg-circle', 'fa-gg', 'fa-digital-ocean', 'fa-dochub', 'fa-contao', 'fa-rebel', 'fa-empire', 'fa-viadeo', 'fa-ravelry', 'fa-pied-piper-alt'];
        for (let i = 0; i < 15; i++) {
            const icon = document.createElement('i');
            const randomIcon = icons[Math.floor(Math.random() * icons.length)];
            icon.className = `fab ${randomIcon}`;
            icon.style.left = `${Math.random() * 100}vw`;
            icon.style.animationDuration = `${Math.random() * 15 + 15}s`;
            icon.style.animationDelay = `${Math.random() * 5}s`;
            icon.style.fontSize = `${Math.random() * 3 + 1}rem`;
            floatingIconsContainer.appendChild(icon);
        }
