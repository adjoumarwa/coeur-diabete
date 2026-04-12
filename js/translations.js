// ============================================
// ملف الترجمة الموحد - يستخدم في جميع صفحات الموقع
// ============================================

// دالة إضافة أنماط CSS من ملف منفصل
function addTranslateStyles() {
  // التحقق إذا كانت الأنماط مضافة بالفعل
  if (!document.getElementById('translate-styles-link')) {
    const link = document.createElement('link');
    link.id = 'translate-styles-link';
    link.rel = 'stylesheet';
    link.href = 'translations.css';
    document.head.appendChild(link);
  }
}

// دالة تهيئة الترجمة
function initTranslation() {
  // إضافة أنماط CSS أولاً
  addTranslateStyles();
  
  // إضافة زر الترجمة إذا لم يكن موجوداً
  if (!document.getElementById('google_translate_element')) {
    const translateDiv = document.createElement('div');
    translateDiv.id = 'google_translate_element';
    translateDiv.className = 'translate-btn';
    translateDiv.innerHTML = '🌐 Français';
    document.body.appendChild(translateDiv);
  }
}

// دالة تحميل Google Translate
function loadGoogleTranslate() {
  // تحقق إذا كانت المكتبة محملة بالفعل
  if (typeof google !== 'undefined' && google.translate) {
    return;
  }
  
  // دالة التهيئة بعد تحميل المكتبة
  window.googleTranslateElementInit = function() {
    new google.translate.TranslateElement({
      pageLanguage: 'ar',
      includedLanguages: 'ar,fr,en',
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element');
    
    // تغيير النص الافتراضي للزر بعد تحميله
    setTimeout(function() {
      const btn = document.querySelector('.goog-te-gadget-simple .goog-te-menu-value span');
      if (btn && btn.innerText === 'Arabic') {
        btn.innerText = '🌐 Français';
      }
    }, 500);
  };
  
  // تحميل مكتبة Google Translate
  const script = document.createElement('script');
  script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  script.async = true;
  document.head.appendChild(script);
}

// تهيئة الترجمة عند تحميل الصفحة
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    initTranslation();
    loadGoogleTranslate();
  });
} else {
  initTranslation();
  loadGoogleTranslate();
}
