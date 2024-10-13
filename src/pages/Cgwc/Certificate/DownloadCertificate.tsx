import useUserStore from "@/store/userStore";
import CertificatePdf from "./index";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { DownloadCloud, Loader } from "lucide-react";
import { toSentenceCase } from "@/utils/textFormatters";

function optimizeName(name: string) {
  const nameArray = name?.split(" ");
  if (nameArray?.length > 2) {
    return `${toSentenceCase(nameArray[0])} ${nameArray[1]?.charAt(0)?.toUpperCase()}. ${toSentenceCase(nameArray[2])}`;
  } else {
    return `${toSentenceCase(nameArray[0])} ${toSentenceCase(nameArray[1])}`;
  }
}

const DownloadCertificate = () => {
  const user = useUserStore((state) => state.user);
  const certificateRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false); // Loading state

  const name = optimizeName(`${user?.firstName} ${user?.lastName}`);
  const length = name?.split("")?.length;

  const handleDownloadPdf = async () => {
    setLoading(true); // Start loading
    const element = certificateRef.current;
    if (element) {
      try {
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
      } catch (error) {
        console.error("Error generating PDF:", error);
      } finally {
        setLoading(false); // End loading
      }
    }
  };
  return (
    <div className="relative overflow-hidden w-fit h-fit">
      <button
        onClick={handleDownloadPdf}
        className="p-2 px-4 rounded-md bg-brandColor-600 text-white mx-auto flex items-center gap-1 text-sm relative z-[1]"
      >
        {loading ? (
          <>
            <Loader className="animate-spin" /> <span>Downloading...</span>
          </>
        ) : (
          <>
            <DownloadCloud /> <span>Download Certificate</span>
          </>
        )}
      </button>

      <div className="overflow-x-scroll w-full absolute -z-20">
        <div className="w-fit h-fit" ref={certificateRef}>
          <CertificatePdf userName={String(name)} length={length ?? 0} />
        </div>
      </div>
      <div className="absolute w-full h-full -z-10 bg-black"></div>
    </div>
  );
};

export default DownloadCertificate;
