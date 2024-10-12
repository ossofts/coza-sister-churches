import CertImage from "./certificate-image";

// Certificate component that generates the PDF document

export const CertificatePdf = ({ userName }: { userName: string }) => (
  <div className="w-fit h-fit relative">
    <CertImage />
    <p className="text-[70px] absolute bottom-[290px] left-[50%] text-[#aa6400] font-Pinyon-Script translate-x-[-50%] translate-y-[-50%]">
      {userName}
    </p>
  </div>
);

// Type for the CertificateDownload component props
