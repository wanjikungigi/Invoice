let items = [
  { desc: "Exhibition Booth Setup & Branding (3m x 3m)", qty: 1, price: 45000, taxRate: 0.16 }
];

const KRA_PIN_REGEX = /^[AP]\d{9}[A-Z]$/;

function init() {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("issueDate").value = today;
  loadProfileFromStorage();
  renderItemInputs();
  renderPreview();
}

function validatePin(input) {
  const val = input.value.trim().toUpperCase();
  input.value = val;
  if (!val) {
    input.classList.remove("border-red-500", "border-emerald-500");
    return;
  }
  if (KRA_PIN_REGEX.test(val)) {
    input.classList.add("border-emerald-500");
    input.classList.remove("border-red-500");
  } else {
    input.classList.add("border-red-500");
    input.classList.remove("border-emerald-500");
  }
}

function addItem() {
  items.push({ desc: "", qty: 1, price: 0, taxRate: 0.16 });
  renderItemInputs();
  renderPreview();
}

function removeItem(index) {
  items.splice(index, 1);
  renderItemInputs();
  renderPreview();
}

function updateItem(index, field, value) {
  items[index][field] = field === "desc" ? value : parseFloat(value) || 0;
  renderPreview();
}

function renderItemInputs() {
  const container = document.getElementById("itemsContainer");
  container.innerHTML = items.map((item, idx) => `
    <div class="grid grid-cols-12 gap-1.5 items-center bg-slate-50 p-2 rounded border border-slate-200">
      <input type="text" placeholder="Item description" value="${item.desc}"
        oninput="updateItem(${idx}, 'desc', this.value)"
        class="col-span-5 border rounded px-2 py-1 text-xs" />
      <input type="number" min="1" value="${item.qty}"
        oninput="updateItem(${idx}, 'qty', this.value)"
        class="col-span-2 border rounded px-2 py-1 text-xs text-right" />
      <input type="number" min="0" value="${item.price}"
        oninput="updateItem(${idx}, 'price', this.value)"
        class="col-span-2 border rounded px-2 py-1 text-xs text-right" />
      <select onchange="updateItem(${idx}, 'taxRate', this.value)"
        class="col-span-2 border rounded px-1 py-1 text-xs">
        <option value="0.16" ${item.taxRate === 0.16 ? "selected" : ""}>16%</option>
        <option value="0" ${item.taxRate === 0 ? "selected" : ""}>0% / Ex</option>
      </select>
      <button onclick="removeItem(${idx})" class="col-span-1 text-red-500 hover:text-red-700 font-bold text-xs text-center">✕</button>
    </div>
  `).join("");
}

function formatMoney(num) {
  return num.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function renderPreview() {
  const getVal = (id, fallback = "-") => document.getElementById(id).value.trim() || fallback;

  document.getElementById("prevDocType").textContent = getVal("docType");
  document.getElementById("prevDocNumber").textContent = getVal("docNumber");
  document.getElementById("prevIssueDate").textContent = getVal("issueDate");
  document.getElementById("prevDueDate").textContent = getVal("dueDate");

  document.getElementById("prevSellerName").textContent = getVal("sellerName", "Your Business Name");
  document.getElementById("prevSellerAddress").textContent = getVal("sellerAddress", "");
  document.getElementById("prevSellerPhone").textContent = getVal("sellerPhone", "");
  document.getElementById("prevSellerPin").textContent = getVal("sellerPin");

  document.getElementById("prevBuyerName").textContent = getVal("buyerName", "Client Name");
  document.getElementById("prevBuyerAddress").textContent = getVal("buyerAddress", "");
  document.getElementById("prevBuyerContact").textContent = getVal("buyerContact", "");
  document.getElementById("prevBuyerPin").textContent = getVal("buyerPin");

  document.getElementById("prevPaymentNotes").textContent = getVal("paymentNotes", "Payment due upon receipt.");

  let subtotal = 0;
  let totalVat = 0;

  document.getElementById("prevItemsBody").innerHTML = items.map(item => {
    const lineNet = item.qty * item.price;
    const lineVat = lineNet * item.taxRate;
    subtotal += lineNet;
    totalVat += lineVat;

    return `
      <tr>
        <td class="py-2.5 pr-2">${item.desc || "Unnamed Item"}</td>
        <td class="py-2.5 text-right font-mono">${item.qty}</td>
        <td class="py-2.5 text-right font-mono">${formatMoney(item.price)}</td>
        <td class="py-2.5 text-center text-xs">${item.taxRate > 0 ? "16%" : "0%"}</td>
        <td class="py-2.5 text-right font-mono font-medium">${formatMoney(lineNet)}</td>
      </tr>
    `;
  }).join("");

  document.getElementById("prevSubtotal").textContent = formatMoney(subtotal);
  document.getElementById("prevVat").textContent = formatMoney(totalVat);
  document.getElementById("prevGrandTotal").textContent = formatMoney(subtotal + totalVat);

  // eTIMS CU Number & QR Code
  const cuNo = document.getElementById("cuInvoiceNo").value.trim();
  const cuWrapper = document.getElementById("prevCuWrapper");
  if (cuNo) {
    cuWrapper.classList.remove("hidden");
    document.getElementById("prevCuInvoiceNo").textContent = cuNo;
  } else {
    cuWrapper.classList.add("hidden");
  }

  const qrUrl = document.getElementById("qrUrl").value.trim();
  const qrWrapper = document.getElementById("qrWrapper");
  const qrBox = document.getElementById("qrcode");
  qrBox.innerHTML = "";
  if (qrUrl) {
    qrWrapper.classList.remove("hidden");
    new QRCode(qrBox, { text: qrUrl, width: 76, height: 76 });
  } else {
    qrWrapper.classList.add("hidden");
  }
}

function saveProfileToStorage() {
  const profile = {
    sellerName: document.getElementById("sellerName").value,
    sellerPin: document.getElementById("sellerPin").value,
    sellerPhone: document.getElementById("sellerPhone").value,
    sellerAddress: document.getElementById("sellerAddress").value,
    paymentNotes: document.getElementById("paymentNotes").value
  };
  localStorage.setItem("etims_seller_profile", JSON.stringify(profile));
  alert("Business profile saved to browser storage!");
}

function loadProfileFromStorage() {
  const saved = localStorage.getItem("etims_seller_profile");
  if (!saved) return;
  const profile = JSON.parse(saved);
  Object.keys(profile).forEach(key => {
    if (document.getElementById(key)) document.getElementById(key).value = profile[key];
  });
}

function loadDemoData() {
  document.getElementById("docType").value = "TAX INVOICE";
  document.getElementById("docNumber").value = "INV-2026-014";
  document.getElementById("sellerName").value = "Apex Events & Marketing Ltd";
  document.getElementById("sellerPin").value = "P051987654K";
  document.getElementById("sellerPhone").value = "+254 700 123 456 | billing@apexevents.co.ke";
  document.getElementById("sellerAddress").value = "Kiambu Road, Nairobi, Kenya";

  document.getElementById("buyerName").value = "Savannah Tech Solutions Ltd";
  document.getElementById("buyerPin").value = "P051112233M";
  document.getElementById("buyerContact").value = "accounts@savannahtech.co.ke";
  document.getElementById("buyerAddress").value = "Westlands, Nairobi";

  document.getElementById("cuInvoiceNo").value = "01100239481000421";
  document.getElementById("qrUrl").value = "https://etims.kra.go.ke/common/link/etims/receipt/indexEtimsReceiptData?Data=DEMO";
  document.getElementById("paymentNotes").value = "M-Pesa Paybill: 247247 | Account: 0123456789\nBank: Equity Bank Kenya - Corporate Branch";

  items = [
    { desc: "Corporate Expo Exhibitor Booth (Prime Corner)", qty: 1, price: 65000, taxRate: 0.16 },
    { desc: "Branded Roll-up Banners & Backdrop Print", qty: 2, price: 8500, taxRate: 0.16 },
    { desc: "Digital Event Guide Listing", qty: 1, price: 10000, taxRate: 0 }
  ];

  renderItemInputs();
  renderPreview();
}

window.onload = init;