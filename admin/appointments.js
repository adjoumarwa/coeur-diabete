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

// ============================================
// المتغيرات العامة
// ============================================
let allAppointments = [];
let currentEditIndex = null;

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
        <p style="margin: 1rem 0; line-height: 1.6;">${message}</p>
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
        { name: "أحمد", email: "user@example.com", password: "12345678", type: "user" },
        { name: "محمد", email: "test@test.com", password: "12345678", type: "user" }
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
// جلب جميع المواعيد من جميع المستخدمين
// ============================================
function getAllAppointments() {
    const users = getAllUsers();
    const appointments = [];
    
    users.forEach(user => {
        const userAppointments = JSON.parse(localStorage.getItem(`appointments_${user.email}`) || '[]');
        userAppointments.forEach((app, index) => {
            appointments.push({
                id: `${user.email}_${index}`,
                userEmail: user.email,
                userName: user.name,
                date: app.date,
                title: app.title,
                status: app.status || 'قادم'
            });
        });
    });
    
    // ترتيب حسب التاريخ (الأحدث أولاً)
    appointments.sort((a, b) => new Date(b.date) - new Date(a.date));
    return appointments;
}

// ============================================
// حفظ المواعيد
// ============================================
function saveAppointmentsToUser(userEmail, appointments) {
    const appointmentsWithoutId = appointments.map(({ id, ...rest }) => rest);
    localStorage.setItem(`appointments_${userEmail}`, JSON.stringify(appointmentsWithoutId));
}

// ============================================
// تحديث الإحصائيات
// ============================================
function updateStats() {
    const appointments = getAllAppointments();
    const users = getAllUsers();
    
    document.getElementById('totalAppointments').textContent = appointments.length;
    document.getElementById('totalUsers').textContent = users.length;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthAppointments = appointments.filter(app => {
        const appDate = new Date(app.date);
        return appDate.getMonth() === currentMonth && appDate.getFullYear() === currentYear;
    });
    document.getElementById('appointmentsThisMonth').textContent = thisMonthAppointments.length;
}

// ============================================
// عرض جدول المواعيد
// ============================================
let currentSearchTerm = '';
let currentFilter = 'all';

function renderAppointmentsTable() {
    let appointments = getAllAppointments();
    
    // تطبيق البحث
    if (currentSearchTerm) {
        const searchLower = currentSearchTerm.toLowerCase();
        appointments = appointments.filter(app => 
            app.userName.toLowerCase().includes(searchLower) ||
            app.userEmail.toLowerCase().includes(searchLower) ||
            app.title.toLowerCase().includes(searchLower)
        );
    }
    
    // تطبيق الفلتر
    if (currentFilter !== 'all') {
        appointments = appointments.filter(app => app.title === currentFilter);
    }
    
    const tbody = document.getElementById('appointmentsTableBody');
    
    if (appointments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">📭 لا توجد مواعيد مسجلة</td></tr>';
        return;
    }
    
    tbody.innerHTML = '';
    appointments.forEach((app, index) => {
        const row = tbody.insertRow();
        
        let statusClass = '';
        if (app.status === 'قادم') statusClass = 'status-upcoming';
        else if (app.status === 'مكتمل') statusClass = 'status-completed';
        else statusClass = 'status-cancelled';
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${app.userName}</td>
            <td>${app.userEmail}</td>
            <td>${app.date}</td>
            <td>${app.title}</td>
            <td><span class="status-badge ${statusClass}">${app.status || 'قادم'}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editAppointment('${app.id}')">تعديل</button>
                    <button class="delete-btn" onclick="deleteAppointment('${app.id}')">حذف</button>
                </div>
             </td>
        `;
    });
}

// ============================================
// إضافة/تعديل موعد
// ============================================
let isEditing = false;
let editingId = null;

function openAddModal() {
    isEditing = false;
    editingId = null;
    document.getElementById('modalTitle').textContent = 'إضافة موعد جديد';
    
    // تعبئة قائمة المستخدمين
    const users = getAllUsers();
    const userSelect = document.getElementById('modalUserEmail');
    userSelect.innerHTML = '<option value="">اختر المستخدم</option>';
    users.forEach(user => {
        userSelect.innerHTML += `<option value="${user.email}">${user.name} (${user.email})</option>`;
    });
    
    document.getElementById('modalDate').value = '';
    document.getElementById('modalType').value = 'فحص قلب ECG';
    document.getElementById('modalStatus').value = 'قادم';
    document.getElementById('appointmentModal').style.display = 'flex';
}

function editAppointment(id) {
    isEditing = true;
    editingId = id;
    document.getElementById('modalTitle').textContent = 'تعديل الموعد';
    
    const appointments = getAllAppointments();
    const appointment = appointments.find(app => app.id === id);
    
    if (appointment) {
        // تعبئة قائمة المستخدمين
        const users = getAllUsers();
        const userSelect = document.getElementById('modalUserEmail');
        userSelect.innerHTML = '<option value="">اختر المستخدم</option>';
        users.forEach(user => {
            userSelect.innerHTML += `<option value="${user.email}" ${user.email === appointment.userEmail ? 'selected' : ''}>${user.name} (${user.email})</option>`;
        });
        
        document.getElementById('modalDate').value = appointment.date;
        document.getElementById('modalType').value = appointment.title;
        document.getElementById('modalStatus').value = appointment.status || 'قادم';
        document.getElementById('appointmentModal').style.display = 'flex';
    }
}

function saveAppointment() {
    const userEmail = document.getElementById('modalUserEmail').value;
    const date = document.getElementById('modalDate').value;
    const title = document.getElementById('modalType').value;
    const status = document.getElementById('modalStatus').value;
    
    if (!userEmail) {
        showCustomAlert('❌ الرجاء اختيار المستخدم', 'خطأ');
        return;
    }
    
    if (!date) {
        showCustomAlert('❌ الرجاء اختيار التاريخ', 'خطأ');
        return;
    }
    
    // جلب المواعيد الحالية للمستخدم
    const userAppointments = JSON.parse(localStorage.getItem(`appointments_${userEmail}`) || '[]');
    
    if (isEditing && editingId) {
        // تعديل موعد موجود
        const [email, index] = editingId.split('_');
        if (userAppointments[parseInt(index)]) {
            userAppointments[parseInt(index)] = { date, title, status };
            saveAppointmentsToUser(userEmail, userAppointments);
            showCustomAlert('✅ تم تعديل الموعد بنجاح', 'تم التعديل');
        }
    } else {
        // إضافة موعد جديد
        userAppointments.push({ date, title, status });
        saveAppointmentsToUser(userEmail, userAppointments);
        showCustomAlert('✅ تم إضافة الموعد بنجاح', 'تم الحفظ');
    }
    
    closeModal();
    updateStats();
    renderAppointmentsTable();
}

function deleteAppointment(id) {
    if (confirm('⚠️ هل أنت متأكد من حذف هذا الموعد؟')) {
        const [userEmail, index] = id.split('_');
        const userAppointments = JSON.parse(localStorage.getItem(`appointments_${userEmail}`) || '[]');
        userAppointments.splice(parseInt(index), 1);
        saveAppointmentsToUser(userEmail, userAppointments);
        
        updateStats();
        renderAppointmentsTable();
        showCustomAlert('✅ تم حذف الموعد بنجاح', 'تم الحذف');
    }
}

function closeModal() {
    document.getElementById('appointmentModal').style.display = 'none';
}

// ============================================
// تصدير البيانات
// ============================================
function exportToExcel() {
    const appointments = getAllAppointments();
    let csvContent = "المستخدم,البريد الإلكتروني,التاريخ,نوع الموعد,الحالة\n";
    
    appointments.forEach(app => {
        csvContent += `"${app.userName}","${app.userEmail}","${app.date}","${app.title}","${app.status || 'قادم'}"\n`;
    });
    
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `appointments_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showCustomAlert('✅ تم تصدير البيانات بنجاح', 'تم التصدير');
}

function printTable() {
    const printContent = document.querySelector('.appointments-table-container').innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = `
        <div style="padding: 20px; direction: rtl;">
            <h1 style="text-align: center;">قلب السكري - قائمة المواعيد</h1>
            <p style="text-align: center;">تاريخ الطباعة: ${new Date().toLocaleDateString('ar')}</p>
            ${printContent}
        </div>
    `;
    
    window.print();
    document.body.innerHTML = originalContent;
    location.reload();
}

// ============================================
// إضافة موعد لجميع المستخدمين
// ============================================
function addGlobalAppointment() {
    const date = prompt('أدخل تاريخ الموعد (YYYY-MM-DD):');
    const title = prompt('نوع الموعد:', 'فحص قلب ECG');
    
    if (date && title) {
        const users = getAllUsers();
        let addedCount = 0;
        
        users.forEach(user => {
            const appointments = JSON.parse(localStorage.getItem(`appointments_${user.email}`) || '[]');
            appointments.push({ date, title, status: 'قادم' });
            localStorage.setItem(`appointments_${user.email}`, JSON.stringify(appointments));
            addedCount++;
        });
        
        updateStats();
        renderAppointmentsTable();
        showCustomAlert(`✅ تم إضافة الموعد لـ ${addedCount} مستخدم`, 'تم الإضافة');
    }
}

// ============================================
// تسجيل الخروج
// ============================================
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = '../index.html';
});

document.getElementById('backBtn').addEventListener('click', () => {
    window.location.href = 'admin.html';
});

// ============================================
// ربط الأحداث
// ============================================
document.getElementById('addGlobalAppointmentBtn').addEventListener('click', addGlobalAppointment);
document.getElementById('saveAppointmentBtn').addEventListener('click', saveAppointment);
document.getElementById('closeModalBtn').addEventListener('click', closeModal);
document.getElementById('cancelModalBtn').addEventListener('click', closeModal);
document.getElementById('exportExcelBtn').addEventListener('click', exportToExcel);
document.getElementById('printBtn').addEventListener('click', printTable);

document.getElementById('searchInput').addEventListener('input', (e) => {
    currentSearchTerm = e.target.value;
    renderAppointmentsTable();
});

document.getElementById('filterType').addEventListener('change', (e) => {
    currentFilter = e.target.value;
    renderAppointmentsTable();
});

// إضافة زر في admin.html لفتح صفحة المواعيد
// ============================================
// تهيئة الصفحة
// ============================================
updateStats();
renderAppointmentsTable();

// إغلاق المودال عند النقر خارجها
window.onclick = function(event) {
    const modal = document.getElementById('appointmentModal');
    if (event.target === modal) {
        closeModal();
    }
}
