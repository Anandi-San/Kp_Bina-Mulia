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
5. Jalankan perintah `npm run start-dev` untuk menjalankan proyek.

## Penggunaan

Cara menggunakan atau mengakses proyek ini:

1. Jalankan proyek menggunakan perintah `npm start`.
2. Buka aplikasi di browser pada alamat `http://localhost:port`.
3. Ikuti instruksi atau navigasi yang tersedia pada antarmuka aplikasi.

## Endpoint

# Role Endpoints

| Endpoint          | Deskripsi                                         |
|-------------------|---------------------------------------------------|
| `GET /role`       | Mengambil daftar peran (roles) dari sistem        |
| `GET /role/:id`   | Mengambil detail peran (role) berdasarkan ID      |
| `PATCH /role/:id` | Memperbarui informasi peran (role) berdasarkan ID |
| `POST /role`      | Membuat peran (role) baru dalam sistem            |
| `DELETE /role/:id`| Menghapus peran (role) berdasarkan ID             |

# User login and others Endpoints

| Endpoint                  | Deskripsi                                                 |
|---------------------------|-----------------------------------------------------------|
| `POST /user/signup`       | Mendaftarkan pengguna baru                                |
| `POST /user/login`        | Memungkinkan pengguna untuk masuk (login)                 |
| `GET /user/refresh-token` | Memperbarui token akses menggunakan refresh token         |
| `GET /user/current-user`  | Mengambil informasi pengguna yang sedang masuk            |
| `GET /user/logout`        | Melakukan proses logout untuk pengguna yang sedang masuk  |

# Features Edit and GetUser

| Endpoint               | Deskripsi                                                        |
|------------------------|----------------------------------------------------------------- |
| `GET /user`            | Mengambil daftar user dari sistem                                |
| `GET /user/:id`        | Mengambil detail user berdasarkan ID                             |
| `PATCH /user/:id`      | Memperbarui informasi user berdasarkan ID dengan role user       |
| `PATCH /user/admin/:id`| Memperbarui informasi user berdasarkan ID dengan role superadmin |

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

# Galeri Endpoint

| Endpoint              | Deskripsi                                        |
|-----------------------|------------------------------------------------- |
| `GET /galeri`          | Mengambil daftar galeri dari sistem             |
| `GET /galeri/:id`     | Mengambil detail galeri berdasarkan ID           |
| `POST /galeri`        | Membuat galeri baru dalam sistem                 |
| `PATCH /galeri/:id`   | Memperbarui informasi galeri berdasarkan ID      |
| `DELETE /galeri/:id`  | Menghapus galeri berdasarkan ID                  |


# Message EndPoint

| Endpoint              | Deskripsi                                        |
|-----------------------|--------------------------------------------------|
| `GET /forum`          | Mengambil daftar message dari sistem             |
| `POST /forum`         | Membuat message baru dalam sistem                |
| `DELETE /forum/:id`   | Menghapus message berdasarkan ID                 |


