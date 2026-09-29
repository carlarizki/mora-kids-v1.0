/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Worksheet PDF asset (bundled by Vite; import resolves to a served URL)
import warnaBentukAngkaPdf from '../assets/worksheets/warna-bentuk-angka-pertamaku.pdf';

export interface WorksheetActivity {
  title: string;
  description: string;
  category: string;
}

export interface WorksheetItem {
  id: string;
  title: string;
  tagline: string;
  ageGroup: string;
  pageCount: number;
  topics: string[];
  pdfUrl: string;
  pdfFileName: string;
  activities: WorksheetActivity[];
}

export const WORKSHEETS_CATALOG: WorksheetItem[] = [
  {
    id: 'warna-bentuk-angka-pertamaku',
    title: 'Warna, Bentuk & Angka Pertamaku',
    tagline: 'Main sambil belajar, bareng Ayah & Bunda',
    ageGroup: 'Usia 3-4 tahun',
    pageCount: 10,
    topics: ['Motorik halus', 'Warna & bentuk', 'Berhitung 1-5', 'Logika sederhana'],
    pdfUrl: warnaBentukAngkaPdf,
    pdfFileName: 'Mora - Warna, Bentuk & Angka Pertamaku.pdf',
    activities: [
      {
        title: 'Ikuti Garisnya',
        description: 'Bantu teman-teman hewan menemukan makanannya, telusuri garisnya pakai krayon.',
        category: 'Motorik Halus',
      },
      {
        title: 'Jejak Bentuk',
        description: 'Tebalkan bentuknya, mulai dari titik hijau — lingkaran, segitiga, kotak.',
        category: 'Mengenal Bentuk',
      },
      {
        title: 'Warnai Sesuai Warnanya',
        description: 'Lihat titik warnanya, lalu warnai dengan krayon yang sama.',
        category: 'Mengenal Warna',
      },
      {
        title: 'Ayo Berhitung',
        description: 'Hitung gambarnya, lalu lingkari angka yang benar.',
        category: 'Berhitung 1-5',
      },
      {
        title: 'Mana yang Lebih Besar?',
        description: 'Lingkari yang lebih besar di setiap kotak.',
        category: 'Membandingkan',
      },
      {
        title: 'Cari Pasangannya',
        description: 'Tarik garis dari titik ke gambar yang sama.',
        category: 'Mencocokkan',
      },
      {
        title: 'Bantu Matahari Pulang',
        description: 'Temukan jalan dari matahari ke rumah, awas ada batu!',
        category: 'Pemecahan Masalah',
      },
      {
        title: 'Sertifikat & Momen',
        description: 'Rayakan pencapaian si kecil dengan sertifikat dan tempel momen favorit hari ini.',
        category: 'Merayakan',
      },
    ],
  },
];
