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
