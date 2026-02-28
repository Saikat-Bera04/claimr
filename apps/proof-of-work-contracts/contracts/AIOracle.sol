// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "./BountyEscrow.sol";

/**
 * @title AIOracle
 * @notice Trustless bridge between off-chain AI judging (Claude API) and on-chain result submission.
 *
 * For the hackathon: single oracle wallet = your FastAPI backend key.
 * For production:    rotate to multi-sig or Chainlink Functions.
 *
 * How it works:
 *  1. Your backend signs: keccak256(abi.encodePacked(bountyId, winner, score))
 *  2. Frontend (or backend) calls submitResult() with the signature
 *  3. This contract verifies the signature came from a trusted oracle key
 *  4. Then calls BountyEscrow.declareWinner()
 */
contract AIOracle is Ownable {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    BountyEscrow public escrow;
    mapping(address => bool) public isOracle;

    event ResultSubmitted(uint256 indexed bountyId, address indexed winner, uint256 score, address submittedBy);
    event OracleAdded(address indexed oracle);
    event OracleRemoved(address indexed oracle);

    constructor(address _escrow) Ownable(msg.sender) {
        escrow = BountyEscrow(payable(_escrow));
        isOracle[msg.sender] = true;
    }

    modifier onlyOracle() {
        require(isOracle[msg.sender], "AIOracle: not authorised oracle");
        _;
    }

    function addOracle(address oracle) external onlyOwner {
        isOracle[oracle] = true;
        emit OracleAdded(oracle);
    }

    function removeOracle(address oracle) external onlyOwner {
        isOracle[oracle] = false;
        emit OracleRemoved(oracle);
    }

    /**
     * @notice Submit AI judging result directly (simple path for hackathon)
     * @dev Caller must be a trusted oracle address
     */
    function submitResult(
        uint256 bountyId,
        address winner,
        uint256 score
    ) external onlyOracle {
        escrow.declareWinner(bountyId, winner, score);
        emit ResultSubmitted(bountyId, winner, score, msg.sender);
    }

    /**
     * @notice Submit result with ECDSA signature (more trustless path)
     * @dev Anyone can submit if they have a valid signature from a trusted oracle
     * @param bountyId  The bounty being judged
     * @param winner    Address of the winning submitter
     * @param score     AI-assigned score 0-100
     * @param signature Oracle's ECDSA signature over (bountyId, winner, score)
     */
    function submitResultSigned(
        uint256 bountyId,
        address winner,
        uint256 score,
        bytes calldata signature
    ) external {
        bytes32 messageHash = keccak256(abi.encodePacked(bountyId, winner, score));
        bytes32 ethHash = messageHash.toEthSignedMessageHash();
        address signer = ethHash.recover(signature);

        require(isOracle[signer], "AIOracle: invalid oracle signature");

        escrow.declareWinner(bountyId, winner, score);
        emit ResultSubmitted(bountyId, winner, score, signer);
    }

    /**
     * @notice Mark a bounty as under review (stops new submissions)
     */
    function startJudging(uint256 bountyId) external onlyOracle {
        escrow.markUnderReview(bountyId);
    }
}
