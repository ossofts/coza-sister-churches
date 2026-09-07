// import { toSentenceCase } from "@/utils/textFormatters";
// import CertImage from "./certificate-image";
import { twMerge } from "tailwind-merge";

// Certificate component that generates the PDF document

const CertificatePdf = ({
  userName,
  length,
}: {
  userName: string;
  length: number;
}) => {
  return (
    <div className="w-fit h-fit relative">
      {/* <CertImage /> */}
      <img
        style={{ minWidth: "1122px", minHeight: "793px" }}
        src="/cgls_certificate_2026.png"
        alt=""
        className="w-[1122px] h-[793px]"
      />
      <p
        className={twMerge(
          "absolute left-[50%] text-[#aa6400] font-Pinyon-Script translate-x-[-50%] translate-y-[-50%] whitespace-nowrap",
          length && length > 35
            ? "text-[50px] bottom-[360px]"
            : "text-[70px] bottom-[330px]",
        )}
      >
        {userName}
      </p>
    </div>
  );
};

export default CertificatePdf;
