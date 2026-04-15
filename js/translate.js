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

// دالة إزالة شريط Google Translate (طريقة قوية)
function removeGoogleTranslateBar() {
  // إزالة الشريط العلوي
  const removeBanner = setInterval(function() {
    const banner = document.querySelector('.goog-te-banner-frame');
    if (banner) {
      banner.remove();
      banner.style.display = 'none';
      banner.style.visibility = 'hidden';
    }
    
    // إزالة أي عناصر إضافية
    const elements = document.querySelectorAll('.goog-te-banner, .goog-te-banner-frame, #goog-gt-tt, .goog-te-balloon-frame');
    elements.forEach(el => {
      if (el) {
        el.remove();
        el.style.display = 'none';
      }
    });
    
    // إصلاح موضع الجسم
    document.body.style.top = '0px';
    document.body.style.position = 'relative';
    document.body.style.marginTop = '0';
    document.documentElement.style.marginTop = '0';
    
  }, 100);
  
  // التوقف بعد 3 ثواني
  setTimeout(() => clearInterval(removeBanner), 3000);
}

// دالة إخفاء شريط التحميل
function removeLoadingBar() {
  const style = document.createElement('style');
  style.textContent = `
    .goog-te-spinner,
    .goog-te-spinner-pos,
    .goog-te-spinner-icon,
    .skiptranslate iframe,
    .skiptranslate div {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
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
    
    // إزالة الشريط بعد التهيئة مباشرة
    setTimeout(() => {
      removeGoogleTranslateBar();
      removeLoadingBar();
    }, 100);
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

// دالة تغيير النص الافتراضي للزر
function customizeTranslateButton() {
  setTimeout(function() {
    const btnText = document.querySelector('.goog-te-gadget-simple .goog-te-menu-value span');
    if (btnText && btnText.innerText === 'Arabic') {
      btnText.innerText = '🌐 Français';
    }
    
    // إخفاء أي نصوص إضافية
    const extraSpans = document.querySelectorAll('.goog-te-gadget-simple span:not(.goog-te-menu-value)');
    extraSpans.forEach(span => {
      if (span && span.innerText !== 'Arabic' && span.innerText !== '🌐 Français') {
        span.style.display = 'none';
      }
    });
  }, 1500);
}

// مراقبة التغييرات لإخفاء الشريط باستمرار
function watchForChanges() {
  // مراقبة إضافة عناصر جديدة
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length) {
        removeGoogleTranslateBar();
      }
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
  
  // إعادة الإخفاء كل ثانية
  setInterval(() => {
    removeGoogleTranslateBar();
  }, 1000);
}

// تهيئة كل شيء
function initTranslation() {
  addTranslateStyles();
  initGoogleTranslate();
  customizeTranslateButton();
  watchForChanges();
}

// بدء الترجمة عند تحميل الصفحة
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTranslation);
} else {
  initTranslation();
}

// إعادة الإخفاء عند تغيير اللغة
document.addEventListener('click', function() {
  setTimeout(() => {
    removeGoogleTranslateBar();
  }, 500);
});
