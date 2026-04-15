// ============================================
// ملف الترجمة الموحد - translate.js
// يستخدم في جميع صفحات الموقع
// ============================================

// دالة إضافة أنماط CSS
function addTranslateStyles() {
  if (!document.getElementById('translate-styles-link')) {
    const link = document.createElement('link');
    link.id = 'translate-styles-link';
    link.rel = 'stylesheet';
    
    // تحديد المسار الصحيح حسب موقع الصفحة
    const path = window.location.pathname;
    if (path.includes('/signup/') || path.includes('/dashboard/') || path.includes('/admin/')) {
      link.href = '../js/translate.css';
    } else {
      link.href = 'js/translate.css';
    }
    
    document.head.appendChild(link);
  }
}

// دالة تهيئة Google Translate
function initGoogleTranslate() {
  // إضافة حاوية الترجمة إذا لم تكن موجودة
  if (!document.getElementById('google_translate_element')) {
    const translateDiv = document.createElement('div');
    translateDiv.id = 'google_translate_element';
    document.body.appendChild(translateDiv);
  }
  
  // تعريف دالة التهيئة
  window.googleTranslateElementInit = function() {
    new google.translate.TranslateElement({
      pageLanguage: 'ar',
      includedLanguages: 'ar,fr,en',
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element');
  };
  
  // تحميل مكتبة Google Translate إذا لم تكن محملة
  if (typeof google === 'undefined' || !google.translate) {
    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.head.appendChild(script);
  } else {
    googleTranslateElementInit();
  }
}

// دالة إخفاء شريط Google Translate (تأكيد إضافي)
function hideGoogleTranslateBar() {
  setTimeout(function() {
    const banner = document.querySelector('.goog-te-banner-frame');
    if (banner) {
      banner.style.display = 'none';
    }
    document.body.style.top = '0px';
  }, 500);
}

// دالة تغيير النص الافتراضي للزر
function customizeTranslateButton() {
  setTimeout(function() {
    const btnText = document.querySelector('.goog-te-gadget-simple .goog-te-menu-value span');
    if (btnText && btnText.innerText === 'Arabic') {
      btnText.innerText = '🌐 Français';
    }
  }, 1000);
}

// تهيئة كل شيء
function initTranslation() {
  addTranslateStyles();
  initGoogleTranslate();
  hideGoogleTranslateBar();
  customizeTranslateButton();
}

// بدء الترجمة عند تحميل الصفحة
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTranslation);
} else {
  initTranslation();
}

// إعادة إخفاء الشريط عند تغيير اللغة
document.addEventListener('click', function() {
  hideGoogleTranslateBar();
});
