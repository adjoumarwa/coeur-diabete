// ============================================
// ملف الترجمة الموحد - translate.js
// ============================================

// دالة إضافة أنماط CSS
function addTranslateStyles() {
  if (!document.getElementById('translate-styles-link')) {
    const link = document.createElement('link');
    link.id = 'translate-styles-link';
    link.rel = 'stylesheet';
    
    const path = window.location.pathname;
    if (path.includes('/signup/') || path.includes('/dashboard/') || path.includes('/admin/')) {
      link.href = '../js/translate.css';
    } else {
      link.href = 'js/translate.css';
    }
    
    document.head.appendChild(link);
  }
}

// دالة إخفاء الشريط العلوي فقط
function hideTranslateBar() {
  // إخفاء الشريط العلوي
  const banner = document.querySelector('.goog-te-banner-frame');
  if (banner) {
    banner.style.display = 'none';
    banner.style.visibility = 'hidden';
    banner.style.height = '0';
  }
  
  // إصلاح موضع الجسم
  document.body.style.top = '0px';
  document.body.style.position = 'relative';
  document.body.style.marginTop = '0';
  document.documentElement.style.marginTop = '0';
}

// دالة تهيئة Google Translate
function initGoogleTranslate() {
  if (!document.getElementById('google_translate_element')) {
    const translateDiv = document.createElement('div');
    translateDiv.id = 'google_translate_element';
    document.body.appendChild(translateDiv);
  }
  
  window.googleTranslateElementInit = function() {
    new google.translate.TranslateElement({
      pageLanguage: 'ar',
      includedLanguages: 'ar,fr,en',
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element');
    
    // إخفاء الشريط بعد التحميل
    setTimeout(hideTranslateBar, 100);
  };
  
  if (typeof google === 'undefined' || !google.translate) {
    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.head.appendChild(script);
  } else {
    googleTranslateElementInit();
  }
}

// دالة تغيير النص الافتراضي للزر
function customizeButton() {
  setTimeout(function() {
    const btn = document.querySelector('.goog-te-gadget-simple .goog-te-menu-value span');
    if (btn && btn.innerText === 'Arabic') {
      btn.innerText = '🌐 Français';
    }
  }, 1000);
}

// مراقبة وإخفاء الشريط باستمرار
function watchAndHide() {
  setInterval(hideTranslateBar, 1000);
  
  const observer = new MutationObserver(function() {
    hideTranslateBar();
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
}

// تهيئة كل شيء
function initTranslation() {
  addTranslateStyles();
  initGoogleTranslate();
  customizeButton();
  watchAndHide();
}

// بدء الترجمة
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTranslation);
} else {
  initTranslation();
}
