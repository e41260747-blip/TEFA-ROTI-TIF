/* TEFA ROTI SIP - Keranjang pemesanan & chat WhatsApp */

// GANTI nomor WhatsApp admin TEFA (format: kode negara tanpa +, tanpa 0 di depan)
const NOMOR_WA = "6285755823704";

const keranjang = {}; // { id: {nama, harga, jumlah} }

const rupiah = (n) => "Rp " + n.toLocaleString("id-ID");
const bukaWA = (teks) =>
  window.open("https://wa.me/" + NOMOR_WA + "?text=" + encodeURIComponent(teks), "_blank");

const elDaftar = document.getElementById("daftar-keranjang");
const elKosong = document.getElementById("keranjang-kosong");
const elArea = document.getElementById("area-beli");
const elTotal = document.getElementById("total");

function render() {
  elDaftar.innerHTML = "";
  let total = 0;
  const ids = Object.keys(keranjang);

  ids.forEach((id) => {
    const it = keranjang[id];
    total += it.harga * it.jumlah;
    const li = document.createElement("li");
    li.innerHTML =
      '<span class="nama">' + it.nama + "<small>" + rupiah(it.harga) + "</small></span>" +
      '<span class="qty">' +
      '<button type="button" data-aksi="kurang" data-id="' + id + '" aria-label="Kurangi">−</button>' +
      "<b>" + it.jumlah + "</b>" +
      '<button type="button" data-aksi="tambah" data-id="' + id + '" aria-label="Tambah">+</button>' +
      "</span>" +
      '<span class="sub">' + rupiah(it.harga * it.jumlah) + "</span>";
    elDaftar.appendChild(li);
  });

  elKosong.hidden = ids.length > 0;
  elArea.hidden = ids.length === 0;
  elTotal.textContent = rupiah(total);
}

// Tombol "+ Tambah" pada kartu roti
document.querySelectorAll(".kartu-roti").forEach((kartu) => {
  kartu.querySelector(".btn-tambah").addEventListener("click", () => {
    const id = kartu.dataset.id;
    if (!keranjang[id]) {
      keranjang[id] = { nama: kartu.dataset.nama, harga: Number(kartu.dataset.harga), jumlah: 0 };
    }
    keranjang[id].jumlah++;
    render();
  });
});

// Tombol +/- di keranjang
elDaftar.addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  const it = keranjang[b.dataset.id];
  if (!it) return;
  it.jumlah += b.dataset.aksi === "tambah" ? 1 : -1;
  if (it.jumlah <= 0) delete keranjang[b.dataset.id];
  render();
});

// Tombol Beli -> kirim pesanan ke WhatsApp
document.getElementById("btn-beli").addEventListener("click", () => {
  const nama = document.getElementById("nama-pemesan").value.trim();
  if (!nama) {
    alert("Silakan isi nama pemesan terlebih dahulu.");
    document.getElementById("nama-pemesan").focus();
    return;
  }
  let total = 0;
  let teks = "Halo TEFA ROTI SIP, saya ingin memesan:\n";
  Object.values(keranjang).forEach((it) => {
    total += it.harga * it.jumlah;
    teks += "- " + it.nama + " x" + it.jumlah + " = " + rupiah(it.harga * it.jumlah) + "\n";
  });
  teks += "\nTotal: " + rupiah(total) + "\nAtas nama: " + nama;
  bukaWA(teks);
});

// Chatbox WhatsApp
const panel = document.getElementById("wa-panel");
document.getElementById("wa-buka").addEventListener("click", () => {
  panel.hidden = !panel.hidden;
  if (!panel.hidden) document.getElementById("wa-pesan").focus();
});
document.getElementById("wa-tutup").addEventListener("click", () => (panel.hidden = true));
document.getElementById("wa-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("wa-pesan");
  const pesan = input.value.trim();
  if (!pesan) return;
  bukaWA(pesan);
  input.value = "";
});

render();
