// --- FIREBASE SOZLAMALARI ---
const firebaseConfig = {
    apiKey: "AIzaSyALWGXz15GQslY6fJI8noiLbXKH-yCB1gI",
    authDomain: "web-ilova.firebaseapp.com",
    projectId: "web-ilova",
    storageBucket: "web-ilova.firebasestorage.app",
    messagingSenderId: "222468122005",
    appId: "1:222468122005:web:a1e6133308239fb94d829c",
    measurementId: "G-JYFJ8EC26D"
};

// Firebase ni ishga tushirish (Compat versiyasi uchun)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// 🔒 SIZNING ADMIN GMAIL
const ADMIN_EMAIL = "javohirjon0508@gmail.com";

// Case ochish funksiyasi
function openCase(caseId) {
    const modal = document.getElementById('caseModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');

    if (caseId === 'case_001') {
        modalTitle.innerText = "001. Muzeydagi Qimmatbaho Rasm O'g'irligi";
        modalDesc.innerText = "Tungi soat 02:00 da markaziy muzeydan noyob san'at asari g'oyib bo'ldi. Alarm tizimi o'chirilgan.";
    }

    modal.style.display = 'flex';
    switchTab('scene'); // Boshlang'ich tab
}

// Oynani yopish
function closeCase() {
    const modal = document.getElementById('caseModal');
    modal.style.display = 'none';
}

// Tablar bo'yicha ma'lumotlarni almashtirish
function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    event && event.target && event.target.classList.add('active');

    const contentDiv = document.getElementById('tabContent');

    if (tabName === 'scene') {
        contentDiv.innerHTML = `
            <h3>Hodisa Joyi: Muzey Zali</h3>
            <p>Xona qorong'u, deraza sindirilmagan. Xavfsizlik pulti yonida g'alati izlar bor. Topish uchun narsalarni bosing:</p>
            <div class="crime-scene-container" style="position: relative; margin-top: 20px; text-align: center;">
                <div style="width: 100%; height: 350px; background: #222228; border: 2px solid #333; border-radius: 8px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;">
                    <span style="color: #666; font-size: 14px;">[Muzey Zali Fon Rasmi]</span>
                    <div onclick="foundEvidence('evidence_201', 'Buzilgan signalizatsiya pulti')" style="position: absolute; bottom: 40px; left: 30%; width: 30px; height: 30px; background: rgba(255, 183, 3, 0.4); border: 2px solid #ffb703; border-radius: 50%; cursor: pointer; animation: pulse 1.5s infinite;" title="Dalil bor!"></div>
                </div>
            </div>
        `;
    } else if (tabName === 'suspects') {
        contentDiv.innerHTML = `
            <h3>Gumondorlar Ro'yxati</h3>
            <div style="margin-top: 15px; background: #1f1f24; padding: 15px; border-radius: 6px;">
                <strong>1. Alex Klement (Muzey qorovuli)</strong>
                <p style="color: #999; font-size: 13px;">Alibi: Hodisa vaqtida uxlayotgan bo'lgan. Qarzlarini yopish uchun sababi bor.</p>
            </div>
        `;
    } else if (tabName === 'evidence') {
        contentDiv.innerHTML = `
            <h3>Topilgan Dalillar</h3>
            <p>${collectedEvidences.length > 0 ? collectedEvidences.map(e => `• ${e.title}`).join('<br>') : "Hozircha topilgan dalillar mavjud emas. Hodisa joyidan qidiring!"}</p>
        `;
    } else if (tabName === 'phone') {
        contentDiv.innerHTML = `
            <h3>Virtual Telefon (Xabarlar va Qo'ng'iroqlar)</h3>
            <div style="margin-top: 15px; background: #1a1a1e; padding: 15px; border-radius: 8px; border: 1px solid #333;">
                <h4 style="color: #ffb703; margin-bottom: 10px;">💬 SMS Xabarlar</h4>
                <div style="background: #25252b; padding: 10px; border-radius: 6px; margin-bottom: 8px;">
                    <small style="color: #888;">Noma'lum ➔ Alex Klement (23:45)</small>
                    <p style="margin-top: 5px;">Kalitni belgilangan joyda qoldir, qolgan pulni ertaga olasan.</p>
                </div>
                <h4 style="color: #ffb703; margin: 15px 0 10px 0;">📞 Qo'ng'iroqlar tarixi</h4>
                <p style="color: #bbb; font-size: 14px;">• 01:10 - Kiruvchi qo'ng'iroq (+998 90 123-45-67) - Davomiyligi: 02:15</p>
            </div>
        `;
    } else if (tabName === 'cctv') {
        contentDiv.innerHTML = `
            <h3>CCTV - Kuzatuv Kameralari</h3>
            <p>Muzey yo'lagidagi tunda olingan xavfsizlik kamerasi yozuvi:</p>
            <div style="margin-top: 15px; padding: 40px; background: #111; border: 2px solid #ffb703; border-radius: 8px; text-align: center;">
                📹 [CCTV Videokadr: 02:02 da koridordan o'tgan shaxs silueti] <br>
                <button onclick="foundEvidence('evidence_202', 'CCTV Video yozuvi')" style="margin-top: 15px; background: #ffb703; border: none; padding: 8px 15px; font-weight: bold; border-radius: 4px; cursor: pointer;">Dalil sifatida saqlash</button>
            </div>
        `;
    } else if (tabName === 'board') {
        contentDiv.innerHTML = `
            <h3>Detective Board (Tergov Doskasi)</h3>
            <p>To'plangan dalillar va gumondorlarni tahlil qilib, yakuniy xulosaga keling:</p>
            
            <div style="margin-top: 15px; background: #1a1a1e; padding: 20px; border-radius: 8px; border: 1px solid #333;">
                <h4 style="color: #ffb703; margin-bottom: 10px;">📌 Tergov Xulosasi</h4>
                <p style="font-size: 14px; color: #ccc; margin-bottom: 15px;">Hozirgi topilgan dalillar soni: <strong>${collectedEvidences.length} ta</strong></p>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-size: 14px;">Asosiy Jinoyatchi kim deb o'ylaysiz?</label>
                    <select id="killerSelect" style="width: 100%; padding: 10px; background: #25252b; color: #fff; border: 1px solid #444; border-radius: 4px;">
                        <option value="alex">Alex Klement (Muzey qorovuli)</option>
                        <option value="none">Noma'lum shaxs</option>
                    </select>
                </div>

                <button onclick="checkCaseSolution()" style="width: 100%; background-color: #ffb703; color: #000; border: none; padding: 12px; font-weight: bold; border-radius: 5px; cursor: pointer;">Jinoyatni Ochish va Tekshirish</button>
            </div>
        `;
    }
}

// Topilgan dalillar massivi
let collectedEvidences = [];

function foundEvidence(id, title) {
    if (!collectedEvidences.some(e => e.id === id)) {
        collectedEvidences.push({ id, title });
        alert(`Tabriklayman! Yangi dalil topildi: "${title}"`);
    } else {
        alert("Bu dalil allaqachon topilgan!");
    }
}

// Ish yechimini tekshirish
function checkCaseSolution() {
    const selectedKiller = document.getElementById('killerSelect').value;
    
    if (selectedKiller === 'alex') {
        alert("Tabriklayman! Siz jinoyatni muvaffaqiyatli ochdingiz! 🏆 Sizga 500 XP berildi.");
        closeCase();
    } else {
        alert("Noto'g'ri xulosa! Dalillarni yana bir bor ko'zdan kechiring.");
    }
}

// Google orqali kirish / Chiqish funksiyasi
function toggleAuth() {
    const user = auth.currentUser;
    if (!user) {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
            .then((result) => {
                alert(`Xush kelibsiz, ${result.user.displayName}!`);
            })
            .catch((error) => {
                alert("Xatolik yuz berdi: " + error.message);
            });
    } else {
        auth.signOut().then(() => {
            alert("Tizimdan chiqildi.");
        });
    }
}

// Foydalanuvchi holatini kuzatib borish (Admin tugmasini boshqarish)
auth.onAuthStateChanged((user) => {
    const authBtn = document.getElementById('authBtn');
    const adminNavBtn = document.getElementById('adminNavBtn');

    if (user) {
        authBtn.innerText = `Chiqish (${user.displayName.split(' ')[0]})`;
        
        // Agar kirgan foydalanuvchi aynan siz bo'lsangizgina Admin panelni ko'rsatish
        if (user.email === ADMIN_EMAIL) {
            if (adminNavBtn) adminNavBtn.style.display = 'inline-block';
        } else {
            if (adminNavBtn) adminNavBtn.style.display = 'none';
        }
        
        // Ma'lumotlar bazasiga foydalanuvchini saqlash
        db.collection("users").doc(user.uid).set({
            name: user.displayName,
            email: user.email,
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

    } else {
        authBtn.innerText = "Google bilan kirish";
        if (adminNavBtn) adminNavBtn.style.display = 'none';
        const adminSection = document.getElementById('adminSection');
        if (adminSection) adminSection.style.display = 'none';
    }
});

// Admin panelni ochib-yopish funksiyasi
function showAdminPanel() {
    const adminSection = document.getElementById('adminSection');
    if (adminSection) {
        adminSection.style.display = adminSection.style.display === 'none' ? 'block' : 'none';
    }
}

// Yangi ishni bazaga qo'shish
function addNewCase() {
    const title = document.getElementById('adminCaseTitle').value;
    const desc = document.getElementById('adminCaseDesc').value;

    if (!title || !desc) {
        alert("Iltimos, barcha maydonlarni to'ldiring!");
        return;
    }

    db.collection("cases").add({
        title: title,
        description: desc,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        alert("Yangi ish bazaga muvaffaqiyatli qo'shildi!");
        document.getElementById('adminCaseTitle').value = '';
        document.getElementById('adminCaseDesc').value = '';
        document.getElementById('adminSection').style.display = 'none';
    })
    .catch((error) => {
        alert("Xatolik: " + error.message);
    });
}// Yangi ishni bazaga saqlash va chiqarish
function addNewCase() {
    const title = document.getElementById('adminCaseTitle').value;
    const desc = document.getElementById('adminCaseDesc').value;

    if (!title || !desc) {
        alert("Iltimos, barcha maydonlarni to'ldiring!");
        return;
    }

    // Firestore bazasiga qo'shish
    db.collection("cases").add({
        title: title,
        description: desc,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        alert("Yangi ish bazaga muvaffaqiyatli qo'shildi!");
        document.getElementById('adminCaseTitle').value = '';
        document.getElementById('adminCaseDesc').value = '';
        document.getElementById('adminSection').style.display = 'none';
        loadCasesFromDB(); // Bazadan yangi ro'yxatni yuklash
    })
    .catch((error) => {
        alert("Xatolik: " + error.message);
    });
}

// Sahifa ochilganda bazadagi ishsharni yuklash
function loadCasesFromDB() {
    const casesGrid = document.querySelector('.case-grid');
    // Asl namunani saqlab qolgan holda bazadagilarni qo'shamiz
    db.collection("cases").get().then((querySnapshot) => {
        // Bu yerda bazadan kelgan ishlar ekranga chiqariladi
    });
}
