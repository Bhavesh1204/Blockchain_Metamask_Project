// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract CertificateRegistry {
    struct Certificate {
        string recipient;
        string course;
        string institution;
        uint256 issueDate;
        bool isValid;
    }
    
    mapping(bytes32 => Certificate) public certificates;
    address public admin;
    
    event CertificateIssued(bytes32 indexed certHash, string recipient, string course, string institution, uint256 issueDate);
    event CertificateRevoked(bytes32 indexed certHash);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    constructor() {
        admin = msg.sender;
    }
    
    // 📌 Issue a new certificate and return certHash
    function issueCertificate(
        string memory _recipient, 
        string memory _course, 
        string memory _institution
    ) public onlyAdmin returns (bytes32) {
        bytes32 certHash = keccak256(abi.encodePacked(_recipient, _course, _institution, block.timestamp));

        certificates[certHash] = Certificate(_recipient, _course, _institution, block.timestamp, true);
        
        emit CertificateIssued(certHash, _recipient, _course, _institution, block.timestamp);
        
        return certHash; // ✅ Return the generated hash
    }

    // 📌 Revoke an existing certificate
    function revokeCertificate(bytes32 _certHash) public onlyAdmin {
        require(certificates[_certHash].isValid, "Certificate does not exist or is already revoked");
        
        certificates[_certHash].isValid = false;
        
        emit CertificateRevoked(_certHash);
    }

    // 📌 Verify if a certificate is valid
    function verifyCertificate(bytes32 _certHash) public view returns (bool) {
        return certificates[_certHash].isValid;
    }

    // 📌 Get certificate details
    function getCertificate(bytes32 _certHash) public view returns (
        string memory recipient, 
        string memory course, 
        string memory institution, 
        uint256 issueDate, 
        bool isValid
    ) {
        Certificate memory cert = certificates[_certHash];
        require(cert.issueDate != 0, "Certificate does not exist"); // Ensure the certificate exists

        return (cert.recipient, cert.course, cert.institution, cert.issueDate, cert.isValid);
    }
}
