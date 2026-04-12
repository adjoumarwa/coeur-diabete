// ============================================
// ملف الترجمة الموحد - يستخدم في جميع صفحات الموقع
// ============================================

// دالة تهيئة الترجمة
function initTranslation() {
  // إضافة زر الترجمة إذا لم يكن موجوداً
  if (!document.getElementById('google_translate_element')) {
    const translateDiv = document.createElement('div');
    translateDiv.id = 'google_translate_element';
    translateDiv.className = 'translate-btn';
    translateDiv.innerHTML = '🌐 Français';
    document.body.appendChild(translateDiv);
  }
  
  // إضافة أنماط الترجمة إذا لم تكن موجودة
  if (!document.getElementById('translate-styles')) {
    const styles = document.createElement('style');
    styles.id = 'translate-styles';
    styles.textContent = `
      /* زر الترجمة */
      .translate-btn {
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 9999;
        background: white;
        border: 2px solid #dc2626;
        padding: 8px 20px;
        border-radius: 40px;
        font-size: 14px;
        font-weight: bold;
        color: #dc2626;
        cursor: pointer;
        transition: all 0.3s;
        font-family: inherit;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }
      
      .translate-btn:hover {
        background: #dc2626;
        color: white;
        transform: scale(1.05);
      }
      
      /* إخفاء كل إضافات Google Translate */
      .goog-te-banner-frame, 
      .goog-te-gadget, 
      .goog-logo-link, 
      .goog-te-gadget span {
        display: none !important;
      }
      
      body {
        top: 0 !important;
      }
      
      /* تنسيق القائمة المنسدلة */
      .goog-te-menu-frame {
        border-radius: 12px !important;
        overflow: hidden !important;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2) !important;
      }
      
      .goog-te-menu2-item {
        padding: 10px 15px !important;
        transition: background 0.2s;
      }
      
      .goog-te-menu2-item:hover {
        background: #f1f5f9 !important;
      }
      
      .goog-te-menu2-item-selected {
        background: #dc2626 !important;
      }
      
      .goog-te-menu2-item-selected .goog-te-menu2-item-text {
        color: white !important;
      }
      
      /* للشاشات الصغيرة */
      @media (max-width: 768px) {
        .translate-btn {
          top: 10px;
          left: 10px;
          padding: 6px 15px;
          font-size: 12px;
        }
      }
      
      /* للعربية */
      [dir="rtl"] .translate-btn {
        left: auto;
        right: 20px;
      }
      
      @media (max-width: 768px) {
        [dir="rtl"] .translate-btn {
          right: 10px;
          left: auto;
        }
      }
    `;
    document.head.appendChild(styles);
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
