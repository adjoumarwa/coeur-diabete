// ============================================
// ABbeats - Dashboard Principal
// Votre cœur, notre care
// ============================================

// ============================================
// VARIABLES GLOBALES
// ============================================
let totalScore = 0;
let historyResults = [];

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
        border-top: 5px solid #dc2626;
    `;
    
    modal.innerHTML = `
        <h3 style="color: #1a472a; margin-bottom: 1rem;">${title}</h3>
        <div style="margin: 1rem 0; text-align: left; line-height: 1.6; white-space: pre-line;">${message}</div>
        <button id="alertCloseBtn" style="background: linear-gradient(135deg, #dc2626, #2563eb); color: white; border: none; padding: 10px 30px; border-radius: 10px; cursor: pointer; margin-top: 1rem;">OK</button>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    document.getElementById('alertCloseBtn').onclick = () => overlay.remove();
}

// ============================================
// TIMER POUR LES SYMPTÔMES
// ============================================
let timerInterval;
let timerSeconds = 0;

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timerSeconds++;
        const minutes = Math.floor(timerSeconds / 60);
        const seconds = timerSeconds % 60;
        document.getElementById('timer').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
}

// Démarrer le timer au chargement
startTimer();

// ============================================
// ALERTE INTELLIGENTE
// ============================================
function checkSmartAlert() {
    const douleur = document.getElementById('douleurSelect').value;
    const dyspnee = document.getElementById('dyspneeSelect').value;
    const alertDiv = document.getElementById('smartAlert');
    
    if ((douleur === '2' || douleur === '3') && dyspnee === '2') {
        alertDiv.style.display = 'block';
    } else {
        alertDiv.style.display = 'none';
    }
}

// Écouter les changements
document.getElementById('douleurSelect')?.addEventListener('change', checkSmartAlert);
document.getElementById('dyspneeSelect')?.addEventListener('change', checkSmartAlert);

// ============================================
// CALCUL DU RISQUE
// ============================================
function calculateRisk() {
    // Récupérer toutes les valeurs
    const age = parseInt(document.getElementById('ageSelect').value);
    const sexe = parseInt(document.getElementById('sexeSelect').value);
    
    // Pathologies
    let pathologies = 0;
    if (document.getElementById('hypertension').checked) pathologies += 2;
    if (document.getElementById('diabete').checked) pathologies += 2;
    if (document.getElementById('hypercholesterolemie').checked) pathologies += 2;
    
    // Mode de vie
    const tabagisme = parseInt(document.getElementById('tabagismeSelect').value);
    const activite = parseInt(document.getElementById('activiteSelect').value);
    const alimentation = parseInt(document.getElementById('alimentationSelect').value);
    
    // Facteurs supplémentaires
    let facteurs = 0;
    if (document.getElementById('obesite').checked) facteurs += 1;
    if (document.getElementById('antecedents').checked) facteurs += 2;
    
    // Symptômes
    const douleur = parseInt(document.getElementById('douleurSelect').value);
    const dyspnee = parseInt(document.getElementById('dyspneeSelect').value);
    const fatigue = parseInt(document.getElementById('fatigueSelect').value);
    
    // Calcul du score total
    totalScore = age + sexe + pathologies + tabagisme + activite + alimentation + facteurs + douleur + dyspnee + fatigue;
    
    // Afficher le résultat
    showResult(totalScore);
    
    // Sauvegarder dans l'historique
    saveToHistory(totalScore);
}

// ============================================
// AFFICHAGE DU RÉSULTAT
// ============================================
function showResult(score) {
    const resultCard = document.getElementById('resultCard');
    const scoreSpan = document.getElementById('scoreValue');
    const riskLevelSpan = document.getElementById('riskLevel');
    const riskDescriptionSpan = document.getElementById('riskDescription');
    const riskAdviceSpan = document.getElementById('riskAdvice');
    
    scoreSpan.textContent = score;
    resultCard.style.display = 'block';
    
    // Faire défiler vers le résultat
    document.getElementById('resultat').scrollIntoView({ behavior: 'smooth' });
    
    let level = '';
    let description = '';
    let advice = '';
    let levelClass = '';
    
    if (score <= 5) {
        level = '✔ Risque faible';
        description = 'État rassurant';
        advice = '✔ Hygiène de vie à maintenir';
        levelClass = 'low';
    } else if (score <= 10) {
        level = '⚠ Risque modéré';
        description = 'Présence de facteurs de risque';
        advice = 'Un bilan médical est recommandé (pression artérielle, analyses sanguines)';
        levelClass = 'medium';
    } else {
        level = '🚨 Risque élevé';
        description = 'Forte probabilité de maladie cardiaque aiguë';
        advice = 'Une prise en charge rapide aux urgences peut sauver le muscle cardiaque';
        levelClass = 'high';
    }
    
    riskLevelSpan.innerHTML = `<span class="${levelClass}">${level}</span>`;
    riskDescriptionSpan.textContent = description;
    riskAdviceSpan.textContent = advice;
    
    // Dessiner le gauge
    drawGauge(score);
}

// ============================================
// DESSIN DU GAUGE
// ============================================
function drawGauge(score) {
    const canvas = document.getElementById('riskGauge');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const percentage = Math.min(score / 20, 1);
    const angle = -Math.PI / 2 + (Math.PI * percentage);
    
    ctx.clearRect(0, 0, width, height);
    
    // Arc de fond
    ctx.beginPath();
    ctx.arc(100, 100, 80, -Math.PI / 2, Math.PI / 2);
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 15;
    ctx.stroke();
    
    // Arc du score
    ctx.beginPath();
    ctx.arc(100, 100, 80, -Math.PI / 2, angle);
    
    if (score <= 5) {
        ctx.strokeStyle = "#16a34a";
    } else if (score <= 10) {
        ctx.strokeStyle = "#f59e0b";
    } else {
        ctx.strokeStyle = "#dc2626";
    }
    ctx.lineWidth = 15;
    ctx.stroke();
}

// ============================================
// HISTORIQUE DES RÉSULTATS
// ============================================
function saveToHistory(score) {
    const history = JSON.parse(localStorage.getItem('abbeats_history') || '[]');
    history.push({
        date: new Date().toLocaleDateString('fr-FR'),
        time: new Date().toLocaleTimeString('fr-FR'),
        score: score
    });
    localStorage.setItem('abbeats_history', JSON.stringify(history));
    historyResults = history;
}

function showHistory() {
    const history = JSON.parse(localStorage.getItem('abbeats_history') || '[]');
    const modal = document.getElementById('historyModal');
    const historyList = document.getElementById('historyList');
    
    if (history.length === 0) {
        historyList.innerHTML = '<p style="text-align: center;">Aucun résultat enregistré</p>';
    } else {
        historyList.innerHTML = '<table class="history-table"><tr><th>Date</th><th>Heure</th><th>Score</th><th>Risque</th></tr>';
        history.forEach(item => {
            let risk = '';
            if (item.score <= 5) risk = 'Faible';
            else if (item.score <= 10) risk = 'Modéré';
            else risk = 'Élevé';
            historyList.innerHTML += `<tr><td>${item.date}</td><td>${item.time}</td><td>${item.score}/20</td><td>${risk}</td></tr>`;
        });
        historyList.innerHTML += '</table>';
    }
    
    modal.style.display = 'flex';
}

// ============================================
// SCROLL SMOOTH VERS LES SECTIONS
// ============================================
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// ============================================
// GESTION DE L'UTILISATEUR (SESSION)
// ============================================
const currentUser = localStorage.getItem('currentUser');
if (currentUser) {
    const user = JSON.parse(currentUser);
    document.getElementById('userName').textContent = user.name || user.email;
} else {
    document.getElementById('userName').textContent = 'Invité';
}

// ============================================
// DÉCONNEXION
// ============================================
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = '../signUp/login.html';
});

// ============================================
// BOUTONS D'URGENCE
// ============================================
function emergencyAlert() {
    showCustomAlert(
        "🚨 URGENCE MÉDICALE 🚨\n\n" +
        "En cas de douleur thoracique intense :\n" +
        "• Arrêter tout effort\n" +
        "• S'asseoir ou s'allonger\n" +
        "• Appeler immédiatement les secours\n\n" +
        "📞 SAMU / Secours : 14\n" +
        "📞 Protection civile : 14 / 1548\n\n" +
        "Chaque minute compte !",
        "URGENCE"
    );
}

document.getElementById('emergencyBtn')?.addEventListener('click', emergencyAlert);
document.getElementById('emergencyResultBtn')?.addEventListener('click', emergencyAlert);

// ============================================
// BOUTONS DE NAVIGATION
// ============================================
document.getElementById('startEvaluationBtn')?.addEventListener('click', () => scrollToSection('evaluation'));
document.getElementById('discoverSymptomsBtn')?.addEventListener('click', () => scrollToSection('symptomes'));
document.getElementById('findHelpBtn')?.addEventListener('click', () => scrollToSection('urgence'));
document.getElementById('calculateRiskBtn')?.addEventListener('click', calculateRisk);
document.getElementById('restartBtn')?.addEventListener('click', () => scrollToSection('evaluation'));
document.getElementById('preventionBtn')?.addEventListener('click', () => scrollToSection('prevention'));
document.getElementById('preventionFromExamsBtn')?.addEventListener('click', () => scrollToSection('prevention'));
document.getElementById('symptomsFromPreventionBtn')?.addEventListener('click', () => scrollToSection('symptomes'));
document.getElementById('seeExamsBtn')?.addEventListener('click', () => scrollToSection('examens'));
document.getElementById('historyBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    showHistory();
});

// Fermer le modal d'historique
document.getElementById('closeHistoryBtn')?.addEventListener('click', () => {
    document.getElementById('historyModal').style.display = 'none';
});
document.getElementById('historyModal')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('historyModal')) {
        document.getElementById('historyModal').style.display = 'none';
    }
});

// ============================================
// FORMULAIRE DE CONTACT
// ============================================
document.getElementById('contactForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contactName')?.value;
    const email = document.getElementById('contactEmail')?.value;
    const message = document.getElementById('contactMessage')?.value;
    
    if (name && email && message) {
        showCustomAlert(
            "✅ Message envoyé avec succès !\n\n" +
            "Merci " + name + ", notre équipe vous répondra dans les plus brefs délais.",
            "Confirmation"
        );
        document.getElementById('contactForm').reset();
    } else {
        showCustomAlert("❌ Veuillez remplir tous les champs", "Erreur");
    }
});

// ============================================
// SCROLL POUR LES LIENS DE NAVIGATION
// ============================================
document.querySelectorAll('.dashboard-nav .nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        scrollToSection(targetId);
    });
});

// ============================================
// INITIALISATION
// ============================================
// Vérifier l'alerte intelligente au chargement
checkSmartAlert();

/*the old code*/
// ============================================
// ABbeats - Dashboard Principal
// Votre cœur, notre care
// ============================================

// ============================================
// VARIABLES GLOBALES
// ============================================
let totalScore = 0;
let historyResults = [];
let timerInterval;
let timerSeconds = 0;
let user = null;

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
// TIMER POUR LES SYMPTÔMES
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

function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
}

// Démarrer le timer au chargement
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
// CALCUL DU RISQUE
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
    
    totalScore = age + sexe + pathologies + tabagisme + activite + alimentation + facteurs + douleur + dyspnee + fatigue;
    
    showResult(totalScore);
    saveToHistory(totalScore);
}

// ============================================
// AFFICHAGE DU RÉSULTAT
// ============================================
function showResult(score) {
    const resultCard = document.getElementById('resultCard');
    const scoreSpan = document.getElementById('scoreValue');
    const riskLevelSpan = document.getElementById('riskLevel');
    const riskDescriptionSpan = document.getElementById('riskDescription');
    const riskAdviceSpan = document.getElementById('riskAdvice');
    
    if (resultCard) resultCard.style.display = 'block';
    if (scoreSpan) scoreSpan.textContent = score;
    
    const resultSection = document.getElementById('resultat');
    if (resultSection) resultSection.scrollIntoView({ behavior: 'smooth' });
    
    let level = '';
    let description = '';
    let advice = '';
    let levelClass = '';
    
    if (score <= 5) {
        level = '✔ Risque faible';
        description = 'État rassurant';
        advice = '✔ Hygiène de vie à maintenir';
        levelClass = 'low';
    } else if (score <= 10) {
        level = '⚠ Risque modéré';
        description = 'Présence de facteurs de risque';
        advice = 'Un bilan médical est recommandé (pression artérielle, analyses sanguines)';
        levelClass = 'medium';
    } else {
        level = '🚨 Risque élevé';
        description = 'Forte probabilité de maladie cardiaque aiguë';
        advice = 'Une prise en charge rapide aux urgences peut sauver le muscle cardiaque';
        levelClass = 'high';
    }
    
    if (riskLevelSpan) riskLevelSpan.innerHTML = `<span class="${levelClass}">${level}</span>`;
    if (riskDescriptionSpan) riskDescriptionSpan.textContent = description;
    if (riskAdviceSpan) riskAdviceSpan.textContent = advice;
    
    drawGauge(score);
}

// ============================================
// DESSIN DU GAUGE
// ============================================
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
    
    if (score <= 5) {
        ctx.strokeStyle = "#16a34a";
    } else if (score <= 10) {
        ctx.strokeStyle = "#f59e0b";
    } else {
        ctx.strokeStyle = "#dc2626";
    }
    ctx.lineWidth = 15;
    ctx.stroke();
}

// ============================================
// HISTORIQUE DES RÉSULTATS
// ============================================
function saveToHistory(score) {
    const history = JSON.parse(localStorage.getItem('abbeats_history') || '[]');
    history.push({
        date: new Date().toLocaleDateString('fr-FR'),
        time: new Date().toLocaleTimeString('fr-FR'),
        score: score
    });
    localStorage.setItem('abbeats_history', JSON.stringify(history));
    historyResults = history;
}

function showHistory() {
    const history = JSON.parse(localStorage.getItem('abbeats_history') || '[]');
    const modal = document.getElementById('historyModal');
    const historyList = document.getElementById('historyList');
    
    if (history.length === 0) {
        if (historyList) historyList.innerHTML = '<p style="text-align: center;">Aucun résultat enregistré</p>';
    } else {
        if (historyList) {
            historyList.innerHTML = '<table class="history-table"><tr><th>Date</th><th>Heure</th><th>Score</th><th>Risque</th></tr>';
            history.forEach(item => {
                let risk = '';
                if (item.score <= 5) risk = 'Faible';
                else if (item.score <= 10) risk = 'Modéré';
                else risk = 'Élevé';
                historyList.innerHTML += `<tr><td>${item.date}</td><td>${item.time}</td><td>${item.score}/20</td><td>${risk}</td></tr>`;
            });
            historyList.innerHTML += '</table>';
        }
    }
    
    if (modal) modal.style.display = 'flex';
}

// ============================================
// SCROLL SMOOTH
// ============================================
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// ============================================
// GESTION DE L'UTILISATEUR
// ============================================
try {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        user = JSON.parse(storedUser);
        const userNameSpan = document.getElementById('userName');
        if (userNameSpan) userNameSpan.textContent = user.name || user.email || 'Invité';
    } else {
        const userNameSpan = document.getElementById('userName');
        if (userNameSpan) userNameSpan.textContent = 'Invité';
    }
} catch(e) {
    console.log('Erreur utilisateur:', e);
}

// ============================================
// DÉCONNEXION
// ============================================
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = '../signUp/login.html';
    });
}

// ============================================
// BOUTONS D'URGENCE
// ============================================
function emergencyAlert() {
    showCustomAlert(
        "🚨 URGENCE MÉDICALE 🚨\n\n" +
        "En cas de douleur thoracique intense :\n" +
        "• Arrêter tout effort\n" +
        "• S'asseoir ou s'allonger\n" +
        "• Appeler immédiatement les secours\n\n" +
        "📞 SAMU / Secours : 14\n" +
        "📞 Protection civile : 14 / 1548\n\n" +
        "Chaque minute compte !",
        "URGENCE"
    );
}

const emergencyBtn = document.getElementById('emergencyBtn');
if (emergencyBtn) emergencyBtn.addEventListener('click', emergencyAlert);

const emergencyResultBtn = document.getElementById('emergencyResultBtn');
if (emergencyResultBtn) emergencyResultBtn.addEventListener('click', emergencyAlert);

// ============================================
// BOUTONS DE NAVIGATION
// ============================================
const startEvaluationBtn = document.getElementById('startEvaluationBtn');
if (startEvaluationBtn) startEvaluationBtn.addEventListener('click', () => scrollToSection('evaluation'));

const discoverSymptomsBtn = document.getElementById('discoverSymptomsBtn');
if (discoverSymptomsBtn) discoverSymptomsBtn.addEventListener('click', () => scrollToSection('symptomes'));

const findHelpBtn = document.getElementById('findHelpBtn');
if (findHelpBtn) findHelpBtn.addEventListener('click', () => scrollToSection('urgence'));

const calculateRiskBtn = document.getElementById('calculateRiskBtn');
if (calculateRiskBtn) calculateRiskBtn.addEventListener('click', calculateRisk);

const restartBtn = document.getElementById('restartBtn');
if (restartBtn) restartBtn.addEventListener('click', () => scrollToSection('evaluation'));

const preventionBtn = document.getElementById('preventionBtn');
if (preventionBtn) preventionBtn.addEventListener('click', () => scrollToSection('prevention'));

const preventionFromExamsBtn = document.getElementById('preventionFromExamsBtn');
if (preventionFromExamsBtn) preventionFromExamsBtn.addEventListener('click', () => scrollToSection('prevention'));

const symptomsFromPreventionBtn = document.getElementById('symptomsFromPreventionBtn');
if (symptomsFromPreventionBtn) symptomsFromPreventionBtn.addEventListener('click', () => scrollToSection('symptomes'));

const seeExamsBtn = document.getElementById('seeExamsBtn');
if (seeExamsBtn) seeExamsBtn.addEventListener('click', () => scrollToSection('examens'));

const historyBtn = document.getElementById('historyBtn');
if (historyBtn) {
    historyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showHistory();
    });
}

// Fermer le modal d'historique
const closeHistoryBtn = document.getElementById('closeHistoryBtn');
if (closeHistoryBtn) {
    closeHistoryBtn.addEventListener('click', () => {
        const modal = document.getElementById('historyModal');
        if (modal) modal.style.display = 'none';
    });
}

const historyModal = document.getElementById('historyModal');
if (historyModal) {
    historyModal.addEventListener('click', (e) => {
        if (e.target === historyModal) {
            historyModal.style.display = 'none';
        }
    });
}

// ============================================
// FORMULAIRE DE CONTACT
// ============================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('contactName')?.value;
        const email = document.getElementById('contactEmail')?.value;
        const message = document.getElementById('contactMessage')?.value;
        
        if (name && email && message) {
            showCustomAlert(
                "✅ Message envoyé avec succès !\n\n" +
                "Merci " + name + ", notre équipe vous répondra dans les plus brefs délais.",
                "Confirmation"
            );
            contactForm.reset();
        } else {
            showCustomAlert("❌ Veuillez remplir tous les champs", "Erreur");
        }
    });
}

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
// ANCIENNES FONCTIONNALITÉS
// ============================================

// 1. Mise à jour des lectures médicales
function updateReadings() {
    const currentUser = localStorage.getItem('currentUser');
    const user = currentUser ? JSON.parse(currentUser) : { email: 'guest@example.com' };
    
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
        <h3 style="color: #1e3c5c; margin-bottom: 1rem;">📊 Mettre à jour les lectures</h3>
        <div style="margin: 1rem 0;">
            <label style="display: block; text-align: left; margin-bottom: 0.5rem;">HBA1c (%) - Objectif <7%</label>
            <input type="number" id="hba1cInput" step="0.1" placeholder="Ex: 6.5" style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 10px;">
        </div>
        <div style="margin: 1rem 0;">
            <label style="display: block; text-align: left; margin-bottom: 0.5rem;">Tension artérielle (mmHg) - Objectif <130</label>
            <input type="text" id="bpInput" placeholder="Ex: 120/80" style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 10px;">
        </div>
        <div style="margin: 1rem 0;">
            <label style="display: block; text-align: left; margin-bottom: 0.5rem;">Cholestérol LDL (mg/dL) - Objectif <100</label>
            <input type="number" id="cholesterolInput" placeholder="Ex: 95" style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 10px;">
        </div>
        <div style="margin: 1rem 0;">
            <label style="display: block; text-align: left; margin-bottom: 0.5rem;">Glycémie à jeun (mg/dL) - Objectif 80-130</label>
            <input type="number" id="fastingSugarInput" placeholder="Ex: 110" style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 10px;">
        </div>
        <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
            <button id="saveReadingsBtn" style="flex: 1; background: #1e3c5c; color: white; border: none; padding: 12px; border-radius: 10px; cursor: pointer;">Enregistrer</button>
            <button id="closeReadingsBtn" style="flex: 1; background: #e74c3c; color: white; border: none; padding: 12px; border-radius: 10px; cursor: pointer;">Annuler</button>
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    document.getElementById('saveReadingsBtn').onclick = () => {
        const hba1c = document.getElementById('hba1cInput').value;
        const bp = document.getElementById('bpInput').value;
        const cholesterol = document.getElementById('cholesterolInput').value;
        const fastingSugar = document.getElementById('fastingSugarInput').value;
        
        const userData = JSON.parse(localStorage.getItem(`userData_${user.email}`) || '{}');
        
        if (hba1c) { userData.hba1c = hba1c; document.getElementById('hba1c').textContent = hba1c; }
        if (bp) { userData.bp = bp; document.getElementById('bp').textContent = bp; }
        if (cholesterol) { userData.cholesterol = cholesterol; document.getElementById('cholesterol').textContent = cholesterol; }
        if (fastingSugar) { userData.fastingSugar = fastingSugar; document.getElementById('fastingSugar').textContent = fastingSugar; }
        
        localStorage.setItem(`userData_${user.email}`, JSON.stringify(userData));
        overlay.remove();
        showCustomAlert('✅ Lectures mises à jour avec succès!', 'Succès');
    };
    
    document.getElementById('closeReadingsBtn').onclick = () => overlay.remove();
}

// 2. Calculateur BMI
function calculateBMI() {
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
        max-width: 400px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        border-top: 5px solid #e74c3c;
    `;
    
    modal.innerHTML = `
        <h3 style="color: #1e3c5c; margin-bottom: 1rem;">⚖️ Calculateur IMC</h3>
        <div style="margin: 1rem 0;">
            <label style="display: block; text-align: left; margin-bottom: 0.5rem;">Poids (kg):</label>
            <input type="number" id="bmiWeight" step="any" placeholder="Ex: 75" style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 10px;">
        </div>
        <div style="margin: 1rem 0;">
            <label style="display: block; text-align: left; margin-bottom: 0.5rem;">Taille (m):</label>
            <input type="number" id="bmiHeight" step="0.01" placeholder="Ex: 1.75" style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 10px;">
        </div>
        <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
            <button id="calcBmiBtn" style="flex: 1; background: #1e3c5c; color: white; border: none; padding: 12px; border-radius: 10px; cursor: pointer;">Calculer</button>
            <button id="closeBmiBtn" style="flex: 1; background: #e74c3c; color: white; border: none; padding: 12px; border-radius: 10px; cursor: pointer;">Fermer</button>
        </div>
        <div id="bmiResult" style="margin-top: 1rem; display: none;"></div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    document.getElementById('calcBmiBtn').onclick = () => {
        const weight = parseFloat(document.getElementById('bmiWeight').value);
        const height = parseFloat(document.getElementById('bmiHeight').value);
        const resultDiv = document.getElementById('bmiResult');
        
        if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
            resultDiv.innerHTML = '<p style="color: #dc2626;">❌ Veuillez entrer des valeurs valides</p>';
            resultDiv.style.display = 'block';
            return;
        }
        
        const bmi = weight / (height * height);
        let status = '';
        let statusColor = '';
        let advice = '';
        
        if (bmi < 18.5) {
            status = 'Insuffisance pondérale';
            statusColor = '#f59e0b';
            advice = '⚠️ Consultez un nutritionniste';
        } else if (bmi < 25) {
            status = 'Poids normal';
            statusColor = '#16a34a';
            advice = '✓ Excellent! Maintenez ce poids';
        } else if (bmi < 30) {
            status = 'Surpoids';
            statusColor = '#f59e0b';
            advice = '⚠️ Régime DASH recommandé';
        } else {
            status = 'Obésité';
            statusColor = '#dc2626';
            advice = '🚨 Consultez un médecin';
        }
        
        resultDiv.innerHTML = `
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 10px; margin-top: 1rem;">
                <p style="font-size: 1.2rem;">IMC = <strong style="font-size: 1.5rem; color: #1e3c5c;">${bmi.toFixed(1)}</strong></p>
                <p style="color: ${statusColor}; font-weight: bold;">Classification: ${status}</p>
                <p style="margin-top: 0.5rem;">${advice}</p>
            </div>
        `;
        resultDiv.style.display = 'block';
    };
    
    document.getElementById('closeBmiBtn').onclick = () => overlay.remove();
}

// 3. Rendez-vous
function loadAppointments() {
    const currentUser = localStorage.getItem('currentUser');
    const user = currentUser ? JSON.parse(currentUser) : { email: 'guest@example.com' };
    const appointments = JSON.parse(localStorage.getItem(`appointments_${user.email}`) || '[]');
    const list = document.getElementById('appointmentsList');
    
    if (appointments.length === 0) {
        if (list) list.innerHTML = '<li style="text-align: center; color: #999;">📅 Aucun rendez-vous enregistré</li>';
        return;
    }
    
    if (list) {
        list.innerHTML = '';
        appointments.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        appointments.forEach((app, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span style="font-weight: bold; color: #1e3c5c;">${app.date}</span>
                <span>${app.title}</span>
                <button onclick="deleteAppointment(${index})" style="background: #e74c3c; color: white; border: none; border-radius: 5px; padding: 3px 8px; cursor: pointer;">✗</button>
            `;
            list.appendChild(li);
        });
    }
}

function addAppointment() {
    const currentUser = localStorage.getItem('currentUser');
    const user = currentUser ? JSON.parse(currentUser) : { email: 'guest@example.com' };
    
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
        max-width: 400px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        border-top: 5px solid #e74c3c;
    `;
    
    modal.innerHTML = `
        <h3 style="color: #1e3c5c; margin-bottom: 1rem;">📅 Ajouter un rendez-vous</h3>
        <div style="margin: 1rem 0;">
            <label style="display: block; text-align: left; margin-bottom: 0.5rem;">Date:</label>
            <input type="date" id="appointmentDate" style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 10px;">
        </div>
        <div style="margin: 1rem 0;">
            <label style="display: block; text-align: left; margin-bottom: 0.5rem;">Type de rendez-vous:</label>
            <select id="appointmentType" style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 10px;">
                <option value="ECG cardiaque">ECG cardiaque</option>
                <option value="Bilan sanguin complet">Bilan sanguin complet</option>
                <option value="Consultation cardiologue">Consultation cardiologue</option>
                <option value="Contrôle diabète">Contrôle diabète</option>
                <option value="Consultation nutritionniste">Consultation nutritionniste</option>
            </select>
        </div>
        <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
            <button id="saveAppointmentBtn" style="flex: 1; background: #1e3c5c; color: white; border: none; padding: 12px; border-radius: 10px; cursor: pointer;">Enregistrer</button>
            <button id="closeAppointmentBtn" style="flex: 1; background: #e74c3c; color: white; border: none; padding: 12px; border-radius: 10px; cursor: pointer;">Annuler</button>
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    document.getElementById('saveAppointmentBtn').onclick = () => {
        const date = document.getElementById('appointmentDate').value;
        const title = document.getElementById('appointmentType').value;
        
        if (!date) {
            showCustomAlert('❌ Veuillez choisir une date', 'Erreur');
            return;
        }
        
        const appointments = JSON.parse(localStorage.getItem(`appointments_${user.email}`) || '[]');
        appointments.push({ date, title });
        localStorage.setItem(`appointments_${user.email}`, JSON.stringify(appointments));
        loadAppointments();
        overlay.remove();
        showCustomAlert('✅ Rendez-vous ajouté avec succès!', 'Succès');
    };
    
    document.getElementById('closeAppointmentBtn').onclick = () => overlay.remove();
}

function deleteAppointment(index) {
    const currentUser = localStorage.getItem('currentUser');
    const user = currentUser ? JSON.parse(currentUser) : { email: 'guest@example.com' };
    
    const confirmOverlay = document.createElement('div');
    confirmOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        backdrop-filter: blur(5px);
        z-index: 10001;
        display: flex;
        justify-content: center;
        align-items: center;
    `;
    
    const confirmModal = document.createElement('div');
    confirmModal.style.cssText = `
        background: white;
        border-radius: 20px;
        padding: 2rem;
        max-width: 350px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        border-top: 5px solid #e74c3c;
    `;
    
    confirmModal.innerHTML = `
        <h3 style="color: #1e3c5c;">🗑️ Confirmation</h3>
        <p style="margin: 1rem 0;">Êtes-vous sûr de vouloir supprimer ce rendez-vous?</p>
        <div style="display: flex; gap: 1rem; justify-content: center;">
            <button id="confirmDeleteBtn" style="background: #e74c3c; color: white; border: none; padding: 8px 20px; border-radius: 8px; cursor: pointer;">Oui, supprimer</button>
            <button id="cancelDeleteBtn" style="background: #64748b; color: white; border: none; padding: 8px 20px; border-radius: 8px; cursor: pointer;">Annuler</button>
        </div>
    `;
    
    confirmOverlay.appendChild(confirmModal);
    document.body.appendChild(confirmOverlay);
    
    document.getElementById('confirmDeleteBtn').onclick = () => {
        const appointments = JSON.parse(localStorage.getItem(`appointments_${user.email}`) || '[]');
        appointments.splice(index, 1);
        localStorage.setItem(`appointments_${user.email}`, JSON.stringify(appointments));
        loadAppointments();
        confirmOverlay.remove();
        showCustomAlert('✅ Rendez-vous supprimé', 'Succès');
    };
    
    document.getElementById('cancelDeleteBtn').onclick = () => confirmOverlay.remove();
}

// 4. Conseils quotidiens
const tips = [
    '🚶 Commencez votre journée par 30 minutes de marche',
    '💧 Buvez 8-10 verres d\'eau par jour',
    '🥗 Mangez des légumes verts riches en magnésium',
    '😴 Dormez 7-8 heures par nuit',
    '📊 Contrôlez régulièrement votre glycémie',
    '❤️ Mesurez votre tension chaque semaine',
    '🥑 L\'huile d\'olive est bonne pour le cœur',
    '🚫 Évitez les sodas et les sucres raffinés',
    '🐟 Mangez du poisson 2 fois par semaine',
    '🧘‍♂️ Pratiquez la respiration profonde'
];

function newTip() {
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    const tipElement = document.getElementById('dailyTip');
    if (tipElement) tipElement.innerHTML = randomTip;
}

// 5. Téléchargements
function telechargerGuide() {
    const content = `GUIDE DE LA CRISE CARDIAQUE SILENCIEUSE

Qu'est-ce qu'une crise cardiaque silencieuse?
Une crise cardiaque qui survient sans douleur thoracique classique.

Signes d'alerte:
✓ Fatigue soudaine intense
✓ Nausées ou indigestion
✓ Douleurs dans le dos ou la mâchoire
✓ Essoufflement

Que faire?
1. Appelez les secours (14)
2. Ne conduisez pas
3. Allongez-vous`;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'guide_cardiaque.txt';
    link.click();
    URL.revokeObjectURL(link.href);
    showCustomAlert('✅ Guide téléchargé', 'Téléchargement');
}

function telechargerCarte() {
    const content = `CARTE PATIENT - ABbeats

Nom: ................................
Type de diabète: ........................
Médicaments: ......................
Allergies: ............................
Urgence: 14 ou 997

⚠️ Patient diabétique - Risque de crise silencieuse`;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'carte_patient.txt';
    link.click();
    URL.revokeObjectURL(link.href);
    showCustomAlert('✅ Carte patient téléchargée', 'Téléchargement');
}

function telechargerAlimentation() {
    const content = `GUIDE NUTRITIONNEL

Régime DASH:
✓ 5-6 portions de légumes par jour
✓ 4-5 portions de fruits par jour
✓ Céréales complètes
✓ Produits laitiers allégés

Régime Méditerranéen:
✓ Huile d'olive
✓ Poisson 2x/semaine
✓ Fruits et légumes frais`;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'guide_alimentation.txt';
    link.click();
    URL.revokeObjectURL(link.href);
    showCustomAlert('✅ Guide nutritionnel téléchargé', 'Téléchargement');
}

// 6. Charger les données utilisateur
function loadUserData() {
    const currentUser = localStorage.getItem('currentUser');
    const user = currentUser ? JSON.parse(currentUser) : { email: 'guest@example.com' };
    const userData = JSON.parse(localStorage.getItem(`userData_${user.email}`) || '{}');
    
    const hba1cElement = document.getElementById('hba1c');
    const bpElement = document.getElementById('bp');
    const cholesterolElement = document.getElementById('cholesterol');
    const fastingSugarElement = document.getElementById('fastingSugar');
    const loginCountElement = document.getElementById('loginCount');
    const lastLoginElement = document.getElementById('lastLogin');
    const memberSinceElement = document.getElementById('memberSince');
    
    if (hba1cElement && userData.hba1c) hba1cElement.textContent = userData.hba1c;
    if (bpElement && userData.bp) bpElement.textContent = userData.bp;
    if (cholesterolElement && userData.cholesterol) cholesterolElement.textContent = userData.cholesterol;
    if (fastingSugarElement && userData.fastingSugar) fastingSugarElement.textContent = userData.fastingSugar;
    
    let loginCount = parseInt(localStorage.getItem(`loginCount_${user.email}`) || '0');
    if (loginCountElement) loginCountElement.textContent = loginCount;
    
    const lastLogin = localStorage.getItem(`lastLogin_${user.email}`);
    if (lastLoginElement && lastLogin) lastLoginElement.textContent = new Date(lastLogin).toLocaleDateString('fr-FR');
    
    const memberSince = localStorage.getItem(`memberSince_${user.email}`);
    if (memberSinceElement) {
        if (memberSince) {
            memberSinceElement.textContent = new Date(memberSince).toLocaleDateString('fr-FR');
        } else {
            const today = new Date().toISOString();
            localStorage.setItem(`memberSince_${user.email}`, today);
            memberSinceElement.textContent = new Date(today).toLocaleDateString('fr-FR');
        }
    }
}

// 7. Mettre à jour les statistiques de connexion
function updateLoginStats() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;
    
    const user = JSON.parse(currentUser);
    let loginCount = parseInt(localStorage.getItem(`loginCount_${user.email}`) || '0');
    loginCount++;
    localStorage.setItem(`loginCount_${user.email}`, loginCount);
    localStorage.setItem(`lastLogin_${user.email}`, new Date().toISOString());
}

// 8. Raccourcis clavier (Ctrl+U pour urgence)
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        emergencyAlert();
    }
});

// ============================================
// INITIALISATION
// ============================================

// Écouter les changements pour l'alerte intelligente
const douleurSelect = document.getElementById('douleurSelect');
const dyspneeSelect = document.getElementById('dyspneeSelect');
if (douleurSelect) douleurSelect.addEventListener('change', checkSmartAlert);
if (dyspneeSelect) dyspneeSelect.addEventListener('change', checkSmartAlert);

// Initialiser les fonctions
checkSmartAlert();
updateLoginStats();
loadUserData();
loadAppointments();
newTip();

// Rendre les fonctions globales pour les boutons HTML
window.deleteAppointment = deleteAppointment;
window.telechargerGuide = telechargerGuide;
window.telechargerCarte = telechargerCarte;
window.telechargerAlimentation = telechargerAlimentation;
window.updateReadings = updateReadings;
window.calculateBMI = calculateBMI;
window.addAppointment = addAppointment;
window.newTip = newTip;

// Lier les boutons aux fonctions
const updateReadingsBtn = document.getElementById('updateReadingsBtn');
if (updateReadingsBtn) updateReadingsBtn.addEventListener('click', updateReadings);

const bmiBtn = document.getElementById('bmiBtn');
if (bmiBtn) bmiBtn.addEventListener('click', calculateBMI);

const addAppointmentBtn = document.getElementById('addAppointmentBtn');
if (addAppointmentBtn) addAppointmentBtn.addEventListener('click', addAppointment);

const newTipBtn = document.getElementById('newTipBtn');
if (newTipBtn) newTipBtn.addEventListener('click', newTip);

const downloadBtns = document.querySelectorAll('.download-btn');
downloadBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const type = this.getAttribute('data-download');
        if (type === 'guide') telechargerGuide();
        else if (type === 'carte') telechargerCarte();
        else if (type === 'alimentation') telechargerAlimentation();
    });
});




/*if it didn't work delete this */

// ============================================
// دوال مساعدة لإنشاء النوافذ المنبثقة المخصصة (نفس الدوال في index.js)
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
        border-top: 5px solid #dc2626;
    `;
    
    modal.innerHTML = `
        <h3 style="color: #1a472a; margin-bottom: 1rem;">${title}</h3>
        <div style="margin: 1rem 0; text-align: right; line-height: 1.6; white-space: pre-line;">${message}</div>
        <button id="alertCloseBtn" style="background: linear-gradient(135deg, #dc2626, #2563eb); color: white; border: none; padding: 10px 30px; border-radius: 10px; cursor: pointer; margin-top: 1rem;">موافق</button>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    document.getElementById('alertCloseBtn').onclick = () => overlay.remove();
}

// نافذة إدخال مخصصة
function showCustomPrompt(title, placeholder, callback, isNumber = true) {
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
        max-width: 400px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        border-top: 5px solid #dc2626;
    `;
    
    modal.innerHTML = `
        <h3 style="color: #1a472a; margin-bottom: 1rem;">${title}</h3>
        <input type="${isNumber ? 'number' : 'text'}" id="promptInput" step="any" placeholder="${placeholder}" style="width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 10px; margin: 1rem 0; font-size: 1rem;">
        <div style="display: flex; gap: 1rem; justify-content: center;">
            <button id="promptConfirmBtn" style="background: #1a472a; color: white; border: none; padding: 10px 25px; border-radius: 10px; cursor: pointer;">تأكيد</button>
            <button id="promptCancelBtn" style="background: #dc2626; color: white; border: none; padding: 10px 25px; border-radius: 10px; cursor: pointer;">إلغاء</button>
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    document.getElementById('promptConfirmBtn').onclick = () => {
        const value = document.getElementById('promptInput').value;
        overlay.remove();
        if (value && callback) callback(value);
    };
    
    document.getElementById('promptCancelBtn').onclick = () => overlay.remove();
}

// ============================================
// التحقق من تسجيل الدخول
// ============================================
const currentUser = localStorage.getItem('currentUser');
if (!currentUser) {
    window.location.href = '../Signup/login.html';
}

const user = JSON.parse(currentUser);
if (user.type === 'admin') {
    window.location.href = '../admin/admin.html';
}

document.getElementById('userName').textContent = user.name;

// ============================================
// تسجيل الخروج
// ============================================
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = '../index.html';
});

// ============================================
// اختبار الخطر (بنعم/لا)
// ============================================
let riskScore = 0;
let riskAnswers = [];
let currentRiskQuestion = 0;

const riskQuestions = [
    { text: "هل عمرك بين 40 و 50 سنة؟", field: "العمر", yesScore: 1, noScore: 0 },
    { text: "هل لديك تاريخ عائلي لأمراض القلب؟", field: "تاريخ عائلي", yesScore: 1, noScore: 0 },
    { text: "هل تعاني من ارتفاع ضغط الدم؟", field: "ضغط الدم", yesScore: 1, noScore: 0 },
    { text: "هل تعاني من مرض السكري؟", field: "ضغط الدم", yesScore: 1, noScore: 0 },
    { text: "هل تدخن؟", field: "التدخين", yesScore: 1, noScore: 0 },
    { text: "هل تعاني من السمنة أو الوزن الزائد؟", field: "الوزن", yesScore: 1, noScore: 0 },
    { text: "هل تمارس الرياضة بانتظام (30 دقيقة يومياً على الأقل 3 أيام أسبوعياً)؟", field: "الرياضة", yesScore: 0, noScore: 1 }
];

function showRiskQuestion() {
    if (currentRiskQuestion >= riskQuestions.length) {
        showRiskResult();
        return;
    }
    
    const q = riskQuestions[currentRiskQuestion];
    
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
        max-width: 500px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        border-top: 5px solid #dc2626;
    `;
    
    modal.innerHTML = `
        <div style="background: #f0fdf4; padding: 0.5rem 1rem; border-radius: 15px; margin-bottom: 1rem;">
            <p style="font-size: 0.9rem; color: #1a472a;">السؤال ${currentRiskQuestion + 1} من ${riskQuestions.length}</p>
            <progress value="${currentRiskQuestion + 1}" max="${riskQuestions.length}" style="width: 100%; height: 8px; border-radius: 10px;"></progress>
        </div>
        <h3 style="color: #1a472a; margin-bottom: 1.5rem;">📋 اختبار خطر أمراض القلب</h3>
        <p style="font-size: 1.1rem; margin-bottom: 2rem; line-height: 1.6;">${q.text}</p>
        <div style="display: flex; gap: 1rem; justify-content: center;">
            <button id="riskYesBtn" style="background: #1a472a; color: white; border: none; padding: 12px 30px; border-radius: 10px; cursor: pointer; font-weight: bold;">✅ نعم</button>
            <button id="riskNoBtn" style="background: #dc2626; color: white; border: none; padding: 12px 30px; border-radius: 10px; cursor: pointer; font-weight: bold;">❌ لا</button>
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    document.getElementById('riskYesBtn').onclick = () => {
        riskScore += q.yesScore;
        riskAnswers.push(`✓ ${q.field}: نعم`);
        overlay.remove();
        currentRiskQuestion++;
        showRiskQuestion();
    };
    
    document.getElementById('riskNoBtn').onclick = () => {
        riskScore += q.noScore;
        riskAnswers.push(`✗ ${q.field}: لا`);
        overlay.remove();
        currentRiskQuestion++;
        showRiskQuestion();
    };
}

function showRiskResult() {
    let resultText = '';
    let resultColor = '';
    let recommendations = '';
    
    if (riskScore >= 4) {
        resultText = 'خطر مرتفع جداً';
        resultColor = '#dc2626';
        recommendations = `
            <div style="background: #fee2e2; padding: 1rem; border-radius: 10px; margin-top: 1rem; text-align: right;">
                <p style="font-weight: bold; color: #b91c1c;">⚠️ توصيات عاجلة:</p>
                <ul style="margin-right: 1.5rem; margin-top: 0.5rem;">
                    <li>✓ راجع طبيب القلب فوراً</li>
                    <li>✓ أجرِ فحوصات شاملة (ECG, ECHO)</li>
                    <li>✓ ابدأ بتغيير نمط الحياة فوراً</li>
                </ul>
            </div>
        `;
    } else if (riskScore >= 2) {
        resultText = 'خطر متوسط';
        resultColor = '#f59e0b';
        recommendations = `
            <div style="background: #fef3c7; padding: 1rem; border-radius: 10px; margin-top: 1rem; text-align: right;">
                <p style="font-weight: bold; color: #b45309;">⚠️ توصيات:</p>
                <ul style="margin-right: 1.5rem; margin-top: 0.5rem;">
                    <li>✓ استشر طبيبك في أقرب وقت</li>
                    <li>✓ اتبع نظام DASH الغذائي</li>
                    <li>✓ مارس الرياضة 30 دقيقة يومياً</li>
                </ul>
            </div>
        `;
    } else {
        resultText = 'خطر منخفض';
        resultColor = '#16a34a';
        recommendations = `
            <div style="background: #dcfce7; padding: 1rem; border-radius: 10px; margin-top: 1rem; text-align: right;">
                <p style="font-weight: bold; color: #166534;">✓ أحسنت! استمر في نمط الحياة الصحي:</p>
                <ul style="margin-right: 1.5rem; margin-top: 0.5rem;">
                    <li>✓ حافظ على نظامك الغذائي الصحي</li>
                    <li>✓ استمر في ممارسة الرياضة</li>
                    <li>✓ قم بفحص دوري كل 6 شهور</li>
                </ul>
            </div>
        `;
    }
    
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
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        border-top: 5px solid #dc2626;
    `;
    
    modal.innerHTML = `
        <h3 style="color: #1a472a; margin-bottom: 1rem;">📊 نتيجة اختبار الخطر</h3>
        <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 15px; margin: 1rem 0;">
            <p style="font-size: 1.1rem;">نقاط الخطر: <strong style="font-size: 1.5rem; color: ${resultColor};">${riskScore}</strong> / ${riskQuestions.length}</p>
            <div style="height: 10px; background: #e0e0e0; border-radius: 5px; margin: 1rem 0;">
                <div style="width: ${(riskScore/riskQuestions.length)*100}%; height: 100%; background: ${resultColor}; border-radius: 5px;"></div>
            </div>
            <p style="font-size: 1.2rem; font-weight: bold; color: ${resultColor};">مستوى الخطر: ${resultText}</p>
            ${recommendations}
        </div>
        <details style="margin: 1rem 0; text-align: right;">
            <summary style="cursor: pointer; color: #1a472a; font-weight: bold;">📋 تفاصيل الإجابات</summary>
            <div style="margin-top: 0.5rem; padding: 0.5rem;">
                ${riskAnswers.map(a => `<p style="margin: 0.3rem 0;">${a}</p>`).join('')}
            </div>
        </details>
        <button id="closeRiskBtn" style="background: linear-gradient(135deg, #dc2626, #2563eb); color: white; border: none; padding: 12px 30px; border-radius: 10px; cursor: pointer; margin-top: 1rem;">إغلاق</button>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    document.getElementById('closeRiskBtn').onclick = () => {
        overlay.remove();
        // حفظ النتيجة
        const results = JSON.parse(localStorage.getItem(`testResults_${user.email}`) || '[]');
        results.push({ date: new Date().toISOString(), score: riskScore });
        localStorage.setItem(`testResults_${user.email}`, JSON.stringify(results));
        
        riskScore = 0;
        riskAnswers = [];
        currentRiskQuestion = 0;
    };
}

// ============================================
// حاسبة BMI (بنافذة مخصصة)
// ============================================
function calculateBMI() {
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
        max-width: 400px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        border-top: 5px solid #dc2626;
    `;
    
    modal.innerHTML = `
        <h3 style="color: #1a472a; margin-bottom: 1rem;">⚖️ حاسبة مؤشر كتلة الجسم BMI</h3>
        <div style="margin: 1rem 0;">
            <label style="display: block; text-align: right; margin-bottom: 0.5rem;">الوزن (كيلوغرام):</label>
            <input type="number" id="bmiWeight" step="any" placeholder="مثال: 75" style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 10px;">
        </div>
        <div style="margin: 1rem 0;">
            <label style="display: block; text-align: right; margin-bottom: 0.5rem;">الطول (متر):</label>
            <input type="number" id="bmiHeight" step="0.01" placeholder="مثال: 1.75" style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 10px;">
        </div>
        <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
            <button id="calcBmiBtn" style="flex: 1; background: #1a472a; color: white; border: none; padding: 12px; border-radius: 10px; cursor: pointer;">احسب</button>
            <button id="closeBmiBtn" style="flex: 1; background: #dc2626; color: white; border: none; padding: 12px; border-radius: 10px; cursor: pointer;">إغلاق</button>
        </div>
        <div id="bmiResult" style="margin-top: 1rem; display: none;"></div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    document.getElementById('calcBmiBtn').onclick = () => {
        const weight = parseFloat(document.getElementById('bmiWeight').value);
        const height = parseFloat(document.getElementById('bmiHeight').value);
        const resultDiv = document.getElementById('bmiResult');
        
        if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
            resultDiv.innerHTML = '<p style="color: #dc2626;">❌ الرجاء إدخال قيم صحيحة</p>';
            resultDiv.style.display = 'block';
            return;
        }
        
        const bmi = weight / (height * height);
        let status = '';
        let statusColor = '';
        let advice = '';
        
        if (bmi < 18.5) {
            status = 'نقص وزن';
            statusColor = '#f59e0b';
            advice = '⚠️ ننصح بزيارة أخصائي تغذية لزيادة الوزن الصحي';
        } else if (bmi < 25) {
            status = 'وزن طبيعي';
            statusColor = '#16a34a';
            advice = '✓ ممتاز! حافظ على وزنك الصحي';
        } else if (bmi < 30) {
            status = 'وزن زائد';
            statusColor = '#f59e0b';
            advice = '⚠️ ننصح باتباع نظام DASH الغذائي وممارسة الرياضة';
        } else if (bmi < 35) {
            status = 'سمنة درجة 1';
            statusColor = '#dc2626';
            advice = '⚠️⚠️ يرجى استشارة طبيب لبرنامج إنقاص وزن';
        } else {
            status = 'سمنة مفرطة';
            statusColor = '#dc2626';
            advice = '🚨 خطر مرتفع - ننصح بمراجعة طبيب فوراً';
        }
        
        resultDiv.innerHTML = `
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 10px; margin-top: 1rem;">
                <p style="font-size: 1.2rem;">BMI = <strong style="font-size: 1.5rem; color: #1a472a;">${bmi.toFixed(1)}</strong></p>
                <p style="color: ${statusColor}; font-weight: bold;">التصنيف: ${status}</p>
                <p style="margin-top: 0.5rem;">${advice}</p>
            </div>
        `;
        resultDiv.style.display = 'block';
        localStorage.setItem(`lastBMI_${user.email}`, bmi.toFixed(1));
    };
    
    document.getElementById('closeBmiBtn').onclick = () => overlay.remove();
}

// ============================================
// تحديث القراءات الطبية (بنافذة مخصصة)
// ============================================
function updateReadings() {
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
        border-top: 5px solid #dc2626;
    `;
    
    modal.innerHTML = `
        <h3 style="color: #1a472a; margin-bottom: 1rem;">📊 تحديث القراءات الطبية</h3>
        <div style="margin: 1rem 0;">
            <label style="display: block; text-align: right; margin-bottom: 0.5rem;">السكري التراكمي HBA1c (%) - الهدف &lt;7%</label>
            <input type="number" id="hba1cInput" step="0.1" placeholder="مثال: 6.5" style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 10px;">
        </div>
        <div style="margin: 1rem 0;">
            <label style="display: block; text-align: right; margin-bottom: 0.5rem;">ضغط الدم (mmHg) - الهدف &lt;130</label>
            <input type="text" id="bpInput" placeholder="مثال: 120/80" style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 10px;">
        </div>
        <div style="margin: 1rem 0;">
            <label style="display: block; text-align: right; margin-bottom: 0.5rem;">الكوليسترول LDL (mg/dL) - الهدف &lt;100</label>
            <input type="number" id="cholesterolInput" placeholder="مثال: 95" style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 10px;">
        </div>
        <div style="margin: 1rem 0;">
            <label style="display: block; text-align: right; margin-bottom: 0.5rem;">سكر الصائم (mg/dL) - الهدف 80-130</label>
            <input type="number" id="fastingSugarInput" placeholder="مثال: 110" style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 10px;">
        </div>
        <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
            <button id="saveReadingsBtn" style="flex: 1; background: #1a472a; color: white; border: none; padding: 12px; border-radius: 10px; cursor: pointer;">حفظ</button>
            <button id="closeReadingsBtn" style="flex: 1; background: #dc2626; color: white; border: none; padding: 12px; border-radius: 10px; cursor: pointer;">إلغاء</button>
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    document.getElementById('saveReadingsBtn').onclick = () => {
        const hba1c = document.getElementById('hba1cInput').value;
        const bp = document.getElementById('bpInput').value;
        const cholesterol = document.getElementById('cholesterolInput').value;
        const fastingSugar = document.getElementById('fastingSugarInput').value;
        
        const userData = JSON.parse(localStorage.getItem(`userData_${user.email}`) || '{}');
        
        if (hba1c) { userData.hba1c = hba1c; document.getElementById('hba1c').textContent = hba1c; }
        if (bp) { userData.bp = bp; document.getElementById('bp').textContent = bp; }
        if (cholesterol) { userData.cholesterol = cholesterol; document.getElementById('cholesterol').textContent = cholesterol; }
        if (fastingSugar) { userData.fastingSugar = fastingSugar; document.getElementById('fastingSugar').textContent = fastingSugar; }
        
        localStorage.setItem(`userData_${user.email}`, JSON.stringify(userData));
        overlay.remove();
        showCustomAlert('✅ تم تحديث القراءات بنجاح!', 'تم التحديث');
    };
    
    document.getElementById('closeReadingsBtn').onclick = () => overlay.remove();
}

// ============================================
// إضافة موعد (بنافذة مخصصة)
// ============================================
function addAppointment() {
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
        max-width: 400px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        border-top: 5px solid #dc2626;
    `;
    
    modal.innerHTML = `
        <h3 style="color: #1a472a; margin-bottom: 1rem;">📅 إضافة موعد جديد</h3>
        <div style="margin: 1rem 0;">
            <label style="display: block; text-align: right; margin-bottom: 0.5rem;">تاريخ الموعد:</label>
            <input type="date" id="appointmentDate" style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 10px;">
        </div>
        <div style="margin: 1rem 0;">
            <label style="display: block; text-align: right; margin-bottom: 0.5rem;">نوع الموعد:</label>
            <select id="appointmentType" style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 10px;">
                <option value="فحص قلب ECG">فحص قلب ECG</option>
                <option value="تحليل دم شامل">تحليل دم شامل</option>
                <option value="موعد مع طبيب القلب">موعد مع طبيب القلب</option>
                <option value="فحص السكري التراكمي">فحص السكري التراكمي</option>
                <option value="موعد مع أخصائي تغذية">موعد مع أخصائي تغذية</option>
            </select>
        </div>
        <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
            <button id="saveAppointmentBtn" style="flex: 1; background: #1a472a; color: white; border: none; padding: 12px; border-radius: 10px; cursor: pointer;">حفظ</button>
            <button id="closeAppointmentBtn" style="flex: 1; background: #dc2626; color: white; border: none; padding: 12px; border-radius: 10px; cursor: pointer;">إلغاء</button>
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    document.getElementById('saveAppointmentBtn').onclick = () => {
        const date = document.getElementById('appointmentDate').value;
        const title = document.getElementById('appointmentType').value;
        
        if (!date) {
            showCustomAlert('❌ الرجاء اختيار تاريخ', 'خطأ');
            return;
        }
        
        const appointments = JSON.parse(localStorage.getItem(`appointments_${user.email}`) || '[]');
        appointments.push({ date, title });
        localStorage.setItem(`appointments_${user.email}`, JSON.stringify(appointments));
        loadAppointments();
        overlay.remove();
        showCustomAlert('✅ تم إضافة الموعد بنجاح!', 'تم الحفظ');
    };
    
    document.getElementById('closeAppointmentBtn').onclick = () => overlay.remove();
}

// ============================================
// تحميل المواعيد
// ============================================
function loadAppointments() {
    const appointments = JSON.parse(localStorage.getItem(`appointments_${user.email}`) || '[]');
    const list = document.getElementById('appointmentsList');
    
    if (appointments.length === 0) {
        list.innerHTML = '<li style="text-align: center; color: #999;">📅 لا توجد مواعيد مسجلة</li>';
        return;
    }
    
    list.innerHTML = '';
    appointments.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    appointments.forEach((app, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span style="font-weight: bold; color: #1a472a;">${app.date}</span>
            <span>${app.title}</span>
            <button onclick="deleteAppointment(${index})" style="background: #dc2626; color: white; border: none; border-radius: 5px; padding: 3px 8px; cursor: pointer;">✗</button>
        `;
        list.appendChild(li);
    });
}

function deleteAppointment(index) {
    const confirmOverlay = document.createElement('div');
    confirmOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        backdrop-filter: blur(5px);
        z-index: 10001;
        display: flex;
        justify-content: center;
        align-items: center;
    `;
    
    const confirmModal = document.createElement('div');
    confirmModal.style.cssText = `
        background: white;
        border-radius: 20px;
        padding: 2rem;
        max-width: 350px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        border-top: 5px solid #dc2626;
    `;
    
    confirmModal.innerHTML = `
        <h3 style="color: #1a472a; margin-bottom: 1rem;">🗑️ تأكيد الحذف</h3>
        <p style="margin-bottom: 1.5rem;">هل أنت متأكد من حذف هذا الموعد؟</p>
        <div style="display: flex; gap: 1rem; justify-content: center;">
            <button id="confirmDeleteBtn" style="background: #dc2626; color: white; border: none; padding: 8px 20px; border-radius: 8px; cursor: pointer;">نعم، احذف</button>
            <button id="cancelDeleteBtn" style="background: #64748b; color: white; border: none; padding: 8px 20px; border-radius: 8px; cursor: pointer;">إلغاء</button>
        </div>
    `;
    
    confirmOverlay.appendChild(confirmModal);
    document.body.appendChild(confirmOverlay);
    
    document.getElementById('confirmDeleteBtn').onclick = () => {
        const appointments = JSON.parse(localStorage.getItem(`appointments_${user.email}`) || '[]');
        appointments.splice(index, 1);
        localStorage.setItem(`appointments_${user.email}`, JSON.stringify(appointments));
        loadAppointments();
        confirmOverlay.remove();
        showCustomAlert('✅ تم حذف الموعد', 'تم الحذف');
    };
    
    document.getElementById('cancelDeleteBtn').onclick = () => confirmOverlay.remove();
}

// ============================================
// النصائح اليومية
// ============================================
const tips = [
    '🚶 ابدأ يومك بـ 30 دقيقة مشي - المشي يحسن الدورة الدموية ويخفض السكر',
    '💧 اشرب 8-10 أكواب ماء يومياً - الترطيب الجيد يساعد الكلى',
    '🥗 تناول الخضروات الورقية الداكنة - غنية بالمغنيسيوم المفيد للقلب',
    '😴 نام 7-8 ساعات يومياً - قلة النوم تزيد مقاومة الأنسولين',
    '📊 راجع سكري الدم بانتظام - المعرفة قوة في التحكم بالسكري',
    '❤️ قياس ضغط الدم أسبوعياً مهم جداً - ارتفاع الضغط قاتل صامت',
    '🥑 زيت الزيتون بديل صحي للدهون - غني بمضادات الأكسدة',
    '🚫 ابتعد عن المشروبات الغازية والسكرية - تسبب ارتفاع مفاجئ في السكر',
    '🐟 تناول السمك مرتين أسبوعياً - غني بأوميغا 3 المفيد للقلب',
    '🧘‍♂️ ممارسة التأمل والتنفس العميق - تقلل التوتر وضغط الدم'
];

function newTip() {
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    document.getElementById('dailyTip').innerHTML = randomTip;
}

// ============================================
// تحميل الملفات
// ============================================
function telechargerGuide() {
    const content = `دليل التعرف على الأزمة القلبية الصامتة...`;
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'guide.txt';
    link.click();
    showCustomAlert('✅ تم تحميل الدليل', 'تم التحميل');
}

// ============================================
// تحميل البيانات المحفوظة
// ============================================
function loadUserData() {
    const userData = JSON.parse(localStorage.getItem(`userData_${user.email}`) || '{}');
    if (userData.hba1c) document.getElementById('hba1c').textContent = userData.hba1c;
    if (userData.bp) document.getElementById('bp').textContent = userData.bp;
    if (userData.cholesterol) document.getElementById('cholesterol').textContent = userData.cholesterol;
    if (userData.fastingSugar) document.getElementById('fastingSugar').textContent = userData.fastingSugar;
    
    let loginCount = parseInt(localStorage.getItem(`loginCount_${user.email}`) || '0');
    document.getElementById('loginCount').textContent = loginCount;
    
    const lastLogin = localStorage.getItem(`lastLogin_${user.email}`);
    if (lastLogin) document.getElementById('lastLogin').textContent = new Date(lastLogin).toLocaleDateString('ar');
    
    const memberSince = localStorage.getItem(`memberSince_${user.email}`);
    if (memberSince) document.getElementById('memberSince').textContent = new Date(memberSince).toLocaleDateString('ar');
    else {
        const today = new Date().toISOString();
        localStorage.setItem(`memberSince_${user.email}`, today);
        document.getElementById('memberSince').textContent = new Date(today).toLocaleDateString('ar');
    }
}

// ============================================
// تحديث إحصائيات تسجيل الدخول
// ============================================
function updateLoginStats() {
    let loginCount = parseInt(localStorage.getItem(`loginCount_${user.email}`) || '0');
    loginCount++;
    localStorage.setItem(`loginCount_${user.email}`, loginCount);
    localStorage.setItem(`lastLogin_${user.email}`, new Date().toISOString());
}

// ============================================
// ربط الأحداث
// ============================================
document.getElementById('riskTestBtn').addEventListener('click', () => {
    riskScore = 0;
    riskAnswers = [];
    currentRiskQuestion = 0;
    showRiskQuestion();
});
document.getElementById('bmiBtn').addEventListener('click', calculateBMI);
document.getElementById('updateReadingsBtn').addEventListener('click', updateReadings);
document.getElementById('addAppointmentBtn').addEventListener('click', addAppointment);
document.getElementById('newTipBtn').addEventListener('click', newTip);

document.querySelectorAll('.download-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        telechargerGuide();
    });
});

// ============================================
// تهيئة الصفحة
// ============================================
updateLoginStats();
loadUserData();
loadAppointments();
newTip();

window.deleteAppointment = deleteAppointment;


