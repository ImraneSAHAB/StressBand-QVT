import type { NextRequest } from "next/server";
import { generateReportPdf, type ReportId } from "../../../../lib/reportPdf";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: paramId } = await params;
  const rawId = decodeURIComponent(paramId).trim();

  // Pour la maquette, on mappe simplement sur l'un des deux profils connus.
  const id: ReportId = rawId === "936421" ? "936421" : "124578";

  const pdfBytes = await generateReportPdf(id, request.nextUrl.origin);

  return new Response(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="compte-rendu-${id}.pdf"`,
    },
  });
}
