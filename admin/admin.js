// ============================================
// ABbeats - Administration Panel
// ============================================

// ============================================
// DONNÉES DE TEST
// ============================================

// Utilisateurs fictifs
let users = [
    { id: 1, name: "Ahmed Benali", email: "ahmed@example.com", role: "user", registeredAt: "2025-01-15", loginCount: 24, lastActivity: "2025-05-13", status: "active" },
    { id: 2, name: "Fatima Zohra", email: "fatima@example.com", role: "user", registeredAt: "2025-02-20", loginCount: 18, lastActivity: "2025-05-12", status: "active" },
    { id: 3, name: "Mohamed Lamine", email: "mohamed@example.com", role: "user", registeredAt: "2025-03-10", loginCount: 31, lastActivity: "2025-05-14", status: "active" },
    { id: 4, name: "Nadia Cherif", email: "nadia@example.com", role: "user", registeredAt: "2025-03-25", loginCount: 12, lastActivity: "2025-05-10", status: "inactive" },
    { id: 5, name: "Admin System", email: "admin@abbeats.com", role: "admin", registeredAt: "2025-01-01", loginCount: 89, lastActivity: "2025-05-14", status: "active" }
];

// Rendez-vous fictifs
let appointments = [
    { id: 1, userName: "Ahmed Benali", date: "2025-05-20", type: "ECG cardiaque", status: "confirmé" },
    { id: 2, userName: "Fatima Zohra", date: "2025-05-22", type: "Consultation cardiologue", status: "en attente" },
    { id: 3, userName: "Mohamed Lamine", date: "2025-05-25", type: "Bilan sanguin", status: "confirmé" },
    { id: 4, userName: "Nadia Cherif", date: "2025-05-28", type: "Contrôle diabète", status: "en attente" }
];

// Activités fictives
let activities = [
    { user: "Ahmed Benali", action: "Connexion", time: "2025-05-14 09:30", type: "login" },
    { user: "Mohamed Lamine", action: "Test de risque effectué", time: "2025-05-14 10:15", type: "test" },
    { user: "Fatima Zohra", action: "Téléchargement de guide", time: "2025-05-13 14:45", type: "download" },
    { user: "Admin System", action: "Connexion admin", time: "2025-05-14 08:00", type: "login" },
    { user: "Nadia Cherif", action: "Rendez-vous ajouté", time: "2025-05-12 11:20", type: "appointment" }
];

// Données du graphique
let activityData = {
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
    const totalDownloads = 124;
    
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('newUsersThisMonth').textContent = newUsersThisMonth;
    document.getElementById('totalAppointments').textContent = totalAppointments;
    document.getElementById('totalDownloads').textContent = totalDownloads;
    document.getElementById('activeUsers').textContent = activeUsers;
    document.getElementById('totalTests').textContent = 87;
}

// ============================================
// GRAPHIQUE D'ACTIVITÉ
// ============================================
function initChart() {
    const canvas = document.getElementById('activityChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    if (chart) chart.destroy();
    
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
                legend: { position: 'top', labels: { font: { family: 'Poppins', size: 12 } } }
            },
            scales: { y: { beginAtZero: true } }
        }
    });
}

// ============================================
// TABLEAU DES UTILISATEURS
// ============================================
function renderUsersTable() {
    let filteredUsers = users.filter(user => {
        const matchSearch = currentSearch === '' || 
            user.name.toLowerCase().includes(currentSearch.toLowerCase()) || 
            user.email.toLowerCase().includes(currentSearch.toLowerCase());
        const matchFilter = currentFilter === 'all' || user.role === currentFilter;
        return matchSearch && matchFilter;
    });
    
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
        let statusClass = app.status === 'confirmé' ? 'status-active' : (app.status === 'en attente' ? 'status-pending' : 'status-inactive');
        
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
// GESTION DES RENDEZ-VOUS (Page dédiée)
// ============================================
function goToAppointmentsPage() {
    window.location.href = 'appointments.html';
}

function goToUsersManagementPage() {
    window.location.href = 'users-management.html';
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

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                if (data.users) users = data.users;
                if (data.appointments) appointments = data.appointments;
                if (data.activities) activities = data.activities;
                updateStats();
                renderUsersTable();
                renderAppointmentsTable();
                renderActivityLog();
                showAlert('✅ Données importées avec succès', 'success');
            } catch (err) {
                showAlert('❌ Erreur lors de l\'importation', 'error');
            }
        };
        reader.readAsText(file);
    };
    input.click();
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
        const confirmation = prompt('Tapez "SUPPRIMER" pour confirmer :');
        if (confirmation === 'SUPPRIMER') {
            users = [
                { id: 1, name: "Admin", email: "admin@abbeats.com", role: "admin", registeredAt: "2025-01-01", loginCount: 1, lastActivity: new Date().toLocaleDateString(), status: "active" }
            ];
            appointments = [];
            activities = [];
            updateStats();
            renderUsersTable();
            renderAppointmentsTable();
            renderActivityLog();
            showAlert('🗑️ Toutes les données ont été effacées', 'warning');
        } else {
            showAlert('❌ Confirmation incorrecte', 'error');
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
        background: ${type === 'success' ? '#10b981' : (type === 'warning' ? '#f59e0b' : (type === 'error' ? '#ef4444' : '#3b82f6'))};
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
// DÉCONNEXION
// ============================================
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = '../signUp/login.html';
}

// ============================================
// CHANGEMENT DE LANGUE
// ============================================
function changeLanguage(lang) {
    localStorage.setItem('language', lang);
    window.location.reload();
}

// ============================================
// ÉVÉNEMENTS
// ============================================
function initEvents() {
    // Logout
    document.getElementById('logoutBtn')?.addEventListener('click', logout);
    
    // Navigation vers les pages de gestion
    document.getElementById('manageAppointmentsBtn')?.addEventListener('click', goToAppointmentsPage);
    document.getElementById('manageUsersBtn')?.addEventListener('click', goToUsersManagementPage);
    
    // Autres boutons
    document.getElementById('exportDataBtn')?.addEventListener('click', exportData);
    document.getElementById('importDataBtn')?.addEventListener('click', importData);
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
    
    // Sélection multiple
    document.getElementById('selectAll')?.addEventListener('change', (e) => {
        document.querySelectorAll('.user-checkbox').forEach(cb => cb.checked = e.target.checked);
        const bulkActions = document.getElementById('bulkActions');
        if (bulkActions) bulkActions.style.display = e.target.checked ? 'flex' : 'none';
    });
    
    document.getElementById('bulkDeleteBtn')?.addEventListener('click', () => {
        const selected = document.querySelectorAll('.user-checkbox:checked');
        if (selected.length === 0) {
            showAlert('Aucun utilisateur sélectionné', 'error');
            return;
        }
        if (confirm(`Supprimer ${selected.length} utilisateur(s) ?`)) {
            selected.forEach(cb => {
                const id = parseInt(cb.getAttribute('data-id'));
                users = users.filter(u => u.id !== id);
            });
            updateStats();
            renderUsersTable();
            showAlert(`${selected.length} utilisateur(s) supprimé(s)`, 'success');
            document.getElementById('bulkActions').style.display = 'none';
            document.getElementById('selectAll').checked = false;
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
window.changeLanguage = changeLanguage;
