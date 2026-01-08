document.addEventListener("DOMContentLoaded", function () {
    // Security Check (Simple simulation)
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
        const password = prompt("Vui lòng nhập mật khẩu quản trị (Mặc định: admin123):");
        if (password === 'admin123') {
            sessionStorage.setItem('adminLoggedIn', 'true');
        } else {
            alert("Mật khẩu sai! Đang chuyển hướng về trang chủ.");
            window.location.href = 'index.html';
            return;
        }
    }

    // 1. Load Data
    const studentData = JSON.parse(localStorage.getItem('studentData')) || [
        { name: "Nguyễn Văn A", class: "10A1", lastScore: 45, risk: "Average", time: "2026-01-05" },
        { name: "Trần Thị B", class: "11B2", lastScore: 25, risk: "Low", time: "2026-01-06" },
        { name: "Lê Văn C", class: "12C3", lastScore: 85, risk: "Very High", time: "2026-01-07" } // Mock high risk
    ];

    // Check for new High Risk Alert from Survey
    const localScore = localStorage.getItem('violenceTestScore');
    if (localScore && parseInt(localScore) >= 80) {
        // Prevent duplicate if already exists (simplified logic)
        const exists = studentData.some(s => s.lastScore == localScore && s.risk === "Very High");
        if (!exists) {
            studentData.unshift({ name: "Học sinh (Mới)", class: "Không rõ", lastScore: parseInt(localScore), risk: "Very High", time: new Date().toISOString().split('T')[0] });
            localStorage.setItem('studentData', JSON.stringify(studentData));
        }
    }

    const libraryData = JSON.parse(localStorage.getItem('libraryData')) || [/* fallback logic handled in library.js load */];

    // 2. Render Functions
    function renderOverview() {
        // Calculate stats
        const totalStudents = studentData.length;
        const highRisk = studentData.filter(s => s.risk === 'Very High' || s.risk === 'High').length;

        document.getElementById('total-students-count').textContent = totalStudents;
        document.getElementById('high-risk-count').textContent = highRisk;
    }

    function renderStudents() {
        const tbody = document.getElementById('student-table-body');
        if (!tbody) return;
        tbody.innerHTML = '';
        studentData.forEach(s => {
            const tr = document.createElement('tr');
            let riskClass = 'text-success';
            if (s.risk === 'Average') riskClass = 'text-warning';
            if (s.risk === 'High') riskClass = 'text-orange';
            if (s.risk === 'Very High') riskClass = 'text-danger font-bold';

            tr.innerHTML = `
                <td>${s.name}</td>
                <td>${s.class}</td>
                <td>${s.lastScore}</td>
                <td class="${riskClass}">${s.risk}</td>
                <td>${s.time}</td>
            `;
            tbody.appendChild(tr);
        });

        // Render Alerts specifically
        const alertList = document.getElementById('alert-list');
        if (alertList) {
            alertList.innerHTML = '';
            const urgent = studentData.filter(s => s.lastScore >= 80);
            if (urgent.length === 0) {
                alertList.innerHTML = '<p class="text-muted">Không có cảnh báo rủi ro cao nào.</p>';
            } else {
                urgent.forEach(s => {
                    const div = document.createElement('div');
                    div.className = 'alert-item';
                    div.innerHTML = `⚠️ <strong>CẢNH BÁO:</strong> Học sinh ${s.name} (${s.class}) có nguy cơ RẤT CAO (Điểm: ${s.lastScore}). Cần hỗ trợ ngay!`;
                    alertList.appendChild(div);
                });
            }
        }
    }

    function renderLibraryAdmin() {
        const tbody = document.getElementById('library-table-body');
        if (!tbody) return;

        // Reload fresh from storage because separate page contexts
        const currentLib = JSON.parse(localStorage.getItem('libraryData')) || [];
        tbody.innerHTML = '';

        currentLib.forEach((item, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.id}</td>
                <td>${item.title}</td>
                <td>${item.category}</td>
                <td>${item.views}</td>
                <td>
                    <button class="btn-sm btn-danger" onclick="deleteResource(${item.id})">Xóa</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // 3. Admin Actions
    window.deleteResource = function (id) {
        if (!confirm("Bạn có chắc chắn muốn xóa tài liệu này?")) return;

        const currentLib = JSON.parse(localStorage.getItem('libraryData')) || [];
        const updated = currentLib.filter(item => item.id !== id);
        localStorage.setItem('libraryData', JSON.stringify(updated));
        renderLibraryAdmin();
        alert("Đã xóa tài liệu.");
    };

    window.addNewResource = function (e) {
        e.preventDefault();
        const title = document.getElementById('new-title').value;
        const category = document.getElementById('new-category').value;
        const desc = document.getElementById('new-desc').value;

        const currentLib = JSON.parse(localStorage.getItem('libraryData')) || [];
        const newId = currentLib.length ? Math.max(...currentLib.map(i => i.id)) + 1 : 1;

        const newItem = {
            id: newId,
            title: title,
            category: category,
            desc: desc,
            icon: "📘", // Default icon
            views: 0
        };

        currentLib.push(newItem);
        localStorage.setItem('libraryData', JSON.stringify(currentLib));

        document.getElementById('add-resource-form').reset();
        renderLibraryAdmin();
        alert("Đã thêm tài liệu mới thành công!");
    }

    const addForm = document.getElementById('add-resource-form');
    if (addForm) addForm.addEventListener('submit', addNewResource);


    // 4. Chat Logs (Mock)
    function renderChatLogs() {
        const list = document.getElementById('chat-logs-list');
        if (!list) return;

        // In a real app, chatbot.js would push logs to an array in LS.
        // For now, we simulate finding the 'violenceTestScore' activity.
        const score = localStorage.getItem('violenceTestScore');
        if (score) {
            list.innerHTML = `
                <div class="log-item">
                    <strong>Hệ thống:</strong> Đã ghi nhận kết quả bài test gần nhất (${score} điểm). <br>
                    <span class="text-muted">Thời gian: Vừa xong</span>
                </div>
            `;
        } else {
            list.innerHTML = '<p class="text-muted">Chưa có dữ liệu nhật ký trò chuyện.</p>';
        }
    }

    // Init
    renderOverview();
    renderStudents();
    renderLibraryAdmin();
    renderChatLogs();
});
