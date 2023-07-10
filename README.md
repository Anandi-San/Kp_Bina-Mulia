# Kp BIna MUlia

Pembuatan Serverside Website Bina Mulia

## Deskripsi

## Fitur

## Instalasi

Langkah-langkah untuk menginstal dan menjalankan proyek ini:

1. Clone repositori ini ke komputer lokal Anda.
2. Masuk ke direktori proyek.
3. Jalankan perintah `npm install` untuk menginstal dependensi.
4. Konfigurasi file lingkungan (environment) jika diperlukan.
5. Jalankan perintah `npm start` untuk menjalankan proyek.

## Penggunaan

Cara menggunakan atau mengakses proyek ini:

1. Jalankan proyek menggunakan perintah `npm start`.
2. Buka aplikasi di browser pada alamat `http://localhost:port`.
3. Ikuti instruksi atau navigasi yang tersedia pada antarmuka aplikasi.

## Kontribusi

Jika Anda ingin berkontribusi pada proyek ini, Anda dapat mengikuti langkah-langkah berikut:

1. Fork repositori ini.
2. Buat branch baru dengan fitur yang ingin Anda tambahkan (`git checkout -b feature-nama-fitur`).
3. Lakukan perubahan atau penambahan yang diinginkan.
4. Commit perubahan Anda (`git commit -m 'Menambahkan fitur baru'`).
5. Push ke branch di repositori Anda (`git push origin feature-nama-fitur`).
6. Buat Pull Request ke repositori ini.

## Kontak

Tambahkan informasi kontak Anda jika ada pertanyaan atau korespondensi terkait proyek.

## Endpoint

# Role Endpoints

| Endpoint          | Deskripsi                                         |
|-------------------|---------------------------------------------------|
| `GET /role`       | Mengambil daftar peran (roles) dari sistem        |
| `GET /role/:id`   | Mengambil detail peran (role) berdasarkan ID      |
| `PATCH /role/:id` | Memperbarui informasi peran (role) berdasarkan ID |
| `POST /role`      | Membuat peran (role) baru dalam sistem            |
| `DELETE /role/:id`| Menghapus peran (role) berdasarkan ID             |

# User Endpoints

| Endpoint                  | Deskripsi                                                 |
|---------------------------|-----------------------------------------------------------|
| `POST /user/signup`       | Mendaftarkan pengguna baru                                |
| `POST /user/login`        | Memungkinkan pengguna untuk masuk (login)                 |
| `GET /user/refresh-token` | Memperbarui token akses menggunakan refresh token         |
| `GET /user/current-user`  | Mengambil informasi pengguna yang sedang masuk            |
| `GET /user/logout`        | Melakukan proses logout untuk pengguna yang sedang masuk  |

# Banner Endpoints

| Endpoint                 | Deskripsi                                              |
|--------------------------|--------------------------------------------------------|
| `GET /banner`            | Mengambil daftar banner dari sistem                    |
| `POST /banner`           | Membuat banner baru dalam sistem                       |
| `GET /banner/:id`        | Mengambil detail banner berdasarkan ID                 |
| `PATCH /banner/:id`      | Memperbarui informasi banner berdasarkan ID            |
| `DELETE /banner/:id`     | Menghapus banner berdasarkan ID                        |

# Berita & Program Endpoints

| Endpoint                    | Deskripsi                                                  |
|-----------------------------|------------------------------------------------------------|
| `GET /berita&program`       | Mengambil daftar berita dan program dari sistem            |
| `GET /berita&program/:id`   | Mengambil detail berita atau program berdasarkan ID        |
| `POST /berita&program`      | Membuat berita atau program baru dalam sistem              |
| `PATCH /berita&program/:id` | Memperbarui informasi berita atau program berdasarkan ID   |
| `DELETE /berita&program/:id`| Menghapus berita atau program berdasarkan ID               |

# Career Endpoints

| Endpoint              | Deskripsi                                       |
|-----------------------|-------------------------------------------------|
| `GET /career`         | Mengambil daftar karir dari sistem              |
| `GET /career/:id`     | Mengambil detail karir berdasarkan ID           |
| `POST /career`        | Membuat karir baru dalam sistem                 |
| `PATCH /career/:id`   | Memperbarui informasi karir berdasarkan ID      |
| `DELETE /career/:id`  | Menghapus karir berdasarkan ID                  |



