// ============================================================
// Wedding Planner — App Logic
// Semua data disimpan di localStorage (bertahan walau refresh
// atau browser ditutup), murni JS tanpa server/hosting.
// ============================================================
(function(){
"use strict";

const STORE_KEY = "weddingPlannerData_v1";
const MONTHS_ID = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

function deepClone(o){ return JSON.parse(JSON.stringify(o)); }

function loadData(){
  try{
    const raw = localStorage.getItem(STORE_KEY);
    if(raw){
      const parsed = JSON.parse(raw);
      if(parsed && parsed.meta && parsed.budget) return parsed;
    }
  }catch(e){ console.warn("Gagal memuat data tersimpan, memakai data awal.", e); }
  return deepClone(DEFAULT_DATA);
}

let DATA = loadData();
let currentView = "dashboard";
let guestFilter = { search: "", pihak: "Semua" };

function saveData(silent){
  try{
    localStorage.setItem(STORE_KEY, JSON.stringify(DATA));
    if(!silent) showToast("Tersimpan");
  }catch(e){
    showToast("Gagal menyimpan (storage penuh?)");
  }
}

// ---------- helpers ----------
function rupiah(n){
  n = Number(n)||0;
  return "Rp " + n.toLocaleString("id-ID");
}
function num(v){ const n = Number(v); return isNaN(n) ? 0 : n; }
function escapeHtml(s){
  return String(s==null?"":s).replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
}
function statusClass(status){
  const s = (status||"").toLowerCase();
  if(["selesai","lunas","fix"].includes(s)) return "selesai";
  if(["proses","negosiasi","dp"].includes(s)) return "proses";
  return "belum";
}
function formatDateLong(dateStr){
  if(!dateStr) return "-";
  const d = new Date(dateStr+"T00:00:00");
  if(isNaN(d)) return dateStr;
  return d.toLocaleDateString("id-ID",{day:"2-digit",month:"long",year:"numeric"});
}
function daysUntil(dateStr){
  if(!dateStr) return null;
  const target = new Date(dateStr+"T00:00:00");
  const today = new Date(); today.setHours(0,0,0,0);
  return Math.ceil((target-today)/86400000);
}
function showToast(msg){
  const t = document.getElementById("toast");
  document.getElementById("toastMsg").textContent = msg;
  t.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(()=>t.classList.remove("show"), 1800);
}
function iconTrash(){
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m2 0l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6h14z"/></svg>';
}
function iconPlus(){
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>';
}

// ============================================================
// DERIVED / COMPUTED DATA
// ============================================================
function budgetTotals(){
  let estimasi=0, realisasi=0;
  DATA.budget.forEach(b=>{ estimasi+=num(b.estimasi); realisasi+=num(b.realisasi); });
  return { estimasi, realisasi, selisih: estimasi-realisasi };
}
function timelineStats(){
  let total=0, selesai=0, proses=0, belum=0;
  DATA.timeline.forEach(m=>m.tasks.forEach(t=>{
    total++;
    const s=(t.status||"").toLowerCase();
    if(s==="selesai") selesai++; else if(s==="proses") proses++; else belum++;
  }));
  return { total, selesai, proses, belum, pct: total? Math.round(selesai/total*100):0 };
}
function paymentStats(){
  let lunas=0, dp=0, belum=0;
  DATA.payment.forEach(p=>{
    const s=(p.status||"").toLowerCase();
    if(s==="lunas") lunas++; else if(s==="dp") dp++; else belum++;
  });
  return { lunas, dp, belum, total: DATA.payment.length };
}
function currentMonthBlock(){
  const now = new Date();
  const name = MONTHS_ID[now.getMonth()];
  let m = DATA.timeline.find(mm=>mm.bulan.toLowerCase()===name.toLowerCase());
  if(m) return m;
  m = DATA.timeline.find(mm=>mm.tasks.some(t=>(t.status||"").toLowerCase()!=="selesai"));
  return m || DATA.timeline[0];
}

// ============================================================
// NAVIGATION
// ============================================================
const VIEW_TITLES = {
  dashboard:"Dashboard", budget:"Budget", vendor:"Vendor", timeline:"Timeline",
  guests:"Tamu Undangan", payment:"Pembayaran"
};
function setView(view){
  currentView = view;
  document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
  document.getElementById("view-"+view).classList.add("active");
  document.querySelectorAll(".nav-item").forEach(n=>n.classList.toggle("active", n.dataset.view===view));
  document.getElementById("topbarTitle").textContent = VIEW_TITLES[view];
  closeSidebar();
  window.scrollTo({top:0,behavior:"smooth"});
  renderCurrentView();
}
function renderCurrentView(){
  ({dashboard:renderDashboard, budget:renderBudget, vendor:renderVendor,
    timeline:renderTimeline, guests:renderGuests, payment:renderPayment}[currentView])();
}
function renderAll(){
  renderDashboard(); renderBudget(); renderVendor(); renderTimeline(); renderGuests(); renderPayment();
  document.getElementById("brandVenue").textContent = DATA.meta.venue || "";
  const d = daysUntil(DATA.meta.tanggalResepsi);
  document.getElementById("sideCountdown").textContent = d!=null ? Math.max(d,0) : "—";
  document.getElementById("sideDate").textContent = formatDateLong(DATA.meta.tanggalResepsi);
}

function openSidebar(){ document.getElementById("sidebar").classList.add("open"); document.getElementById("overlay").classList.add("show"); }
function closeSidebar(){ document.getElementById("sidebar").classList.remove("open"); document.getElementById("overlay").classList.remove("show"); }

// ============================================================
// DASHBOARD
// ============================================================
function renderDashboard(){
  const el = document.getElementById("view-dashboard");
  const bt = budgetTotals();
  const ts = timelineStats();
  const ps = paymentStats();
  const sisa = num(DATA.meta.totalBudget) - bt.realisasi;
  const d = daysUntil(DATA.meta.tanggalResepsi);
  const monthBlock = currentMonthBlock();

  el.innerHTML = `
    <div class="hero">
      <svg class="leaf l1" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C7 4 3 9 3 14c0 4 3 8 9 8s9-4 9-8c0-5-4-10-9-12z"/></svg>
      <svg class="leaf l2" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C7 4 3 9 3 14c0 4 3 8 9 8s9-4 9-8c0-5-4-10-9-12z"/></svg>
      <div class="hero-top">
        <div>
          <div class="hero-eyebrow">Menuju Hari Bahagia</div>
          <h1>${escapeHtml(DATA.meta.coupleA)} &amp; ${escapeHtml(DATA.meta.coupleB)}</h1>
          <div class="venue-line">${escapeHtml(DATA.meta.venue)} · ${formatDateLong(DATA.meta.tanggalResepsi)}</div>
        </div>
        <div class="countdown">
          <div class="num">${d!=null?Math.max(d,0):"—"}</div>
          <div class="lbl">Hari Lagi</div>
        </div>
      </div>
      <div class="hero-progress">
        <div class="hero-progress-row"><span>Progress Persiapan</span><span>${ts.pct}% selesai</span></div>
        <div class="bar"><div style="width:${ts.pct}%"></div></div>
      </div>
    </div>

    <div class="grid cols-4">
      <div class="card stat-card accent"><div class="label">Total Budget</div><div class="value">${rupiah(DATA.meta.totalBudget)}</div></div>
      <div class="card stat-card"><div class="label">Total Estimasi</div><div class="value">${rupiah(bt.estimasi)}</div></div>
      <div class="card stat-card"><div class="label">Total Realisasi</div><div class="value">${rupiah(bt.realisasi)}</div></div>
      <div class="card stat-card"><div class="label">Sisa Budget</div><div class="value" style="color:${sisa<0?'var(--danger)':'var(--success)'}">${rupiah(sisa)}</div></div>
    </div>

    <div class="section-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4h16v16H4z"/><path d="M4 9h16M9 4v16"/></svg>Informasi Acara</div>
    <div class="grid cols-3">
      <div class="card tight"><div class="label" style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;">💒 Tanggal Akad</div><div style="font-family:var(--font-display);font-size:17px;color:var(--primary);margin-top:6px;">${formatDateLong(DATA.meta.tanggalAkad)}</div></div>
      <div class="card tight"><div class="label" style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;">🎉 Tanggal Resepsi</div><div style="font-family:var(--font-display);font-size:17px;color:var(--primary);margin-top:6px;">${formatDateLong(DATA.meta.tanggalResepsi)}</div></div>
      <div class="card tight"><div class="label" style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;">🏛️ Venue</div><div style="font-family:var(--font-display);font-size:17px;color:var(--primary);margin-top:6px;">${escapeHtml(DATA.meta.venue)}</div></div>
    </div>

    <div class="section-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>Tugas Bulan ${monthBlock?escapeHtml(monthBlock.bulan):"-"}</div>
    <div class="table-wrap">
      <table><thead><tr><th>Tugas</th><th>PIC</th><th>Status</th></tr></thead>
      <tbody>
        ${monthBlock && monthBlock.tasks.length ? monthBlock.tasks.map(t=>`
          <tr><td>${escapeHtml(t.tugas)}</td><td>${escapeHtml(t.pic)}</td><td><span class="badge ${statusClass(t.status)}"><span class="badge-dot"></span>${escapeHtml(t.status)}</span></td></tr>
        `).join("") : `<tr><td colspan="3" style="color:var(--text-muted);text-align:center;padding:24px;">Belum ada tugas bulan ini</td></tr>`}
      </tbody></table>
    </div>

    <div class="grid cols-2" style="margin-top:26px;">
      <div>
        <div class="section-title first"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 9l2-5h14l2 5M3 9v9a1 1 0 001 1h16a1 1 0 001-1V9M3 9h18"/></svg>Ringkasan Vendor</div>
        <div class="table-wrap"><table><thead><tr><th>Kategori</th><th>Vendor</th><th>Status</th></tr></thead><tbody>
          ${DATA.vendor.map(v=>`<tr><td>${escapeHtml(v.kategori)}</td><td>${escapeHtml(v.namaVendor||"-")}</td><td>${v.status?`<span class="badge ${statusClass(v.status)}"><span class="badge-dot"></span>${escapeHtml(v.status)}</span>`:"-"}</td></tr>`).join("")}
        </tbody></table></div>
      </div>
      <div>
        <div class="section-title first"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="6" width="20" height="13" rx="2"/><path d="M2 10.5h20"/></svg>Status Pembayaran</div>
        <div class="grid cols-3" style="margin-bottom:14px;">
          <div class="card tight" style="text-align:center;"><div class="value" style="font-family:var(--font-display);font-size:22px;color:var(--success);">${ps.lunas}</div><div style="font-size:11px;color:var(--text-muted);">Lunas</div></div>
          <div class="card tight" style="text-align:center;"><div class="value" style="font-family:var(--font-display);font-size:22px;color:var(--warning);">${ps.dp}</div><div style="font-size:11px;color:var(--text-muted);">DP</div></div>
          <div class="card tight" style="text-align:center;"><div class="value" style="font-family:var(--font-display);font-size:22px;color:var(--danger);">${ps.belum}</div><div style="font-size:11px;color:var(--text-muted);">Belum Bayar</div></div>
        </div>
      </div>
    </div>
  `;
}

// ============================================================
// BUDGET
// ============================================================
function renderBudget(){
  const el = document.getElementById("view-budget");
  const bt = budgetTotals();
  el.innerHTML = `
    <div class="page-head">
      <div><div class="eyebrow">Rincian Anggaran</div><h1>Budget</h1><p class="desc">Estimasi vs realisasi biaya untuk setiap kebutuhan pernikahan. Klik sel angka untuk mengubah.</p></div>
      <button class="btn primary" id="addBudgetRow">${iconPlus()} Tambah Kategori</button>
    </div>
    <div class="table-wrap"><table>
      <thead><tr><th style="width:26%">Kategori</th><th style="width:14%">Volume</th><th>Estimasi</th><th>Realisasi</th><th>Selisih</th><th class="col-actions"></th></tr></thead>
      <tbody>
        ${DATA.budget.map((b,i)=>{
          const selisih = num(b.estimasi)-num(b.realisasi);
          return `<tr data-i="${i}">
            <td><input class="cell-input" data-f="kategori" value="${escapeHtml(b.kategori)}" placeholder="Nama kategori"></td>
            <td><input class="cell-input" data-f="volume" value="${escapeHtml(b.volume)}" placeholder="-"></td>
            <td><input class="cell-input" data-f="estimasi" type="number" value="${b.estimasi||0}"></td>
            <td><input class="cell-input" data-f="realisasi" type="number" value="${b.realisasi||0}"></td>
            <td style="color:${selisih<0?'var(--danger)':'var(--text-muted)'};font-weight:500;">${rupiah(selisih)}</td>
            <td class="col-actions"><button class="icon-btn" data-del="${i}" title="Hapus">${iconTrash()}</button></td>
          </tr>`;
        }).join("")}
        <tr class="total-row">
          <td colspan="2">Total</td>
          <td>${rupiah(bt.estimasi)}</td>
          <td>${rupiah(bt.realisasi)}</td>
          <td style="color:${bt.selisih<0?'var(--danger)':'var(--success)'}">${rupiah(bt.selisih)}</td>
          <td></td>
        </tr>
      </tbody>
    </table></div>
    <div class="card tight" style="margin-top:18px;max-width:340px;">
      <label style="font-size:11px;letter-spacing:0.8px;text-transform:uppercase;color:var(--text-muted);font-weight:600;">Target Total Budget (Dashboard)</label>
      <input class="cell-input" id="metaTotalBudget" type="number" value="${DATA.meta.totalBudget||0}" style="border:1px solid var(--border);margin-top:6px;">
    </div>
  `;

  el.querySelectorAll("tbody tr[data-i] input").forEach(inp=>{
    inp.addEventListener("change", e=>{
      const tr = e.target.closest("tr");
      const i = Number(tr.dataset.i);
      const f = e.target.dataset.f;
      DATA.budget[i][f] = (f==="estimasi"||f==="realisasi") ? num(e.target.value) : e.target.value;
      saveData(true);
      renderBudget(); renderDashboard();
    });
  });
  el.querySelectorAll("[data-del]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      DATA.budget.splice(Number(btn.dataset.del),1);
      saveData(true); renderBudget(); renderDashboard();
    });
  });
  document.getElementById("addBudgetRow").addEventListener("click", ()=>{
    DATA.budget.push({kategori:"Kategori Baru", volume:"", estimasi:0, realisasi:0});
    saveData(true); renderBudget();
  });
  document.getElementById("metaTotalBudget").addEventListener("change", e=>{
    DATA.meta.totalBudget = num(e.target.value);
    saveData(true); renderDashboard();
  });
}

// ============================================================
// VENDOR
// ============================================================
function renderVendor(){
  const el = document.getElementById("view-vendor");
  el.innerHTML = `
    <div class="page-head">
      <div><div class="eyebrow">Daftar Rekanan</div><h1>Vendor</h1><p class="desc">Detail setiap vendor beserta item yang disepakati. Klik "Tambah Vendor" untuk kategori baru.</p></div>
      <button class="btn primary" id="addVendor">${iconPlus()} Tambah Vendor</button>
    </div>
    ${DATA.vendor.map((v,i)=>`
      <div class="vendor-card" data-i="${i}">
        <div class="vendor-head">
          <div>
            <div class="vendor-kat">${escapeHtml(v.kategori)}</div>
            <div class="vendor-nama">${escapeHtml(v.namaVendor||"Belum ditentukan")}</div>
          </div>
          <div style="display:flex;gap:8px;align-items:center;">
            ${v.status?`<span class="badge ${statusClass(v.status)}"><span class="badge-dot"></span>${escapeHtml(v.status)}</span>`:""}
            <button class="icon-btn" data-del-vendor="${i}" title="Hapus vendor">${iconTrash()}</button>
          </div>
        </div>
        <div class="vendor-meta">
          ${v.picDana?`<span>PIC Dana: <b>${escapeHtml(v.picDana)}</b></span>`:""}
          ${v.kontak?`<span>Kontak: <b>${escapeHtml(v.kontak)}</b></span>`:""}
        </div>
        ${v.items && v.items.length ? `<div class="vendor-items"><ul>${v.items.map(it=>`<li>${escapeHtml(it)}</li>`).join("")}</ul></div>`:""}
        <div class="vendor-edit-row">
          <div class="form-row"><label>Kategori</label><input data-f="kategori" value="${escapeHtml(v.kategori)}"></div>
          <div class="form-row"><label>Nama Vendor</label><input data-f="namaVendor" value="${escapeHtml(v.namaVendor)}"></div>
          <div class="form-row"><label>PIC Dana</label><input data-f="picDana" value="${escapeHtml(v.picDana)}"></div>
          <div class="form-row"><label>Status</label>
            <select data-f="status">
              ${["","Survey","Negosiasi","Fix"].map(s=>`<option value="${s}" ${v.status===s?"selected":""}>${s||"- Pilih -"}</option>`).join("")}
            </select>
          </div>
          <div class="form-row"><label>Kontak</label><input data-f="kontak" value="${escapeHtml(v.kontak)}"></div>
          <div class="form-row"><label>Catatan</label><input data-f="catatan" value="${escapeHtml(v.catatan)}"></div>
          <textarea data-f="items" placeholder="Satu item per baris...">${(v.items||[]).map(escapeHtml).join("\n")}</textarea>
        </div>
      </div>
    `).join("")}
  `;

  el.querySelectorAll(".vendor-card").forEach(card=>{
    const i = Number(card.dataset.i);
    card.querySelectorAll("[data-f]").forEach(field=>{
      field.addEventListener("change", e=>{
        const f = e.target.dataset.f;
        if(f==="items"){
          DATA.vendor[i].items = e.target.value.split("\n").map(s=>s.trim()).filter(Boolean);
        } else {
          DATA.vendor[i][f] = e.target.value;
        }
        saveData(true); renderVendor(); renderDashboard();
      });
    });
  });
  el.querySelectorAll("[data-del-vendor]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      DATA.vendor.splice(Number(btn.dataset.delVendor),1);
      saveData(true); renderVendor(); renderDashboard();
    });
  });
  document.getElementById("addVendor").addEventListener("click", ()=>{
    DATA.vendor.push({kategori:"Kategori Baru", namaVendor:"", picDana:"", status:"", kontak:"", catatan:"", items:[]});
    saveData(true); renderVendor();
  });
}

// ============================================================
// TIMELINE
// ============================================================
function renderTimeline(){
  const el = document.getElementById("view-timeline");
  el.innerHTML = `
    <div class="page-head">
      <div><div class="eyebrow">Rencana Persiapan</div><h1>Timeline</h1><p class="desc">Susunan tugas per bulan. Centang untuk menandai selesai.</p></div>
      <button class="btn primary" id="addMonth">${iconPlus()} Tambah Bulan</button>
    </div>
    ${DATA.timeline.map((m,mi)=>{
      const total = m.tasks.length;
      const selesai = m.tasks.filter(t=>(t.status||"").toLowerCase()==="selesai").length;
      const pct = total? Math.round(selesai/total*100):0;
      return `
      <div class="month-block" data-mi="${mi}">
        <div class="month-header" data-toggle>
          <div class="month-name"><span class="idx">${mi+1}</span>${escapeHtml(m.bulan)}</div>
          <div class="month-progress"><div class="bar"><div style="width:${pct}%"></div></div><span>${selesai}/${total} selesai</span></div>
          <div style="display:flex;align-items:center;gap:10px;">
            <button class="icon-btn" data-del-month="${mi}" title="Hapus bulan">${iconTrash()}</button>
            <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M6 9l6 6 6-6"/></svg>
          </div>
        </div>
        <div class="month-body">
          ${m.tasks.map((t,ti)=>`
            <div class="task-row ${((t.status||"").toLowerCase()==="selesai")?"done":""}" data-ti="${ti}">
              <input type="checkbox" class="task-check" ${((t.status||"").toLowerCase()==="selesai")?"checked":""} data-f="done">
              <input class="tugas" data-f="tugas" value="${escapeHtml(t.tugas)}" placeholder="Nama tugas">
              <input class="cell-input pic-field" data-f="pic" value="${escapeHtml(t.pic)}" placeholder="PIC" style="border:1px solid var(--border);">
              <select class="cell-input status-field" data-f="status" style="border:1px solid var(--border);">
                ${["Belum","Proses","Selesai"].map(s=>`<option ${s===t.status?"selected":""}>${s}</option>`).join("")}
              </select>
              <button class="icon-btn" data-del-task="${ti}" title="Hapus tugas">${iconTrash()}</button>
            </div>
          `).join("")}
          <div class="month-add"><button class="btn sm" data-add-task>${iconPlus()} Tambah Tugas</button></div>
        </div>
      </div>`;
    }).join("")}
  `;

  el.querySelectorAll(".month-block").forEach(block=>{
    const mi = Number(block.dataset.mi);
    block.querySelector("[data-toggle]").addEventListener("click", e=>{
      if(e.target.closest("[data-del-month]")) return;
      block.classList.toggle("open");
    });
    block.querySelectorAll(".task-row").forEach(row=>{
      const ti = Number(row.dataset.ti);
      row.querySelectorAll("[data-f]").forEach(field=>{
        const ev = field.type==="checkbox" ? "change" : (field.tagName==="SELECT" ? "change" : "change");
        field.addEventListener(ev, e=>{
          const f = e.target.dataset.f;
          if(f==="done"){
            DATA.timeline[mi].tasks[ti].status = e.target.checked ? "Selesai" : "Proses";
          } else {
            DATA.timeline[mi].tasks[ti][f] = e.target.value;
          }
          saveData(true); renderTimeline(); renderDashboard();
          document.querySelectorAll(".month-block")[mi].classList.add("open");
        });
      });
      row.querySelector("[data-del-task]").addEventListener("click", ()=>{
        DATA.timeline[mi].tasks.splice(ti,1);
        saveData(true); renderTimeline(); renderDashboard();
        document.querySelectorAll(".month-block")[mi].classList.add("open");
      });
    });
    block.querySelector("[data-add-task]").addEventListener("click", ()=>{
      DATA.timeline[mi].tasks.push({tugas:"Tugas baru", pic:"", status:"Belum"});
      saveData(true); renderTimeline();
      document.querySelectorAll(".month-block")[mi].classList.add("open");
    });
    block.querySelector("[data-del-month]").addEventListener("click", ()=>{
      DATA.timeline.splice(mi,1);
      saveData(true); renderTimeline(); renderDashboard();
    });
  });
  document.getElementById("addMonth").addEventListener("click", ()=>{
    DATA.timeline.push({bulan:"Bulan Baru", tasks:[]});
    saveData(true); renderTimeline();
  });
}

// ============================================================
// GUESTS
// ============================================================
function renderGuests(){
  const el = document.getElementById("view-guests");
  const pihakSet = Array.from(new Set(DATA.guests.map(g=>g.pihak).filter(Boolean)));
  let list = DATA.guests.map((g,i)=>({...g, _i:i}));
  if(guestFilter.pihak!=="Semua") list = list.filter(g=>g.pihak===guestFilter.pihak);
  if(guestFilter.search){
    const q = guestFilter.search.toLowerCase();
    list = list.filter(g=>(g.nama||"").toLowerCase().includes(q) || (g.catatan||"").toLowerCase().includes(q));
  }

  el.innerHTML = `
    <div class="page-head">
      <div><div class="eyebrow">Daftar Undangan</div><h1>Tamu Undangan</h1><p class="desc">Kelola daftar tamu dari kedua pihak keluarga.</p></div>
      <button class="btn primary" id="addGuest">${iconPlus()} Tambah Tamu</button>
    </div>
    <div class="guest-summary">
      <div class="item"><b>${DATA.guests.length}</b>Total Tamu</div>
      ${pihakSet.map(p=>`<div class="item"><b>${DATA.guests.filter(g=>g.pihak===p).length}</b>Pihak ${escapeHtml(p)}</div>`).join("")}
    </div>
    <div class="guest-toolbar">
      <div class="search-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>
        <input id="guestSearch" placeholder="Cari nama atau catatan..." value="${escapeHtml(guestFilter.search)}">
      </div>
      <div class="toolbar" id="pihakFilters">
        <button class="pihak-pill" data-pihak="Semua" style="${guestFilter.pihak==='Semua'?'background:var(--primary);color:#fff;border-color:var(--primary);':''}">Semua</button>
        ${pihakSet.map(p=>`<button class="pihak-pill" data-pihak="${escapeHtml(p)}" style="${guestFilter.pihak===p?'background:var(--primary);color:#fff;border-color:var(--primary);':''}">${escapeHtml(p)}</button>`).join("")}
      </div>
    </div>
    <div class="table-wrap"><table>
      <thead><tr><th style="width:28%">Nama</th><th style="width:16%">Pihak</th><th style="width:20%">No HP</th><th>Catatan</th><th class="col-actions"></th></tr></thead>
      <tbody>
        ${list.length? list.map(g=>`
          <tr data-i="${g._i}">
            <td><input class="cell-input" data-f="nama" value="${escapeHtml(g.nama)}"></td>
            <td><input class="cell-input" data-f="pihak" value="${escapeHtml(g.pihak)}"></td>
            <td><input class="cell-input" data-f="noHp" value="${escapeHtml(g.noHp)}" placeholder="-"></td>
            <td><input class="cell-input" data-f="catatan" value="${escapeHtml(g.catatan)}" placeholder="-"></td>
            <td class="col-actions"><button class="icon-btn" data-del="${g._i}">${iconTrash()}</button></td>
          </tr>
        `).join("") : `<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:24px;">Tidak ada tamu yang cocok</td></tr>`}
      </tbody>
    </table></div>
  `;

  el.querySelectorAll("tbody input").forEach(inp=>{
    inp.addEventListener("change", e=>{
      const i = Number(e.target.closest("tr").dataset.i);
      DATA.guests[i][e.target.dataset.f] = e.target.value;
      saveData(true); renderGuests();
    });
  });
  el.querySelectorAll("[data-del]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      DATA.guests.splice(Number(btn.dataset.del),1);
      saveData(true); renderGuests();
    });
  });
  document.getElementById("addGuest").addEventListener("click", ()=>{
    DATA.guests.unshift({nama:"", pihak: pihakSet[0]||"", noHp:"", catatan:""});
    saveData(true); renderGuests();
    const first = el.querySelector("tbody input");
    if(first) first.focus();
  });
  document.getElementById("guestSearch").addEventListener("input", e=>{
    guestFilter.search = e.target.value; renderGuests();
    const inp = document.getElementById("guestSearch");
    inp.focus(); inp.selectionStart = inp.selectionEnd = inp.value.length;
  });
  el.querySelectorAll("[data-pihak]").forEach(btn=>{
    btn.addEventListener("click", ()=>{ guestFilter.pihak = btn.dataset.pihak; renderGuests(); });
  });
}

// ============================================================
// PAYMENT
// ============================================================
function renderPayment(){
  const el = document.getElementById("view-payment");
  let totalAll=0, dpAll=0;
  DATA.payment.forEach(p=>{ totalAll+=num(p.total); dpAll+=num(p.dp); });
  el.innerHTML = `
    <div class="page-head">
      <div><div class="eyebrow">Cicilan &amp; Pelunasan</div><h1>Pembayaran</h1><p class="desc">Pantau DP, sisa tagihan, dan jatuh tempo tiap vendor.</p></div>
      <button class="btn primary" id="addPayment">${iconPlus()} Tambah Vendor</button>
    </div>
    <div class="table-wrap"><table>
      <thead><tr><th style="width:20%">Vendor</th><th>Total</th><th>DP</th><th>Sisa</th><th style="width:15%">Jatuh Tempo</th><th style="width:14%">Status</th><th class="col-actions"></th></tr></thead>
      <tbody>
        ${DATA.payment.map((p,i)=>{
          const sisa = num(p.total)-num(p.dp);
          return `<tr data-i="${i}">
            <td><input class="cell-input" data-f="vendor" value="${escapeHtml(p.vendor)}"></td>
            <td><input class="cell-input" data-f="total" type="number" value="${p.total||0}"></td>
            <td><input class="cell-input" data-f="dp" type="number" value="${p.dp||0}"></td>
            <td style="color:var(--text-muted);">${rupiah(sisa)}</td>
            <td><input class="cell-input" data-f="jatuhTempo" type="date" value="${p.jatuhTempo||""}"></td>
            <td><select class="cell-input" data-f="status" style="border:1px solid var(--border);">
              ${["Belum Bayar","DP","Lunas"].map(s=>`<option ${s===p.status?"selected":""}>${s}</option>`).join("")}
            </select></td>
            <td class="col-actions"><button class="icon-btn" data-del="${i}">${iconTrash()}</button></td>
          </tr>`;
        }).join("")}
        <tr class="total-row">
          <td>Total</td><td>${rupiah(totalAll)}</td><td>${rupiah(dpAll)}</td><td>${rupiah(totalAll-dpAll)}</td><td></td><td></td><td></td>
        </tr>
      </tbody>
    </table></div>
  `;
  el.querySelectorAll("tbody tr[data-i] [data-f]").forEach(inp=>{
    inp.addEventListener("change", e=>{
      const i = Number(e.target.closest("tr").dataset.i);
      const f = e.target.dataset.f;
      DATA.payment[i][f] = (f==="total"||f==="dp") ? num(e.target.value) : e.target.value;
      saveData(true); renderPayment(); renderDashboard();
    });
  });
  el.querySelectorAll("[data-del]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      DATA.payment.splice(Number(btn.dataset.del),1);
      saveData(true); renderPayment(); renderDashboard();
    });
  });
  document.getElementById("addPayment").addEventListener("click", ()=>{
    DATA.payment.push({vendor:"Vendor Baru", total:0, dp:0, jatuhTempo:"", status:"Belum Bayar"});
    saveData(true); renderPayment();
  });
}

// ============================================================
// INIT / GLOBAL EVENTS
// ============================================================
function init(){
  document.querySelectorAll(".nav-item").forEach(btn=>{
    btn.addEventListener("click", ()=>setView(btn.dataset.view));
  });
  document.getElementById("hamburgerBtn").addEventListener("click", openSidebar);
  document.getElementById("sidebarClose").addEventListener("click", closeSidebar);
  document.getElementById("overlay").addEventListener("click", closeSidebar);

  document.getElementById("btnExport").addEventListener("click", ()=>{
    const blob = new Blob([JSON.stringify(DATA,null,2)], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "wedding-plan-backup.json"; a.click();
    URL.revokeObjectURL(url);
    showToast("File cadangan diunduh");
  });
  document.getElementById("btnImport").addEventListener("click", ()=>document.getElementById("fileImport").click());
  document.getElementById("fileImport").addEventListener("change", e=>{
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ()=>{
      try{
        const parsed = JSON.parse(reader.result);
        if(!parsed.meta || !parsed.budget) throw new Error("format tidak valid");
        DATA = parsed; saveData(true); renderAll(); setView(currentView);
        showToast("Data berhasil diimport");
      }catch(err){ showToast("File tidak valid"); }
    };
    reader.readAsText(file);
    e.target.value = "";
  });
  document.getElementById("btnReset").addEventListener("click", ()=>{
    if(confirm("Kembalikan semua data ke data awal dari Excel? Perubahan yang belum di-export akan hilang.")){
      DATA = deepClone(DEFAULT_DATA);
      saveData(true); renderAll(); setView(currentView);
      showToast("Data direset");
    }
  });

  renderAll();
  setView("dashboard");
  // buka bulan berjalan otomatis di timeline saat pertama render
}

document.addEventListener("DOMContentLoaded", init);
})();
