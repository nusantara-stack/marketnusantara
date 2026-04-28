document.addEventListener('DOMContentLoaded', () => {
    const mitraContainer = document.getElementById('mitra-container');
    if (!mitraContainer) return; // Mencegah error jika elemen tidak ditemukan

    const roleLabels = {
        'own': 'OWNER',
        'pt': 'PARTNER',
        'tk': 'TANGAN KANAN',
        'pp': 'PAID PROMOTE'
    };

    // Helper untuk mengubah hex ke rgba untuk efek shadow transparan
    const hexToRgba = (hex, alpha) => {
        let r = 34, g = 211, b = 238; // Default Cyan fallback
        if (hex && hex.startsWith('#')) {
            let cleanHex = hex.replace('#', '');
            if (cleanHex.length === 3) {
                cleanHex = cleanHex.split('').map(char => char + char).join('');
            }
            if (cleanHex.length === 6) {
                r = parseInt(cleanHex.substring(0, 2), 16);
                g = parseInt(cleanHex.substring(2, 4), 16);
                b = parseInt(cleanHex.substring(4, 6), 16);
            }
        }
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    let allMitraData = []; 
    let mitraSwiperInstance = null; 

    const renderMitraSlider = (filter = 'all') => {
        if (mitraSwiperInstance !== null) {
            mitraSwiperInstance.destroy(true, true);
            mitraSwiperInstance = null;
        }

        mitraContainer.innerHTML = ''; 
        
        const filteredData = filter === 'all' 
            ? allMitraData 
            : allMitraData.filter(m => m.role === filter);

        const displayData = [...filteredData].sort(() => 0.5 - Math.random()).slice(0, 25);

        if (displayData.length === 0) {
            mitraContainer.innerHTML = '<div class="w-full text-center py-8 text-gray-500 col-span-full">Belum ada data untuk kategori ini.</div>';
            return; 
        }

        let htmlContent = '';
        displayData.forEach(mitra => {
            const roleName = roleLabels[mitra.role] || 'MEMBER';
            
            // Ambil warna dari JSON, default ke Cyan jika tidak ada
            const accentColor = mitra.aksen_warna || '#22d3ee';
            const accentDim = hexToRgba(accentColor, 0.4);
            
            const status = Math.random() > 0.3 ? 'Online' : 'Away';
            const statusColor = status === 'Online' ? '#4ade80' : '#fbbf24';

            htmlContent += `
                <div class="swiper-slide h-auto">
                    <div class="mitra-card" style="--card-accent: ${accentColor}; --card-accent-dim: ${accentDim};">
                        <div class="mitra-card-pattern"></div>
                        
                        <div class="mitra-status">
                            <div class="mitra-status-dot" style="background-color: ${statusColor}"></div>
                            ${status}
                        </div>
                        
                        <div class="mitra-image-wrapper">
                            <img src="${mitra.foto}" alt="${mitra.nama}" class="mitra-img" onerror="this.src='https://placehold.co/200x200/1c1c1c/a1a1aa?text=${mitra.nama.substring(0,2)}'">
                        </div>
                        
                        <div class="mitra-info">
                            <div>
                                <span class="mitra-role-label">${roleName}</span>
                                <h3 class="mitra-name">${mitra.nama}</h3>
                                
                                <div class="mitra-stats-row">
                                    <div class="mitra-stat-item">
                                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                        <span>4.9</span>
                                    </div>
                                    <div class="mitra-stat-item">
                                        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <span>Verified</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mitra-action-bar">
                                <a href="${mitra.link}" target="_blank" class="btn-feed">
                                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.487 5.235 3.487 8.413.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.269.655 4.502 1.908 6.387l-.473 1.724 1.743-.459z"/></svg>
                                    Hubungi
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        mitraContainer.innerHTML = htmlContent;

        mitraSwiperInstance = new Swiper(".mitra-swiper", {
            slidesPerView: 2,
            spaceBetween: 10, 
            loop: displayData.length > 2, 
            speed: 3000, 
            roundLengths: true, 
            grabCursor: true, 
            autoplay: {
                delay: 0,
                disableOnInteraction: false,
                pauseOnMouseEnter: true 
            },
            pagination: {
                el: ".swiper-pagination",
                type: "progressbar",
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            breakpoints: {
                640: { slidesPerView: 2, spaceBetween: 12 },
                768: { slidesPerView: 3, spaceBetween: 14 },
                1024: { slidesPerView: 5, spaceBetween: 16 }, 
                1280: { slidesPerView: 5, spaceBetween: 20 }
            },
        });
    };

    const loadMitraData = async () => {
        try {
            const response = await fetch('DATABASE/mitra.json');
            if (!response.ok) throw new Error("File tidak ditemukan");
            allMitraData = await response.json();
            renderMitraSlider('all');
        } catch (error) {
            console.error('Error loading mitra data:', error);
            mitraContainer.innerHTML = '<div class="w-full text-center py-8 text-red-500 col-span-full">Gagal memuat data mitra. Pastikan file JSON tersedia.</div>';
        }
    };

    loadMitraData();

    const filterBtns = document.querySelectorAll('.mitra-filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            renderMitraSlider(filterValue);
        });
    });
});
