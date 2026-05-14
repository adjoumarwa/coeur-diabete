// ============================================
// التحقق من صلاحيات المدير
// ============================================
const currentUser = localStorage.getItem('currentUser');
if (!currentUser) {
    window.location.href = '../signup/login.html';
}

const user = JSON.parse(currentUser);
if (user.type !== 'admin') {
    window.location.href = '../dashboard/dashboard.html';
}

document.getElementById('adminName').textContent = user.name;

// ============================================
// دوال مساعدة
// ============================================
function showCustomAlert(message, title = 'تنبيه') {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        backdrop-filter: blur(5px);
        z-index: 20000;
        display: flex;
        justify-content: center;
        align-items: center;
    `;
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white;
        border-radius: 20px;
        padding: 2rem;
        max-width: 400px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        border-top: 5px solid #dc2626;
    `;
    
    modal.innerHTML = `
        <h3 style="color: #1a472a; margin-bottom: 1rem;">${title}</h3>
        <p style="margin: 1rem 0; line-height: 1.6; white-space: pre-line;">${message}</p>
        <button id="alertCloseBtn" style="background: linear-gradient(135deg, #dc2626, #2563eb); color: white; border: none; padding: 10px 30px; border-radius: 10px; cursor: pointer;">موافق</button>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    document.getElementById('alertCloseBtn').onclick = () => overlay.remove();
}

// ============================================
// جلب جميع المستخدمين
// ============================================
function getAllUsers() {
    const defaultUsers = [
        { name: "أحمد", email: "user@example.com", password: "12345678", type: "user", registeredAt: "2025-01-15T10:00:00.000Z" },
        { name: "محمد", email: "test@test.com", password: "12345678", type: "user", registeredAt: "2025-02-20T10:00:00.000Z" }
    ];
    
    const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const allUsers = [...defaultUsers];
    
    storedUsers.forEach(storedUser => {
        if (!allUsers.find(u => u.email === storedUser.email)) {
            allUsers.push(storedUser);
        }
    });
    
    return allUsers;
}

// ============================================
// تحديث الإحصائيات
// ============================================
function updateStats() {
    const users = getAllUsers();
    const regularUsers = users.filter(u => u.type !== 'admin');
    
    // إجمالي المستخدمين
    document.getElementById('totalUsers').textContent = regularUsers.length;
    
    // المستخدمين الجدد هذا الشهر
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const newUsers = regularUsers.filter(u => {
        const regDate = new Date(u.registeredAt);
        return regDate.getMonth() === currentMonth && regDate.getFullYear() === currentYear;
    });
    document.getElementById('newUsersThisMonth').textContent = newUsers.length;
    
    // إجمالي المواعيد
    let totalAppointments = 0;
    regularUsers.forEach(user => {
        const appointments = JSON.parse(localStorage.getItem(`appointments_${user.email}`) || '[]');
        totalAppointments += appointments.length;
    });
    document.getElementById('totalAppointments').textContent = totalAppointments;
    
    // إجمالي التحميلات
    let totalDownloads = 0;
    regularUsers.forEach(user => {
        const downloads = parseInt(localStorage.getItem(`downloads_${user.email}`) || '0');
        totalDownloads += downloads;
    });
    document.getElementById('totalDownloads').textContent = totalDownloads;
}

// ============================================
// عرض جدول المستخدمين
// ============================================
let searchTerm = '';

function renderUsersTable() {
    let users = getAllUsers();
    const regularUsers = users.filter(u => u.type !== 'admin');
    
    if (searchTerm) {
        const filtered = regularUsers.filter(u => 
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        users = filtered;
    } else {
        users = regularUsers;
    }
    
    const tbody = document.getElementById('usersTableBody');
    
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">📭 لا يوجد مستخدمين</td></tr>';
        return;
    }
    
    tbody.innerHTML = '';
    users.forEach((user, index) => {
        const loginCount = parseInt(localStorage.getItem(`loginCount_${user.email}`) || '0');
        const regDate = new Date(user.registeredAt).toLocaleDateString('ar');
        const firstLetter = user.name.charAt(0);
        
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>
                <div class="user-avatar">${firstLetter}</div>
                <div style="margin-top: 5px;">${user.name}</div>
            </td>
            <td>${user.email}</td>
            <td>${regDate}</td>
            <td>${loginCount}</td>
            <td><button class="delete-btn" onclick="deleteUser('${user.email}')">🗑️ حذف</button></td>
        `;
    });
}

// ============================================
// حذف مستخدم
// ============================================
function deleteUser(email) {
    const confirmOverlay = document.createElement('div');
    confirmOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        backdrop-filter: blur(5px);
        z-index: 20001;
        display: flex;
        justify-content: center;
        align-items: center;
    `;
    
    const confirmModal = document.createElement('div');
    confirmModal.style.cssText = `
        background: white;
        border-radius: 20px;
        padding: 2rem;
        max-width: 400px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        border-top: 5px solid #dc2626;
    `;
    
    confirmModal.innerHTML = `
        <h3 style="color: #1a472a; margin-bottom: 1rem;">⚠️ تأكيد الحذف</h3>
        <p style="margin-bottom: 1.5rem;">هل أنت متأكد من حذف المستخدم "${email}"؟<br>سيتم حذف جميع بياناته بشكل نهائي.</p>
        <div style="display: flex; gap: 1rem; justify-content: center;">
            <button id="confirmDeleteBtn" style="background: #dc2626; color: white; border: none; padding: 10px 25px; border-radius: 10px; cursor: pointer;">نعم، احذف</button>
            <button id="cancelDeleteBtn" style="background: #64748b; color: white; border: none; padding: 10px 25px; border-radius: 10px; cursor: pointer;">إلغاء</button>
        </div>
    `;
    
    confirmOverlay.appendChild(confirmModal);
    document.body.appendChild(confirmOverlay);
    
    document.getElementById('confirmDeleteBtn').onclick = () => {
        let users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        users = users.filter(u => u.email !== email);
        localStorage.setItem('registeredUsers', JSON.stringify(users));
        
        localStorage.removeItem(`userData_${email}`);
        localStorage.removeItem(`appointments_${email}`);
        localStorage.removeItem(`testResults_${email}`);
        localStorage.removeItem(`loginCount_${email}`);
        localStorage.removeItem(`lastLogin_${email}`);
        localStorage.removeItem(`memberSince_${email}`);
        
        addActivity(email, 'delete', `تم حذف المستخدم ${email}`);
        
        updateStats();
        renderUsersTable();
        renderActivityLog();
        
        confirmOverlay.remove();
        showCustomAlert('✅ تم حذف المستخدم بنجاح', 'تم الحذف');
    };
    
    document.getElementById('cancelDeleteBtn').onclick = () => confirmOverlay.remove();
}

// ============================================
// سجل النشاطات
// ============================================
function addActivity(userEmail, type, description) {
    let activities = JSON.parse(localStorage.getItem('adminActivities') || '[]');
    
    activities.unshift({
        userEmail: userEmail,
        type: type,
        description: description,
        time: new Date().toISOString()
    });
    
    if (activities.length > 100) {
        activities = activities.slice(0, 100);
    }
    
    localStorage.setItem('adminActivities', JSON.stringify(activities));
}

function renderActivityLog() {
    const activities = JSON.parse(localStorage.getItem('adminActivities') || '[]');
    const container = document.getElementById('activityList');
    
    if (activities.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #94a3b8;">📭 لا توجد نشاطات مسجلة</p>';
        return;
    }
    
    container.innerHTML = '';
    activities.forEach(activity => {
        const time = new Date(activity.time).toLocaleString('ar');
        let iconClass = '';
        let icon = '';
        
        switch(activity.type) {
            case 'login':
                iconClass = 'login';
                icon = 'fa-sign-in-alt';
                break;
            case 'register':
                iconClass = 'register';
                icon = 'fa-user-plus';
                break;
            case 'delete':
                iconClass = 'delete';
                icon = 'fa-trash';
                break;
            case 'edit':
                iconClass = 'edit';
                icon = 'fa-edit';
                break;
            default:
                iconClass = 'login';
                icon = 'fa-info-circle';
        }
        
        const item = document.createElement('div');
        item.className = 'activity-item';
        item.innerHTML = `
            <div class="activity-icon ${iconClass}">
                <i class="fas ${icon}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-user">${activity.userEmail}</div>
                <div class="activity-action">${activity.description}</div>
                <div class="activity-time">${time}</div>
            </div>
        `;
        container.appendChild(item);
    });
}

// ============================================
// تصدير البيانات
// ============================================
function exportData() {
    const users = getAllUsers();
    const regularUsers = users.filter(u => u.type !== 'admin');
    
    let exportData = [];
    
    regularUsers.forEach(user => {
        const userData = JSON.parse(localStorage.getItem(`userData_${user.email}`) || '{}');
        const appointments = JSON.parse(localStorage.getItem(`appointments_${user.email}`) || '[]');
        const testResults = JSON.parse(localStorage.getItem(`testResults_${user.email}`) || '[]');
        const loginCount = parseInt(localStorage.getItem(`loginCount_${user.email}`) || '0');
        
        exportData.push({
            name: user.name,
            email: user.email,
            registeredAt: user.registeredAt,
            loginCount: loginCount,
            lastLogin: localStorage.getItem(`lastLogin_${user.email}`) || '',
            healthData: userData,
            appointments: appointments,
            testResults: testResults
        });
    });
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coeur-diabete-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    addActivity('admin@coeur-diabete.com', 'export', 'تم تصدير جميع بيانات المستخدمين');
    showCustomAlert('✅ تم تصدير البيانات بنجاح', 'تم التصدير');
}

// ============================================
// مسح جميع البيانات
// ============================================
function clearAllData() {
    const confirmOverlay = document.createElement('div');
    confirmOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        backdrop-filter: blur(5px);
        z-index: 20001;
        display: flex;
        justify-content: center;
        align-items: center;
    `;
    
    const confirmModal = document.createElement('div');
    confirmModal.style.cssText = `
        background: white;
        border-radius: 20px;
        padding: 2rem;
        max-width: 450px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        border-top: 5px solid #dc2626;
    `;
    
    confirmModal.innerHTML = `
        <h3 style="color: #1a472a; margin-bottom: 1rem;">⚠️ تحذير خطير!</h3>
        <p style="margin-bottom: 1rem;">هذا الإجراء سيحذف جميع بيانات المستخدمين نهائياً.<br>لا يمكن التراجع عن هذا الإجراء.</p>
        <p style="margin-bottom: 1.5rem; color: #dc2626;">للتأكيد، اكتب "مسح" في المربع أدناه:</p>
        <input type="text" id="confirmationInput" placeholder="اكتب مسح" style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 10px; margin-bottom: 1rem;">
        <div style="display: flex; gap: 1rem; justify-content: center;">
            <button id="confirmClearBtn" style="background: #dc2626; color: white; border: none; padding: 10px 25px; border-radius: 10px; cursor: pointer;">تأكيد المسح</button>
            <button id="cancelClearBtn" style="background: #64748b; color: white; border: none; padding: 10px 25px; border-radius: 10px; cursor: pointer;">إلغاء</button>
        </div>
    `;
    
    confirmOverlay.appendChild(confirmModal);
    document.body.appendChild(confirmOverlay);
    
    document.getElementById('confirmClearBtn').onclick = () => {
        const confirmation = document.getElementById('confirmationInput').value;
        if (confirmation === 'مسح') {
            const users = getAllUsers();
            const regularUsers = users.filter(u => u.type !== 'admin');
            
            regularUsers.forEach(user => {
                localStorage.removeItem(`userData_${user.email}`);
                localStorage.removeItem(`appointments_${user.email}`);
                localStorage.removeItem(`testResults_${user.email}`);
                localStorage.removeItem(`loginCount_${user.email}`);
                localStorage.removeItem(`lastLogin_${user.email}`);
                localStorage.removeItem(`memberSince_${user.email}`);
            });
            
            localStorage.removeItem('registeredUsers');
            localStorage.removeItem('adminActivities');
            
            addActivity('admin@coeur-diabete.com', 'delete', 'تم مسح جميع بيانات المستخدمين');
            
            updateStats();
            renderUsersTable();
            renderActivityLog();
            
            confirmOverlay.remove();
            showCustomAlert('✅ تم مسح جميع البيانات بنجاح', 'تم المسح');
        } else {
            showCustomAlert('❌ لم يتم التأكيد بشكل صحيح', 'خطأ');
        }
    };
    
    document.getElementById('cancelClearBtn').onclick = () => confirmOverlay.remove();
}

// ============================================
// نسخ احتياطي
// ============================================
function backupData() {
    const allData = {};
    
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        allData[key] = localStorage.getItem(key);
    }
    
    const dataStr = JSON.stringify(allData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coeur-diabete-full-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    addActivity('admin@coeur-diabete.com', 'export', 'تم إنشاء نسخة احتياطية كاملة');
    showCustomAlert('✅ تم إنشاء النسخة الاحتياطية بنجاح', 'تم النسخ');
}

// ============================================
// تسجيل الخروج
// ============================================
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = '../index.html';
}

// ============================================
// ربط الأحداث
// ============================================
document.getElementById('logoutBtn').addEventListener('click', logout);
document.getElementById('exportDataBtn').addEventListener('click', exportData);
document.getElementById('clearAllDataBtn').addEventListener('click', clearAllData);
document.getElementById('backupDataBtn').addEventListener('click', backupData);
document.getElementById('manageAppointmentsBtn').addEventListener('click', () => {
    window.location.href = 'appointments.html';
});

document.getElementById('searchInput').addEventListener('input', (e) => {
    searchTerm = e.target.value;
    renderUsersTable();
});

// ============================================
// تهيئة الصفحة
// ============================================
updateStats();
renderUsersTable();
renderActivityLog();
addActivity('admin@coeur-diabete.com', 'login', `تسجيل دخول المدير من ${new Date().toLocaleString('ar')}`);

// جعل الدوال عامة للاستخدام في HTML
window.deleteUser = deleteUser;
// ============================================
// ABbeats - Administration Panel
// ============================================

// ============================================
// DONNÉES DE TEST
// ============================================

// Utilisateurs fictifs
const demoUsers = [
    { id: 1, name: "Ahmed Benali", email: "ahmed@example.com", role: "user", registeredAt: "2025-01-15", loginCount: 24, lastActivity: "2025-05-13", status: "active" },
    { id: 2, name: "Fatima Zohra", email: "fatima@example.com", role: "user", registeredAt: "2025-02-20", loginCount: 18, lastActivity: "2025-05-12", status: "active" },
    { id: 3, name: "Mohamed Lamine", email: "mohamed@example.com", role: "user", registeredAt: "2025-03-10", loginCount: 31, lastActivity: "2025-05-14", status: "active" },
    { id: 4, name: "Nadia Cherif", email: "nadia@example.com", role: "user", registeredAt: "2025-03-25", loginCount: 12, lastActivity: "2025-05-10", status: "inactive" },
    { id: 5, name: "Admin System", email: "admin@abbeats.com", role: "admin", registeredAt: "2025-01-01", loginCount: 89, lastActivity: "2025-05-14", status: "active" }
];

// Rendez-vous fictifs
const demoAppointments = [
    { id: 1, userName: "Ahmed Benali", date: "2025-05-20", type: "ECG cardiaque", status: "confirmé" },
    { id: 2, userName: "Fatima Zohra", date: "2025-05-22", type: "Consultation cardiologue", status: "en attente" },
    { id: 3, userName: "Mohamed Lamine", date: "2025-05-25", type: "Bilan sanguin", status: "confirmé" },
    { id: 4, userName: "Nadia Cherif", date: "2025-05-28", type: "Contrôle diabète", status: "en attente" }
];

// Activités fictives
const demoActivities = [
    { user: "Ahmed Benali", action: "Connexion", time: "2025-05-14 09:30", type: "login" },
    { user: "Mohamed Lamine", action: "Test de risque effectué", time: "2025-05-14 10:15", type: "test" },
    { user: "Fatima Zohra", action: "Téléchargement de guide", time: "2025-05-13 14:45", type: "download" },
    { user: "Admin System", action: "Connexion admin", time: "2025-05-14 08:00", type: "login" },
    { user: "Nadia Cherif", action: "Rendez-vous ajouté", time: "2025-05-12 11:20", type: "appointment" }
];

// Statistiques d'activité (pour le graphique)
const activityData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    values: [12, 19, 15, 22, 28, 18, 14]
};

// ============================================
// VARIABLES GLOBALES
// ============================================
let currentUser = null;
let currentPage = 1;
let itemsPerPage = 5;
let currentFilter = 'all';
let currentSearch = '';
let users = [...demoUsers];
let appointments = [...demoAppointments];
let activities = [...demoActivities];
let chart = null;

// ============================================
// INITIALISATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Vérifier l'utilisateur connecté
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        document.getElementById('adminName').textContent = currentUser.name || currentUser.email || 'Admin';
    } else {
        document.getElementById('adminName').textContent = 'Administrateur';
    }
    
    // Initialiser toutes les sections
    updateStats();
    renderUsersTable();
    renderAppointmentsTable();
    renderActivityLog();
    initChart();
    updateSystemInfo();
    
    // Initialiser les événements
    initEvents();
});

// ============================================
// STATISTIQUES
// ============================================
function updateStats() {
    const activeUsers = users.filter(u => u.status === 'active').length;
    const newUsersThisMonth = users.filter(u => u.registeredAt >= '2025-05-01').length;
    const totalAppointments = appointments.length;
    const totalDownloads = 124; // Valeur exemple
    
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('newUsersThisMonth').textContent = newUsersThisMonth;
    document.getElementById('totalAppointments').textContent = totalAppointments;
    document.getElementById('totalDownloads').textContent = totalDownloads;
    document.getElementById('activeUsers').textContent = activeUsers;
    document.getElementById('totalTests').textContent = 87; // Valeur exemple
}

// ============================================
// GRAPHIQUE D'ACTIVITÉ
// ============================================
function initChart() {
    const canvas = document.getElementById('activityChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Détruire l'ancien graphique s'il existe
    if (chart) {
        chart.destroy();
    }
    
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: activityData.labels,
            datasets: [{
                label: 'Activités quotidiennes',
                data: activityData.values,
                borderColor: '#e74c3c',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#e74c3c',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { font: { family: 'Poppins', size: 12 } }
                },
                tooltip: { backgroundColor: '#1e293b', titleColor: '#fff', bodyColor: '#94a3b8' }
            },
            scales: {
                y: { beginAtZero: true, grid: { color: '#e2e8f0' }, title: { display: true, text: 'Nombre d\'activités' } },
                x: { grid: { display: false }, title: { display: true, text: 'Jours de la semaine' } }
            }
        }
    });
}

// ============================================
// TABLEAU DES UTILISATEURS
// ============================================
function renderUsersTable() {
    // Filtrer les utilisateurs
    let filteredUsers = users.filter(user => {
        const matchSearch = currentSearch === '' || 
            user.name.toLowerCase().includes(currentSearch.toLowerCase()) || 
            user.email.toLowerCase().includes(currentSearch.toLowerCase());
        const matchFilter = currentFilter === 'all' || user.role === currentFilter;
        return matchSearch && matchFilter;
    });
    
    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = filteredUsers.slice(start, start + itemsPerPage);
    
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    
    if (paginatedUsers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center;">Aucun utilisateur trouvé</td></tr>';
        document.getElementById('pagination').innerHTML = '';
        return;
    }
    
    tbody.innerHTML = '';
    paginatedUsers.forEach((user, index) => {
        const row = tbody.insertRow();
        const firstLetter = user.name.charAt(0);
        const statusClass = user.status === 'active' ? 'status-active' : 'status-inactive';
        const statusText = user.status === 'active' ? 'Actif' : 'Inactif';
        
        row.innerHTML = `
            <td class="checkbox-cell"><input type="checkbox" class="user-checkbox" data-id="${user.id}"></td>
            <td>${start + index + 1}</td>
            <td><div class="user-avatar">${firstLetter}</div><div style="margin-top: 5px; font-weight: 500;">${user.name}</div></td>
            <td>${user.email}</td>
            <td>${user.registeredAt}</td>
            <td>${user.loginCount}</td>
            <td>${user.lastActivity}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td class="action-buttons">
                <button class="action-btn edit-btn" onclick="editUser(${user.id})" title="Modifier"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete-btn" onclick="deleteUser(${user.id})" title="Supprimer"><i class="fas fa-trash"></i></button>
            </td>
        `;
    });
    
    // Mettre à jour la pagination
    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    const paginationDiv = document.getElementById('pagination');
    if (!paginationDiv) return;
    
    if (totalPages <= 1) {
        paginationDiv.innerHTML = '';
        return;
    }
    
    let html = '';
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }
    paginationDiv.innerHTML = html;
}

function goToPage(page) {
    currentPage = page;
    renderUsersTable();
}

// ============================================
// TABLEAU DES RENDEZ-VOUS
// ============================================
function renderAppointmentsTable() {
    const tbody = document.getElementById('appointmentsTableBody');
    if (!tbody) return;
    
    if (appointments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Aucun rendez-vous enregistré</td></tr>';
        return;
    }
    
    tbody.innerHTML = '';
    appointments.forEach((app, index) => {
        const row = tbody.insertRow();
        let statusClass = '';
        if (app.status === 'confirmé') statusClass = 'status-active';
        else if (app.status === 'en attente') statusClass = 'status-pending';
        else statusClass = 'status-inactive';
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${app.userName}</td>
            <td>${app.date}</td>
            <td>${app.type}</td>
            <td><span class="status-badge ${statusClass}">${app.status}</span></td>
        `;
    });
}

// ============================================
// ACTIVITÉS
// ============================================
function renderActivityLog() {
    const container = document.getElementById('activityList');
    if (!container) return;
    
    if (activities.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #94a3b8;">Aucune activité enregistrée</p>';
        return;
    }
    
    container.innerHTML = '';
    activities.forEach(activity => {
        let iconClass = '';
        let icon = '';
        
        if (activity.type === 'login') { iconClass = 'login'; icon = 'fa-sign-in-alt'; }
        else if (activity.type === 'test') { iconClass = 'register'; icon = 'fa-chart-line'; }
        else if (activity.type === 'download') { iconClass = 'edit'; icon = 'fa-download'; }
        else { iconClass = 'edit'; icon = 'fa-calendar-alt'; }
        
        const item = document.createElement('div');
        item.className = 'activity-item';
        item.innerHTML = `
            <div class="activity-icon ${iconClass}"><i class="fas ${icon}"></i></div>
            <div class="activity-content">
                <div class="activity-user">${activity.user}</div>
                <div class="activity-action">${activity.action}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        `;
        container.appendChild(item);
    });
}

// ============================================
// INFORMATIONS SYSTÈME
// ============================================
function updateSystemInfo() {
    const lastBackup = localStorage.getItem('lastBackup') || 'Jamais';
    document.getElementById('lastBackup').textContent = lastBackup;
}

// ============================================
// GESTION DES UTILISATEURS
// ============================================
function editUser(id) {
    const user = users.find(u => u.id === id);
    if (!user) return;
    
    document.getElementById('modalTitle').textContent = 'Modifier l\'utilisateur';
    document.getElementById('editUserName').value = user.name;
    document.getElementById('editUserEmail').value = user.email;
    document.getElementById('editUserRole').value = user.role;
    
    const modal = document.getElementById('userModal');
    if (modal) modal.style.display = 'flex';
    
    window.currentEditId = id;
}

function saveUser() {
    const id = window.currentEditId;
    const user = users.find(u => u.id === id);
    if (user) {
        user.name = document.getElementById('editUserName').value;
        user.role = document.getElementById('editUserRole').value;
        
        // Ajouter l'activité
        activities.unshift({
            user: user.name,
            action: `Utilisateur modifié (${user.email})`,
            time: new Date().toLocaleString(),
            type: 'edit'
        });
        
        renderUsersTable();
        renderActivityLog();
        showAlert('✅ Utilisateur modifié avec succès', 'success');
    }
    closeUserModal();
}

function deleteUser(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
        const user = users.find(u => u.id === id);
        users = users.filter(u => u.id !== id);
        
        // Ajouter l'activité
        activities.unshift({
            user: user?.name || 'Inconnu',
            action: `Utilisateur supprimé (${user?.email})`,
            time: new Date().toLocaleString(),
            type: 'delete'
        });
        
        updateStats();
        renderUsersTable();
        renderActivityLog();
        showAlert('✅ Utilisateur supprimé avec succès', 'success');
    }
}

function closeUserModal() {
    const modal = document.getElementById('userModal');
    if (modal) modal.style.display = 'none';
}

// ============================================
// EXPORT / IMPORT / STATS
// ============================================
function exportData() {
    const data = { users, appointments, activities, exportDate: new Date().toISOString() };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `abbeats_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showAlert('✅ Données exportées avec succès', 'success');
}

function showStatsReport() {
    document.getElementById('statTotalUsers').textContent = users.length;
    document.getElementById('statNewUsers').textContent = users.filter(u => u.registeredAt >= '2025-05-01').length;
    document.getElementById('statTotalTests').textContent = '87';
    document.getElementById('statTotalDownloads').textContent = '124';
    document.getElementById('statTotalAppointments').textContent = appointments.length;
    document.getElementById('statActiveUsers').textContent = users.filter(u => u.status === 'active').length;
    
    const modal = document.getElementById('statsModal');
    if (modal) modal.style.display = 'flex';
}

function backupData() {
    exportData();
    localStorage.setItem('lastBackup', new Date().toLocaleString());
    updateSystemInfo();
    showAlert('💾 Sauvegarde effectuée avec succès', 'success');
}

function clearAllData() {
    if (confirm('⚠️ ATTENTION : Cette action supprimera TOUTES les données. Êtes-vous sûr ?')) {
        if (confirm('Dernière confirmation : Taper "SUPPRIMER" pour valider')) {
            users = [...demoUsers];
            appointments = [...demoAppointments];
            activities = [...demoActivities];
            updateStats();
            renderUsersTable();
            renderAppointmentsTable();
            renderActivityLog();
            showAlert('🗑️ Toutes les données ont été effacées', 'warning');
        }
    }
}

// ============================================
// ALERTES
// ============================================
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : (type === 'warning' ? '#f59e0b' : '#3b82f6')};
        color: white;
        padding: 12px 20px;
        border-radius: 10px;
        z-index: 10001;
        animation: slideIn 0.3s ease;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;
    alertDiv.innerHTML = message;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
}

// ============================================
// ÉVÉNEMENTS
// ============================================
function initEvents() {
    // Logout
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = '../signUp/login.html';
    });
    
    // Boutons admin
    document.getElementById('manageAppointmentsBtn')?.addEventListener('click', () => {
        document.getElementById('appointmentsTableBody')?.scrollIntoView({ behavior: 'smooth' });
    });
    
    document.getElementById('manageUsersBtn')?.addEventListener('click', () => {
        document.getElementById('usersTableBody')?.scrollIntoView({ behavior: 'smooth' });
    });
    
    document.getElementById('exportDataBtn')?.addEventListener('click', exportData);
    document.getElementById('statsReportBtn')?.addEventListener('click', showStatsReport);
    document.getElementById('backupDataBtn')?.addEventListener('click', backupData);
    document.getElementById('clearAllDataBtn')?.addEventListener('click', clearAllData);
    
    // Sauvegarde utilisateur
    document.getElementById('saveUserBtn')?.addEventListener('click', saveUser);
    document.getElementById('closeUserModal')?.addEventListener('click', closeUserModal);
    document.getElementById('cancelUserBtn')?.addEventListener('click', closeUserModal);
    document.getElementById('closeStatsModal')?.addEventListener('click', () => {
        document.getElementById('statsModal').style.display = 'none';
    });
    
    // Recherche et filtres
    document.getElementById('searchInput')?.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        currentPage = 1;
        renderUsersTable();
    });
    
    document.getElementById('filterType')?.addEventListener('change', (e) => {
        currentFilter = e.target.value;
        currentPage = 1;
        renderUsersTable();
    });
    
    // Rafraîchir
    document.getElementById('refreshUsersBtn')?.addEventListener('click', () => {
        renderUsersTable();
        showAlert('🔄 Liste actualisée', 'info');
    });
    
    document.getElementById('refreshAppointmentsBtn')?.addEventListener('click', () => {
        renderAppointmentsTable();
        showAlert('🔄 Rendez-vous actualisés', 'info');
    });
    
    document.getElementById('clearLogBtn')?.addEventListener('click', () => {
        if (confirm('Effacer tout le journal d\'activités ?')) {
            activities = [];
            renderActivityLog();
            showAlert('✅ Journal effacé', 'success');
        }
    });
    
    // Fermer les modals en cliquant à l'extérieur
    window.onclick = (event) => {
        const userModal = document.getElementById('userModal');
        const statsModal = document.getElementById('statsModal');
        if (event.target === userModal) closeUserModal();
        if (event.target === statsModal) statsModal.style.display = 'none';
    };
}

// ============================================
// STYLES D'ANIMATION
// ============================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Rendre les fonctions globales
window.editUser = editUser;
window.deleteUser = deleteUser;
window.goToPage = goToPage;



function changeLanguage(lang) {
    localStorage.setItem('language', lang);
    window.location.reload();
}
