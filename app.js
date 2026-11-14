let items = [
  { 
    desc: "Space booking for stall No. 27\nCribs & Biz Fusion Expo to be held in October, 16-18, 2026,\nRunda Mall - Kiambu Road.", 
    qty: 1, 
    price: 60000, 
    taxRate: 0.16 
  }
];

function init() {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("issueDate").value = today;
  document.getElementById("dueDate").value = today;
  renderItemInputs();
  renderPreview();
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
    <div class="space-y-2 bg-slate-50 p-3 rounded border border-slate-200">
      <textarea placeholder="Item description and event details" rows="3"
        oninput="updateItem(${idx}, 'desc', this.value)"
        class="w-full border rounded p-1.5 text-xs">${item.desc}</textarea>
      <div class="grid grid-cols-3 gap-2">
        <div>
          <label class="text-[10px] text-slate-500 block">Quantity</label>
          <input type="number" min="1" value="${item.qty}"
            oninput="updateItem(${idx}, 'qty', this.value)"
            class="w-full border rounded p-1 text-xs text-right" />
        </div>
        <div>
          <label class="text-[10px] text-slate-500 block">Unit Price (KES)</label>
          <input type="number" min="0" value="${item.price}"
            oninput="updateItem(${idx}, 'price', this.value)"
            class="w-full border rounded p-1 text-xs text-right" />
        </div>
        <div>
          <label class="text-[10px] text-slate-500 block">Action</label>
          <button onclick="removeItem(${idx})" class="w-full bg-red-100 text-red-600 hover:bg-red-200 rounded p-1 text-xs font-bold">Remove</button>
        </div>
      </div>
    </div>
  `).join("");
}

function formatMoney(num) {
  return num.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function renderPreview() {
  const getVal = (id, fallback = "") => document.getElementById(id).value.trim() || fallback;

  document.getElementById("prevDocNumber").textContent = "#" + getVal("docNumber", "INV001");
  document.getElementById("prevIssueDate").textContent = getVal("issueDate");
  document.getElementById("prevDueDate").textContent = getVal("dueDate");

  document.getElementById("prevBuyerName").textContent = getVal("buyerName", "CLIENT NAME");
  document.getElementById("prevBuyerPin").textContent = "PIN: " + getVal("buyerPin", "-");
  document.getElementById("prevBankDetails").textContent = getVal("bankDetails");

  let subtotal = 0;
  let totalVat = 0;

  document.getElementById("prevItemsBody").innerHTML = items.map(item => {
    const lineNet = item.qty * item.price;
    const lineVat = lineNet * item.taxRate;
    subtotal += lineNet;
    totalVat += lineVat;

    return `
      <tr class="border-b border-slate-100">
        <td class="py-3 px-3 whitespace-pre-line text-slate-800 font-medium">${item.desc || "Item description"}</td>
        <td class="py-3 px-2 text-right font-mono">${item.qty.toFixed(2)}</td>
        <td class="py-3 px-2 text-right font-mono">${formatMoney(item.price)}</td>
        <td class="py-3 px-2 text-center text-xs">16%</td>
        <td class="py-3 px-3 text-right font-mono font-bold">${formatMoney(lineNet)}</td>
      </tr>
    `;
  }).join("");

  const grandTotal = subtotal + totalVat;

  document.getElementById("prevSubtotal").textContent = formatMoney(subtotal);
  document.getElementById("prevVat").textContent = formatMoney(totalVat);
  document.getElementById("prevGrandTotal").textContent = formatMoney(grandTotal);
  document.getElementById("prevAmountDue").textContent = formatMoney(grandTotal);
}

function loadDefaultExpoData() {
  document.getElementById("docNumber").value = "INV038";
  document.getElementById("buyerName").value = "DAVIS & SHIRTLIFF";
  document.getElementById("buyerPin").value = "";
  document.getElementById("bankDetails").value = `PAYMENT MADE TO FAMILY BANK LIMITED
BANK NAME: FAMILY BANK | BRANCH: RUIRU
ACCOUNT NAME: FIRES MEDIA & MARKETING/ADVERTISNG COMPANY LTD
ACCOUNT NUMBER: 024000066950
MPESA PAYMENT: PAYBILL No. 222111 | ACCT. 3145745`;

  items = [
    { 
      desc: "Space booking for stall No. 27\nCribs & Biz Fusion Expo to be held in October, 16-18, 2026,\nRunda Mall - Kiambu Road.", 
      qty: 1, 
      price: 60000, 
      taxRate: 0.16 
    }
  ];

  renderItemInputs();
  renderPreview();
}

window.onload = init;