// ============================================
// دوال مساعدة لإنشاء النوافذ المنبثقة المخصصة
// ============================================

// إنشاء نافذة مخصصة
function createCustomModal(title, content, onConfirm, onCancel) {
    // إزالة أي مودال موجود
    const existingModal = document.querySelector('.custom-modal-overlay');
    if (existingModal) existingModal.remove();
    
    const overlay = document.createElement('div');
    overlay.className = 'custom-modal-overlay';
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
    modal.className = 'custom-modal';
    modal.style.cssText = `
        background: white;
        border-radius: 20px;
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        border-top: 5px solid #dc2626;
    `;
    
    modal.innerHTML = `
        <h3 style="color: #1a472a; margin-bottom: 1rem;">${title}</h3>
        <div style="margin: 1.5rem 0;">${content}</div>
        <div style="display: flex; gap: 1rem; justify-content: center;">
            <button id="modalConfirmBtn" style="background: #1a472a; color: white; border: none; padding: 10px 25px; border-radius: 10px; cursor: pointer; font-weight: bold;">نعم</button>
            <button id="modalCancelBtn" style="background: #dc2626; color: white; border: none; padding: 10px 25px; border-radius: 10px; cursor: pointer; font-weight: bold;">لا</button>
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    document.getElementById('modalConfirmBtn').onclick = () => {
        overlay.remove();
        if (onConfirm) onConfirm();
    };
    
    document.getElementById('modalCancelBtn').onclick = () => {
        overlay.remove();
        if (onCancel) onCancel();
    };
    
    return overlay;
}

// نافذة رسالة مخصصة
function showCustomAlert(message, title = 'تنبيه') {
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
        <div style="margin: 1rem 0; text-align: right; line-height: 1.6;">${message}</div>
        <button id="alertCloseBtn" style="background: linear-gradient(135deg, #dc2626, #2563eb); color: white; border: none; padding: 10px 30px; border-radius: 10px; cursor: pointer; margin-top: 1rem;">موافق</button>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    document.getElementById('alertCloseBtn').onclick = () => overlay.remove();
}

// نافذة إدخال مخصصة (للوزن والطول والقراءات)
function showCustomPrompt(title, placeholder, callback) {
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
        max-width: 400px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        border-top: 5px solid #dc2626;
    `;
    
    modal.innerHTML = `
        <h3 style="color: #1a472a; margin-bottom: 1rem;">${title}</h3>
        <input type="number" id="promptInput" step="any" placeholder="${placeholder}" style="width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 10px; margin: 1rem 0; font-size: 1rem;">
        <div style="display: flex; gap: 1rem; justify-content: center;">
            <button id="promptConfirmBtn" style="background: #1a472a; color: white; border: none; padding: 10px 25px; border-radius: 10px; cursor: pointer;">تأكيد</button>
            <button id="promptCancelBtn" style="background: #dc2626; color: white; border: none; padding: 10px 25px; border-radius: 10px; cursor: pointer;">إلغاء</button>
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    document.getElementById('promptConfirmBtn').onclick = () => {
        const value = document.getElementById('promptInput').value;
        overlay.remove();
        if (value && callback) callback(value);
    };
    
    document.getElementById('promptCancelBtn').onclick = () => overlay.remove();
}

// ============================================
// زر الطوارئ
// ============================================
document.getElementById('urgenceBtn')?.addEventListener('click', function() {
    showCustomAlert(
        '🚨 في حالة ظهور أي من علامات الخطر (ألم الصدر، ضيق التنفس، التعب المفاجئ، الغثيان، آلام الظهر أو الفك):\n\n' +
        '1️⃣ اتصل بالإسعاف فوراً (14 أو 997)\n' +
        '2️⃣ لا تقود السيارة بنفسك\n' +
        '3️⃣ اجلس في وضع مريح\n' +
        '4️⃣ إذا كنت تتناول الأسبرين وليس لديك حساسية منه، يمكنك مضغ قرص\n' +
        '5️⃣ أخبر المسعفين أنك مريض سكري',
        '🚨 زر الطوارئ'
    );
});

// ============================================
// اختبار الخطر (بنعم/لا)
// ============================================
let riskScore = 0;
let riskAnswers = [];
let currentRiskQuestion = 0;

const riskQuestions = [
    { text: "هل عمرك أكثر من 45 سنة؟", field: "العمر", yesScore: 1, noScore: 0 },
    { text: "هل لديك تاريخ عائلي لأمراض القلب؟", field: "تاريخ عائلي", yesScore: 1, noScore: 0 },
    { text: "هل تعاني من ارتفاع ضغط الدم؟", field: "ضغط الدم", yesScore: 1, noScore: 0 },
    { text: "هل تدخن؟", field: "التدخين", yesScore: 1, noScore: 0 },
    { text: "هل تعاني من السمنة أو الوزن الزائد؟", field: "الوزن", yesScore: 1, noScore: 0 },
    { text: "هل تمارس الرياضة بانتظام (30 دقيقة يومياً على الأقل 3 أيام أسبوعياً)؟", field: "الرياضة", yesScore: 0, noScore: 1 }
];

function showRiskQuestion() {
    if (currentRiskQuestion >= riskQuestions.length) {
        showRiskResult();
        return;
    }
    
    const q = riskQuestions[currentRiskQuestion];
    
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
        max-width: 500px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        border-top: 5px solid #dc2626;
    `;
    
    modal.innerHTML = `
        <div style="background: #f0fdf4; padding: 0.5rem 1rem; border-radius: 15px; margin-bottom: 1rem;">
            <p style="font-size: 0.9rem; color: #1a472a;">السؤال ${currentRiskQuestion + 1} من ${riskQuestions.length}</p>
            <progress value="${currentRiskQuestion + 1}" max="${riskQuestions.length}" style="width: 100%; height: 8px; border-radius: 10px;"></progress>
        </div>
        <h3 style="color: #1a472a; margin-bottom: 1.5rem;">📋 اختبار خطر أمراض القلب</h3>
        <p style="font-size: 1.1rem; margin-bottom: 2rem; line-height: 1.6;">${q.text}</p>
        <div style="display: flex; gap: 1rem; justify-content: center;">
            <button id="riskYesBtn" style="background: #1a472a; color: white; border: none; padding: 12px 30px; border-radius: 10px; cursor: pointer; font-weight: bold;">✅ نعم</button>
            <button id="riskNoBtn" style="background: #dc2626; color: white; border: none; padding: 12px 30px; border-radius: 10px; cursor: pointer; font-weight: bold;">❌ لا</button>
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    document.getElementById('riskYesBtn').onclick = () => {
        riskScore += q.yesScore;
        riskAnswers.push(`✓ ${q.field}: نعم`);
        overlay.remove();
        currentRiskQuestion++;
        showRiskQuestion();
    };
    
    document.getElementById('riskNoBtn').onclick = () => {
        riskScore += q.noScore;
        riskAnswers.push(`✗ ${q.field}: لا`);
        overlay.remove();
        currentRiskQuestion++;
        showRiskQuestion();
    };
}

function showRiskResult() {
    let resultText = '';
    let resultColor = '';
    let recommendations = '';
    
    if (riskScore >= 4) {
        resultText = 'خطر مرتفع جداً';
        resultColor = '#dc2626';
        recommendations = `
            <div style="background: #fee2e2; padding: 1rem; border-radius: 10px; margin-top: 1rem; text-align: right;">
                <p style="font-weight: bold; color: #b91c1c;">⚠️ توصيات عاجلة:</p>
                <ul style="margin-right: 1.5rem; margin-top: 0.5rem;">
                    <li>✓ راجع طبيب القلب فوراً</li>
                    <li>✓ أجرِ فحوصات شاملة (ECG, ECHO)</li>
                    <li>✓ ابدأ بتغيير نمط الحياة فوراً</li>
                    <li>✓ تابع ضغط الدم والسكر بانتظام</li>
                </ul>
            </div>
        `;
    } else if (riskScore >= 2) {
        resultText = 'خطر متوسط';
        resultColor = '#f59e0b';
        recommendations = `
            <div style="background: #fef3c7; padding: 1rem; border-radius: 10px; margin-top: 1rem; text-align: right;">
                <p style="font-weight: bold; color: #b45309;">⚠️ توصيات:</p>
                <ul style="margin-right: 1.5rem; margin-top: 0.5rem;">
                    <li>✓ استشر طبيبك في أقرب وقت</li>
                    <li>✓ اتبع نظام DASH الغذائي</li>
                    <li>✓ مارس الرياضة 30 دقيقة يومياً</li>
                </ul>
            </div>
        `;
    } else {
        resultText = 'خطر منخفض';
        resultColor = '#16a34a';
        recommendations = `
            <div style="background: #dcfce7; padding: 1rem; border-radius: 10px; margin-top: 1rem; text-align: right;">
                <p style="font-weight: bold; color: #166534;">✓ أحسنت! استمر في نمط الحياة الصحي:</p>
                <ul style="margin-right: 1.5rem; margin-top: 0.5rem;">
                    <li>✓ حافظ على نظامك الغذائي الصحي</li>
                    <li>✓ استمر في ممارسة الرياضة</li>
                    <li>✓ قم بفحص دوري كل 6 شهور</li>
                </ul>
            </div>
        `;
    }
    
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
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        border-top: 5px solid #dc2626;
    `;
    
    modal.innerHTML = `
        <h3 style="color: #1a472a; margin-bottom: 1rem;">📊 نتيجة اختبار الخطر</h3>
        <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 15px; margin: 1rem 0;">
            <p style="font-size: 1.1rem;">نقاط الخطر: <strong style="font-size: 1.5rem; color: ${resultColor};">${riskScore}</strong> / ${riskQuestions.length}</p>
            <div style="height: 10px; background: #e0e0e0; border-radius: 5px; margin: 1rem 0;">
                <div style="width: ${(riskScore/riskQuestions.length)*100}%; height: 100%; background: ${resultColor}; border-radius: 5px;"></div>
            </div>
            <p style="font-size: 1.2rem; font-weight: bold; color: ${resultColor};">مستوى الخطر: ${resultText}</p>
            ${recommendations}
        </div>
        <details style="margin: 1rem 0; text-align: right;">
            <summary style="cursor: pointer; color: #1a472a; font-weight: bold;">📋 تفاصيل الإجابات</summary>
            <div style="margin-top: 0.5rem; padding: 0.5rem;">
                ${riskAnswers.map(a => `<p style="margin: 0.3rem 0;">${a}</p>`).join('')}
            </div>
        </details>
        <button id="closeRiskBtn" style="background: linear-gradient(135deg, #dc2626, #2563eb); color: white; border: none; padding: 12px 30px; border-radius: 10px; cursor: pointer; margin-top: 1rem;">إغلاق</button>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    document.getElementById('closeRiskBtn').onclick = () => {
        overlay.remove();
        // إعادة تعيين المتغيرات
        riskScore = 0;
        riskAnswers = [];
        currentRiskQuestion = 0;
    };
}

// ============================================
// حاسبة BMI (بنافذة مخصصة)
// ============================================
function calculateBMI() {
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
        max-width: 400px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        border-top: 5px solid #dc2626;
    `;
    
    modal.innerHTML = `
        <h3 style="color: #1a472a; margin-bottom: 1rem;">⚖️ حاسبة مؤشر كتلة الجسم BMI</h3>
        <div style="margin: 1rem 0;">
            <label style="display: block; text-align: right; margin-bottom: 0.5rem;">الوزن (كيلوغرام):</label>
            <input type="number" id="bmiWeight" step="any" placeholder="مثال: 75" style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 10px;">
        </div>
        <div style="margin: 1rem 0;">
            <label style="display: block; text-align: right; margin-bottom: 0.5rem;">الطول (متر):</label>
            <input type="number" id="bmiHeight" step="0.01" placeholder="مثال: 1.75" style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 10px;">
        </div>
        <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
            <button id="calcBmiBtn" style="flex: 1; background: #1a472a; color: white; border: none; padding: 12px; border-radius: 10px; cursor: pointer;">احسب</button>
            <button id="closeBmiBtn" style="flex: 1; background: #dc2626; color: white; border: none; padding: 12px; border-radius: 10px; cursor: pointer;">إغلاق</button>
        </div>
        <div id="bmiResult" style="margin-top: 1rem; display: none;"></div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    document.getElementById('calcBmiBtn').onclick = () => {
        const weight = parseFloat(document.getElementById('bmiWeight').value);
        const height = parseFloat(document.getElementById('bmiHeight').value);
        const resultDiv = document.getElementById('bmiResult');
        
        if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
            resultDiv.innerHTML = '<p style="color: #dc2626;">❌ الرجاء إدخال قيم صحيحة</p>';
            resultDiv.style.display = 'block';
            return;
        }
        
        const bmi = weight / (height * height);
        let status = '';
        let statusColor = '';
        let advice = '';
        
        if (bmi < 18.5) {
            status = 'نقص وزن';
            statusColor = '#f59e0b';
            advice = '⚠️ ننصح بزيارة أخصائي تغذية لزيادة الوزن الصحي';
        } else if (bmi < 25) {
            status = 'وزن طبيعي';
            statusColor = '#16a34a';
            advice = '✓ ممتاز! حافظ على وزنك الصحي';
        } else if (bmi < 30) {
            status = 'وزن زائد';
            statusColor = '#f59e0b';
            advice = '⚠️ ننصح باتباع نظام DASH الغذائي وممارسة الرياضة';
        } else if (bmi < 35) {
            status = 'سمنة درجة 1';
            statusColor = '#dc2626';
            advice = '⚠️⚠️ يرجى استشارة طبيب لبرنامج إنقاص وزن';
        } else {
            status = 'سمنة مفرطة';
            statusColor = '#dc2626';
            advice = '🚨 خطر مرتفع - ننصح بمراجعة طبيب فوراً';
        }
        
        resultDiv.innerHTML = `
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 10px; margin-top: 1rem;">
                <p style="font-size: 1.2rem;">BMI = <strong style="font-size: 1.5rem; color: #1a472a;">${bmi.toFixed(1)}</strong></p>
                <p style="color: ${statusColor}; font-weight: bold;">التصنيف: ${status}</p>
                <p style="margin-top: 0.5rem;">${advice}</p>
            </div>
        `;
        resultDiv.style.display = 'block';
    };
    
    document.getElementById('closeBmiBtn').onclick = () => overlay.remove();
}

// ============================================
// مفكرة المواعيد
// ============================================
const rappelContainer = document.getElementById('rappel-container');
document.getElementById('ajouterRappelBtn')?.addEventListener('click', function() {
    if (rappelContainer.style.display === 'none') {
        rappelContainer.style.display = 'block';
    } else {
        rappelContainer.style.display = 'none';
    }
});

document.getElementById('saveRappelBtn')?.addEventListener('click', function() {
    const date = document.getElementById('rappel-date').value;
    if (date) {
        localStorage.setItem('rappelECG', date);
        document.getElementById('rappel-message').innerHTML = `✅ تم حفظ تذكير فحص القلب يوم ${date}`;
        showCustomAlert(`✅ تم حفظ التذكير!\nسيتم تذكيرك بموعد فحص ECG يوم ${date}`, 'تم الحفظ');
    } else {
        showCustomAlert('❌ الرجاء اختيار تاريخ', 'خطأ');
    }
});

// استعادة التذكير المحفوظ
const savedRappel = localStorage.getItem('rappelECG');
if (savedRappel) {
    document.getElementById('rappel-message').innerHTML = `📅 التذكير القادم لفحص القلب: ${savedRappel}`;
}

// ============================================
// تحميل الكتيبات
// ============================================
function telechargerGuide() {
    const content = `دليل التعرف على الأزمة القلبية الصامتة

═══════════════════════════════

ما هي الأزمة القلبية الصامتة؟
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
أزمة قلبية تحدث بدون ألم الصدر التقليدي، وهي شائعة جداً عند مرضى السكري.

العلامات التحذيرية:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ تعب مفاجئ شديد غير مبرر
✓ غثيان أو عسر هضم
✓ آلام في الظهر أو الفك أو الرقبة
✓ ضيق في التنفس
✓ دوار أو إغماء

ما يجب فعله:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. اتصل بالإسعاف فوراً (14 أو 997)
2. لا تنتظر، الوقت مهم جداً
3. أخبر الطبيب أنك مريض سكري
4. لا تقود السيارة بنفسك

ملاحظة مهمة:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
مريض السكري قد لا يشعر بألم الصدر التقليدي!`;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'guide_crise_cardiaque_silencieuse.txt';
    link.click();
    URL.revokeObjectURL(link.href);
    showCustomAlert('✅ تم تحميل دليل الأزمة القلبية الصامتة', 'تم التحميل');
}

function telechargerCarte() {
    const content = `بطاقة المريض - قلب السكري

═══════════════════════════════

الاسم: ................................
نوع السكري: ........................
تاريخ التشخيص: ....................

أدوية السكري:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. ................................
2. ................................

أدوية القلب والضغط:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. ................................
2. ................................

الحساسية: ............................

معلومات الطبيب المعالج:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
الاسم: ................................
الهاتف: ................................
العنوان: .............................

رقم الطوارئ: 14 أو 997

⚠️ تنبيه مهم:
أنا مريض سكري ومعرض لخطر الأزمة القلبية الصامتة.
قد لا أشعر بألم الصدر التقليدي!`;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'carte_patient.txt';
    link.click();
    URL.revokeObjectURL(link.href);
    showCustomAlert('✅ تم تحميل بطاقة المريض', 'تم التحميل');
}

function telechargerAlimentation() {
    const content = `دليل التغذية لمرضى السكري والقلب

═══════════════════════════════

نظام DASH (لخفض الضغط والكوليسترول):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ 5-6 حصص من الخضروات يومياً
✓ 4-5 حصص من الفواكه يومياً
✓ 6-8 حصص من الحبوب الكاملة
✓ 2-3 حصص من منتجات الألبان قليلة الدسم
✓ 2-3 حصص من الدهون الصحية
✓ أقل من 1500 ملجم صوديوم يومياً

نظام البحر المتوسط:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ زيت الزيتون كدهون رئيسية
✓ الأسماك الدهنية مرتين أسبوعياً (سلمون، سردين)
✓ الخضروات والفواكه الطازجة يومياً
✓ المكسرات والبقوليات
✓ الأعشاب والتوابل بدلاً من الملح

أطعمة تجنبها تماماً:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✗ السكريات البسيطة (حلويات، معجنات، كيك)
✗ المشروبات الغازية والعصائر المحلاة
✗ الدهون المشبعة والمتحولة
✗ الأطعمة المصنعة والوجبات السريعة

نموذج وجبة صحية:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
الإفطار: شوفان مع حليب خالي الدسم + تفاحة
الغداء: سمك مشوي + سلطة خضراء + أرز بني
العشاء: دجاج مشوي + خضروات مطبوخة`;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'guide_alimentation.txt';
    link.click();
    URL.revokeObjectURL(link.href);
    showCustomAlert('✅ تم تحميل دليل التغذية', 'تم التحميل');
}

// ربط أزرار التحميل
document.querySelectorAll('.download-card').forEach(card => {
    card.addEventListener('click', function() {
        const type = this.getAttribute('data-download');
        if (type === 'guide') telechargerGuide();
        else if (type === 'carte') telechargerCarte();
        else if (type === 'alimentation') telechargerAlimentation();
    });
});

// ============================================
// ربط الأحداث
// ============================================
document.getElementById('testRisqueBtn')?.addEventListener('click', () => {
    riskScore = 0;
    riskAnswers = [];
    currentRiskQuestion = 0;
    showRiskQuestion();
});
document.getElementById('calculerIMCBtn')?.addEventListener('click', calculateBMI);

// ============================================
// القائمة المنسدلة للهاتف
// ============================================
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');
if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// ============================================
// تمرير سلس للروابط
// ============================================
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });
});




// ============================================
// استخدام نظام الترجمة الديناميكي
// ============================================

// زر تبديل اللغة
document.getElementById('langBtn')?.addEventListener('click', () => {
  window.langManager.toggleLanguage();
  // تحديث النصوص الديناميكية بعد تغيير اللغة
  updateDynamicAlerts();
});

// تحديث التنبيهات الديناميكية
function updateDynamicAlerts() {
  const t = window.langManager.getText;
  
  // تحديث دالة الطوارئ
  const emergencyBtn = document.getElementById('emergency_btn');
  if (emergencyBtn) {
    const oldClick = emergencyBtn.onclick;
    emergencyBtn.onclick = () => {
      alert(window.langManager.getText('emergency_alert'));
    };
  }
}

// ============================================
// اختبار الخطر (ديناميكي)
// ============================================
function riskTest() {
  const t = window.langManager.getText;
  let score = 0;
  let answers = [];
  
  let q1 = confirm(t('risk_q1'));
  if (q1) { score++; answers.push('✓'); } else { answers.push('✗'); }
  
  let q2 = confirm(t('risk_q2'));
  if (q2) { score++; answers.push('✓'); } else { answers.push('✗'); }
  
  let q3 = confirm(t('risk_q3'));
  if (q3) { score++; answers.push('✓'); } else { answers.push('✗'); }
  
  let q4 = confirm(t('risk_q4'));
  if (q4) { score++; answers.push('✓'); } else { answers.push('✗'); }
  
  let q5 = confirm(t('risk_q5'));
  if (q5) { score++; answers.push('✓'); } else { answers.push('✗'); }
  
  let q6 = confirm(t('risk_q6'));
  if (!q6) { score++; answers.push('✓'); } else { answers.push('✗'); }
  
  let result = `📊 ${t('risk_result')}\n\n`;
  result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  result += `${t('risk_score')}: ${score}/6\n\n`;
  
  if (score >= 4) {
    result += `⚠️ ${t('risk_high')}\n${t('risk_high_advice')}`;
  } else if (score >= 2) {
    result += `⚠️ ${t('risk_medium')}\n${t('risk_medium_advice')}`;
  } else {
    result += `✓ ${t('risk_low')}\n${t('risk_low_advice')}`;
  }
  
  alert(result);
}

// ============================================
// حاسبة BMI (ديناميكية)
// ============================================
function calculateBMI() {
  const t = window.langManager.getText;
  let weight = prompt(t('bmi_weight'));
  let height = prompt(t('bmi_height'));
  
  if (weight && height) {
    weight = parseFloat(weight);
    height = parseFloat(height);
    let bmi = weight / (height * height);
    let status = '';
    
    if (bmi < 18.5) status = t('bmi_underweight');
    else if (bmi < 25) status = t('bmi_normal');
    else if (bmi < 30) status = t('bmi_overweight');
    else status = t('bmi_obese');
    
    alert(`${t('bmi_result')}: ${bmi.toFixed(1)}\n${t('bmi_status')}: ${status}`);
  }
}

// ============================================
// ربط الأحداث
// ============================================
document.getElementById('testRisqueBtn')?.addEventListener('click', riskTest);
document.getElementById('calculerIMCBtn')?.addEventListener('click', calculateBMI);

// ============================================
// تهيئة الصفحة
// ============================================
updateDynamicAlerts();

// استعادة التذكير المحفوظ
const savedRappel = localStorage.getItem('rappelECG');
if (savedRappel) {
  const t = window.langManager.getText;
  document.getElementById('rappel-message').innerHTML = `📅 ${t('next_reminder')}: ${savedRappel}`;
}
