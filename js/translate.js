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
    if (path.includes('/signUp/') || path.includes('/dashboard/') || path.includes('/admin/')) {
      link.href = '../js/translate.css';
    } else {
      link.href = 'js/translate.css';
    }
    
    document.head.appendChild(link);
  }
}

// دالة إخفاء الشريط العلوي فقط - مع ترك الزر
function hideTranslateBarOnly() {
  // إخفاء الشريط العلوي فقط
  const banner = document.querySelector('.goog-te-banner-frame');
  if (banner) {
    banner.style.display = 'none';
    banner.style.visibility = 'hidden';
    banner.style.height = '0';
  }
  
  // إخفاء الإشعارات المنبثقة
  const notifications = document.querySelectorAll('#goog-gt-tt, .goog-te-balloon-frame');
  notifications.forEach(el => {
    if (el) el.style.display = 'none';
  });
  
  // إصلاح موضع الجسم
  document.body.style.top = '0px';
  document.body.style.position = 'relative';
  document.body.style.marginTop = '0';
  document.documentElement.style.marginTop = '0';
  
  // التأكد من أن زر الترجمة ظاهر
  const translateBtn = document.querySelector('.goog-te-gadget-simple');
  if (translateBtn) {
    translateBtn.style.visibility = 'visible';
    translateBtn.style.opacity = '1';
    translateBtn.style.display = 'inline-block';
  }
}

// دالة تهيئة Google Translate
function initGoogleTranslate() {
  if (!document.getElementById('google_translate_element')) {
    const translateDiv = document.createElement('div');
    translateDiv.id = 'google_translate_element';
    translateDiv.className = 'translate-btn-container';
    
    const navActions = document.querySelector('.nav-actions');
    if (navActions) {
      navActions.insertBefore(translateDiv, navActions.firstChild);
    } else {
      document.body.appendChild(translateDiv);
    }
  }
  
  window.googleTranslateElementInit = function() {
    new google.translate.TranslateElement({
      pageLanguage: 'ar',
      includedLanguages: 'ar,fr,en',
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element');
    
    setTimeout(() => {
      hideTranslateBarOnly();
    }, 100);
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
  }, 1500);
}

// مراقبة وإخفاء الشريط مع التأكد من بقاء الزر
function watchAndHide() {
  setInterval(() => {
    hideTranslateBarOnly();
  }, 1000);
  
  const observer = new MutationObserver(() => {
    hideTranslateBarOnly();
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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTranslation);
} else {
  initTranslation();
}
