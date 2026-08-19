// ==========================================
// DETEKTIV LOYIHASI: MAKSIMAL BOARD.JS KODI
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    const boardContainer = document.getElementById("board") || createDefaultBoard();
    
    // Brauzer xotirasidan (localStorage) saqlangan ma'lumotlarni yuklash
    loadBoardState();

    // 1. Yangi dalil yoki kartochka qo'shish funksiyasi
    window.addEvidenceCard = function(id, title, text, x = 100, y = 100) {
        const card = document.createElement("div");
        card.className = "evidence-card";
        card.id = id || "card_" + Date.now();
        card.style.position = "absolute";
        card.style.left = x + "px";
        card.style.top = y + "px";
        
        card.innerHTML = `
            <div class="card-header">
                <span class="card-title">${title || "Noma'lum dalil"}</span>
                <button class="delete-btn" onclick="removeCard('${card.id}')">×</button>
            </div>
            <div class="card-body">
                <p>${text || "Tafsilotlar kiritilmagan..."}</p>
            </div>
        `;

        // Drag and Drop (Kartochkani taxta bo'ylab surish) imkoniyatini ulash
        makeDraggable(card);
        boardContainer.appendChild(card);
        
        // Har safar yangi karta qo'shilganda holatni saqlash
        saveBoardState();
    };

    // 2. Kartochkani o'chirish
    window.removeCard = function(cardId) {
        const card = document.getElementById(cardId);
        if (card) {
            card.remove();
            saveBoardState();
        }
    };

    // 3. Drag and Drop (Sudrab yurish) mexanizmi
    function makeDraggable(element) {
        let isDragging = false;
        let startX, startY;

        element.addEventListener("mousedown", (e) => {
            // O'chirish tugmasi bosilganda surilmasligi uchun shart
            if (e.target.classList.contains("delete-btn")) return;
            
            isDragging = true;
            startX = e.clientX - element.offsetLeft;
            startY = e.clientY - element.offsetTop;
            element.style.zIndex = 1000; // Chiqqan karta ustki qatorda turishi uchun
        });

        document.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            let newX = e.clientX - startX;
            let newY = e.clientY - startY;

            element.style.left = newX + "px";
            element.style.top = newY + "px";
        });

        document.addEventListener("mouseup", () => {
            if (isDragging) {
                isDragging = false;
                element.style.zIndex = 1;
                saveBoardState(); // Joylashuvi o'zgarganda ham saqlash
            }
        });
    }

    // 4. Agar HTML da #board elementi bo'lmasa, uni avtomatik yaratish
    function createDefaultBoard() {
        let board = document.createElement("div");
        board.id = "board";
        board.style.width = "100vw";
        board.style.height = "100vh";
        board.style.position = "relative";
        board.style.overflow = "hidden";
        document.body.appendChild(board);
        return board;
    }

    // 5. Ma'lumotlarni LocalStorage'ga saqlash (Brauzerni yopib ochganda yo'qolmaydi)
    function saveBoardState() {
        const cards = document.querySelectorAll(".evidence-card");
        const cardsData = [];

        cards.forEach(card => {
            cardsData.push({
                id: card.id,
                title: card.querySelector(".card-title").innerText,
                text: card.querySelector(".card-body p").innerText,
                left: card.style.left,
                top: card.style.top
            });
        });

        localStorage.setItem("detektiv_board_cards", JSON.stringify(cardsData));
    }

    // 6. Saqlangan ma'lumotlarni qayta tiklash
    function loadBoardState() {
        const savedData = localStorage.getItem("detektiv_board_cards");
        if (!savedData) return;

        const cardsData = JSON.parse(savedData);
        cardsData.forEach(data => {
            const card = document.createElement("div");
            card.className = "evidence-card";
            card.id = data.id;
            card.style.position = "absolute";
            card.style.left = data.left;
            card.style.top = data.top;
            
            card.innerHTML = `
                <div class="card-header">
                    <span class="card-title">${data.title}</span>
                    <button class="delete-btn" onclick="removeCard('${card.id}')">×</button>
                </div>
                <div class="card-body">
                    <p>${data.text}</p>
                </div>
            `;

            makeDraggable(card);
            boardContainer.appendChild(card);
        });
    }
});
