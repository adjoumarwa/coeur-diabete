// ============================================
// نظام الترجمة الديناميكي المركزي
// ============================================

// تعريف جميع الترجمات في مكان واحد
const translations = {
  ar: {
    // معلومات اللغة
    langName: 'العربية',
    langCode: 'ar',
    dir: 'rtl',
    
    // Header
    logo: 'قلب السكري',
    nav_home: 'الرئيسية',
    nav_comprendre: 'افهم مرضك',
    nav_signes: 'علامات الخطر',
    nav_prevention: 'الوقاية',
    nav_outils: 'أدوات تفاعلية',
    nav_telechargements: 'تحميلات',
    login: 'دخول',
    register: 'تسجيل',
    
    // Hero
    hero_title: '❤️ قلب السكري',
    hero_subtitle: 'اعرف قلبك.. تحكم بسكريك',
    emergency_btn: '🚨 زر الطوارئ: ماذا أفعل عند ظهور أعراض؟',
    
    // Comprendre
    comprendre_title: '📘 افهم مرضك (Comprendre le risque)',
    comprendre_text1: 'العلاقة بين السكري وأمراض القلب: السكري يرفع نسبة السكر في الدم مما يؤدي إلى تلف الأوعية الدموية وتصلب الشرايين.',
    comprendre_text2: 'لماذا الخطر أكبر عند مريض السكري؟ ارتفاع السكر المزمن يزيد الالتهابات ويضعف جدران الأوعية الدموية، ويسرع من تصلب الشرايين.',
    comprendre_text3: 'مفهوم "الجلطة الصامتة": عند مريض السكري، قد تحدث نوبة قلبية دون ألم صدر، فقط تعب شديد أو غثيان أو عسر هضم.',
    
    // Signes
    signes_title: '⚠️ علامات الخطر (Signes d\'alerte)',
    classic_title: '📍 الأعراض الكلاسيكية',
    classic_1: 'ألم أو ضغط في منتصف الصدر',
    classic_2: 'ضيق في التنفس',
    classic_3: 'تعرق بارد وغزير',
    classic_4: 'دوار أو إغماء',
    atypical_title: '⚠️ الأعراض غير النمطية (الأكثر شيوعاً عند مرضى السكري)',
    atypical_1: 'تعب مفاجئ شديد غير مبرر',
    atypical_2: 'غثيان أو عسر هضم أو حرقة معدة',
    atypical_3: 'آلام في الظهر بين الكتفين',
    atypical_4: 'آلام في الفك أو الرقبة',
    
    // Prevention
    prevention_title: '🥗 ركن الوقاية (Conseils Préventifs)',
    prevention_text1: '🥗 التغذية: نظام DASH أو البحر الأبيض المتوسط - إكثار من الخضروات والفواكه والحبوب الكاملة، زيت الزيتون، الأسماك الدهنية، وتقليل الملح والسكريات.',
    prevention_text2: '🏃 النشاط البدني: مشي 30 دقيقة يومياً، تمارين مقاومة خفيفة مرتين في الأسبوع، تمارين المرونة والتوازن.',
    prevention_text3: '📊 متابعة الأرقام:',
    table_measure: 'القياس',
    table_target: 'الهدف الموصى به',
    table_when: 'متى أقيسه؟',
    table_bp: 'ضغط الدم الانقباضي',
    table_bp_target: '< 130 مم زئبق',
    table_bp_when: 'يومياً',
    table_hba1c: 'السكري التراكمي HBA1c',
    table_hba1c_target: '< 7%',
    table_hba1c_when: 'كل 3 شهور',
    table_ldl: 'الكوليسترول الضار LDL',
    table_ldl_target: '< 100 mg/dL',
    table_ldl_when: 'كل 6 شهور',
    table_sugar: 'سكر الصائم',
    table_sugar_target: '80-130 mg/dL',
    table_sugar_when: 'يومياً',
    
    // Outils
    outils_title: '🛠️ أدوات تفاعلية (Outils)',
    test_title: 'اختبار سريع',
    test_subtitle: 'هل أنت في خطر؟',
    bmi_title: 'حاسبة BMI',
    bmi_subtitle: 'احسب وزنك المثالي',
    calendar_title: 'مفكرة المواعيد',
    calendar_subtitle: 'تذكير بفحص القلب',
    save_btn: 'حفظ التذكير',
    
    // Downloads
    downloads_title: '📥 قسم التحميل (Téléchargements)',
    guide_title: 'دليل التعرف على الأزمة القلبية الصامتة',
    guide_text: 'PDF قابل للطباعة',
    carte_title: 'بطاقة المريض',
    carte_text: 'احملها معك في محفظتك',
    alim_title: 'دليل التغذية لمرضى السكري والقلب',
    alim_text: 'نظام DASH + المتوسطي',
    
    // Footer
    footer_text: '© 2025 قلب السكري - موقع توعوي لمرضى السكري وأمراض القلب',
    footer_emergency: 'في حالة الطوارئ، اتصل بالإسعاف فوراً: 14 أو 997',
    
    // Emergency Alert
    emergency_alert: '🚨 في حالة ظهور أي من علامات الخطر:\n\n1️⃣ اتصل بالإسعاف فوراً (14 أو 997)\n2️⃣ لا تقود السيارة بنفسك\n3️⃣ اجلس في وضع مريح\n4️⃣ أخبر المسعفين أنك مريض سكري',
    
    // Risk Test Questions
    risk_q1: 'هل عمرك أكثر من 45 سنة؟',
    risk_q2: 'هل لديك تاريخ عائلي لأمراض القلب؟',
    risk_q3: 'هل تعاني من ارتفاع ضغط الدم؟',
    risk_q4: 'هل تدخن؟',
    risk_q5: 'هل تعاني من السمنة أو الوزن الزائد؟',
    risk_q6: 'هل تمارس الرياضة بانتظام (30 دقيقة يومياً)؟',
    
    // BMI
    bmi_weight: 'أدخل وزنك بالكيلوغرام:',
    bmi_height: 'أدخل طولك بالمتر (مثال: 1.75):',
    
    // Alerts
    alert_success: '✅ تم الحفظ بنجاح',
    alert_error: '❌ حدث خطأ',
    alert_date_required: '❌ الرجاء اختيار تاريخ'
  },
  
  fr: {
    // Informations de langue
    langName: 'Français',
    langCode: 'fr',
    dir: 'ltr',
    
    // Header
    logo: 'Cœur et Diabète',
    nav_home: 'Accueil',
    nav_comprendre: 'Comprendre',
    nav_signes: 'Signes',
    nav_prevention: 'Prévention',
    nav_outils: 'Outils',
    nav_telechargements: 'Téléchargements',
    login: 'Connexion',
    register: 'Inscription',
    
    // Hero
    hero_title: '❤️ Cœur et Diabète',
    hero_subtitle: 'Connaissez votre cœur.. Contrôlez votre diabète',
    emergency_btn: '🚨 Urgence: Que faire en cas de symptômes?',
    
    // Comprendre
    comprendre_title: '📘 Comprendre votre maladie (Comprendre le risque)',
    comprendre_text1: 'Relation entre diabète et maladies cardiaques: Le diabète augmente le taux de sucre dans le sang, ce qui endommage les vaisseaux sanguins et accélère l\'athérosclérose.',
    comprendre_text2: 'Pourquoi le risque est-il plus élevé chez le diabétique? L\'hyperglycémie chronique augmente l\'inflammation et affaiblit les parois des vaisseaux sanguins.',
    comprendre_text3: 'Concept de "crise silencieuse": Chez le diabétique, une crise cardiaque peut survenir sans douleur thoracique, seulement une fatigue intense, des nausées ou des indigestions.',
    
    // Signes
    signes_title: '⚠️ Signes d\'alerte (Signes d\'alerte)',
    classic_title: '📍 Symptômes classiques',
    classic_1: 'Douleur ou pression dans la poitrine',
    classic_2: 'Essoufflement',
    classic_3: 'Sueurs froides et abondantes',
    classic_4: 'Vertiges ou évanouissement',
    atypical_title: '⚠️ Symptômes atypiques (plus fréquents chez les diabétiques)',
    atypical_1: 'Fatigue soudaine et intense inexpliquée',
    atypical_2: 'Nausées, indigestion ou brûlures d\'estomac',
    atypical_3: 'Douleurs dans le dos entre les omoplates',
    atypical_4: 'Douleurs à la mâchoire ou au cou',
    
    // Prevention
    prevention_title: '🥗 Conseils Préventifs (Conseils Préventifs)',
    prevention_text1: '🥗 Alimentation: Régime DASH ou méditerranéen - Légumes, fruits, céréales complètes, huile d\'olive, poissons gras, réduction du sel et des sucres.',
    prevention_text2: '🏃 Activité physique: Marche 30 minutes par jour, exercices de résistance légers deux fois par semaine.',
    prevention_text3: '📊 Suivi des chiffres:',
    table_measure: 'Mesure',
    table_target: 'Objectif recommandé',
    table_when: 'Quand mesurer?',
    table_bp: 'Tension artérielle systolique',
    table_bp_target: '< 130 mmHg',
    table_bp_when: 'Quotidien',
    table_hba1c: 'HBA1c (diabète)',
    table_hba1c_target: '< 7%',
    table_hba1c_when: 'Tous les 3 mois',
    table_ldl: 'Cholestérol LDL',
    table_ldl_target: '< 100 mg/dL',
    table_ldl_when: 'Tous les 6 mois',
    table_sugar: 'Glycémie à jeun',
    table_sugar_target: '80-130 mg/dL',
    table_sugar_when: 'Quotidien',
    
    // Outils
    outils_title: '🛠️ Outils interactifs (Outils)',
    test_title: 'Test rapide',
    test_subtitle: 'Êtes-vous à risque?',
    bmi_title: 'Calculateur IMC',
    bmi_subtitle: 'Calculez votre poids idéal',
    calendar_title: 'Agenda',
    calendar_subtitle: 'Rappel examen cardiaque',
    save_btn: 'Enregistrer le rappel',
    
    // Downloads
    downloads_title: '📥 Téléchargements (Téléchargements)',
    guide_title: 'Guide de la crise cardiaque silencieuse',
    guide_text: 'PDF imprimable',
    carte_title: 'Carte patient',
    carte_text: 'Portez-la dans votre portefeuille',
    alim_title: 'Guide nutritionnel pour diabétiques et cardiaques',
    alim_text: 'Régime DASH + Méditerranéen',
    
    // Footer
    footer_text: '© 2025 Cœur et Diabète - Site éducatif sur le diabète et les maladies cardiaques',
    footer_emergency: 'En cas d\'urgence, appelez les secours: 14 ou 997',
    
    // Emergency Alert
    emergency_alert: '🚨 En cas de symptômes:\n\n1️⃣ Appelez les secours immédiatement (14 ou 997)\n2️⃣ Ne conduisez pas vous-même\n3️⃣ Asseyez-vous dans une position confortable\n4️⃣ Informez les secouristes que vous êtes diabétique',
    
    // Risk Test Questions
    risk_q1: 'Avez-vous plus de 45 ans?',
    risk_q2: 'Avez-vous des antécédents familiaux de maladie cardiaque?',
    risk_q3: 'Souffrez-vous d\'hypertension artérielle?',
    risk_q4: 'Fumez-vous?',
    risk_q5: 'Souffrez-vous d\'obésité ou de surpoids?',
    risk_q6: 'Faites-vous de l\'exercice régulièrement (30 minutes par jour)?',
    
    // BMI
    bmi_weight: 'Entrez votre poids en kilogrammes:',
    bmi_height: 'Entrez votre taille en mètres (ex: 1.75):',
    
    // Alerts
    alert_success: '✅ Enregistré avec succès',
    alert_error: '❌ Erreur',
    alert_date_required: '❌ Veuillez choisir une date'
  }
};

// اللغة الحالية
let currentLang = localStorage.getItem('language') || 'ar';

// عناصر تحتاج ترجمة (معرفاتها)
const translatableElements = [
  'logo', 'nav_home', 'nav_comprendre', 'nav_signes', 'nav_prevention', 
  'nav_outils', 'nav_telechargements', 'login', 'register', 'hero_title', 
  'hero_subtitle', 'emergency_btn', 'comprendre_title', 'comprendre_text1',
  'comprendre_text2', 'comprendre_text3', 'signes_title', 'classic_title',
  'classic_1', 'classic_2', 'classic_3', 'classic_4', 'atypical_title',
  'atypical_1', 'atypical_2', 'atypical_3', 'atypical_4', 'prevention_title',
  'prevention_text1', 'prevention_text2', 'prevention_text3', 'table_measure',
  'table_target', 'table_when', 'table_bp', 'table_bp_target', 'table_bp_when',
  'table_hba1c', 'table_hba1c_target', 'table_hba1c_when', 'table_ldl',
  'table_ldl_target', 'table_ldl_when', 'table_sugar', 'table_sugar_target',
  'table_sugar_when', 'outils_title', 'test_title', 'test_subtitle',
  'bmi_title', 'bmi_subtitle', 'calendar_title', 'calendar_subtitle',
  'save_btn', 'downloads_title', 'guide_title', 'guide_text', 'carte_title',
  'carte_text', 'alim_title', 'alim_text', 'footer_text', 'footer_emergency'
];

// دالة تطبيق الترجمة على جميع العناصر
function applyTranslation() {
  const t = translations[currentLang];
  
  // تطبيق الترجمة على العناصر المحددة
  translatableElements.forEach(id => {
    const element = document.getElementById(id);
    if (element && t[id]) {
      element.innerHTML = t[id];
    }
  });
  
  // تغيير اتجاه الصفحة
  document.body.style.direction = t.dir;
  document.documentElement.lang = t.langCode;
  document.documentElement.dir = t.dir;
  
  // تغيير نص زر اللغة
  const langBtn = document.getElementById('langBtn');
  if (langBtn) {
    langBtn.innerHTML = `<i class="fas fa-globe"></i> <span>${currentLang === 'ar' ? 'FR' : 'AR'}</span>`;
  }
  
  // حفظ اللغة
  localStorage.setItem('language', currentLang);
  
  // تحديث الروابط في الأزرار (لن تختفي الترجمة عند الانتقال)
  updateAuthLinks();
}

// تحديث روابط صفحات التسجيل والدخول
function updateAuthLinks() {
  const loginLink = document.getElementById('loginLink');
  const registerLink = document.getElementById('registerLink');
  
  if (loginLink) {
    loginLink.href = `signup/login.html?lang=${currentLang}`;
  }
  if (registerLink) {
    registerLink.href = `signup/signup.html?lang=${currentLang}`;
  }
}

// تبديل اللغة
function toggleLanguage() {
  currentLang = currentLang === 'ar' ? 'fr' : 'ar';
  applyTranslation();
  
  // إعادة تحميل النصوص الديناميكية (مثل التنبيهات)
  updateDynamicContent();
}

// تحديث المحتوى الديناميكي (التنبيهات، الأسئلة)
function updateDynamicContent() {
  const t = translations[currentLang];
  
  // تحديث دالة الطوارئ
  window.emergencyMessage = t.emergency_alert;
  
  // تحديث أسئلة اختبار الخطر
  window.riskQuestions = [
    t.risk_q1, t.risk_q2, t.risk_q3, t.risk_q4, t.risk_q5, t.risk_q6
  ];
  
  // تحديث رسائل BMI
  window.bmiMessages = {
    weight: t.bmi_weight,
    height: t.bmi_height
  };
}

// تصدير الدوال للاستخدام
window.langManager = {
  currentLang: () => currentLang,
  applyTranslation: applyTranslation,
  toggleLanguage: toggleLanguage,
  getText: (key) => translations[currentLang][key] || key,
  t: (key) => translations[currentLang][key] || key
};

// تهيئة النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  // قراءة اللغة من URL إذا وجدت
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang');
  if (urlLang && (urlLang === 'ar' || urlLang === 'fr')) {
    currentLang = urlLang;
  }
  
  applyTranslation();
  updateDynamicContent();
});

// إذا كان الملف يُستخدم في صفحات أخرى
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { translations, currentLang, applyTranslation, toggleLanguage };
}
