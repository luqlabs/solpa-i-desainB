---
name: solpaci-b-full
owner: astra
date: 2026-09-24
status: internal-design-preview
---

# Solpaċi B — Color Studio

Preview frontend mandiri tujuh halaman. **Bukan toko aktif**, bukan file Figma, bukan template Elementor, dan belum merupakan persetujuan klien.

Catatan revisi: versi ini menggantikan draft awal B yang berjudul "agensi-spanduk" (uppercase shouty, border 4-5 px ke segala arah). Versi revisi mengikuti bahasa visual dari Essie (warna sebagai fokus, kanvas putih bersih, heading besar berani tapi tenang) dan Gingel (mood boutique tenang, panel pink sebagai aksen, tipografi poster). Tujuannya: dua pilihan untuk klien — A tenang-editorial, B medium-bold-poster — keduanya feminim boutique, bukan streetwear.

## Buka preview

Buka langsung:

`file:///C:/Lucky%20punya%20dataset/Solpaci/assets/design-b-full/index.html`

Atau buka file `C:\Lucky punya dataset\Solpaci\assets\design-b-full\index.html` di browser. Tidak ada instalasi npm, CDN, font eksternal, atau koneksi internet yang dibutuhkan. JavaScript harus aktif untuk konten interaktif; tanpa JavaScript tersedia penjelasan singkat dan navigasi fallback.

Jika penyimpanan `file://` dibatasi browser, gunakan server lokal (jalankan sendiri, berhenti dengan Ctrl+C):

```bat
"C:\Users\LENOVO\AppData\Local\Programs\Python\Python314\python.exe" -m http.server 8087 --bind 127.0.0.1 --directory "C:\Lucky punya dataset\Solpaci\assets\design-b-full"
```

Lalu buka `http://127.0.0.1:8087/index.html`. Keranjang untuk `file://` dan HTTP adalah penyimpanan terpisah. Perilaku localStorage file lokal dapat berbeda antarbrowser.

## Bahasa visual (Color Studio)

Arah B menggunakan pink sebagai panel tema (bukan blok overpower), border hitam tegas sebagai pembentuk komposisi, dan tipografi sans-serif display tebal sebagai figur utama. Tone boutique tenang — beda dari A di tiga hal: heading menggunakan sans-serif display (Helvetica Neue / Segoe UI / Arial) 700, bukan serif; border pakai tiga bobot (1 / 2 / 4 px) untuk membentuk struktur; pink dipakai sebagai surface panel di hero art, story, footer top, catalog aside. Copy menggunakan kalimat pendek feminim ("A color study.", "Pick your shade.", "Made for every mood.") — bukan slogannya agensi.

Palet usulan: cream `#F5F2E9` (kanvas utama), medium pink `#EFC5CD` (panel pink), pink-deep `#E291A0` (varian), ink `#181516` (teks dan border), accent marun `#7A2C3F` (hover, harga, kutipan), pop `#D84862` (aksen terbatas). Headline sans-serif display 700 dengan line-height 1.05; body Helvetica Neue 14/1.6. Breakpoint mobile 700 px, penyesuaian tablet 1000 px. Grid katalog: empat kolom desktop, dua kolom mobile.

## Isi dan perilaku

Semua output berada di `C:\Lucky punya dataset\Solpaci\assets\design-b-full`:

- `index.html` — hero poster, koleksi, story editorial, FAQ rumah, footer dengan statement strip.
- `shop.html` — filter dua-tone (Soft / Bold), pencarian, urutan nama, aside pink, empty state.
- `product.html` — empat detail shade via `?shade=01` sampai `04`, galeri utama, picker shade dengan border aktif, jumlah, related shades, invalid state.
- `cart.html` — jumlah, hapus, subtotal, summary tempel (sticky), empty state.
- `checkout.html` — form data rekaan terkunci, simulasi pilihan, consent wajib, konfirmasi tanpa transaksi.
- `about.html` — narasi brand dengan kutipan editorial di blok pink, tiga pilar nilai.
- `faq.html` — katalog pertanyaan dengan navigator kategori sticky (panel), produk, belanja, kebijakan, dan related shades di footer.
- `app.js` — render dan interaksi plain JavaScript.
- `catalog.js` — empat shade demo sama dengan studi awal dan A.
- `styles.css` — responsive CSS, sans-serif display + body, border 1/2/4 px, panel pink, fokus keyboard, reduced motion.
- `tokens.json` — design system tokens (warna, tipografi, border 1/2/4 px, spacing, breakpoint, grid). Ditulis terakhir setelah styling stabil, jadi acuan handover ke Elementor / WooCommerce. Tidak di-fetch saat runtime agar tetap offline.
- `images` — sepuluh SVG lokal: studio poster, ikon, empat botol dan empat swatch. Ilustrasi studi awal disalin read-only, bukan foto klien.

Bahasa ID/EN mengikuti parameter `lang=id` / `lang=en` dan pilihan browser. Tagline Inggris dipertahankan sebagai bagian konsep di kedua bahasa. Shade dan mata uang rupiah tidak berubah saat bahasa diganti. Harga keempat produk sama, sehingga pengurutan yang ditawarkan adalah urutan koleksi / nama A–Z / nama Z–A, bukan opsi harga yang tidak memberi perbedaan.

Keranjang memakai key **khusus B** `solpaci-b-demo-cart-v1`, bahasa `solpaci-b-lang`. Tidak membaca/menulis key A. Jumlah 1–10 per shade adalah batas demo, bukan stok. Data rusak/asing disaring saat dibaca. Jika localStorage diblokir, aplikasi menampilkan peringatan dan hanya menyimpan state sementara pada halaman aktif. Perubahan keranjang juga diselaraskan antartab HTTP.

Checkout tidak meminta nama/alamat/email asli, tidak mengirim form, tidak membuat nomor pesanan, QR, atau instruksi transfer. Opsi reguler/ekspres dan VA/QRIS hanya demonstrasi UI. Ongkir/pajak tidak dianggap gratis; semuanya **belum dihitung**. Konfirmasi tidak mengosongkan keranjang. Pilihan checkout tidak disimpan.

## Visual & screenshot

Screenshot dihasilkan via Playwright Chromium headless pada 1440 px desktop dan 390 px mobile.

- `preview-screenshots/home-desktop.png` — homepage, lebar 1440 px.
- `preview-screenshots/home-mobile.png` — homepage, lebar 390 px.
- `preview-screenshots/shop-desktop.png` — koleksi + aside pink, lebar 1440 px.
- `preview-screenshots/shop-mobile.png` — koleksi, lebar 390 px.
- `preview-screenshots/product-desktop.png` — detail shade galeri utama, lebar 1440 px.
- `preview-screenshots/product-mobile.png` — detail shade, lebar 390 px.
- `preview-screenshots/cart-desktop.png` — keranjang + summary, lebar 1440 px.
- `preview-screenshots/cart-mobile.png` — keranjang, lebar 390 px.
- `preview-screenshots/checkout-desktop.png` — checkout form + summary, lebar 1440 px.
- `preview-screenshots/checkout-mobile.png` — checkout, lebar 390 px.
- `preview-screenshots/about-desktop.png` — cerita brand + kutipan pink, lebar 1440 px.
- `preview-screenshots/about-mobile.png` — cerita brand, lebar 390 px.
- `preview-screenshots/faq-desktop.png` — daftar FAQ + navigator kategori, lebar 1440 px.
- `preview-screenshots/faq-mobile.png` — daftar FAQ, lebar 390 px.

Pemutakhiran skrip tangkap: `build/capture_previews.py`. Skrip mengarahkan Chromium ke direktori lokal B, memuat `index.html` lalu menavigasi tujuh halaman dengan parameter bahasa, dan menyimpan PNG sesuai nama di atas.

## Pengujian yang dapat diulang

Pemutakhiran Playwright tersedia dengan menjalankan skrip tangkap:

```bat
"C:\Users\LENOVO\AppData\Local\Programs\Python\Python314\python.exe" "C:\Lucky punya dataset\Solpaci\assets\design-b-full\build\capture_previews.py"
```

Output skrip: empat belas PNG di `preview-screenshots/`. Skrip memuat setiap halaman, mengatur `lang=id`, menunggu render selesai, lalu mengambil screenshot viewport. Tidak menjalankan browser lain — hanya Chromium headless yang sudah tersedia.

**Batas QA:** Chromium, bukan pengujian lintas-browser atau audit WCAG lengkap. Uji integrasi WooCommerce/payment/shipping tidak termasuk. Tidak ada klaim bahwa preview siap produksi.

## Handover untuk Claude

1. Review internal Lucky lebih dulu; tidak ada desain yang dikirim otomatis ke klien.
2. Logo/wordmark, font final, foto, bentuk kemasan, nama/warna shade, harga Rp99.000, copy, formula/volume, kebijakan, ongkir/pajak, dan kontak resmi masih menunggu aset/data/ACC klien. Tidak ada klaim ketahanan, sertifikasi, testimoni, stok, atau best-seller yang direka.
3. Gunakan token dan screenshot sebagai spesifikasi visual, bukan bukti kompatibilitas widget Elementor Free. Implementasi produksi tetap WordPress/WooCommerce.
4. Cart, checkout, stok, pembayaran, shipping, bilingual produk, privasi dan validasi server harus memakai implementasi produksi, **bukan localStorage/checkout demo ini**.
5. Border 1/2/4 px adalah ciri bahasa visual B. Saat membuat Global Styles Elementor, petakan border-width dengan ketebalan yang sama. Penggunaan border tipis pada kartu produk dan heavy (4 px) di separator antar section adalah kunci perbedaan dari A.
6. Pink `#EFC5CD` dipakai sebagai panel permukaan (hero art, story, footer top, catalog aside, closing CTA strip), bukan sebagai latar dokumen penuh. Saat produksi, pertahankan susunan cream sebagai body dan pink sebagai layer.
7. Native `.fig`, export JSON Elementor, PHP/SQL, hosting, payment, dan shipping tidak dibuat atau disentuh dalam pekerjaan ini.
8. Preview A/B awal, A full, scratchpad, kredensial, dokumen koordinasi backend, dan folder review bersama tidak diedit oleh pekerjaan ini.

## Perbedaan singkat A vs B

A (Soft Editorial) menggunakan serif 400 dan pink lembut `#FBE4E6` sebagai aksen sekunder; B (Color Studio) menggunakan sans-serif display 700 dan pink medium `#EFC5CD` sebagai panel primer. A bertujuan nuansa editorial buku majalah; B bertujuan nuansa poster butik warna. Keduanya feminim tenang dan siap premium. Keputusan akhir menunggu ACC klien.

## File yang dibackup

Draft awal B yang bercorak agensi (uppercase + slogan jalanan) disimpan di `backup/old-b-asal-asalan-2409/` untuk referensi internal — bukan untuk presentasi klien. Versi revisi ini adalah yang dikirim ke klien lewat Lucky.
