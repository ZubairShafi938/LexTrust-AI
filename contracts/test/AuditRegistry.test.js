const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AuditRegistry", function () {
  it("anchors a record and reads it back unchanged", async function () {
    const AuditRegistry = await ethers.getContractFactory("AuditRegistry");
    const registry = await AuditRegistry.deploy();

    const docHash = ethers.keccak256(ethers.toUtf8Bytes("sample document text"));
    const decisionHash = ethers.keccak256(ethers.toUtf8Bytes("sample decision"));

    await registry.anchorDecision("LT-2026-00124", docHash, decisionHash);
    const [readDocHash, readDecisionHash, timestamp] = await registry.getRecord("LT-2026-00124");

    expect(readDocHash).to.equal(docHash);
    expect(readDecisionHash).to.equal(decisionHash);
    expect(timestamp).to.be.gt(0);
  });

  it("rejects an empty audit ID", async function () {
    const AuditRegistry = await ethers.getContractFactory("AuditRegistry");
    const registry = await AuditRegistry.deploy();
    const hash = ethers.keccak256(ethers.toUtf8Bytes("x"));

    await expect(registry.anchorDecision("", hash, hash)).to.be.revertedWith("auditId required");
  });
});
