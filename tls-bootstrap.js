import { readFileSync } from "node:fs";
import { X509Certificate } from "node:crypto";
import { getCACertificates, rootCertificates, setDefaultCACertificates } from "node:tls";

// Supply the missing cross-certificate, authenticated by an existing Node root.
// Never trust a certificate merely because the upstream server supplied it.
const pem = readFileSync(new URL("./certs/root-ye-by-x2.pem", import.meta.url), "utf8");
const certificate = new X509Certificate(pem);
const issuer = rootCertificates.map(value => new X509Certificate(value)).find(value =>
  certificate.checkIssued(value) && certificate.verify(value.publicKey));
const now = Date.now();
if (!issuer || !certificate.ca || now < Date.parse(certificate.validFrom) || now > Date.parse(certificate.validTo)) {
  throw new Error("The bundled TLS cross-certificate is invalid or expired");
}
setDefaultCACertificates([...getCACertificates("default"), pem]);
