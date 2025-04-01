import { useState } from "react";
import { issueCertificate, verifyCertificate, revokeCertificate } from "../blockchain";
import "../CertificateForm.css";

const Certification = () => {
  const [recipient, setRecipient] = useState("");
  const [course, setCourse] = useState("");
  const [institution, setInstitution] = useState("");
  const [certHash, setCertHash] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState({ issue: false, verify: false, revoke: false });

  // Store issued certificates
  const [certificates, setCertificates] = useState([]);
  const [revokedCertificates, setRevokedCertificates] = useState(new Set());

  const handleIssue = async () => {
    if (!recipient || !course || !institution) {
      alert("Please fill all fields!");
      return;
    }

    setLoading({ ...loading, issue: true });
    try {
      const issuedHash = await issueCertificate(recipient, course, institution);
      alert("✅ Certificate Issued Successfully!");

      // Save issued certificate
      setCertificates([...certificates, { recipient, course, institution, hash: issuedHash }]);
      setRecipient("");
      setCourse("");
      setInstitution("");
    } catch (error) {
      console.error("Error issuing certificate:", error);
      alert("❌ Error issuing certificate!");
    }
    setLoading({ ...loading, issue: false });
  };

  const handleVerify = async () => {
    if (!certHash) {
      alert("Please enter a certificate hash!");
      return;
    }

    setLoading({ ...loading, verify: true });
    try {
      if (revokedCertificates.has(certHash)) {
        setVerificationResult("⚠️ Certificate has been revoked!");
      } else {
        const isValid = await verifyCertificate(certHash);
        setVerificationResult(isValid ? "✅ Certificate is valid" : "❌ Certificate is invalid");
      }
    } catch (error) {
      console.error("Error verifying certificate:", error);
      setVerificationResult("❌ Error verifying certificate");
    }
    setLoading({ ...loading, verify: false });
  };

  const handleRevoke = async () => {
    if (!certHash) {
      alert("Please enter a certificate hash!");
      return;
    }

    setLoading({ ...loading, revoke: true });
    try {
      await revokeCertificate(certHash);
      alert("⚠️ Certificate Revoked Successfully!");

      // Save revoked certificate
      setRevokedCertificates(new Set([...revokedCertificates, certHash]));
      setCertHash("");
    } catch (error) {
      console.error("Error revoking certificate:", error);
      alert("❌ Error revoking certificate!");
    }
    setLoading({ ...loading, revoke: false });
  };

  return (
    <div className="certification">
      <h2>🎓 Blockchain Certificate Registry</h2>

      <div className="form-section">
        <h3>📜 Issue Certificate</h3>
        <input type="text" placeholder="Recipient Name" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
        <input type="text" placeholder="Course" value={course} onChange={(e) => setCourse(e.target.value)} />
        <input type="text" placeholder="Institution" value={institution} onChange={(e) => setInstitution(e.target.value)} />
        <button onClick={handleIssue} disabled={loading.issue}>
          {loading.issue ? "Processing..." : "Issue Certificate"}
        </button>
      </div>

      <div className="form-section">
        <h3>🔍 Verify Certificate</h3>
        <input type="text" placeholder="Enter Certificate Hash" value={certHash} onChange={(e) => setCertHash(e.target.value)} />
        <button onClick={handleVerify} disabled={loading.verify}>
          {loading.verify ? "Checking..." : "Verify"}
        </button>
        {verificationResult && <p className="verification-result">{verificationResult}</p>}
      </div>

      <div className="form-section">
        <h3>⚠️ Revoke Certificate</h3>
        <input type="text" placeholder="Enter Certificate Hash" value={certHash} onChange={(e) => setCertHash(e.target.value)} />
        <button onClick={handleRevoke} disabled={loading.revoke}>
          {loading.revoke ? "Processing..." : "Revoke Certificate"}
        </button>
      </div>

      <div className="form-section">
        <h3>📜 Issued Certificates</h3>
        <ul>
          {certificates.map((cert, index) => (
            <li key={index}>
              <strong>{cert.recipient}</strong> - {cert.course} ({cert.institution})  
              <br />
              Hash: {cert.hash}  
              {revokedCertificates.has(cert.hash) && <span className="revoked"> ⚠️ Revoked</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Certification;
