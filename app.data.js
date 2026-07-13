// ============================================================
// DATA AWAL
// Dipakai hanya saat pertama kali website dibuka di sebuah
// browser (belum ada data tersimpan). User memilih salah satu:
//  - DUMMY_DATA : data contoh (fiktif) untuk melihat semua fitur
//  - EMPTY_DATA : semua kosong, siap diisi dari nol
// Setelah dipilih, semua perubahan disimpan otomatis ke localStorage.
// ============================================================

const DUMMY_DATA = {
  meta: {
    coupleA: "Raka",
    coupleB: "Salsa",
    venue: "Gedung Serbaguna Melati, Jakarta",
    tanggalAkad: "2027-02-13",
    tanggalResepsi: "2027-02-13",
    totalBudget: 50000000
  },

  budget: [{
      kategori: "Venue",
      volume: "1",
      estimasi: 18000000,
      realisasi: 18000000
    },
    {
      kategori: "Dekorasi",
      volume: "1 Paket",
      estimasi: 8000000,
      realisasi: 4000000
    },
    {
      kategori: "Katering",
      volume: "300 Pax",
      estimasi: 9000000,
      realisasi: 0
    },
    {
      kategori: "MUA & Busana",
      volume: "1 Set",
      estimasi: 6000000,
      realisasi: 3000000
    },
    {
      kategori: "Fotografi & Videografi",
      volume: "1 Paket",
      estimasi: 4500000,
      realisasi: 0
    },
    {
      kategori: "Undangan",
      volume: "200",
      estimasi: 800000,
      realisasi: 800000
    },
    {
      kategori: "Souvenir",
      volume: "200",
      estimasi: 1200000,
      realisasi: 0
    },
    {
      kategori: "Hiburan / Entertainment",
      volume: "1 Paket",
      estimasi: 2500000,
      realisasi: 0
    }
  ],

  vendor: [{
      kategori: "Venue",
      namaVendor: "Contoh Gedung Melati",
      picDana: "Pria",
      status: "Fix",
      kontak: "0812xxxxxxx",
      catatan: "DP sudah dibayar",
      items: [
        "Kapasitas 300 orang", "Sewa 1 hari penuh", "AC & sound system standar"
      ]
    },
    {
      kategori: "Dekorasi",
      namaVendor: "Contoh Dekor Indah",
      picDana: "Wanita",
      status: "Negosiasi",
      kontak: "",
      catatan: "",
      items: [
        "Pelaminan minimalis", "Bunga jalan", "Photobooth sederhana"
      ]
    },
    {
      kategori: "Katering",
      namaVendor: "Contoh Catering Rasa",
      picDana: "Pria",
      status: "Survey",
      kontak: "",
      catatan: "",
      items: [
        "Nasi & lauk 3 pilihan", "Dessert corner", "Minuman prasmanan"
      ]
    },
    {
      kategori: "Fotografi & Videografi",
      namaVendor: "Contoh Studio Cahaya",
      picDana: "Wanita",
      status: "Survey",
      kontak: "",
      catatan: "",
      items: [
        "1 fotografer + 1 videografer", "Album cetak", "Highlight video"
      ]
    }
  ],

  timeline: [{
      bulan: "Bulan 1",
      tasks: [{
          tugas: "Survey & fix venue",
          pic: "Raka",
          status: "Selesai"
        },
        {
          tugas: "Survey vendor dekorasi",
          pic: "Salsa",
          status: "Proses"
        },
        {
          tugas: "Tentukan tanggal acara",
          pic: "Semua",
          status: "Selesai"
        }
      ]
    },
    {
      bulan: "Bulan 2",
      tasks: [{
          tugas: "Booking fotografer",
          pic: "Salsa",
          status: "Belum"
        },
        {
          tugas: "Fix menu katering",
          pic: "Raka",
          status: "Belum"
        },
        {
          tugas: "Desain undangan",
          pic: "Salsa",
          status: "Proses"
        }
      ]
    },
    {
      bulan: "Bulan 3",
      tasks: [{
          tugas: "Cetak & sebar undangan",
          pic: "Semua",
          status: "Belum"
        },
        {
          tugas: "Fitting busana",
          pic: "Salsa",
          status: "Belum"
        }
      ]
    }
  ],

  guests: [{
      nama: "Contoh Tamu 1",
      pihak: "Mempelai Pria",
      noHp: "",
      catatan: "Keluarga"
    },
    {
      nama: "Contoh Tamu 2",
      pihak: "Mempelai Pria",
      noHp: "",
      catatan: "Teman kantor"
    },
    {
      nama: "Contoh Tamu 3",
      pihak: "Mempelai Wanita",
      noHp: "",
      catatan: "Keluarga"
    },
    {
      nama: "Contoh Tamu 4",
      pihak: "Mempelai Wanita",
      noHp: "",
      catatan: "Teman kuliah"
    }
  ],

  payment: [{
      vendor: "Venue",
      total: 18000000,
      dp: 18000000,
      jatuhTempo: "",
      status: "Lunas"
    },
    {
      vendor: "Dekorasi",
      total: 8000000,
      dp: 4000000,
      jatuhTempo: "2027-01-10",
      status: "DP"
    },
    {
      vendor: "Katering",
      total: 9000000,
      dp: 0,
      jatuhTempo: "2027-01-20",
      status: "Belum Bayar"
    },
    {
      vendor: "Fotografi & Videografi",
      total: 4500000,
      dp: 0,
      jatuhTempo: "2027-01-15",
      status: "Belum Bayar"
    }
  ]
};

const EMPTY_DATA = {
  meta: {
    coupleA: "",
    coupleB: "",
    venue: "",
    tanggalAkad: "",
    tanggalResepsi: "",
    totalBudget: 0
  },
  budget: [],
  vendor: [],
  timeline: [],
  guests: [],
  payment: []
};