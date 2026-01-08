document.addEventListener("DOMContentLoaded", function () {
    const resourceContainer = document.getElementById('resource-container');
    if (!resourceContainer) return; // Only run on references page

    // 1. Initial Data (Real Links)
    const initialResources = [
        { id: 1, title: "Tài liệu về Bạo lực học đường", category: "violence", desc: "Tổng quan về thực trạng và các hình thức bạo lực học đường hiện nay.", icon: "🛡️", views: 120, url: "https://eduttc-my.sharepoint.com/:b:/g/personal/tuyenbn_igcschool_edu_vn/IQD8FEgJkHSjRaKC8MOdl7ZdAUFdTxLn7ZeMf8ACeQqv-Hg?e=fQfETg" },
        { id: 2, title: "Hướng dẫn quản lý cảm xúc", category: "emotion", desc: "Kỹ năng nhận diện và làm chủ cảm xúc tiêu cực.", icon: "😊", views: 95, url: "https://eduttc-my.sharepoint.com/:b:/g/personal/tuyenbn_igcschool_edu_vn/IQC-1AB1e9hISop30jhvMLGAAZbEBV-gdftAQNV7bAFInMw" },
        { id: 3, title: "Các phương pháp phòng chống bạo lực", category: "violence", desc: "Biện pháp phòng ngừa bạo lực hiệu quả cho học sinh.", icon: "🚫", views: 150, url: "https://eduttc-my.sharepoint.com/:b:/g/personal/tuyenbn_igcschool_edu_vn/IQCXjoDnttxUQ6YY92DFPInlAXxH1WbMoDQC4ibSkdNjCJ0" },
        { id: 4, title: "Tư vấn tâm lý cho học sinh", category: "skill", desc: "Hỗ trợ vượt qua các vấn đề tâm lý lứa tuổi học đường.", icon: "🗣️", views: 110, url: "https://eduttc-my.sharepoint.com/:b:/g/personal/tuyenbn_igcschool_edu_vn/IQB6jWke7PUoQrzxzL79x8lOAcK9ntxno8EMhU7X1tYrrXU" },
        { id: 5, title: "Quản lý cảm xúc trong học đường", category: "emotion", desc: "Ứng dụng trí tuệ cảm xúc trong môi trường lớp học.", icon: "🧘", views: 80, url: "https://eduttc-my.sharepoint.com/:b:/g/personal/tuyenbn_igcschool_edu_vn/IQBjcL2SX4ppR6IBa60JcAg8AZeD5Ccfp9cTsju2_VRnICc" },
        { id: 6, title: "Giới thiệu về bạo lực học đường", category: "violence", desc: "Định nghĩa và các dấu hiệu nhận biết sớm.", icon: "📖", views: 70, url: "https://eduttc-my.sharepoint.com/:b:/g/personal/tuyenbn_igcschool_edu_vn/IQCF7CO85npFRKxYeQWWn7SMARFsB29suFvY51eMmvORxr8" },
        { id: 7, title: "Hướng dẫn phòng chống bạo lực", category: "violence", desc: "Sổ tay hướng dẫn chi tiết cho học sinh và giáo viên.", icon: "🛡️", views: 130, url: "https://eduttc-my.sharepoint.com/:b:/g/personal/tuyenbn_igcschool_edu_vn/IQAEIWz47p7bRYW7p_JWoSTtASlYdAfgV2duSChp_dICecw" },
        { id: 8, title: "Đề án phòng chống bạo lực", category: "violence", desc: "Văn bản và kế hoạch hành động cấp trường.", icon: "📑", views: 45, url: "https://eduttc-my.sharepoint.com/:b:/g/personal/tuyenbn_igcschool_edu_vn/IQABdHGI5prJR6TEfw29IDdtActQg5xaLTtiXz5vKFMvzdg" },
        { id: 9, title: "Tư vấn tâm lý học đường", category: "skill", desc: "Quy trình và nguyên tắc tư vấn cơ bản.", icon: "🤝", views: 90, url: "https://eduttc-my.sharepoint.com/:b:/g/personal/tuyenbn_igcschool_edu_vn/IQCerJQtK5G6T4PudCWuu68sAXDm7SeCNNVd7wYkO8JKT28" },
        { id: 10, title: "Tài liệu phương pháp tư vấn", category: "skill", desc: "Các kỹ thuật tham vấn tâm lý chuyên sâu.", icon: "🧠", views: 60, url: "https://eduttc-my.sharepoint.com/:b:/g/personal/tuyenbn_igcschool_edu_vn/IQCvAxXwyQymR72OMxYJPr25AVEflPMPdJwq5yVbf0ZEakc" },
        { id: 11, title: "Phương pháp can thiệp tâm lý", category: "skill", desc: "Các bước can thiệp khi phát hiện vấn đề tâm lý.", icon: "🩺", views: 55, url: "https://eduttc-my.sharepoint.com/:b:/g/personal/tuyenbn_igcschool_edu_vn/IQDmYwLeZ-dpRILMhRG9VhDlAQyCZLO6gN6nlLwmKXPRDr8" },
        { id: 12, title: "Giải pháp can thiệp bạo lực", category: "violence", desc: "Quy trình xử lý các vụ việc bạo lực học đường.", icon: "⚖️", views: 100, url: "https://eduttc-my.sharepoint.com/:b:/g/personal/tuyenbn_igcschool_edu_vn/IQD8FEgJkHSjRaKC8MOdl7ZdAUFdTxLn7ZeMf8ACeQqv-Hg" }
    ];

    // Load from localStorage or initialize
    // RESET Data to ensure new links appear (Simulated DB Reset)
    // In production, we wouldn't overwrite user data like this, but for dev we need to update the mock DB.
    let resources = initialResources;
    localStorage.setItem('libraryData', JSON.stringify(resources));

    // 2. Render Functions
    function renderResources(data) {
        resourceContainer.innerHTML = '';
        if (data.length === 0) {
            resourceContainer.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">Không tìm thấy tài liệu phù hợp.</p>';
            return;
        }

        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'book-card';
            card.innerHTML = `
                <div class="book-thumb">${item.icon}</div>
                <div class="book-info">
                    <div class="book-title">${item.title}</div>
                    <div class="book-desc">${item.desc}</div>
                    <div style="display:flex; justify-content:space-between; align-items:center; width:100%">
                         <button class="btn book-btn" onclick="openResource(${item.id})">Đọc ngay</button>
                         <span style="font-size:0.8rem; color:#888;">👁️ ${item.views}</span>
                    </div>
                </div>
            `;
            resourceContainer.appendChild(card);
        });
    }

    // ... (Filter logic remains same) ...
    // 3. Filter Logic
    const searchInput = document.getElementById('search-input');
    const categorySelect = document.getElementById('category-select');

    function filterData() {
        const keyword = searchInput.value.toLowerCase();
        const category = categorySelect.value;

        const filtered = resources.filter(item => {
            const matchKeyword = item.title.toLowerCase().includes(keyword) || item.desc.toLowerCase().includes(keyword);
            const matchCategory = category === 'all' || item.category === category;
            return matchKeyword && matchCategory;
        });

        renderResources(filtered);
    }

    searchInput.addEventListener('input', filterData);
    categorySelect.addEventListener('change', filterData);

    // 4. Popular Resources Logic
    function renderPopular() {
        const popularContainer = document.getElementById('popular-container');
        if (!popularContainer) return;

        const sorted = [...resources].sort((a, b) => b.views - a.views).slice(0, 3);
        popularContainer.innerHTML = '';

        sorted.forEach(item => {
            const div = document.createElement('div');
            // Inline style for sidebar item
            div.style.marginBottom = '1rem';
            div.style.paddingBottom = '0.5rem';
            div.style.borderBottom = '1px solid #eee';
            div.style.cursor = 'pointer';
            div.innerHTML = `
                <div style="font-weight:bold; color:var(--primary-blue);">${item.title}</div>
                <div style="font-size:0.8rem; color:#666;">${item.views} lượt xem</div>
            `;
            div.onclick = () => openResource(item.id);
            popularContainer.appendChild(div);
        });
    }

    // 5. Action
    window.openResource = function (id) {
        // Find item
        const index = resources.findIndex(r => r.id === id);
        if (index !== -1) {
            resources[index].views += 1;
            // Update storage
            localStorage.setItem('libraryData', JSON.stringify(resources));

            // Open URL in new window
            if (resources[index].url) {
                window.open(resources[index].url, '_blank');
            } else {
                alert("Tài liệu này chưa có liên kết.");
            }

            // Re-render to update view counts
            filterData();
            renderPopular();
        }
    }

    // Init
    renderResources(resources);
    renderPopular();
});
