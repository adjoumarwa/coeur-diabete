// ============================================
// التحقق من صلاحيات المدير
// ============================================
const currentUser = localStorage.getItem('currentUser');
if (!currentUser) {
    window.location.href = '../Signup/login.html';
}

const user = JSON.parse(currentUser);
if (user.type !== 'admin') {
    window.location.href = '../dashboard/dashboard.html';
}

document.getElementById('adminName').textContent = user.name;

// ============================================
// تسجيل الخروج
// ============================================
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = '../index.html';
});

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
    document.getElementById('totalUsers').textContent = users.length;
    
    let totalAppointments = 0;
    users.forEach(user => {
        const appointments = JSON.parse(localStorage.getItem(`appointments_${user.email}`) || '[]');
        totalAppointments += appointments.length;
    });
    document.getElementById('totalAppointments').textContent = totalAppointments;
    
    let totalDownloads = 0;
    users.forEach(user => {
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
    
    if (searchTerm) {
        users = users.filter(u => 
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
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
                <div style="width: 35px; height: 35px; border-radius: 50%; background: linear-gradient(135deg, #dc2626, #2563eb); display: inline-flex; align-items: center; justify-content: center; color: white; font-weight: bold;">${firstLetter}</div>
                <div style="margin-top: 5px;">${user.name}</div>
            </td>
            <td>${user.email}</td>
            <td>${regDate}</td>
            <td>${loginCount}</td>
            <td><button class="delete-btn" onclick="deleteUser('${user.email}')">حذف</button></td>
        `;
    });
}

// ============================================
// حذف مستخدم
// ============================================
function deleteUser(email) {
    if (confirm(`⚠️ هل أنت متأكد من حذف المستخدم "${email}"؟\nسيتم حذف جميع بياناته بشكل نهائي.`)) {
        let users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        users = users.filter(u => u.email !== email);
        localStorage.setItem('registeredUsers', JSON.stringify(users));
        
        localStorage.removeItem(`userData_${email}`);
        localStorage.removeItem(`appointments_${email}`);
        localStorage.removeItem(`testResults_${email}`);
        localStorage.removeItem(`loginCount_${email}`);
        localStorage.removeItem(`lastLogin_${email}`);
        localStorage.removeItem(`memberSince_${email}`);
        
        updateStats();
        renderUsersTable();
        alert(`✅ تم حذف المستخدم بنجاح`);
    }
}

// ============================================
// البحث
// ============================================
document.getElementById('searchInput')?.addEventListener('input', function(e) {
    searchTerm = e.target.value;
    renderUsersTable();
});
// أضف هذا الكود في admin.js
document.getElementById('manageAppointmentsBtn')?.addEventListener('click', () => {
    window.location.href = 'appointments.html';
});
// ============================================
// تهيئة الصفحة
// ============================================
updateStats();
renderUsersTable();

window.deleteUser = deleteUser;
