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
