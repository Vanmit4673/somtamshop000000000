// รายการตัวเลือกต่างๆ
const spicyLevels = ["ไม่เผ็ด (พริก 0 เม็ด)", "เผ็ดน้อย (พริก 1-2 เม็ด)", "เผ็ดปานกลาง (พริก 3-5 เม็ด)", "เผ็ดมาก (พริก 6-10 เม็ด)", "เผ็ดสลบ (พริกยกสวน)"];
const noodleOptions = ["เส้นมะละกอกรอบ", "เส้นขนมจีน", "เส้นมาม่า", "เกาเหลา (ไม่ใส่เส้น)"];
const toppings = [
    { name: "แคบหมูกรอบ", price: 15 },
    { name: "หมูกรอบ", price: 30 },
    { name: "กุ้งสด", price: 40 },
    { name: "ไข่เค็ม", price: 15 },
    { name: "ต้มแซ่บกระดูกอ่อน (เครื่องเคียง)", price: 50 }
];

// ฟังก์ชันดึงตัวเลือกมาใส่ในหน้า product.html
function initProductPage() {
    // 1. ใส่ระดับความแซ่บใน Dropdown
    const spicySelect = document.getElementById("spicy-level");
    if (spicySelect) {
        spicyLevels.forEach(level => {
            const opt = document.createElement("option");
            opt.value = level;
            opt.textContent = level;
            spicySelect.appendChild(opt);
        });
    }

    // 2. ใส่ตัวเลือกเส้นใน Dropdown
    const noodleSelect = document.getElementById("noodle-option");
    if (noodleSelect) {
        noodleOptions.forEach(noodle => {
            const opt = document.createElement("option");
            opt.value = noodle;
            opt.textContent = noodle;
            noodleSelect.appendChild(opt);
        });
    }

    // 3. ใส่รายการท็อปปิ้ง (Checkbox)
    const toppingContainer = document.getElementById("topping-list");
    if (toppingContainer) {
        toppingContainer.innerHTML = toppings.map((t) => `
            <div style="margin: 8px 0;">
                <label style="cursor: pointer;">
                    <input type="checkbox" name="topping" value="${t.name}" data-price="${t.price}">
                    ${t.name} (+${t.price} บาท)
                </label>
            </div>
        `).join('');
    }

    // 4. ใส่รูปภาพ (หากมีรูปภาพในโฟลเดอร์ ให้เปลี่ยน path ตรงนี้)
    const imgElem = document.getElementById("product-img");
    if (imgElem) {
        // เปลี่ยนเป็น path รูปของคุณ เช่น "images/somtam.jpg"
        imgElem.src = "https://via.placeholder.com/500x250?text=Somtam+Poo+Plara"; 
        imgElem.style.display = "block";
    }
}

// ฟังก์ชันสำหรับหน้าแรก index.html
function loadIndexMenu() {
    const highlightMenu = document.getElementById("highlight-menu");
    if (!highlightMenu) return;

    const sampleMenus = [
        { id: 1, name: "ตำปูปลาร้า", price: 60, img: "https://via.placeholder.com/300x200?text=Tum+Poo+Pla-Ra" },
        { id: 2, name: "ตำไทยไข่เค็ม", price: 70, img: "https://via.placeholder.com/300x200?text=Tum+Thai" },
        { id: 3, name: "ตำเกาเหลากุ้งสด", price: 120, img: "https://via.placeholder.com/300x200?text=Tum+Kung+Sod" }
    ];

    highlightMenu.innerHTML = sampleMenus.map(item => `
        <div class="menu-card" style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; text-align: center; background: #fff;">
            <img src="${item.img}" alt="${item.name}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 5px;">
            <h3>${item.name}</h3>
            <p style="color: #d9534f; font-weight: bold;">${item.price} บาท</p>
            <a href="product.html?id=${item.id}" style="display: inline-block; padding: 8px 15px; background: #e67e22; color: #fff; text-decoration: none; border-radius: 4px;">สั่งซื้อ</a>
        </div>
    `).join('');
}
