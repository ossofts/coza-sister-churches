import React, { ReactNode } from "react";
import {
  Page,
  Text,
  View,
  Document,
  PDFDownloadLink,
  Font,
  StyleSheet,
} from "@react-pdf/renderer";
import CertImage from "./certificate-image";

// Register the "Pinyon Script" font
Font.register({
  family: "Pinyon Script",
  src: "https://fonts.gstatic.com/s/pinyonscript/v10/6xKvdShfL9yK-rvpCmvbKHwJNFM.woff2",
});

// Define styles for the PDF
const styles = StyleSheet.create({
  page: { backgroundColor: "#fff", width: "100%", height: "auto" },
  container: {
    position: "relative",
    display: "flex",
    width: "fit-content",
    height: "fit-content",
  },
  userName: {
    position: "absolute",
    bottom: "260px", // Adjust based on your certificate layout
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: 70, // Font size for "Pinyon Script"
    fontFamily: "Pinyon Script",
    color: "#aa6400",
  },
});

// Type for the Certificate component props
interface CertificateProps {
  userName: string;
}

// Certificate component that generates the PDF document
export const CertificateCard: React.FC<CertificateProps> = ({ userName }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.container}>
        {/* The certificate SVG image */}
        <CertImage />
        {/* User's name text overlay */}
        {/* <Text style={styles.userName}>{userName}</Text> */}
      </View>
    </Page>
  </Document>
);

export const CertificatePdf = ({ userName }: { userName: string }) => (
  <div className="w-fit h-fit relative">
    <CertImage />
    <p className="text-[70px] absolute bottom-[290px] left-[50%] text-[#aa6400] font-Pinyon-Script translate-x-[-50%] translate-y-[-50%]">
      {userName}
    </p>
  </div>
);

// Type for the CertificateDownload component props
interface CertificateDownloadProps {
  userName: string;
}

type DownloadLinkProps = {
  blob: Blob | null;
  url: string | null;
  loading: boolean;
  error: Error | null;
};

// Main component to render the download link
export const CertificateDownload = ({ userName }: CertificateDownloadProps) => (
  <PDFDownloadLink
    document={
      <div>
        <p>{userName}</p>
      </div>
    }
    fileName="certificate.pdf"
  >
    Download
  </PDFDownloadLink>
  //   <PDFDownloadLink
  //     document={<CertificateCard userName={userName} />}
  //     fileName="certificate.pdf"
  //   >
  //     {({ blob, url, loading, error }: DownloadLinkProps) => {
  //       if (loading) return (<span>Generating certificate...</span>) as ReactNode;
  //       return (
  //         <a href={String(url)} download="certificate.pdf">
  //           Download Certificate
  //         </a>
  //       ) as ReactNode;
  //     }}
  //   </PDFDownloadLink>
);

export default CertificateCard;
