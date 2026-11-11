# FE POS App

Frontend untuk sistem kasir (Point of Sale) Warung Umi Neneng.

## Requirements

- Node.js `24` (lihat `.nvmrc`)
- pnpm `10`
- Backend POS berjalan dan dapat diakses dari frontend

Gunakan Node.js yang sesuai sebelum menjalankan project:

```bash
nvm use
```

Jika Node 24 belum tersedia:

```bash
nvm install 24
nvm use 24
```

## Setup

Install dependency:

```bash
pnpm install
```

Buat file environment:

```bash
cp .env.example .env.local
```

Isi `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Jalankan development server:

```bash
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
pnpm dev      # Menjalankan development server
pnpm lint     # Menjalankan ESLint
pnpm build    # Membuat production build
pnpm start    # Menjalankan production build
```

## Routes

| Route | Keterangan | Akses |
|---|---|---|
| `/login` | Login pengguna | Publik |
| `/pos` | Kasir dan transaksi penjualan | KASIR, OWNER |
| `/products` | Pengelolaan produk | OWNER |
| `/inventory` | Pencatatan stok masuk | OWNER |

`/` mengarahkan pengguna ke `/pos` jika sudah login atau ke `/login` jika belum login.

## Role

- `KASIR`: menggunakan halaman POS untuk membuat transaksi.
- `OWNER`: menggunakan POS serta mengelola produk dan stok.

Validasi permission tetap harus dilakukan oleh backend. Penyembunyian menu di frontend bukan pengganti pemeriksaan authorization di API.

## Struktur Project

```text
app/                  # Route Next.js
components/
  layout/             # Layout dashboard dan sidebar
  ui/                 # Komponen UI reusable
hooks/                # Custom React hooks
lib/                  # API client, menu, dan utility
modules/
  Auth/               # Login dan autentikasi
  Categories/         # Kategori produk
  Inventory/          # Stok masuk
  POS/                # Katalog, cart, pembayaran, receipt
  Products/            # CRUD produk
store/                # Zustand stores untuk auth dan cart
types/                # Tipe domain yang dipakai lintas module
```

Struktur module menggunakan pola feature-based. Logic yang hanya dipakai satu fitur disimpan di module tersebut. Komponen yang dipakai lintas fitur disimpan di `components/ui`.

## Alur Utama

### Login

1. Pengguna login melalui `/login`.
2. Frontend meminta token ke backend.
3. Frontend mengambil data pengguna.
4. Token disimpan di cookie untuk request API.
5. Pengguna diarahkan ke `/pos`.

### Transaksi POS

1. Kasir mencari produk atau memilih kategori.
2. Produk ditambahkan ke cart.
3. Kasir membuka pembayaran.
4. Frontend mengirim item dan nominal pembayaran ke backend.
5. Setelah berhasil, cart dikosongkan dan receipt ditampilkan.

Harga dan stok final harus divalidasi ulang oleh backend saat checkout.

### Produk dan Stok

Owner dapat:

- menambah produk
- mengubah produk
- menonaktifkan produk
- mencatat stok masuk dari supplier

## API

API client utama berada di [lib/api.ts](./lib/api.ts). Base URL diambil dari:

```env
NEXT_PUBLIC_API_BASE_URL
```

Module API berada di:

```text
modules/Auth/utils/api.ts
modules/Categories/utils/api.ts
modules/Inventory/utils/api.ts
modules/POS/utils/api.ts
modules/Products/utils/api.ts
```

Frontend mengharapkan backend menyediakan endpoint untuk:

```text
POST /auth/login
GET  /auth/me
GET  /products/
POST /products/
PATCH /products/{id}
DELETE /products/{id}
GET  /category/resource
GET  /category/
GET  /inventory/stock-in/
POST /inventory/stock-in/
POST /transactions/
```

Detail request dan response mengikuti tipe TypeScript di masing-masing module.

## Development Notes

- Gunakan `pnpm`, bukan mencampur `npm`, `yarn`, dan `pnpm` dalam project yang sama.
- Jangan commit `.env.local` atau token.
- Jalankan `pnpm lint` sebelum membuat pull request.
- Jalankan `pnpm build` dengan Node.js 24 untuk memastikan production build valid.
- Backend tetap menjadi sumber kebenaran untuk authentication, permission, harga, stok, dan total transaksi.
