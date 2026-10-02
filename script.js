// PART 1: ดึงชื่อและราคาจาก URL มาแสดงในหน้า product.html
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');
    const price = urlParams.get('price');

    // ถ้าเปิดหน้า product.html และมี parameter ส่งมา
    if (document.getElementById('product-name')) {
        if (name && price) {
            document.getElementById('product-name').innerText = name;
            document.getElementById('product-price').innerText = price;
        } else {
            // ค่าเริ่มต้นหากเปิดเข้ามาโดยตรง
            document.getElementById('product-name').innerText = 'ตำปูปูปลาร้า';
            document.getElementById('product-price').innerText = '60';
        }
    }

    // ถ้าเปิดหน้า checkout.html ให้โหลดรายการสินค้ามาแสดง
    if (document.getElementById('order-items-list')) {
        displayOrderSummary();
    }
});

// PART 2: บันทึกข้อมูลเมนูส้มตำและเปลี่ยนหน้าไปหน้าชำระเงิน
function submitOrder() {
    const productName = document.getElementById('product-name').innerText;
    const basePrice = parseFloat(document.getElementById('product-price').innerText) || 0;
    const spicyLevel = document.getElementById('spicy-level').value;
    const noodleType = document.getElementById('noodle-type').value;

    // ตรวจสอบข้อมูลบังคับเลือก
    if (!spicyLevel || !noodleType) {
        alert('กรุณาเลือกระดับความแซ่บและตัวเลือกเส้นให้ครบถ้วนครับ!');
        return;
    }

    // คำนวณราคาท็อปปิ้งเพิ่มเติม
    let toppingPrice = 0;
    let selectedToppings = [];
    const toppingCheckBoxes = document.querySelectorAll('.topping:checked');

    toppingCheckBoxes.forEach(cb => {
        selectedToppings.push(cb.value);
        toppingPrice += parseFloat(cb.getAttribute('data-price')) || 0;
    });

    const totalPrice = basePrice + toppingPrice;

    // สร้างออบเจ็กต์รายการสินค้า
    const newItem = {
        name: productName,
        basePrice: basePrice,
        price: totalPrice,
        spicy: spicyLevel,
        noodle: noodleType,
        toppings: selectedToppings,
        quantity: 1
    };

    // เซฟข้อมูลลง LocalStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(newItem);
    localStorage.setItem('cart', JSON.stringify(cart));

    // สั่งเปลี่ยนหน้าไปยังหน้าชำระเงิน
    window.location.href = 'checkout.html';
}

// PART 3: แสดงรายการสินค้าที่หน้าชำระเงิน (checkout.html)
function displayOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('order-items-list');
    const subtotalEl = document.getElementById('subtotal');
    const grandTotalEl = document.getElementById('grand-total');

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center;">ไม่มีรายการสินค้าในตะกร้า</p>';
        if (subtotalEl) subtotalEl.innerText = '0';
        if (grandTotalEl) grandTotalEl.innerText = '0';
        return;
    }

    let subtotal = 0;
    container.innerHTML = '';

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const toppingText = item.toppings && item.toppings.length > 0 
            ? `<br><small style="color: #666;">ท็อปปิ้ง: ${item.toppings.join(', ')}</small>` 
            : '';

        const itemDiv = document.createElement('div');
        itemDiv.style.cssText = 'display: flex; justify-content: space-between; margin-bottom: 15px; border-bottom: 1px #eee solid; padding-bottom: 10px;';
        itemDiv.innerHTML = `
            <div>
                <strong>${item.name}</strong> (x${item.quantity})
                <br><small style="color: #666;">สูตร: ${item.spicy}, ${item.noodle}</small>
                ${toppingText}
            </div>
            <div>
                <strong>${itemTotal.toLocaleString()} บาท</strong>
            </div>
        `;
        container.appendChild(itemDiv);
    });

    const shipping = 50; // ค่าจัดส่ง
    if (subtotalEl) subtotalEl.innerText = subtotal.toLocaleString();
    if (grandTotalEl) grandTotalEl.innerText = (subtotal + shipping).toLocaleString();
}
