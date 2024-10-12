import useUserStore from "@/store/userStore";
import { CertificatePdf } from "./index";
import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { DownloadCloud } from "lucide-react";

const DownloadCertificate = () => {
  const user = useUserStore((state) => state.user);
  const certificateRef = useRef<HTMLDivElement | null>(null);

  const handleDownloadPdf = async () => {
    const element = certificateRef.current;
    if (element) {
      // Use html2canvas to capture the div as an image
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL("image/png");

      // Create a new jsPDF instance with portrait orientation
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "pt", // or 'mm' based on your preference
        format: "a4", // or specify another format
        putOnlyUsedFonts: true,
        floatPrecision: 16, // Use float precision for better quality
      });

      // Calculate the dimensions for the image
      const imgWidth = pdf.internal.pageSize.width;
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

      // Add the image to the PDF
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      // Save the PDF
      pdf.save(`CGLS Certificate - ${user?.firstName} ${user?.lastName}.pdf`);
    }
  };
  return (
    <div className="">
      <button
        onClick={handleDownloadPdf}
        className="p-2 px-4 rounded-md bg-brandColor-600 text-white mx-auto flex items-center gap-1 text-sm"
      >
        <DownloadCloud /> <span>Download Certificate</span>
      </button>

      <div className="overflow-x-scroll w-full absolute -z-10">
        <div className="w-fit h-fit" ref={certificateRef}>
          <CertificatePdf userName={`${user?.firstName} ${user?.lastName}`} />
        </div>
      </div>
    </div>
  );
};

export default DownloadCertificate;
