# Logo PPI Jepang

Halaman pedoman: [`brand-ppi-jepang.html`](brand-ppi-jepang.html), diterbitkan di
`https://ppij-dev.github.io/ppij-design-system/brand/logo/brand-ppi-jepang.html`. Salinan PDF:
[`brand-ppi-jepang.pdf`](brand-ppi-jepang.pdf).

Status: **usulan untuk AD/ART 2027-2028**. Versi Primer berlaku sekarang. Variasi Inversi dan susunan horizontal belum disahkan Kongres; sampai disahkan, surat dan dokumen resmi memakai versi Primer.

Pemakaian logo oleh pihak luar memerlukan izin tertulis dari Pengurus Pusat PPI Jepang. Menaruh berkas di repositori ini bukan pemberian izin.

## Berkas

Latar transparan. Nama berkas mengikuti istilah di halaman pedoman: vertikal, horizontal, horizontal lengkap. Akhirannya menunjukkan latar yang dituju.

| Susunan | Primer | Inversi Hitam | Inversi Putih |
| --- | --- | --- | --- |
| Vertikal | `ppij-vertical-primary.svg` | `ppij-vertical-inverse-black.svg` | `ppij-vertical-inverse-white.svg` |
| Horizontal | `ppij-horizontal-primary.svg` | `ppij-horizontal-inverse-black.svg` | `ppij-horizontal-inverse-white.svg` |
| Horizontal lengkap | `ppij-horizontal-full-primary.svg` | `ppij-horizontal-full-inverse-black.svg` | `ppij-horizontal-full-inverse-white.svg` |
| Lambang saja | `ppij-emblem-red.svg` | | `ppij-emblem-white.svg` |

| Variasi | Lambang | Tipografi | Latar |
| --- | --- | --- | --- |
| Primer | merah `#ED2326` | hitam `#000000` | putih |
| Inversi Hitam | merah `#ED2326` | putih `#FFFFFF` | hitam, dan warna sangat gelap (luminans ≤ 0,031) |
| Inversi Putih | putih | putih | merah `#ED2326`, dan warna gelap lain (luminans ≤ 0,193) |

Bagian putih di dalam lambang adalah lubang, bukan isian putih, jadi warnanya mengikuti latar. Jangan menambalnya.

## Menjaga halaman, berkas, dan PDF tetap sejalan

- `brand-ppi-jepang.html` adalah sumbernya. Daftar nama berkas dan data jalur (path) pada halaman harus sama dengan berkas `.svg` di folder ini. `npm test` memeriksanya (`scripts/check-brand-logo.test.mjs`).
- Setelah mengubah `brand-ppi-jepang.html`, buat ulang PDF dengan `scripts/build-brand-pdf.sh`, lalu commit hasilnya. Skrip memakai Chrome atau Chromium yang terpasang.
- Jangan menyunting berkas `.svg` dengan tangan. Ubah lewat sumbernya, lalu perbarui halaman dan berkas bersamaan.

## Asal berkas

- Lambang dan tipografi vertikal dilacak dari `brand/ppij-logo.png`, logo resmi yang beredar. Kecocokan bentuknya di atas 99%.
- Tipografi horizontal adalah Futura Cyrillic (Demi untuk "PPI JEPANG", Medium untuk nama lengkap) yang sudah diubah menjadi kurva. PPI Jepang memiliki lisensi fontnya. Berkas font tidak ada di repositori ini dan tidak boleh ditambahkan.
- Judul di halaman web memakai Jost (font gratis), bukan Futura. Futura hanya ada di dalam logo.
- Isi berkas SVG hanya jalur. Tidak ada skrip, gambar tertanam, atau tautan luar.

## Tautan tetap

Setelah digabung ke `main` dan Pages selesai menerbitkan:

- Halaman: `https://ppij-dev.github.io/ppij-design-system/brand/logo/brand-ppi-jepang.html`
- PDF: `https://ppij-dev.github.io/ppij-design-system/brand/logo/brand-ppi-jepang.pdf`
- Berkas: `https://ppij-dev.github.io/ppij-design-system/brand/logo/<nama-berkas>.svg`

Untuk dokumen yang harus tetap benar walau berkas berubah, kunci ke tag rilis atau commit di `raw.githubusercontent.com`, bukan `main`.
