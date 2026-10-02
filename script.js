const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyYu4b9c-ORJYTSBLfSF0xbO0dFtAPL1g_lN2TdJKqunww9CIoFHJF9gyQUsKmdZLGz/exec";

function loadIndexMenu() {
  fetch("products.json")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("highlight-menu");
      if(!container) return;
      container.innerHTML = data.map(item => `
        <div class="card">
          <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/250x180'">
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <div class="price">${item.price} บาท</div>
          <a href="product.html?id=${item.id}" class="btn">สั่งเลือกระดับความแซ่บ 🌶️</a>
        </div>
      `).join('');
    });
}

function loadProductDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get('id')) || 1;

  fetch("products.json")
    .then(res => res.json())
    .then(products => {
      const item = products.find(p => p.id === productId);
      if(!item) return;

      document.getElementById("p-image").src = item.image;
      document.getElementById("p-name").innerText = item.name;
      document.getElementById("p-desc").innerText = item.description;
      document.getElementById("p-price").innerText = item.price;

      document.getElementById("p-spicy").innerHTML = item.spicyLevels.map(s => `<option value="${s}">${s}</option>`).join('');
      document.getElementById("p-noodle").innerHTML = item.noodleTypes.map(n => `<option value="${n}">${n}</option>`).join('');
      document.getElementById("p-toppings").innerHTML = item.toppings.map((t) => `
        <label><input type="checkbox" class="topping-cb" value="${t.name}" data-price="${t.price}"> ${t.name} (+${t.price} บ.)</label><br>
      `).join('');

      document.getElementById("add-to-cart-btn").onclick = () => addToCart(item);
    });
}

function addToCart(item) {
  const spicy = document.getElementById("p-spicy").value;
  const noodle = document.getElementById("p-noodle").value;
  
  let extraPrice = 0;
  let selectedToppings = [];
  document.querySelectorAll('.topping-cb:checked').forEach(cb => {
    selectedToppings.push(cb.value);
    extraPrice += parseInt(cb.getAttribute('data-price'));
  });

  if(noodle.includes("+10")) extraPrice += 10;
  if(noodle.includes("+15")) extraPrice += 15;

  const orderItem = {
    name: item.name,
    spicy: spicy,
    noodle: noodle,
    toppings: selectedToppings.join(', ') || 'ไม่มี',
    totalPrice: item.price + extraPrice
  };

  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  cart.push(orderItem);
  localStorage.setItem("cart", JSON.stringify(cart));

  alert("เพิ่มลงตะกร้าเรียบร้อย!");
  window.location.href = "order.html";
}

function loadOrderSummary() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const listContainer = document.getElementById("cart-items");
  if(!listContainer) return;

  if(cart.length === 0) {
    listContainer.innerHTML = "<p>ยังไม่มีรายการในตะกร้า</p>";
    return;
  }

  let total = 0;
  listContainer.innerHTML = cart.map((item, i) => {
    total += item.totalPrice;
    return `<div>${i+1}. <b>${item.name}</b> [${item.spicy}] - ${item.noodle} (ท็อปปิ้ง: ${item.toppings}) = ${item.totalPrice} บาท</div><hr>`;
  }).join('');

  document.getElementById("grand-total").innerText = total;
}

function submitOrder(e) {
  e.preventDefault();
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  if(cart.length === 0) return alert("ตะกร้าสินค้าว่างเปล่า");

  const submitBtn = document.getElementById("submit-btn");
  submitBtn.disabled = true;
  submitBtn.innerText = "กำลังส่งข้อมูล...";

  const itemsString = cart.map(i => `${i.name}[${i.spicy}|${i.noodle}|ท็อปปิ้ง:${i.toppings}]`).join(", ");
  const grandTotal = document.getElementById("grand-total").innerText;

  const slipInput = document.getElementById("slip").files[0];
  const slipName = slipInput ? slipInput.name : "ไม่มีแนบสลิป";

  const payload = {
    customerName: document.getElementById("name").value,
    contact: document.getElementById("phone").value,
    address: document.getElementById("address").value,
    items: itemsString,
    total: grandTotal,
    note: document.getElementById("note").value,
    slipUrl: slipName
  };

  fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(payload)
  })
  .then(() => {
    localStorage.setItem("lastOrder", JSON.stringify({ ...payload, itemsList: cart }));
    localStorage.removeItem("cart");
    window.location.href = "thankyou.html";
  })
  .catch(err => {
    alert("เกิดข้อผิดพลาดในการส่งข้อมูล");
    submitBtn.disabled = false;
  });
}
