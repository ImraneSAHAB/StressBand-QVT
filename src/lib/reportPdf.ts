import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export type ReportId = "124578" | "936421";

type Profile = {
  bandId: ReportId;
  firstName: string;
  lastName: string;
  birthDate: string;
  dossier: string;
  examDate: string;
  metrics: {
    heartRateAvg: string;
    respirationAvg: string;
    sleepRhythm: string;
  };
};

const PROFILES: Record<ReportId, Profile> = {
  "124578": {
    bandId: "124578",
    firstName: "Audrey",
    lastName: "Martin",
    birthDate: "04/07/1985",
    dossier: "2025-001-AM",
    examDate: "10/12/2025",
    metrics: {
      heartRateAvg: "102 bpm (moyenne journée)",
      respirationAvg: "22 / min (moyenne journée)",
      sleepRhythm: "Sommeil court, 5 h 40 – score 58/100",
    },
  },
  "936421": {
    bandId: "936421",
    firstName: "Fabrice",
    lastName: "Durand",
    birthDate: "19/03/1979",
    dossier: "2025-002-FD",
    examDate: "10/12/2025",
    metrics: {
      heartRateAvg: "72 bpm (moyenne journée)",
      respirationAvg: "15 / min (moyenne journée)",
      sleepRhythm: "Sommeil réparateur, 7 h 40 – score 86/100",
    },
  },
};

export async function generateReportPdf(
  id: ReportId,
  baseUrl: string,
): Promise<Uint8Array> {
  const profile = PROFILES[id];

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 portrait
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let y = height - 60;

  const drawText = (
    text: string,
    x: number,
    yPos: number,
    options?: { size?: number; bold?: boolean },
  ) => {
    page.drawText(text, {
      x,
      y: yPos,
      size: options?.size ?? 9,
      font: options?.bold ? fontBold : font,
      color: rgb(0, 0, 0),
    });
  };

  // Logo du labo : on le charge via HTTP pour être certain
  // d'utiliser exactement le même fichier que celui servi au navigateur.
  try {
    const logoUrl = new URL("/logo-SB.png", baseUrl).toString();
    const res = await fetch(logoUrl);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} pour le logo (${logoUrl})`);
    }

    const logoBuffer = await res.arrayBuffer();

    // On tente d'abord de l'interpréter comme PNG, puis comme JPEG si besoin.
    let logoImage;
    try {
      logoImage = await pdfDoc.embedPng(logoBuffer);
    } catch {
      logoImage = await pdfDoc.embedJpg(logoBuffer);
    }
    // On réduit le logo pour qu'il ne prenne qu'un petit bloc
    // en haut à droite (max ~120px de large).
    const maxLogoWidth = 120;
    const scale = maxLogoWidth / logoImage.width;
    const logoDims = logoImage.scale(scale);
    const logoX = width - logoDims.width - 40;
    const logoY = height - logoDims.height - 40;

    page.drawImage(logoImage, {
      x: logoX,
      y: logoY,
      width: logoDims.width,
      height: logoDims.height,
    });
  } catch (error) {
    // Fallback : si le logo ne peut pas être chargé,
    // on affiche au moins un "logo texte" et on logue l'erreur.
    console.error("Erreur lors du chargement du logo pour le PDF :", error);
    drawText("STRESSBAND QVT", width - 170, height - 50, {
      size: 10,
      bold: true,
    });
  }

  // En-tête laboratoire
  drawText("LABORATOIRE DE BIOLOGIE MEDICALE", 40, y, { size: 12, bold: true });
  y -= 14;
  drawText("SELARL XL-BIO (maquette pédagogiques, données fictives)", 40, y, {
    size: 8,
  });
  y -= 24;

  // Infos patient / dossier
  drawText("Patiente / Patient :", 40, y, { bold: true });
  drawText(`${profile.firstName} ${profile.lastName}`, 130, y);
  y -= 12;
  drawText("Date de naissance :", 40, y, { bold: true });
  drawText(profile.birthDate, 130, y);
  y -= 12;
  drawText("N° dossier :", 40, y, { bold: true });
  drawText(profile.dossier, 130, y);
  y -= 12;
  drawText("ID brassard :", 40, y, { bold: true });
  drawText(profile.bandId, 130, y);
  y -= 16;
  drawText("Prélèvement du :", 40, y, { bold: true });
  drawText(profile.examDate, 130, y);

  y -= 32;

  // Titre indicateurs physiologiques
  drawText("INDICATEURS PHYSIOLOGIQUES LIES AU BIEN-ETRE", 40, y, {
    size: 11,
    bold: true,
  });
  y -= 16;

  // Sous-titre
  drawText("Synthèse des données issues du brassard connecté", 40, y, {
    size: 10,
    bold: true,
  });
  y -= 14;

  // Tableau des 3 indicateurs clés
  const left = 50;
  const mid = 250;

  const rows: [string, string][] = [
    ["Fréquence cardiaque moyenne", profile.metrics.heartRateAvg],
    ["Fréquence respiratoire moyenne", profile.metrics.respirationAvg],
    ["Rythme / qualité du sommeil", profile.metrics.sleepRhythm],
  ];

  drawText("INDICATEURS PRINCIPAUX", left, y, { bold: true });
  y -= 12;

  rows.forEach(([label, value]) => {
    drawText(label, left, y);
    drawText(value, mid, y, { bold: true });
    y -= 12;
  });

  y -= 20;

  drawText(
    "Ce compte-rendu est une simulation pédagogique basée sur des données fictives.",
    40,
    y,
    { size: 8 },
  );
  y -= 10;
  drawText(
    "Il ne doit en aucun cas être utilisé pour un avis médical réel.",
    40,
    y,
    { size: 8 },
  );

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
