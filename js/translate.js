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

// دالة قوية لإزالة شريط Google Translate
function removeGoogleTranslateBar() {
  // إزالة الشريط العلوي
  const banners = document.querySelectorAll('.goog-te-banner-frame, .goog-te-banner, .skiptranslate, .skiptranslate iframe');
  banners.forEach(banner => {
    if (banner) {
      banner.remove();
      banner.style.display = 'none';
      banner.style.visibility = 'hidden';
    }
  });
  
  // إزالة أي عناصر إضافية
  const extraElements = document.querySelectorAll('#goog-gt-tt, .goog-te-balloon-frame, .goog-te-spinner');
  extraElements.forEach(el => {
    if (el) el.remove();
  });
  
  // إصلاح موضع الجسم
  document.body.style.top = '0px';
  document.body.style.position = 'relative';
  document.body.style.marginTop = '0';
  document.documentElement.style.marginTop = '0';
  
  // إزالة أي iframes مخفية
  const iframes = document.querySelectorAll('iframe');
  iframes.forEach(iframe => {
    if (iframe.style.height === '0px' || iframe.style.display === 'none') {
      iframe.remove();
    }
  });
}

// دالة إضافة CSS إضافي لإخفاء العناصر
function addHideStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .goog-te-banner-frame, .goog-te-banner, .skiptranslate, .skiptranslate iframe,
    #goog-gt-tt, .goog-te-balloon-frame, .goog-te-spinner {
      display: none !important;
      visibility: hidden !important;
      height: 0 !important;
      width: 0 !important;
      position: absolute !important;
      top: -9999px !important;
      left: -9999px !important;
    }
    body { top: 0 !important; margin-top: 0 !important; }
  `;
  document.head.appendChild(style);
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
    
    // إزالة الشريط بعد التحميل مباشرة
    setTimeout(() => {
      removeGoogleTranslateBar();
      addHideStyles();
    }, 10);
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

// مراقبة وإخفاء الشريط باستمرار
function watchAndHide() {
  // إخفاء كل ثانية
  setInterval(() => {
    removeGoogleTranslateBar();
  }, 500);
  
  // مراقبة إضافة عناصر جديدة
  const observer = new MutationObserver(() => {
    removeGoogleTranslateBar();
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
