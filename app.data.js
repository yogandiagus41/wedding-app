// ============================================================
// DATA AWAL — diambil dari Wedding_Plan.xlsx
// Data ini hanya dipakai SEKALI saat pertama kali dibuka
// (belum ada data tersimpan di browser). Setelah itu semua
// perubahan disimpan otomatis ke localStorage.
// ============================================================
const DEFAULT_DATA = {
  meta: {
    coupleA: "Agus",
    coupleB: "Wenna",
    venue: "Graha Yapin Jatimulya",
    tanggalAkad: "2026-12-05",
    tanggalResepsi: "2026-12-05",
    totalBudget: 60000000
  },

  budget: [
    { kategori: "Venue", volume: "1", estimasi: 26000000, realisasi: 0 },
    { kategori: "Dekorasi", volume: "", estimasi: 0, realisasi: 0 },
    { kategori: "Entertain", volume: "", estimasi: 0, realisasi: 0 },
    { kategori: "Katering + Baso 200 Pax", volume: "600 Pax", estimasi: 11000000, realisasi: 0 },
    { kategori: "Petugas Cuci Piring", volume: "2 Orang", estimasi: 500000, realisasi: 0 },
    { kategori: "Buah", volume: "2 Jenis", estimasi: 1000000, realisasi: 0 },
    { kategori: "Minuman Segar", volume: "2 Jenis", estimasi: 300000, realisasi: 0 },
    { kategori: "Eskrim", volume: "1 Ember", estimasi: 300000, realisasi: 0 },
    { kategori: "Kue Basah", volume: "3 Tampah", estimasi: 1000000, realisasi: 0 },
    { kategori: "MUA & Attire", volume: "1 Set", estimasi: 9000000, realisasi: 0 },
    { kategori: "FG & VG Akad & Resepsi", volume: "1 Set", estimasi: 3000000, realisasi: 0 },
    { kategori: "FG & VG Prewed", volume: "1 Set", estimasi: 1000000, realisasi: 0 },
    { kategori: "Undangan", volume: "300", estimasi: 500000, realisasi: 0 },
    { kategori: "Souvenir", volume: "300", estimasi: 700000, realisasi: 0 },
    { kategori: "MC Akad & Resepsi", volume: "1 Orang", estimasi: 1000000, realisasi: 0 },
    { kategori: "Buku Tamu", volume: "1 Pcs", estimasi: 50000, realisasi: 0 },
    { kategori: "Seragam L", volume: "20 Pcs", estimasi: 2000000, realisasi: 0 },
    { kategori: "Seragam P", volume: "20 Pcs", estimasi: 1000000, realisasi: 0 },
    { kategori: "Urus KUA", volume: "1 Set", estimasi: 1000000, realisasi: 0 },
    { kategori: "Lainnya", volume: "", estimasi: 3000000, realisasi: 0 }
  ],

  vendor: [
    { kategori: "Venue", namaVendor: "Graha Yapin Jatimulya", picDana: "Pria", status: "Survey", kontak: "", catatan: "", items: [] },
    { kategori: "Dekorasi", namaVendor: "Paket Pelangi Dekor", picDana: "Pria", status: "Negosiasi", kontak: "", catatan: "", items: [
      "Pelaminan 6-8 meter","Pergola pintu masuk","Bunga jalan 3 pasang (menyesuaikan panjang)","Set meja akad nikah","Mini garden",
      "Kotak amplop 2","Janur 1 pasang","Standing lampu 1 pasang","Karpet jalan","Rolltop 5","Alat makan 300 set","Blower 3 pcs",
      "AC portable 1 pk 1 pcs","Meja kotak dan bulet untuk prasmanan","Meja gubukan 3 set","Juicer 2","Bangku plastik + cover 100 pcs",
      "Tenda set tirai 4x8","Buket bunga","Wellcome sign (foto 3 lembar)","Wellcome board (kaca)"
    ]},
    { kategori: "MUA & Attire", namaVendor: "Maulina", picDana: "Wanita", status: "Survey", kontak: "", catatan: "", items: [
      "Makeup akad nikah + retouch resepsi 1x","1 pasang busana akad nikah","1 pasang busana resepsi","2 busana ibu pengantin + makeup",
      "2 busana bapak pengantin","4 busana penerima tamu + makeup","Free sepasang melati premium","Free adat (sunda / jawa non paes / betawi) — pilih salah 1",
      "Free henna white + nail art","Free softlens normal"
    ]},
    { kategori: "Catering", namaVendor: "Masak (600 Pax)", picDana: "Pria", status: "Survey", kontak: "", catatan: "", items: [
      "Nasi","Sambel ati kentang","Ayam teriyaki / ayam asam manis","Bihun / karedok","Sop","Kerupuk","Buah","Minuman rasa (sirup)",
      "Eskrim","Baso","Dimsum","Aqua gelas"
    ]},
    { kategori: "FG & VG Akad & Resepsi", namaVendor: "Kanta Production", picDana: "Wanita", status: "Survey", kontak: "", catatan: "", items: [
      "1 FG & 1 VG (8 jam unlimited shoot)","250 edit foto (google drive files)","Cinematic video 3 menit","Teaser video 1 menit"
    ]},
    { kategori: "FG & VG Prewed", namaVendor: "Kanta Production", picDana: "", status: "", kontak: "", catatan: "", items: [
      "1 FG (include VG)","Unlimited foto","1 menit video cinematic","2 jam"
    ]},
    { kategori: "Entertain", namaVendor: "Pelangi decor", picDana: "Pria", status: "Negosiasi", kontak: "", catatan: "", items: [
      "1 pemain keyboard (organ)","2 penyanyi","1 sound sistem","1 MC"
    ]},
    { kategori: "Undangan", namaVendor: "Online", picDana: "Wanita", status: "Survey", kontak: "", catatan: "", items: [] },
    { kategori: "MC Akad dan Resepsi", namaVendor: "", picDana: "Wanita", status: "Survey", kontak: "", catatan: "", items: [] },
    { kategori: "Buku Tamu", namaVendor: "Online", picDana: "Wanita", status: "Survey", kontak: "", catatan: "", items: [] },
    { kategori: "Souvenir", namaVendor: "Online", picDana: "Wanita", status: "Survey", kontak: "", catatan: "", items: [] },
    { kategori: "Seragam keluarga", namaVendor: "Online", picDana: "Wanita", status: "Survey", kontak: "", catatan: "", items: [] }
  ],

  timeline: [
    { bulan: "Juli", tasks: [
      { tugas: "Fixasi & Booking Vendor Dekorasi", pic: "Agus", status: "Proses" },
      { tugas: "Fixasi & Booking Vendor MUA & Attrire", pic: "Wenna", status: "Belum" },
      { tugas: "Fixasi, Survey & Booking Venue", pic: "Agus", status: "Proses" },
      { tugas: "Fixasi & Booking Entertain", pic: "Agus", status: "Proses" },
      { tugas: "Fixasi & Booking FG & VG Akad & Resepsi", pic: "Agus", status: "Proses" },
      { tugas: "Fixasi & Booking FG & VG Prewed", pic: "Agus", status: "Proses" },
      { tugas: "Fixasi & Booking MC Akad & Resepsi", pic: "Wenna", status: "Belum" },
      { tugas: "Fixasi & Booking Stall Tambahan", pic: "Wenna", status: "Belum" },
      { tugas: "Fixasi Souvenir", pic: "Wenna", status: "Belum" },
      { tugas: "Fixasi Design Seragam", pic: "Wenna", status: "Belum" }
    ]},
    { bulan: "Agustus", tasks: [
      { tugas: "List Undangan Sementara", pic: "All", status: "Proses" },
      { tugas: "Fixasi List Seragam Keluarga", pic: "All", status: "Belum" },
      { tugas: "Urus berkas KUA/Catatan Sipil", pic: "All", status: "Belum" },
      { tugas: "Tentukan Design Undangan Fisik & Online", pic: "All", status: "Belum" }
    ]},
    { bulan: "September", tasks: [
      { tugas: "Fixasi List Undangan", pic: "All", status: "Belum" },
      { tugas: "Order Undangan", pic: "Wenna", status: "Belum" },
      { tugas: "Order Souvenir", pic: "Wenna", status: "Belum" },
      { tugas: "Meet Bareng MC & All Vendor", pic: "All", status: "Belum" },
      { tugas: "Buat Rundown Acara", pic: "All", status: "Belum" }
    ]},
    { bulan: "Oktober", tasks: [] },
    { bulan: "November", tasks: [
      { tugas: "Foto Prewed", pic: "All", status: "Belum" },
      { tugas: "Fitting Baju", pic: "All", status: "Belum" },
      { tugas: "Pelunasan Semua Vendor", pic: "All", status: "Belum" },
      { tugas: "Dekorasi Seserahan", pic: "All", status: "Belum" }
    ]},
    { bulan: "Desember", tasks: [] }
  ],

  guests: [
    ["Maman","Agus","","Rumah"],["Aja","Agus","","Rumah"],["Degol","Agus","",""],["Apri","Agus","",""],["Kebo","Agus","",""],
    ["Adang","Agus","",""],["Ebot","Agus","",""],["Arif","Agus","",""],["Bayu","Agus","",""],["Tebe","Agus","",""],
    ["Reza Afriansyah","Agus","",""],["Bayu Kurniadi","Agus","",""],["Sigma Trio","Agus","",""],["Vishal Darmawan","Agus","",""],["Rosiangga","Agus","",""],
    ["Ciko","Agus","",""],["Aditya Welly","Agus","",""],["Gilang","Agus","",""],["Haickal","Agus","",""],["Rifki","Agus","",""],
    ["Theo","Agus","",""],["Wildan","Agus","",""],["Dimas","Agus","",""],["Azmi","Agus","",""],["Hakim","Agus","",""],
    ["Wahab","Agus","",""],["Rama","Agus","",""],["Rozaan","Agus","",""],["Oki","Agus","",""],["Dimas","Agus","",""],
    ["Rafilio","Agus","",""],["Prio","Agus","",""],["Doni","Agus","",""],["Chandra","Agus","",""],["Damar","Agus","",""],
    ["Muadz","Agus","",""],["Kumis","Agus","",""],["Nova","Agus","",""],["Bang Andi W","Agus","",""],["Bang Kukuh","Agus","",""],
    ["Inas","Agus","",""],["Pak Nas","Agus","",""],["Mas Tri","Agus","",""],["Pak Al","Agus","",""],["Aji","Agus","",""],
    ["Riyadi","Agus","",""],["Eric","Agus","",""],["Andi K","Agus","",""],["Diffa","Agus","",""],["Kiki","Agus","",""],
    ["Rafael","Agus","",""],["Bang Idris","Agus","",""],["Bang Diwan","Agus","",""],["Bang Dudung","Agus","",""],["Bang Hardi","Agus","",""],
    ["Bu Anti","Agus","",""],["Mba Lilis","Agus","",""],["Mba Anggi","Agus","",""],["Isna","Agus","",""],["Bu Yiyik","Agus","",""],
    ["Pak Roy","Agus","",""],["Pak Awan","Agus","",""],["Pak Naim","Agus","",""],["Pak Yuli","Agus","",""],["Pak Djas","Agus","",""],
    ["Mba Thira","Agus","",""],["Mba Tia","Agus","",""],["Abel","Agus","",""],["Tulus","Agus","",""],["Rama","Agus","",""],
    ["Fadli","Agus","",""],["Ridwan","Agus","",""],["Fifi","Agus","",""],["Mas Andri","Agus","",""],["Mba Karin","Agus","",""],
    ["Andini","Agus","",""],["Bu Maria","Agus","",""],["Bu Porih","Agus","",""],["Bu Laurent","Agus","",""],["Bang Ihsan","Agus","",""],
    ["Putra","Agus","",""],["Hafiz","Agus","",""],["Bu Hermita","Agus","",""],["Pak Abdul","Agus","",""],["Jihan","Agus","",""],
    ["Bu Felicia","Agus","",""],["Fitri","Agus","",""],["Pak Indra","Agus","",""],["Gorgom","Agus","",""],["Bang Jek","Agus","",""],
    ["Belo","Agus","",""],["Komenk","Agus","",""],["Tori","Agus","",""],["Ayah Baim","Agus","",""],["Dekok","Agus","",""],
    ["Midun","Agus","",""],["Pak Syaiful","Agus","",""],["Teh Ela","Agus","",""],["Pak Beny","Agus","",""]
  ].map(g => ({ nama: g[0], pihak: g[1], noHp: g[2], catatan: g[3] })),

  payment: [
    { vendor: "Venue", total: 0, dp: 0, jatuhTempo: "", status: "Belum Bayar" },
    { vendor: "Dekorasi", total: 0, dp: 0, jatuhTempo: "", status: "Belum Bayar" },
    { vendor: "Entertain", total: 0, dp: 0, jatuhTempo: "", status: "Belum Bayar" },
    { vendor: "Katering", total: 0, dp: 0, jatuhTempo: "", status: "Belum Bayar" },
    { vendor: "MUA", total: 0, dp: 0, jatuhTempo: "", status: "Belum Bayar" },
    { vendor: "FG & VG Akad & Resepsi", total: 0, dp: 0, jatuhTempo: "", status: "Belum Bayar" },
    { vendor: "FG & VG Prewed", total: 0, dp: 0, jatuhTempo: "", status: "Belum Bayar" },
    { vendor: "Undangan", total: 0, dp: 0, jatuhTempo: "", status: "Belum Bayar" },
    { vendor: "Souvenir", total: 0, dp: 0, jatuhTempo: "", status: "Belum Bayar" },
    { vendor: "MC Akad & Resepsi", total: 0, dp: 0, jatuhTempo: "", status: "Belum Bayar" },
    { vendor: "Buku Tamu", total: 0, dp: 0, jatuhTempo: "", status: "Belum Bayar" },
    { vendor: "Seragam L", total: 0, dp: 0, jatuhTempo: "", status: "Belum Bayar" },
    { vendor: "Seragam P", total: 0, dp: 0, jatuhTempo: "", status: "Belum Bayar" }
  ]
};
