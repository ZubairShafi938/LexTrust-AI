// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title AuditRegistry
 * @notice Anchors the SHA-256 fingerprints of a document and the AI decision
 *         made about it. The document and decision themselves never touch
 *         this contract — only their hashes, keyed by an audit ID chosen
 *         off-chain (e.g. "LT-2026-00124"). Anyone can later recompute a
 *         document's hash and compare it against getRecord() to prove
 *         whether it has been altered since the decision was made.
 */
contract AuditRegistry {
    struct AuditRecord {
        bytes32 docHash;
        bytes32 decisionHash;
        uint256 timestamp;
        address submitter;
    }

    // auditId => record. Anchoring the same auditId again overwrites the
    // pointer here but the prior AuditAnchored event remains in history,
    // so the full revision trail is always recoverable from logs.
    mapping(string => AuditRecord) private records;

    event AuditAnchored(
        string indexed auditId,
        bytes32 docHash,
        bytes32 decisionHash,
        uint256 timestamp,
        address submitter
    );

    /// @notice Anchor a document/decision hash pair under an audit ID.
    function anchorDecision(
        string calldata auditId,
        bytes32 docHash,
        bytes32 decisionHash
    ) external {
        require(bytes(auditId).length > 0, "auditId required");
        require(docHash != bytes32(0), "docHash required");
        require(decisionHash != bytes32(0), "decisionHash required");

        records[auditId] = AuditRecord({
            docHash: docHash,
            decisionHash: decisionHash,
            timestamp: block.timestamp,
            submitter: msg.sender
        });

        emit AuditAnchored(auditId, docHash, decisionHash, block.timestamp, msg.sender);
    }

    /// @notice Read back the anchored record for an audit ID.
    function getRecord(string calldata auditId)
        external
        view
        returns (
            bytes32 docHash,
            bytes32 decisionHash,
            uint256 timestamp,
            address submitter
        )
    {
        AuditRecord memory r = records[auditId];
        return (r.docHash, r.decisionHash, r.timestamp, r.submitter);
    }
}
