// ============================================
// دوال مساعدة لإنشاء النوافذ المنبثقة المخصصة (نفس الدوال في index.js)
// ============================================

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
        <div style="margin: 1rem 0; text-align: right; line-height: 1.6; white-space: pre-line;">${message}</div>
        <button id="alertCloseBtn" style="background: linear-gradient(135deg, #dc2626, #2563eb); color: white; border: none; padding: 10px 30px; border-radius: 10px; cursor: pointer; margin-top: 1rem;">موافق</button>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    document.getElementById('alertCloseBtn').onclick = () => overlay.remove();
}

// نافذة إدخال مخصصة
function showCustomPrompt(title, placeholder, callback, isNumber = true) {
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
        <input type="${isNumber ? 'number' : 'text'}" id="promptInput" step="any" placeholder="${placeholder}" style="width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 10px; margin: 1rem 0; font-size: 1rem;">
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
// التحقق من تسجيل الدخول
// ============================================
const currentUser = localStorage.getItem('currentUser');
if (!currentUser) {
    window.location.href = '../Signup/login.html';
}

const user = JSON.parse(currentUser);
if (user.type === 'admin') {
    window.location.href = '../admin/admin.html';
}

document.getElementById('userName').textContent = user.name;

// ============================================
// تسجيل الخروج
// ============================================
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = '../Signup/login.html';
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
        // حفظ النتيجة
        const results = JSON.parse(localStorage.getItem(`testResults_${user.email}`) || '[]');
        results.push({ date: new Date().toISOString(), score: riskScore });
        localStorage.setItem(`testResults_${user.email}`, JSON.stringify(results));
        
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
        localStorage.setItem(`lastBMI_${user.email}`, bmi.toFixed(1));
    };
    
    document.getElementById('closeBmiBtn').onclick = () => overlay.remove();
}

// ============================================
// تحديث القراءات الطبية (بنافذة مخصصة)
// ============================================
function updateReadings() {
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
        <h3 style="color: #1a472a; margin-bottom: 1rem;">📊 تحديث القراءات الطبية</h3>
        <div style="margin: 1rem 0;">
            <label style="display: block; text-align: right; margin-bottom: 0.5rem;">السكري التراكمي HBA1c (%) - الهدف &lt;7%</label>
            <input type="number" id="hba1cInput" step="0.1" placeholder="مثال: 6.5" style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 10px;">
        </div>
        <div style="margin: 1rem 0;">
            <label style="display: block; text-align: right; margin-bottom: 0.5rem;">ضغط الدم (mmHg) - الهدف &lt;130</label>
            <input type="text" id="bpInput" placeholder="مثال: 120/80" style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 10px;">
        </div>
        <div style="margin: 1rem 0;">
            <label style="display: block; text-align: right; margin-bottom: 0.5rem;">الكوليسترول LDL (mg/dL) - الهدف &lt;100</label>
            <input type="number" id="cholesterolInput" placeholder="مثال: 95" style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 10px;">
        </div>
        <div style="margin: 1rem 0;">
            <label style="display: block; text-align: right; margin-bottom: 0.5rem;">سكر الصائم (mg/dL) - الهدف 80-130</label>
            <input type="number" id="fastingSugarInput" placeholder="مثال: 110" style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 10px;">
        </div>
        <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
            <button id="saveReadingsBtn" style="flex: 1; background: #1a472a; color: white; border: none; padding: 12px; border-radius: 10px; cursor: pointer;">حفظ</button>
            <button id="closeReadingsBtn" style="flex: 1; background: #dc2626; color: white; border: none; padding: 12px; border-radius: 10px; cursor: pointer;">إلغاء</button>
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    document.getElementById('saveReadingsBtn').onclick = () => {
        const hba1c = document.getElementById('hba1cInput').value;
        const bp = document.getElementById('bpInput').value;
        const cholesterol = document.getElementById('cholesterolInput').value;
        const fastingSugar = document.getElementById('fastingSugarInput').value;
        
        const userData = JSON.parse(localStorage.getItem(`userData_${user.email}`) || '{}');
        
        if (hba1c) { userData.hba1c = hba1c; document.getElementById('hba1c').textContent = hba1c; }
        if (bp) { userData.bp = bp; document.getElementById('bp').textContent = bp; }
        if (cholesterol) { userData.cholesterol = cholesterol; document.getElementById('cholesterol').textContent = cholesterol; }
        if (fastingSugar) { userData.fastingSugar = fastingSugar; document.getElementById('fastingSugar').textContent = fastingSugar; }
        
        localStorage.setItem(`userData_${user.email}`, JSON.stringify(userData));
        overlay.remove();
        showCustomAlert('✅ تم تحديث القراءات بنجاح!', 'تم التحديث');
    };
    
    document.getElementById('closeReadingsBtn').onclick = () => overlay.remove();
}

// ============================================
// إضافة موعد (بنافذة مخصصة)
// ============================================
function addAppointment() {
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
        <h3 style="color: #1a472a; margin-bottom: 1rem;">📅 إضافة موعد جديد</h3>
        <div style="margin: 1rem 0;">
            <label style="display: block; text-align: right; margin-bottom: 0.5rem;">تاريخ الموعد:</label>
            <input type="date" id="appointmentDate" style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 10px;">
        </div>
        <div style="margin: 1rem 0;">
            <label style="display: block; text-align: right; margin-bottom: 0.5rem;">نوع الموعد:</label>
            <select id="appointmentType" style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 10px;">
                <option value="فحص قلب ECG">فحص قلب ECG</option>
                <option value="تحليل دم شامل">تحليل دم شامل</option>
                <option value="موعد مع طبيب القلب">موعد مع طبيب القلب</option>
                <option value="فحص السكري التراكمي">فحص السكري التراكمي</option>
                <option value="موعد مع أخصائي تغذية">موعد مع أخصائي تغذية</option>
            </select>
        </div>
        <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
            <button id="saveAppointmentBtn" style="flex: 1; background: #1a472a; color: white; border: none; padding: 12px; border-radius: 10px; cursor: pointer;">حفظ</button>
            <button id="closeAppointmentBtn" style="flex: 1; background: #dc2626; color: white; border: none; padding: 12px; border-radius: 10px; cursor: pointer;">إلغاء</button>
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    document.getElementById('saveAppointmentBtn').onclick = () => {
        const date = document.getElementById('appointmentDate').value;
        const title = document.getElementById('appointmentType').value;
        
        if (!date) {
            showCustomAlert('❌ الرجاء اختيار تاريخ', 'خطأ');
            return;
        }
        
        const appointments = JSON.parse(localStorage.getItem(`appointments_${user.email}`) || '[]');
        appointments.push({ date, title });
        localStorage.setItem(`appointments_${user.email}`, JSON.stringify(appointments));
        loadAppointments();
        overlay.remove();
        showCustomAlert('✅ تم إضافة الموعد بنجاح!', 'تم الحفظ');
    };
    
    document.getElementById('closeAppointmentBtn').onclick = () => overlay.remove();
}

// ============================================
// تحميل المواعيد
// ============================================
function loadAppointments() {
    const appointments = JSON.parse(localStorage.getItem(`appointments_${user.email}`) || '[]');
    const list = document.getElementById('appointmentsList');
    
    if (appointments.length === 0) {
        list.innerHTML = '<li style="text-align: center; color: #999;">📅 لا توجد مواعيد مسجلة</li>';
        return;
    }
    
    list.innerHTML = '';
    appointments.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    appointments.forEach((app, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span style="font-weight: bold; color: #1a472a;">${app.date}</span>
            <span>${app.title}</span>
            <button onclick="deleteAppointment(${index})" style="background: #dc2626; color: white; border: none; border-radius: 5px; padding: 3px 8px; cursor: pointer;">✗</button>
        `;
        list.appendChild(li);
    });
}

function deleteAppointment(index) {
    const confirmOverlay = document.createElement('div');
    confirmOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        backdrop-filter: blur(5px);
        z-index: 10001;
        display: flex;
        justify-content: center;
        align-items: center;
    `;
    
    const confirmModal = document.createElement('div');
    confirmModal.style.cssText = `
        background: white;
        border-radius: 20px;
        padding: 2rem;
        max-width: 350px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        border-top: 5px solid #dc2626;
    `;
    
    confirmModal.innerHTML = `
        <h3 style="color: #1a472a; margin-bottom: 1rem;">🗑️ تأكيد الحذف</h3>
        <p style="margin-bottom: 1.5rem;">هل أنت متأكد من حذف هذا الموعد؟</p>
        <div style="display: flex; gap: 1rem; justify-content: center;">
            <button id="confirmDeleteBtn" style="background: #dc2626; color: white; border: none; padding: 8px 20px; border-radius: 8px; cursor: pointer;">نعم، احذف</button>
            <button id="cancelDeleteBtn" style="background: #64748b; color: white; border: none; padding: 8px 20px; border-radius: 8px; cursor: pointer;">إلغاء</button>
        </div>
    `;
    
    confirmOverlay.appendChild(confirmModal);
    document.body.appendChild(confirmOverlay);
    
    document.getElementById('confirmDeleteBtn').onclick = () => {
        const appointments = JSON.parse(localStorage.getItem(`appointments_${user.email}`) || '[]');
        appointments.splice(index, 1);
        localStorage.setItem(`appointments_${user.email}`, JSON.stringify(appointments));
        loadAppointments();
        confirmOverlay.remove();
        showCustomAlert('✅ تم حذف الموعد', 'تم الحذف');
    };
    
    document.getElementById('cancelDeleteBtn').onclick = () => confirmOverlay.remove();
}

// ============================================
// النصائح اليومية
// ============================================
const tips = [
    '🚶 ابدأ يومك بـ 30 دقيقة مشي - المشي يحسن الدورة الدموية ويخفض السكر',
    '💧 اشرب 8-10 أكواب ماء يومياً - الترطيب الجيد يساعد الكلى',
    '🥗 تناول الخضروات الورقية الداكنة - غنية بالمغنيسيوم المفيد للقلب',
    '😴 نام 7-8 ساعات يومياً - قلة النوم تزيد مقاومة الأنسولين',
    '📊 راجع سكري الدم بانتظام - المعرفة قوة في التحكم بالسكري',
    '❤️ قياس ضغط الدم أسبوعياً مهم جداً - ارتفاع الضغط قاتل صامت',
    '🥑 زيت الزيتون بديل صحي للدهون - غني بمضادات الأكسدة',
    '🚫 ابتعد عن المشروبات الغازية والسكرية - تسبب ارتفاع مفاجئ في السكر',
    '🐟 تناول السمك مرتين أسبوعياً - غني بأوميغا 3 المفيد للقلب',
    '🧘‍♂️ ممارسة التأمل والتنفس العميق - تقلل التوتر وضغط الدم'
];

function newTip() {
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    document.getElementById('dailyTip').innerHTML = randomTip;
}

// ============================================
// تحميل الملفات
// ============================================
function telechargerGuide() {
    const content = `دليل التعرف على الأزمة القلبية الصامتة...`;
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'guide.txt';
    link.click();
    showCustomAlert('✅ تم تحميل الدليل', 'تم التحميل');
}

// ============================================
// تحميل البيانات المحفوظة
// ============================================
function loadUserData() {
    const userData = JSON.parse(localStorage.getItem(`userData_${user.email}`) || '{}');
    if (userData.hba1c) document.getElementById('hba1c').textContent = userData.hba1c;
    if (userData.bp) document.getElementById('bp').textContent = userData.bp;
    if (userData.cholesterol) document.getElementById('cholesterol').textContent = userData.cholesterol;
    if (userData.fastingSugar) document.getElementById('fastingSugar').textContent = userData.fastingSugar;
    
    let loginCount = parseInt(localStorage.getItem(`loginCount_${user.email}`) || '0');
    document.getElementById('loginCount').textContent = loginCount;
    
    const lastLogin = localStorage.getItem(`lastLogin_${user.email}`);
    if (lastLogin) document.getElementById('lastLogin').textContent = new Date(lastLogin).toLocaleDateString('ar');
    
    const memberSince = localStorage.getItem(`memberSince_${user.email}`);
    if (memberSince) document.getElementById('memberSince').textContent = new Date(memberSince).toLocaleDateString('ar');
    else {
        const today = new Date().toISOString();
        localStorage.setItem(`memberSince_${user.email}`, today);
        document.getElementById('memberSince').textContent = new Date(today).toLocaleDateString('ar');
    }
}

// ============================================
// تحديث إحصائيات تسجيل الدخول
// ============================================
function updateLoginStats() {
    let loginCount = parseInt(localStorage.getItem(`loginCount_${user.email}`) || '0');
    loginCount++;
    localStorage.setItem(`loginCount_${user.email}`, loginCount);
    localStorage.setItem(`lastLogin_${user.email}`, new Date().toISOString());
}

// ============================================
// ربط الأحداث
// ============================================
document.getElementById('riskTestBtn').addEventListener('click', () => {
    riskScore = 0;
    riskAnswers = [];
    currentRiskQuestion = 0;
    showRiskQuestion();
});
document.getElementById('bmiBtn').addEventListener('click', calculateBMI);
document.getElementById('updateReadingsBtn').addEventListener('click', updateReadings);
document.getElementById('addAppointmentBtn').addEventListener('click', addAppointment);
document.getElementById('newTipBtn').addEventListener('click', newTip);

document.querySelectorAll('.download-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        telechargerGuide();
    });
});

// ============================================
// تهيئة الصفحة
// ============================================
updateLoginStats();
loadUserData();
loadAppointments();
newTip();

window.deleteAppointment = deleteAppointment;