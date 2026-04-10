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
// نظام الترجمة (Arabic / French)
// ============================================

// اللغات المتاحة
const translations = {
  ar: {
    // Header
    logoText: 'قلب السكري',
    navHome: 'الرئيسية',
    navComprendre: 'افهم مرضك',
    navSignes: 'علامات الخطر',
    navPrevention: 'الوقاية',
    navOutils: 'أدوات تفاعلية',
    navTelechargements: 'تحميلات',
    loginLink: 'دخول',
    registerLink: 'تسجيل',
    
    // Hero
    heroTitle: '❤️ قلب السكري',
    heroSubtitle: 'اعرف قلبك.. تحكم بسكريك',
    urgenceText: '🚨 زر الطوارئ: ماذا أفعل عند ظهور أعراض؟',
    
    // Comprendre
    comprendreTitle: '📘 افهم مرضك (Comprendre le risque)',
    comprendreText1: '<strong>العلاقة بين السكري وأمراض القلب:</strong> السكري يرفع نسبة السكر في الدم مما يؤدي إلى تلف الأوعية الدموية وتصلب الشرايين.',
    comprendreText2: '<strong>لماذا الخطر أكبر عند مريض السكري؟</strong> ارتفاع السكر المزمن يزيد الالتهابات ويضعف جدران الأوعية الدموية، ويسرع من تصلب الشرايين.',
    comprendreText3: '<strong>⚠️ مفهوم "الجلطة الصامتة":</strong> عند مريض السكري، قد تحدث نوبة قلبية دون ألم صدر، فقط تعب شديد أو غثيان أو عسر هضم. هذا يجعلها خطيرة لأن المريض قد لا يطلب المساعدة في الوقت المناسب.',
    
    // Signes
    signesTitle: '⚠️ علامات الخطر (Signes d\'alerte)',
    classicTitle: '📍 الأعراض الكلاسيكية',
    classic1: 'ألم أو ضغط في منتصف الصدر',
    classic2: 'ضيق في التنفس',
    classic3: 'تعرق بارد وغزير',
    classic4: 'دوار أو إغماء',
    atypicalTitle: '⚠️ الأعراض غير النمطية (الأكثر شيوعاً عند مرضى السكري)',
    atypical1: 'تعب مفاجئ شديد غير مبرر',
    atypical2: 'غثيان أو عسر هضم أو حرقة معدة',
    atypical3: 'آلام في الظهر بين الكتفين',
    atypical4: 'آلام في الفك أو الرقبة',
    
    // Prevention
    preventionTitle: '🥗 ركن الوقاية (Conseils Préventifs)',
    preventionText1: '<strong>🥗 التغذية:</strong> نظام DASH أو البحر الأبيض المتوسط - إكثار من الخضروات والفواكه والحبوب الكاملة، زيت الزيتون، الأسماك الدهنية، وتقليل الملح والسكريات.',
    preventionText2: '<strong>🏃 النشاط البدني:</strong> مشي 30 دقيقة يومياً، تمارين مقاومة خفيفة مرتين في الأسبوع، تمارين المرونة والتوازن.',
    preventionText3: '<strong>📊 متابعة الأرقام:</strong>',
    tableHeader1: 'القياس',
    tableHeader2: 'الهدف الموصى به',
    tableHeader3: 'متى أقيسه؟',
    row1Col1: 'ضغط الدم الانقباضي',
    row1Col2: '< 130 مم زئبق',
    row1Col3: 'يومياً',
    row2Col1: 'السكري التراكمي HBA1c',
    row2Col2: '< 7%',
    row2Col3: 'كل 3 شهور',
    row3Col1: 'الكوليسترول الضار LDL',
    row3Col2: '< 100 mg/dL',
    row3Col3: 'كل 6 شهور',
    row4Col1: 'سكر الصائم',
    row4Col2: '80-130 mg/dL',
    row4Col3: 'يومياً',
    
    // Outils
    outilsTitle: '🛠️ أدوات تفاعلية (Outils)',
    testTitle: 'اختبار سريع',
    testSubtitle: 'هل أنت في خطر؟',
    bmiTitle: 'حاسبة BMI',
    bmiSubtitle: 'احسب وزنك المثالي',
    calendarTitle: 'مفكرة المواعيد',
    calendarSubtitle: 'تذكير بفحص القلب',
    saveBtn: 'حفظ التذكير',
    
    // Downloads
    downloadsTitle: '📥 قسم التحميل (Téléchargements)',
    guideTitle: 'دليل التعرف على الأزمة القلبية الصامتة',
    guideText: 'PDF قابل للطباعة',
    carteTitle: 'بطاقة المريض',
    carteText: 'احملها معك في محفظتك',
    alimTitle: 'دليل التغذية لمرضى السكري والقلب',
    alimText: 'نظام DASH + المتوسطي',
    
    // Footer
    footerText: '© 2025 قلب السكري - موقع توعوي لمرضى السكري وأمراض القلب',
    footerEmergency: 'في حالة الطوارئ، اتصل بالإسعاف فوراً: 14 أو 997',
    
    // Emergency Alert
    emergencyAlert: '🚨 في حالة ظهور أي من علامات الخطر (ألم الصدر، ضيق التنفس، التعب المفاجئ، الغثيان، آلام الظهر أو الفك):\n\n1️⃣ اتصل بالإسعاف فوراً (14 أو 997)\n2️⃣ لا تقود السيارة بنفسك\n3️⃣ اجلس في وضع مريح\n4️⃣ إذا كنت تتناول الأسبرين وليس لديك حساسية منه، يمكنك مضغ قرص\n5️⃣ أخبر المسعفين أنك مريض سكري'
  },
  
  fr: {
    // Header
    logoText: 'Cœur et Diabète',
    navHome: 'Accueil',
    navComprendre: 'Comprendre',
    navSignes: 'Signes',
    navPrevention: 'Prévention',
    navOutils: 'Outils',
    navTelechargements: 'Téléchargements',
    loginLink: 'Connexion',
    registerLink: 'Inscription',
    
    // Hero
    heroTitle: '❤️ Cœur et Diabète',
    heroSubtitle: 'Connaissez votre cœur.. Contrôlez votre diabète',
    urgenceText: '🚨 Urgence: Que faire en cas de symptômes?',
    
    // Comprendre
    comprendreTitle: '📘 Comprendre votre maladie (Comprendre le risque)',
    comprendreText1: '<strong>Relation entre diabète et maladies cardiaques:</strong> Le diabète augmente le taux de sucre dans le sang, ce qui endommage les vaisseaux sanguins et accélère l\'athérosclérose.',
    comprendreText2: '<strong>Pourquoi le risque est-il plus élevé chez le diabétique?</strong> L\'hyperglycémie chronique augmente l\'inflammation et affaiblit les parois des vaisseaux sanguins.',
    comprendreText3: '<strong>⚠️ Concept de "crise silencieuse":</strong> Chez le diabétique, une crise cardiaque peut survenir sans douleur thoracique, seulement une fatigue intense, des nausées ou des indigestions.',
    
    // Signes
    signesTitle: '⚠️ Signes d\'alerte (Signes d\'alerte)',
    classicTitle: '📍 Symptômes classiques',
    classic1: 'Douleur ou pression dans la poitrine',
    classic2: 'Essoufflement',
    classic3: 'Sueurs froides et abondantes',
    classic4: 'Vertiges ou évanouissement',
    atypicalTitle: '⚠️ Symptômes atypiques (plus fréquents chez les diabétiques)',
    atypical1: 'Fatigue soudaine et intense inexpliquée',
    atypical2: 'Nausées, indigestion ou brûlures d\'estomac',
    atypical3: 'Douleurs dans le dos entre les omoplates',
    atypical4: 'Douleurs à la mâchoire ou au cou',
    
    // Prevention
    preventionTitle: '🥗 Conseils Préventifs (Conseils Préventifs)',
    preventionText1: '<strong>🥗 Alimentation:</strong> Régime DASH ou méditerranéen - Légumes, fruits, céréales complètes, huile d\'olive, poissons gras, réduction du sel et des sucres.',
    preventionText2: '<strong>🏃 Activité physique:</strong> Marche 30 minutes par jour, exercices de résistance légers deux fois par semaine.',
    preventionText3: '<strong>📊 Suivi des chiffres:</strong>',
    tableHeader1: 'Mesure',
    tableHeader2: 'Objectif recommandé',
    tableHeader3: 'Quand mesurer?',
    row1Col1: 'Tension artérielle systolique',
    row1Col2: '< 130 mmHg',
    row1Col3: 'Quotidien',
    row2Col1: 'HBA1c (diabète)',
    row2Col2: '< 7%',
    row2Col3: 'Tous les 3 mois',
    row3Col1: 'Cholestérol LDL',
    row3Col2: '< 100 mg/dL',
    row3Col3: 'Tous les 6 mois',
    row4Col1: 'Glycémie à jeun',
    row4Col2: '80-130 mg/dL',
    row4Col3: 'Quotidien',
    
    // Outils
    outilsTitle: '🛠️ Outils interactifs (Outils)',
    testTitle: 'Test rapide',
    testSubtitle: 'Êtes-vous à risque?',
    bmiTitle: 'Calculateur IMC',
    bmiSubtitle: 'Calculez votre poids idéal',
    calendarTitle: 'Agenda',
    calendarSubtitle: 'Rappel examen cardiaque',
    saveBtn: 'Enregistrer le rappel',
    
    // Downloads
    downloadsTitle: '📥 Téléchargements (Téléchargements)',
    guideTitle: 'Guide de la crise cardiaque silencieuse',
    guideText: 'PDF imprimable',
    carteTitle: 'Carte patient',
    carteText: 'Portez-la dans votre portefeuille',
    alimTitle: 'Guide nutritionnel pour diabétiques et cardiaques',
    alimText: 'Régime DASH + Méditerranéen',
    
    // Footer
    footerText: '© 2025 Cœur et Diabète - Site éducatif sur le diabète et les maladies cardiaques',
    footerEmergency: 'En cas d\'urgence, appelez les secours: 14 ou 997',
    
    // Emergency Alert
    emergencyAlert: '🚨 En cas de symptômes (douleur thoracique, essoufflement, fatigue soudaine, nausées, douleurs au dos ou à la mâchoire):\n\n1️⃣ Appelez les secours immédiatement (14 ou 997)\n2️⃣ Ne conduisez pas vous-même\n3️⃣ Asseyez-vous dans une position confortable\n4️⃣ Si vous prenez de l\'aspirine et n\'y êtes pas allergique, vous pouvez mâcher un comprimé\n5️⃣ Informez les secouristes que vous êtes diabétique'
  }
};

// اللغة الحالية
let currentLang = localStorage.getItem('language') || 'ar';

// تطبيق الترجمة
function applyTranslation() {
  const t = translations[currentLang];
  
  // تطبيق على العناصر
  document.getElementById('logoText').textContent = t.logoText;
  document.getElementById('navHome').textContent = t.navHome;
  document.getElementById('navComprendre').textContent = t.navComprendre;
  document.getElementById('navSignes').textContent = t.navSignes;
  document.getElementById('navPrevention').textContent = t.navPrevention;
  document.getElementById('navOutils').textContent = t.navOutils;
  document.getElementById('navTelechargements').textContent = t.navTelechargements;
  document.getElementById('loginLink').textContent = t.loginLink;
  document.getElementById('registerLink').textContent = t.registerLink;
  document.getElementById('heroTitle').innerHTML = t.heroTitle;
  document.getElementById('heroSubtitle').textContent = t.heroSubtitle;
  document.getElementById('urgenceText').innerHTML = t.urgenceText;
  document.getElementById('comprendreTitle').innerHTML = t.comprendreTitle;
  document.getElementById('comprendreText1').innerHTML = t.comprendreText1;
  document.getElementById('comprendreText2').innerHTML = t.comprendreText2;
  document.getElementById('comprendreText3').innerHTML = t.comprendreText3;
  document.getElementById('signesTitle').innerHTML = t.signesTitle;
  document.getElementById('classicTitle').innerHTML = t.classicTitle;
  document.getElementById('classic1').textContent = t.classic1;
  document.getElementById('classic2').textContent = t.classic2;
  document.getElementById('classic3').textContent = t.classic3;
  document.getElementById('classic4').textContent = t.classic4;
  document.getElementById('atypicalTitle').innerHTML = t.atypicalTitle;
  document.getElementById('atypical1').textContent = t.atypical1;
  document.getElementById('atypical2').textContent = t.atypical2;
  document.getElementById('atypical3').textContent = t.atypical3;
  document.getElementById('atypical4').textContent = t.atypical4;
  document.getElementById('preventionTitle').innerHTML = t.preventionTitle;
  document.getElementById('preventionText1').innerHTML = t.preventionText1;
  document.getElementById('preventionText2').innerHTML = t.preventionText2;
  document.getElementById('preventionText3').innerHTML = t.preventionText3;
  document.getElementById('tableHeader1').textContent = t.tableHeader1;
  document.getElementById('tableHeader2').textContent = t.tableHeader2;
  document.getElementById('tableHeader3').textContent = t.tableHeader3;
  document.getElementById('row1Col1').textContent = t.row1Col1;
  document.getElementById('row1Col2').innerHTML = t.row1Col2;
  document.getElementById('row1Col3').textContent = t.row1Col3;
  document.getElementById('row2Col1').textContent = t.row2Col1;
  document.getElementById('row2Col2').innerHTML = t.row2Col2;
  document.getElementById('row2Col3').textContent = t.row2Col3;
  document.getElementById('row3Col1').textContent = t.row3Col1;
  document.getElementById('row3Col2').innerHTML = t.row3Col2;
  document.getElementById('row3Col3').textContent = t.row3Col3;
  document.getElementById('row4Col1').textContent = t.row4Col1;
  document.getElementById('row4Col2').innerHTML = t.row4Col2;
  document.getElementById('row4Col3').textContent = t.row4Col3;
  document.getElementById('outilsTitle').innerHTML = t.outilsTitle;
  document.getElementById('testTitle').textContent = t.testTitle;
  document.getElementById('testSubtitle').textContent = t.testSubtitle;
  document.getElementById('bmiTitle').textContent = t.bmiTitle;
  document.getElementById('bmiSubtitle').textContent = t.bmiSubtitle;
  document.getElementById('calendarTitle').textContent = t.calendarTitle;
  document.getElementById('calendarSubtitle').textContent = t.calendarSubtitle;
  if (document.getElementById('saveBtn')) document.getElementById('saveBtn').textContent = t.saveBtn;
  document.getElementById('downloadsTitle').innerHTML = t.downloadsTitle;
  document.getElementById('guideTitle').textContent = t.guideTitle;
  document.getElementById('guideText').textContent = t.guideText;
  document.getElementById('carteTitle').textContent = t.carteTitle;
  document.getElementById('carteText').textContent = t.carteText;
  document.getElementById('alimTitle').textContent = t.alimTitle;
  document.getElementById('alimText').textContent = t.alimText;
  document.getElementById('footerText').textContent = t.footerText;
  document.getElementById('footerEmergency').textContent = t.footerEmergency;
  
  // تغيير اتجاه الصفحة
  if (currentLang === 'ar') {
    document.body.style.direction = 'rtl';
    document.documentElement.lang = 'ar';
    document.getElementById('langText').textContent = 'FR';
  } else {
    document.body.style.direction = 'ltr';
    document.documentElement.lang = 'fr';
    document.getElementById('langText').textContent = 'AR';
  }
  
  localStorage.setItem('language', currentLang);
}

// تبديل اللغة
function toggleLanguage() {
  currentLang = currentLang === 'ar' ? 'fr' : 'ar';
  applyTranslation();
}

// ============================================
// زر الطوارئ (مع الترجمة)
// ============================================
document.getElementById('urgenceBtn')?.addEventListener('click', function() {
  const t = translations[currentLang];
  alert(t.emergencyAlert);
});

// ============================================
// زر تبديل اللغة
// ============================================
document.getElementById('langBtn')?.addEventListener('click', toggleLanguage);

// ============================================
// باقي دوال الموقع (اختبار الخطر، BMI، إلخ)
// ============================================

// اختبار الخطر
function riskTest() {
    let score = 0;
    let answers = [];
    
    let q1 = confirm(currentLang === 'ar' ? '⚠️ السؤال 1/6: هل عمرك أكثر من 45 سنة؟' : '⚠️ Question 1/6: Avez-vous plus de 45 ans?');
    if (q1) { score++; answers.push(currentLang === 'ar' ? '✓ العمر > 45' : '✓ Âge > 45'); } 
    else { answers.push(currentLang === 'ar' ? '✗ العمر ≤ 45' : '✗ Âge ≤ 45'); }
    
    let q2 = confirm(currentLang === 'ar' ? '⚠️ السؤال 2/6: هل لديك تاريخ عائلي لأمراض القلب؟' : '⚠️ Question 2/6: Avez-vous des antécédents familiaux de maladie cardiaque?');
    if (q2) { score++; answers.push(currentLang === 'ar' ? '✓ يوجد تاريخ عائلي' : '✓ Antécédents familiaux'); } 
    else { answers.push(currentLang === 'ar' ? '✗ لا يوجد تاريخ عائلي' : '✗ Pas d\'antécédents'); }
    
    let q3 = confirm(currentLang === 'ar' ? '⚠️ السؤال 3/6: هل تعاني من ارتفاع ضغط الدم؟' : '⚠️ Question 3/6: Souffrez-vous d\'hypertension artérielle?');
    if (q3) { score++; answers.push(currentLang === 'ar' ? '✓ يعاني من ضغط مرتفع' : '✓ Hypertension'); } 
    else { answers.push(currentLang === 'ar' ? '✗ ضغط طبيعي' : '✗ Tension normale'); }
    
    let q4 = confirm(currentLang === 'ar' ? '⚠️ السؤال 4/6: هل تدخن؟' : '⚠️ Question 4/6: Fumez-vous?');
    if (q4) { score++; answers.push(currentLang === 'ar' ? '✓ مدخن' : '✓ Fumeur'); } 
    else { answers.push(currentLang === 'ar' ? '✗ غير مدخن' : '✗ Non-fumeur'); }
    
    let q5 = confirm(currentLang === 'ar' ? '⚠️ السؤال 5/6: هل تعاني من السمنة أو الوزن الزائد؟' : '⚠️ Question 5/6: Souffrez-vous d\'obésité ou de surpoids?');
    if (q5) { score++; answers.push(currentLang === 'ar' ? '✓ وزن زائد' : '✓ Surpoids'); } 
    else { answers.push(currentLang === 'ar' ? '✗ وزن طبيعي' : '✗ Poids normal'); }
    
    let q6 = confirm(currentLang === 'ar' ? '⚠️ السؤال 6/6: هل تمارس الرياضة بانتظام (30 دقيقة يومياً)؟' : '⚠️ Question 6/6: Faites-vous de l\'exercice régulièrement (30 minutes par jour)?');
    if (!q6) { score++; answers.push(currentLang === 'ar' ? '✓ لا يمارس رياضة' : '✓ Pas d\'exercice'); } 
    else { answers.push(currentLang === 'ar' ? '✗ يمارس رياضة' : '✗ Fait de l\'exercice'); }
    
    let result = (currentLang === 'ar' ? '📊 نتيجة اختبار خطر أمراض القلب\n\n' : '📊 Résultat du test de risque cardiaque\n\n');
    result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    result += (currentLang === 'ar' ? `نقاط الخطر: ${score}/6\n\n` : `Points de risque: ${score}/6\n\n`);
    
    if (score >= 4) {
        result += (currentLang === 'ar' ? '⚠️ مستوى الخطر: مرتفع جداً!\n' : '⚠️ Niveau de risque: Très élevé!\n');
        result += (currentLang === 'ar' ? 'ننصحك بمراجعة طبيب القلب فوراً\n' : 'Nous vous conseillons de consulter un cardiologue immédiatement\n');
    } else if (score >= 2) {
        result += (currentLang === 'ar' ? '⚠️ مستوى الخطر: متوسط\n' : '⚠️ Niveau de risque: Moyen\n');
        result += (currentLang === 'ar' ? 'لديك بعض عوامل الخطر. اتبع نصائح الوقاية\n' : 'Vous avez certains facteurs de risque. Suivez les conseils de prévention\n');
    } else {
        result += (currentLang === 'ar' ? '✓ مستوى الخطر: منخفض\n' : '✓ Niveau de risque: Faible\n');
        result += (currentLang === 'ar' ? 'ممتاز! استمر في نمط الحياة الصحي\n' : 'Excellent! Continuez votre mode de vie sain\n');
    }
    
    alert(result);
}

// حاسبة BMI
function calculateBMI() {
    let weight = prompt(currentLang === 'ar' ? '⚖️ أدخل وزنك بالكيلوغرام:' : '⚖️ Entrez votre poids en kilogrammes:');
    let height = prompt(currentLang === 'ar' ? '📏 أدخل طولك بالمتر (مثال: 1.75):' : '📏 Entrez votre taille en mètres (ex: 1.75):');
    
    if (weight && height) {
        weight = parseFloat(weight);
        height = parseFloat(height);
        let bmi = weight / (height * height);
        let status = '';
        
        if (bmi < 18.5) status = currentLang === 'ar' ? 'نقص وزن' : 'Insuffisance pondérale';
        else if (bmi < 25) status = currentLang === 'ar' ? 'وزن طبيعي' : 'Poids normal';
        else if (bmi < 30) status = currentLang === 'ar' ? 'وزن زائد' : 'Surpoids';
        else status = currentLang === 'ar' ? 'سمنة' : 'Obésité';
        
        alert(`${currentLang === 'ar' ? 'BMI' : 'IMC'}: ${bmi.toFixed(1)}\n${currentLang === 'ar' ? 'التصنيف' : 'Classification'}: ${status}`);
    }
}

// ============================================
// ربط الأحداث
// ============================================
document.getElementById('testRisqueBtn')?.addEventListener('click', riskTest);
document.getElementById('calculerIMCBtn')?.addEventListener('click', calculateBMI);

// مفكرة المواعيد
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
        const msg = currentLang === 'ar' ? `✅ تم حفظ تذكير فحص القلب يوم ${date}` : `✅ Rappel pour examen cardiaque enregistré le ${date}`;
        document.getElementById('rappel-message').innerHTML = msg;
        alert(msg);
    } else {
        alert(currentLang === 'ar' ? '❌ الرجاء اختيار تاريخ' : '❌ Veuillez choisir une date');
    }
});

// تحميل الملفات
function telechargerGuide() {
    const content = currentLang === 'ar' ? 'دليل التعرف على الأزمة القلبية الصامتة...' : 'Guide de la crise cardiaque silencieuse...';
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = currentLang === 'ar' ? 'guide_cardiaque.txt' : 'guide_cardiaque.txt';
    link.click();
    alert(currentLang === 'ar' ? '✅ تم التحميل' : '✅ Téléchargement terminé');
}

document.querySelectorAll('.download-card').forEach(card => {
    card.addEventListener('click', () => telechargerGuide());
});

// ============================================
// تطبيق اللغة عند تحميل الصفحة
// ============================================
applyTranslation();

// القائمة المنسدلة للهاتف
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');
if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// استعادة التذكير
const savedRappel = localStorage.getItem('rappelECG');
if (savedRappel) {
    const msg = currentLang === 'ar' ? `📅 التذكير القادم لفحص القلب: ${savedRappel}` : `📅 Prochain rappel examen cardiaque: ${savedRappel}`;
    document.getElementById('rappel-message').innerHTML = msg;
}
