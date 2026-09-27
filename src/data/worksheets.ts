/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Worksheet PDF asset (bundled by Vite; import resolves to a served URL)
import sensoryPlayPdf from '../assets/worksheets/sensory-play-5-ideas.pdf';

export interface WorksheetActivity {
  title: string;
  description: string;
}

export interface WorksheetItem {
  id: string;
  title: string;
  tagline: string;
  ageGroup: string;
  pdfUrl: string;
  pdfFileName: string;
  activities: WorksheetActivity[];
}

export const WORKSHEETS_CATALOG: WorksheetItem[] = [
  {
    id: 'sensory-play-5-ideas',
    title: '5 Ide Sensory Play',
    tagline: 'Tanpa Screen, Tanpa Prep',
    ageGroup: 'Usia 3-6 tahun',
    pdfUrl: sensoryPlayPdf,
    pdfFileName: 'Mora - 5 Ide Sensory Play.pdf',
    activities: [
      {
        title: '1. Kotak Rasa & Tekstur',
        description:
          'Isi wadah kecil dengan beras, pasta, atau kacang kering. Gali & sortir dengan sendok.',
      },
      {
        title: '2. Lukis Air di Lantai',
        description: 'Kuas + mangkuk air, "lukis" pola di lantai teras. Aman & mudah dibersihkan.',
      },
      {
        title: '3. Menara Bantal',
        description: 'Susun bantal & guling jadi menara, lalu runtuhkan bersama.',
      },
      {
        title: '4. Jelajah Suara Rumah',
        description: 'Cari 5 benda di rumah yang bisa menghasilkan suara berbeda.',
      },
      {
        title: '5. Kotak Rahasia',
        description: 'Masukkan benda rumah ke kotak tertutup, tebak isinya lewat rabaan.',
      },
    ],
  },
];
