// ============================================
// نظام تسجيل الدخول باستخدام localStorage
// ============================================

let currentUser = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : null;

// عناصر DOM
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const closeLoginModal = document.getElementById('closeLoginModal');
const closeRegisterModal = document.getElementById('closeRegisterModal');
const switchToRegister = document.getElementById('switchToRegister');
const switchToLogin = document.getElementById('switchToLogin');

// فتح وإغلاق المودالات
function showLoginModal() {
  loginModal.style.display = 'flex';
}

function showRegisterModal() {
  registerModal.style.display = 'flex';
}

function closeModals() {
  if (loginModal) loginModal.style.display = 'none';
  if (registerModal) registerModal.style.display = 'none';
}

if (loginBtn) loginBtn.addEventListener('click', showLoginModal);
if (registerBtn) registerBtn.addEventListener('click', showRegisterModal);
if (closeLoginModal) closeLoginModal.addEventListener('click', closeModals);
if (closeRegisterModal) closeRegisterModal.addEventListener('click', closeModals);
if (switchToRegister) switchToRegister.addEventListener('click', (e) => {
  e.preventDefault();
  closeModals();
  showRegisterModal();
});
if (switchToLogin) switchToLogin.addEventListener('click', (e) => {
  e.preventDefault();
  closeModals();
  showLoginModal();
});

// تسجيل مستخدم جديد
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    let users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
      alert('البريد الإلكتروني موجود مسبقاً');
      return;
    }

    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول');
    closeModals();
    showLoginModal();
  });
}

// تسجيل دخول
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    let users = JSON.parse(localStorage.getItem('users') || '[]');
    let user = users.find(u => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      currentUser = user;
      alert(`مرحباً ${user.name}! تم تسجيل الدخول بنجاح`);
      closeModals();
      updateUIForUser();
    } else {
      alert('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }
  });
}

function updateUIForUser() {
  if (currentUser && loginBtn && registerBtn) {
    loginBtn.textContent = `مرحباً ${currentUser.name.split(' ')[0]}`;
    registerBtn.textContent = 'تسجيل خروج';
    registerBtn.onclick = () => {
      localStorage.removeItem('currentUser');
      location.reload();
    };
  }
}

// تحديث واجهة المستخدم إذا كان المستخدم مسجلاً
updateUIForUser();

// ============================================
// وظائف الموقع
// ============================================

// زر الطوارئ
const urgenceBtn = document.getElementById('urgenceBtn');
if (urgenceBtn) {
  urgenceBtn.addEventListener('click', function() {
    alert('🚨 في حالة ظهور أي من علامات الخطر (ألم الصدر، ضيق التنفس، التعب المفاجئ، الغثيان، آلام الظهر أو الفك):\n\n1. اتصل بالإسعاف فوراً (14 أو 997)\n2. لا تقود السيارة بنفسك\n3. اجلس في وضع مريح\n4. إذا كنت تتناول الأسبرين وليس لديك حساسية منه، يمكنك مضغ قرص\n5. أخبر المسعفين أنك مريض سكري');
  });
}

// اختبار الخطر
const testRisqueBtn = document.getElementById('testRisqueBtn');
if (testRisqueBtn) {
  testRisqueBtn.addEventListener('click', function() {
    let score = 0;
    let q1 = confirm('هل عمرك أكثر من 45 سنة؟');
    if (q1) score++;
    let q2 = confirm('هل لديك تاريخ عائلي لأمراض القلب؟');
    if (q2) score++;
    let q3 = confirm('هل تعاني من ارتفاع ضغط الدم؟');
    if (q3) score++;
    let q4 = confirm('هل تدخن؟');
    if (q4) score++;
    let q5 = confirm('هل تعاني من السمنة؟');
    if (q5) score++;

    if (score >= 3) {
      alert(`نقاط الخطر: ${score}/5\n⚠️ أنت في خطر مرتفع! ننصح بمراجعة طبيب القلب وإجراء فحوصات دورية.`);
    } else if (score >= 1) {
      alert(`نقاط الخطر: ${score}/5\n⚠️ لديك بعض عوامل الخطر. اتبع نصائح الوقاية وراقب صحتك.`);
    } else {
      alert(`نقاط الخطر: ${score}/5\n✓ ممتاز! استمر في نمط الحياة الصحي.`);
    }
  });
}

// حاسبة BMI
const calculerIMCBtn = document.getElementById('calculerIMCBtn');
if (calculerIMCBtn) {
  calculerIMCBtn.addEventListener('click', function() {
    let poids = prompt('أدخل وزنك بالكيلوغرام:');
    let taille = prompt('أدخل طولك بالمتر (مثال: 1.75):');
    if (poids && taille) {
      let imc = poids / (taille * taille);
      let status = '';
      if (imc < 18.5) status = 'نقص وزن';
      else if (imc < 25) status = 'وزن طبيعي';
      else if (imc < 30) status = 'وزن زائد';
      else if (imc < 35) status = 'سمنة درجة 1';
      else if (imc < 40) status = 'سمنة درجة 2';
      else status = 'سمنة مفرطة';

      alert(`مؤشر كتلة الجسم BMI: ${imc.toFixed(1)}\nالتصنيف: ${status}\n${imc > 25 ? '⚠️ الوزن الزائد يزيد من خطر الإصابة بالسكري وأمراض القلب' : '✓ حافظ على وزنك الصحي'}`);
    }
  });
}

// مفكرة المواعيد
const ajouterRappelBtn = document.getElementById('ajouterRappelBtn');
const rappelContainer = document.getElementById('rappel-container');
if (ajouterRappelBtn && rappelContainer) {
  ajouterRappelBtn.addEventListener('click', function() {
    if (rappelContainer.style.display === 'none') {
      rappelContainer.style.display = 'block';
    } else {
      rappelContainer.style.display = 'none';
    }
  });
}

const saveRappelBtn = document.getElementById('saveRappelBtn');
if (saveRappelBtn) {
  saveRappelBtn.addEventListener('click', function() {
    const date = document.getElementById('rappel-date').value;
    if (date) {
      localStorage.setItem('rappelECG', date);
      const message = document.getElementById('rappel-message');
      if (message) message.innerHTML = `✅ تم حفظ تذكير فحص القلب يوم ${date}`;
      alert(`تم حفظ التذكير! سيتم تذكيرك بموعد فحص ECG يوم ${date}`);
    } else {
      alert('الرجاء اختيار تاريخ');
    }
  });
}

// استعادة التذكير المحفوظ
const savedRappel = localStorage.getItem('rappelECG');
if (savedRappel) {
  const message = document.getElementById('rappel-message');
  if (message) message.innerHTML = `📅 التذكير القادم لفحص القلب: ${savedRappel}`;
}

// تحميل الملفات
const downloadCards = document.querySelectorAll('.download-card');
downloadCards.forEach(card => {
  card.addEventListener('click', function() {
    const type = this.getAttribute('data-download');
    telechargerPDF(type);
  });
});

function telechargerPDF(type) {
  let content = '';
  let filename = '';

  if (type === 'guide') {
    content = 'دليل التعرف على الأزمة القلبية الصامتة\n\n═══════════════════════════════\n\nالعلامات التحذيرية:\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n✓ تعب مفاجئ شديد غير مبرر\n✓ غثيان أو عسر هضم\n✓ آلام في الظهر أو الفك\n✓ ضيق في التنفس\n✓ دوار أو إغماء\n\nما يجب فعله:\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n1. اتصل بالإسعاف فوراً (14 أو 997)\n2. لا تنتظر، الوقت مهم جداً\n3. أخبر الطبيب أنك مريض سكري\n4. لا تقود السيارة بنفسك\n\nملاحظة: مريض السكري قد لا يشعر بألم الصدر التقليدي!';
    filename = 'guide_crise_cardiaque_silencieuse.txt';
  } else if (type === 'carte') {
    content = 'بطاقة المريض - قلب السكري\n\n═══════════════════════════════\n\nالاسم: ................................\nنوع السكري: ........................\nتاريخ التشخيص: ....................\n\nأدوية السكري:\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n1. ................................\n2. ................................\n\nأدوية القلب:\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n1. ................................\n2. ................................\n\nالحساسية: ............................\n\nمعلومات الطبيب:\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nالاسم: ................................\nالهاتف: ................................\n\nرقم الطوارئ: 14 أو 997\n\n⚠️ ملاحظة مهمة: أنا مريض سكري ومعرض لخطر الأزمة القلبية الصامتة (قد لا أشعر بألم الصدر التقليدي)';
    filename = 'carte_patient.txt';
  } else {
    content = 'دليل التغذية لمرضى السكري والقلب\n\n═══════════════════════════════\n\nنظام DASH (لخفض الضغط والكوليسترول):\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n✓ إكثار من الخضروات والفواكه (5 حصص يومياً)\n✓ الحبوب الكاملة (خبز أسمر، أرز بني)\n✓ منتجات ألبان قليلة الدسم\n✓ بروتينات خالية من الدهون (دجاج منزوع الجلد، سمك)\n✓ مكسرات وبقوليات\n✓ تقليل الملح (أقل من 5 جرام يومياً)\n\nنظام البحر المتوسط:\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n✓ زيت الزيتون (الدهون الرئيسية)\n✓ الأسماك الدهنية (سلمون، سردين، تونة) مرتين أسبوعياً\n✓ الخضروات الطازجة\n✓ الفواكه الطازجة\n✓ الأعشاب والتوابل بدلاً من الملح\n\nأطعمة تجنبها تماماً:\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n✗ الدهون المشبعة والمتحولة (زيوت مهدرجة)\n✗ المشروبات الغازية والعصائر المحلاة\n✗ الأطعمة المصنعة والوجبات السريعة\n✗ السكريات البسيطة (حلويات، معجنات)\n\nنصائح إضافية:\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n• اشرب 8-10 أكواب ماء يومياً\n• تناول وجبات صغيرة متعددة بدلاً من وجبتين كبيرتين\n• اقرأ ملصقات الطعام قبل الشراء';
    filename = 'guide_alimentation.txt';
  }

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
  alert(`✅ تم تحميل ${filename}`);
}

// القائمة المنسدلة للهاتف
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', function() {
    navLinks.classList.toggle('active');
  });
}

// إغلاق المودال عند النقر خارجها
window.onclick = function(event) {
  if (event.target.classList.contains('modal')) {
    event.target.style.display = 'none';
  }
}

// تمرير سلس للروابط
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
    // إغلاق القائمة على الهاتف
    if (navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
    }
  });
});