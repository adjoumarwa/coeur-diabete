// ============================================
// ABbeats - Dashboard Principal
// Toutes les fonctionnalités
// ============================================

// ============================================
// VARIABLES GLOBALES
// ============================================
let timerInterval;
let timerSeconds = 0;
let currentUser = null;

// ============================================
// RÉCUPÉRATION DE L'UTILISATEUR
// ============================================
try {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        const userNameSpan = document.getElementById('userName');
        if (userNameSpan) userNameSpan.textContent = currentUser.name || currentUser.email || 'Invité';
    } else {
        currentUser = { email: 'guest@example.com', name: 'Invité' };
        const userNameSpan = document.getElementById('userName');
        if (userNameSpan) userNameSpan.textContent = 'Invité';
    }
} catch(e) {
    currentUser = { email: 'guest@example.com', name: 'Invité' };
}

// ============================================
// FONCTIONS D'ALERTE PERSONNALISÉES
// ============================================
function showCustomAlert(message, title = 'Information') {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        backdrop-filter: blur(5px);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
    `;
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white;
        border-radius: 20px;
        padding: 2rem;
        max-width: 450px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        border-top: 5px solid #e74c3c;
    `;
    
    modal.innerHTML = `
        <h3 style="color: #1e3c5c; margin-bottom: 1rem;">${title}</h3>
        <div style="margin: 1rem 0; text-align: left; line-height: 1.6; white-space: pre-line;">${message}</div>
        <button id="alertCloseBtn" style="background: linear-gradient(135deg, #e74c3c, #c0392b); color: white; border: none; padding: 10px 30px; border-radius: 10px; cursor: pointer; margin-top: 1rem;">OK</button>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    document.getElementById('alertCloseBtn').onclick = () => overlay.remove();
}

// ============================================
// TIMER
// ============================================
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timerSeconds++;
        const minutes = Math.floor(timerSeconds / 60);
        const seconds = timerSeconds % 60;
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 1000);
}
startTimer();

// ============================================
// ALERTE INTELLIGENTE
// ============================================
function checkSmartAlert() {
    const douleur = document.getElementById('douleurSelect')?.value;
    const dyspnee = document.getElementById('dyspneeSelect')?.value;
    const alertDiv = document.getElementById('smartAlert');
    if (alertDiv && ((douleur === '2' || douleur === '3') && dyspnee === '2')) {
        alertDiv.style.display = 'block';
    } else if (alertDiv) {
        alertDiv.style.display = 'none';
    }
}

// ============================================
// CALCUL DU RISQUE CARDIACQUE
// ============================================
function calculateRisk() {
    const age = parseInt(document.getElementById('ageSelect')?.value || 0);
    const sexe = parseInt(document.getElementById('sexeSelect')?.value || 0);
    
    let pathologies = 0;
    if (document.getElementById('hypertension')?.checked) pathologies += 2;
    if (document.getElementById('diabete')?.checked) pathologies += 2;
    if (document.getElementById('hypercholesterolemie')?.checked) pathologies += 2;
    
    const tabagisme = parseInt(document.getElementById('tabagismeSelect')?.value || 0);
    const activite = parseInt(document.getElementById('activiteSelect')?.value || 0);
    const alimentation = parseInt(document.getElementById('alimentationSelect')?.value || 0);
    
    let facteurs = 0;
    if (document.getElementById('obesite')?.checked) facteurs += 1;
    if (document.getElementById('antecedents')?.checked) facteurs += 2;
    
    const douleur = parseInt(document.getElementById('douleurSelect')?.value || 0);
    const dyspnee = parseInt(document.getElementById('dyspneeSelect')?.value || 0);
    const fatigue = parseInt(document.getElementById('fatigueSelect')?.value || 0);
    
    const totalScore = age + sexe + pathologies + tabagisme + activite + alimentation + facteurs + douleur + dyspnee + fatigue;
    
    showResult(totalScore);
    saveToHistory(totalScore);
}

function showResult(score) {
    const resultCard = document.getElementById('resultCard');
    const scoreSpan = document.getElementById('scoreValue');
    const riskLevelSpan = document.getElementById('riskLevel');
    
    if (resultCard) resultCard.style.display = 'block';
    if (scoreSpan) scoreSpan.textContent = score;
    
    document.getElementById('resultat')?.scrollIntoView({ behavior: 'smooth' });
    
    let level = '';
    let levelClass = '';
    if (score <= 5) {
        level = '✔ Risque faible';
        levelClass = 'low';
    } else if (score <= 10) {
        level = '⚠ Risque modéré';
        levelClass = 'medium';
    } else {
        level = '🚨 Risque élevé';
        levelClass = 'high';
    }
    
    if (riskLevelSpan) riskLevelSpan.innerHTML = `<span class="${levelClass}">${level}</span>`;
    drawGauge(score);
}

function drawGauge(score) {
    const canvas = document.getElementById('riskGauge');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 200;
    
    const percentage = Math.min(score / 20, 1);
    const angle = -Math.PI / 2 + (Math.PI * percentage);
    
    ctx.clearRect(0, 0, 200, 200);
    
    ctx.beginPath();
    ctx.arc(100, 100, 80, -Math.PI / 2, Math.PI / 2);
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 15;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(100, 100, 80, -Math.PI / 2, angle);
    
    if (score <= 5) ctx.strokeStyle = "#16a34a";
    else if (score <= 10) ctx.strokeStyle = "#f59e0b";
    else ctx.strokeStyle = "#dc2626";
    ctx.lineWidth = 15;
    ctx.stroke();
}

// ============================================
// HISTORIQUE
// ============================================
function saveToHistory(score) {
    const history = JSON.parse(localStorage.getItem('abbeats_history') || '[]');
    history.push({
        date: new Date().toLocaleDateString('fr-FR'),
        time: new Date().toLocaleTimeString('fr-FR'),
        score: score
    });
    localStorage.setItem('abbeats_history', JSON.stringify(history));
}

function showHistory() {
    const history = JSON.parse(localStorage.getItem('abbeats_history') || '[]');
    const modal = document.getElementById('historyModal');
    const historyList = document.getElementById('historyList');
    
    if (history.length === 0) {
        if (historyList) historyList.innerHTML = '<p style="text-align: center;">Aucun résultat enregistré</p>';
    } else if (historyList) {
        historyList.innerHTML = '<table class="history-table"><tr><th>Date</th><th>Heure</th><th>Score</th><th>Risque</th></tr>';
        history.forEach(item => {
            let risk = item.score <= 5 ? 'Faible' : (item.score <= 10 ? 'Modéré' : 'Élevé');
            historyList.innerHTML += `<tr><td>${item.date}</td><td>${item.time}</td><td>${item.score}/20</td><td>${risk}</td></tr>`;
        });
        historyList.innerHTML += '</table>';
    }
    if (modal) modal.style.display = 'flex';
}

// ============================================
// FONCTION 1: LECTURES MÉDICALES
// ============================================
function updateReadings() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 10001;
        display: flex;
        justify-content: center;
        align-items: center;
    `;
    modal.innerHTML = `
        <div style="background: white; border-radius: 20px; padding: 25px; max-width: 400px; width: 90%;">
            <h3 style="color: #e74c3c;">📊 Mettre à jour les lectures</h3>
            <div style="margin: 15px 0;"><label>HBA1c (%) - Objectif <7%</label><input type="number" id="hba1cInput" step="0.1" placeholder="Ex: 6.5" style="width:100%; padding:10px; margin-top:5px; border-radius:8px; border:1px solid #ddd;"></div>
            <div style="margin: 15px 0;"><label>Tension artérielle (mmHg)</label><input type="text" id="bpInput" placeholder="Ex: 120/80" style="width:100%; padding:10px; margin-top:5px; border-radius:8px; border:1px solid #ddd;"></div>
            <div style="margin: 15px 0;"><label>Cholestérol LDL (mg/dL) - Objectif <100</label><input type="number" id="cholesterolInput" placeholder="Ex: 95" style="width:100%; padding:10px; margin-top:5px; border-radius:8px; border:1px solid #ddd;"></div>
            <div style="margin: 15px 0;"><label>Glycémie à jeun (mg/dL) - Objectif 80-130</label><input type="number" id="fastingSugarInput" placeholder="Ex: 110" style="width:100%; padding:10px; margin-top:5px; border-radius:8px; border:1px solid #ddd;"></div>
            <div style="display: flex; gap: 10px;"><button id="saveReadingsBtn" style="flex:1; background:#e74c3c; color:white; border:none; padding:12px; border-radius:8px; cursor:pointer;">Enregistrer</button><button id="closeReadingsBtn" style="flex:1; background:#95a5a6; color:white; border:none; padding:12px; border-radius:8px; cursor:pointer;">Annuler</button></div>
        </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('saveReadingsBtn').onclick = () => {
        const hba1c = document.getElementById('hba1cInput').value;
        const bp = document.getElementById('bpInput').value;
        const cholesterol = document.getElementById('cholesterolInput').value;
        const fastingSugar = document.getElementById('fastingSugarInput').value;
        
        const userData = JSON.parse(localStorage.getItem(`userData_${currentUser.email}`) || '{}');
        if (hba1c) { userData.hba1c = hba1c; document.getElementById('hba1c').textContent = hba1c; }
        if (bp) { userData.bp = bp; document.getElementById('bp').textContent = bp; }
        if (cholesterol) { userData.cholesterol = cholesterol; document.getElementById('cholesterol').textContent = cholesterol; }
        if (fastingSugar) { userData.fastingSugar = fastingSugar; document.getElementById('fastingSugar').textContent = fastingSugar; }
        
        localStorage.setItem(`userData_${currentUser.email}`, JSON.stringify(userData));
        modal.remove();
        showCustomAlert('✅ Lectures mises à jour!', 'Succès');
    };
    document.getElementById('closeReadingsBtn').onclick = () => modal.remove();
}

// ============================================
// FONCTION 2: CALCULATEUR IMC
// ============================================
function calculateBMI() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 10001;
        display: flex;
        justify-content: center;
        align-items: center;
    `;
    modal.innerHTML = `
        <div style="background: white; border-radius: 20px; padding: 25px; max-width: 350px; width: 90%; text-align: center;">
            <h3 style="color: #e74c3c;">⚖️ Calculateur IMC</h3>
            <div style="margin: 15px 0;"><input type="number" id="weight" placeholder="Poids (kg)" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd; margin-bottom:10px;"><input type="number" id="height" step="0.01" placeholder="Taille (m)" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd;"></div>
            <button id="calcBtn" style="background:#e74c3c; color:white; border:none; padding:12px 25px; border-radius:8px; cursor:pointer;">Calculer</button>
            <div id="bmiResult" style="margin-top:15px; display:none;"></div>
            <button id="closeBmiBtn" style="background:#95a5a6; color:white; border:none; padding:10px; border-radius:8px; cursor:pointer; margin-top:15px; width:100%;">Fermer</button>
        </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('calcBtn').onclick = () => {
        const weight = parseFloat(document.getElementById('weight').value);
        const height = parseFloat(document.getElementById('height').value);
        const resultDiv = document.getElementById('bmiResult');
        
        if (!weight || !height || weight <= 0 || height <= 0) {
            resultDiv.innerHTML = '<p style="color: red;">Veuillez entrer des valeurs valides</p>';
            resultDiv.style.display = 'block';
            return;
        }
        
        const bmi = weight / (height * height);
        let status = bmi < 18.5 ? 'Insuffisance pondérale' : (bmi < 25 ? 'Poids normal' : (bmi < 30 ? 'Surpoids' : 'Obésité'));
        resultDiv.innerHTML = `<p style="font-size: 24px; font-weight: bold;">IMC: ${bmi.toFixed(1)}</p><p>${status}</p>`;
        resultDiv.style.display = 'block';
    };
    document.getElementById('closeBmiBtn').onclick = () => modal.remove();
}

// ============================================
// FONCTION 3: AGENDA DES RENDEZ-VOUS
// ============================================
function loadAppointments() {
    const appointments = JSON.parse(localStorage.getItem(`appointments_${currentUser.email}`) || '[]');
    const list = document.getElementById('appointmentsList');
    if (!list) return;
    
    if (appointments.length === 0) {
        list.innerHTML = '<li style="text-align: center; color: #999;">📅 Aucun rendez-vous enregistré</li>';
        return;
    }
    
    list.innerHTML = '';
    appointments.sort((a, b) => new Date(a.date) - new Date(b.date));
    appointments.forEach((app, index) => {
        const li = document.createElement('li');
        li.style.cssText = 'padding: 10px; background: #f8fafc; margin-bottom: 8px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;';
        li.innerHTML = `<span style="font-weight: bold; color: #1e3c5c;">${app.date}</span><span>${app.title}</span><button onclick="deleteAppointment(${index})" style="background:#e74c3c; color:white; border:none; border-radius:5px; padding:3px 8px; cursor:pointer;">✗</button>`;
        list.appendChild(li);
    });
}

function addAppointment() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 10001;
        display: flex;
        justify-content: center;
        align-items: center;
    `;
    modal.innerHTML = `
        <div style="background: white; border-radius: 20px; padding: 25px; max-width: 350px; width: 90%;">
            <h3 style="color: #e74c3c;">📅 Ajouter un rendez-vous</h3>
            <div style="margin: 15px 0;"><input type="date" id="appDate" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd; margin-bottom:10px;"><select id="appType" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd;"><option>ECG cardiaque</option><option>Bilan sanguin</option><option>Consultation cardiologue</option><option>Contrôle diabète</option><option>Consultation nutritionniste</option></select></div>
            <button id="saveAppBtn" style="background:#e74c3c; color:white; border:none; padding:12px; border-radius:8px; cursor:pointer; width:100%;">Enregistrer</button>
            <button id="closeAppBtn" style="background:#95a5a6; color:white; border:none; padding:10px; border-radius:8px; cursor:pointer; margin-top:10px; width:100%;">Annuler</button>
        </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('saveAppBtn').onclick = () => {
        const date = document.getElementById('appDate').value;
        const title = document.getElementById('appType').value;
        if (!date) { showCustomAlert('Veuillez choisir une date', 'Erreur'); return; }
        
        const appointments = JSON.parse(localStorage.getItem(`appointments_${currentUser.email}`) || '[]');
        appointments.push({ date, title });
        localStorage.setItem(`appointments_${currentUser.email}`, JSON.stringify(appointments));
        loadAppointments();
        modal.remove();
        showCustomAlert('✅ Rendez-vous ajouté!', 'Succès');
    };
    document.getElementById('closeAppBtn').onclick = () => modal.remove();
}

function deleteAppointment(index) {
    if (confirm('Supprimer ce rendez-vous?')) {
        const appointments = JSON.parse(localStorage.getItem(`appointments_${currentUser.email}`) || '[]');
        appointments.splice(index, 1);
        localStorage.setItem(`appointments_${currentUser.email}`, JSON.stringify(appointments));
        loadAppointments();
        showCustomAlert('✅ Rendez-vous supprimé', 'Succès');
    }
}

// ============================================
// FONCTION 4: CONSEILS QUOTIDIENS
// ============================================
const tipsList = [
    "🚶 Commencez votre journée par 30 minutes de marche",
    "💧 Buvez 8-10 verres d'eau par jour",
    "🥗 Mangez des légumes verts riches en magnésium",
    "😴 Dormez 7-8 heures par nuit",
    "📊 Contrôlez régulièrement votre glycémie",
    "❤️ Mesurez votre tension chaque semaine",
    "🥑 L'huile d'olive est bonne pour le cœur",
    "🚫 Évitez les sodas et les sucres raffinés",
    "🐟 Mangez du poisson 2 fois par semaine",
    "🧘‍♂️ Pratiquez la respiration profonde"
];

function newTip() {
    const randomTip = tipsList[Math.floor(Math.random() * tipsList.length)];
    const tipDiv = document.getElementById('dailyTip');
    if (tipDiv) tipDiv.innerHTML = randomTip;
}

// ============================================
// FONCTION 5: TÉLÉCHARGEMENTS
// ============================================
function downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
    showCustomAlert('✅ Téléchargement terminé!', 'Succès');
}

function telechargerGuide() {
    downloadFile("GUIDE DE LA CRISE CARDIAQUE SILENCIEUSE\n\nSignes d'alerte:\n- Fatigue soudaine\n- Nausées\n- Douleurs dos/mâchoire\n\nAppelez le 14!", 'guide_cardiaque.txt');
}

function telechargerCarte() {
    downloadFile("CARTE PATIENT\n\nNom: ................................\nDiabète: ............................\nUrgence: 14\n⚠️ Patient diabétique", 'carte_patient.txt');
}

function telechargerAlimentation() {
    downloadFile("GUIDE NUTRITIONNEL\n\nRégime DASH:\n- 5-6 portions légumes\n- Fruits\n- Céréales complètes\n\nRégime Méditerranéen:\n- Huile d'olive\n- Poisson\n- Fruits frais", 'guide_alimentation.txt');
}

// ============================================
// FONCTION 6: STATISTIQUES
// ============================================
function loadUserStats() {
    const loginCount = localStorage.getItem(`loginCount_${currentUser.email}`) || 0;
    const lastLogin = localStorage.getItem(`lastLogin_${currentUser.email}`) || '';
    const memberSince = localStorage.getItem(`memberSince_${currentUser.email}`) || new Date().toLocaleDateString();
    
    const loginCountEl = document.getElementById('loginCount');
    const lastLoginEl = document.getElementById('lastLogin');
    const memberSinceEl = document.getElementById('memberSince');
    
    if (loginCountEl) loginCountEl.textContent = loginCount;
    if (lastLoginEl) lastLoginEl.textContent = lastLogin ? new Date(lastLogin).toLocaleDateString() : 'Aujourd\'hui';
    if (memberSinceEl) memberSinceEl.textContent = memberSince;
}

function loadUserReadings() {
    const data = JSON.parse(localStorage.getItem(`userData_${currentUser.email}`) || '{}');
    if (document.getElementById('hba1c') && data.hba1c) document.getElementById('hba1c').textContent = data.hba1c;
    if (document.getElementById('bp') && data.bp) document.getElementById('bp').textContent = data.bp;
    if (document.getElementById('cholesterol') && data.cholesterol) document.getElementById('cholesterol').textContent = data.cholesterol;
    if (document.getElementById('fastingSugar') && data.fastingSugar) document.getElementById('fastingSugar').textContent = data.fastingSugar;
}

function updateLoginStats() {
    if (currentUser.email === 'guest@example.com') return;
    let count = parseInt(localStorage.getItem(`loginCount_${currentUser.email}`) || '0');
    count++;
    localStorage.setItem(`loginCount_${currentUser.email}`, count);
    localStorage.setItem(`lastLogin_${currentUser.email}`, new Date().toISOString());
    if (!localStorage.getItem(`memberSince_${currentUser.email}`)) {
        localStorage.setItem(`memberSince_${currentUser.email}`, new Date().toLocaleDateString());
    }
}

// ============================================
// URGENCE
// ============================================
function emergencyAlert() {
    showCustomAlert("🚨 URGENCE MÉDICALE 🚨\n\nEn cas de douleur thoracique intense :\n• Arrêter tout effort\n• S'asseoir ou s'allonger\n• Appeler immédiatement les secours\n\n📞 SAMU / Secours : 14\n📞 Protection civile : 14 / 1548", "URGENCE");
}

// ============================================
// SCROLL
// ============================================
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
}

// ============================================
// DÉCONNEXION
// ============================================
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = '../signUp/login.html';
});

// ============================================
// BOUTONS DE NAVIGATION
// ============================================
document.getElementById('startEvaluationBtn')?.addEventListener('click', () => scrollToSection('evaluation'));
document.getElementById('discoverSymptomsBtn')?.addEventListener('click', () => scrollToSection('symptomes'));
document.getElementById('findHelpBtn')?.addEventListener('click', () => scrollToSection('urgence'));
document.getElementById('calculateRiskBtn')?.addEventListener('click', calculateRisk);
document.getElementById('restartBtn')?.addEventListener('click', () => scrollToSection('evaluation'));
document.getElementById('preventionBtn')?.addEventListener('click', () => scrollToSection('prevention'));
document.getElementById('seeExamsBtn')?.addEventListener('click', () => scrollToSection('examens'));
document.getElementById('emergencyBtn')?.addEventListener('click', emergencyAlert);
document.getElementById('emergencyResultBtn')?.addEventListener('click', emergencyAlert);
document.getElementById('historyBtn')?.addEventListener('click', (e) => { e.preventDefault(); showHistory(); });
document.getElementById('closeHistoryBtn')?.addEventListener('click', () => document.getElementById('historyModal').style.display = 'none');

// ============================================
// LIER LES BOUTONS DES FONCTIONNALITÉS
// ============================================
document.getElementById('updateReadingsBtn')?.addEventListener('click', updateReadings);
document.getElementById('bmiBtn')?.addEventListener('click', calculateBMI);
document.getElementById('addAppointmentBtn')?.addEventListener('click', addAppointment);
document.getElementById('newTipBtn')?.addEventListener('click', newTip);

document.querySelectorAll('.download-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const type = btn.getAttribute('data-download');
        if (type === 'guide') telechargerGuide();
        else if (type === 'carte') telechargerCarte();
        else if (type === 'alimentation') telechargerAlimentation();
    });
});

// ============================================
// FORMULAIRE DE CONTACT
// ============================================
document.getElementById('contactForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    showCustomAlert("✅ Message envoyé avec succès! Notre équipe vous répondra dans les plus brefs délais.", "Confirmation");
    e.target.reset();
});

// ============================================
// NAVIGATION LINKS
// ============================================
document.querySelectorAll('.dashboard-nav .nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        scrollToSection(targetId);
    });
});

// ============================================
// ALERTE INTELLIGENTE
// ============================================
document.getElementById('douleurSelect')?.addEventListener('change', checkSmartAlert);
document.getElementById('dyspneeSelect')?.addEventListener('change', checkSmartAlert);

// ============================================
// INITIALISATION
// ============================================
updateLoginStats();
loadUserStats();
loadUserReadings();
loadAppointments();
newTip();
checkSmartAlert();

// Rendre les fonctions globales
window.deleteAppointment = deleteAppointment;
