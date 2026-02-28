// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ProofOfWorkNFT.sol";

contract BountyEscrow is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    enum BountyStatus   { Open, UnderReview, Closed, Refunded }
    enum BountyCategory { Code, Design, Writing, Other }

    struct Bounty {
        address poster;
        uint256 reward;
        address token;
        string  ipfsHash;
        uint256 deadline;
        BountyStatus status;
        BountyCategory category;
        address winner;
        uint256 submissionCount;
    }

    struct Submission {
        address submitter;
        string  ipfsHash;
        uint256 score;
        uint256 submittedAt;
    }

    uint256 public bountyCount;
    mapping(uint256 => Bounty)                       public bounties;
    mapping(uint256 => Submission[])                 public submissions;
    mapping(uint256 => mapping(address => bool))     public hasSubmitted;
    mapping(address => bool)                         public isOracle;

    ProofOfWorkNFT public nftContract;
    uint256 public constant PLATFORM_FEE_BPS = 250; // 2.5%
    address public feeRecipient;

    event BountyPosted(uint256 indexed bountyId, address indexed poster, uint256 reward, address token, string ipfsHash, uint256 deadline, BountyCategory category);
    event SolutionSubmitted(uint256 indexed bountyId, address indexed submitter, string ipfsHash, uint256 submissionIndex);
    event WinnerDeclared(uint256 indexed bountyId, address indexed winner, uint256 reward, uint256 score);
    event BountyRefunded(uint256 indexed bountyId, address indexed poster, uint256 amount);
    event OracleUpdated(address indexed oracle, bool status);

    modifier onlyOracle() {
        require(isOracle[msg.sender], "Not oracle");
        _;
    }

    modifier bountyExists(uint256 bountyId) {
        require(bountyId < bountyCount, "Bounty does not exist");
        _;
    }

    constructor(address _feeRecipient) Ownable(msg.sender) {
        feeRecipient = _feeRecipient;
        isOracle[msg.sender] = true; // deployer is initial oracle
    }

    // ── Admin ──────────────────────────────────────

    function setNFTContract(address _nft) external onlyOwner {
        nftContract = ProofOfWorkNFT(_nft);
    }

    function setOracle(address oracle, bool status) external onlyOwner {
        isOracle[oracle] = status;
        emit OracleUpdated(oracle, status);
    }

    function setFeeRecipient(address _feeRecipient) external onlyOwner {
        feeRecipient = _feeRecipient;
    }

    // ── Post Bounty ────────────────────────────────

    function postBounty(
        string calldata ipfsHash,
        uint256 deadline,
        BountyCategory category
    ) external payable returns (uint256 bountyId) {
        require(msg.value > 0, "Reward must be > 0");
        require(deadline > block.timestamp, "Deadline must be future");

        bountyId = bountyCount++;
        bounties[bountyId] = Bounty({
            poster:          msg.sender,
            reward:          msg.value,
            token:           address(0),
            ipfsHash:        ipfsHash,
            deadline:        deadline,
            status:          BountyStatus.Open,
            category:        category,
            winner:          address(0),
            submissionCount: 0
        });

        emit BountyPosted(bountyId, msg.sender, msg.value, address(0), ipfsHash, deadline, category);
    }

    function postBountyERC20(
        string calldata ipfsHash,
        uint256 deadline,
        BountyCategory category,
        address token,
        uint256 amount
    ) external returns (uint256 bountyId) {
        require(amount > 0, "Reward must be > 0");
        require(deadline > block.timestamp, "Deadline must be future");
        require(token != address(0), "Invalid token");

        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        bountyId = bountyCount++;
        bounties[bountyId] = Bounty({
            poster:          msg.sender,
            reward:          amount,
            token:           token,
            ipfsHash:        ipfsHash,
            deadline:        deadline,
            status:          BountyStatus.Open,
            category:        category,
            winner:          address(0),
            submissionCount: 0
        });

        emit BountyPosted(bountyId, msg.sender, amount, token, ipfsHash, deadline, category);
    }

    // ── Submit Solution ────────────────────────────

    function submitSolution(
        uint256 bountyId,
        string calldata ipfsHash
    ) external bountyExists(bountyId) {
        Bounty storage bounty = bounties[bountyId];

        require(bounty.status == BountyStatus.Open, "Bounty not open");
        require(block.timestamp < bounty.deadline,  "Deadline passed");
        require(msg.sender != bounty.poster,         "Poster cannot submit");
        require(!hasSubmitted[bountyId][msg.sender], "Already submitted");

        hasSubmitted[bountyId][msg.sender] = true;
        uint256 idx = submissions[bountyId].length;

        submissions[bountyId].push(Submission({
            submitter:   msg.sender,
            ipfsHash:    ipfsHash,
            score:       0,
            submittedAt: block.timestamp
        }));

        bounty.submissionCount++;
        emit SolutionSubmitted(bountyId, msg.sender, ipfsHash, idx);
    }

    // ── Declare Winner (Oracle) ────────────────────

    function declareWinner(
        uint256 bountyId,
        address winner,
        uint256 score
    ) external onlyOracle bountyExists(bountyId) nonReentrant {
        Bounty storage bounty = bounties[bountyId];

        require(
            bounty.status == BountyStatus.Open || bounty.status == BountyStatus.UnderReview,
            "Bounty already closed"
        );
        require(hasSubmitted[bountyId][winner], "Winner did not submit");
        require(score <= 100, "Score out of range");

        bounty.status = BountyStatus.Closed;
        bounty.winner = winner;

        uint256 fee    = (bounty.reward * PLATFORM_FEE_BPS) / 10_000;
        uint256 payout = bounty.reward - fee;

        _transferReward(bounty.token, winner, payout);
        if (fee > 0) _transferReward(bounty.token, feeRecipient, fee);

        if (address(nftContract) != address(0)) {
            nftContract.mintAchievement(
                winner,
                bountyId,
                _categoryToString(bounty.category),
                score,
                bounty.ipfsHash
            );
        }

        emit WinnerDeclared(bountyId, winner, payout, score);
    }

    function markUnderReview(uint256 bountyId) external onlyOracle bountyExists(bountyId) {
        require(bounties[bountyId].status == BountyStatus.Open, "Not open");
        bounties[bountyId].status = BountyStatus.UnderReview;
    }

    // ── Refund Poster ──────────────────────────────

    function refundPoster(uint256 bountyId) external bountyExists(bountyId) nonReentrant {
        Bounty storage bounty = bounties[bountyId];

        require(msg.sender == bounty.poster || isOracle[msg.sender], "Not authorized");
        require(bounty.status == BountyStatus.Open, "Cannot refund");
        require(block.timestamp > bounty.deadline,  "Deadline not passed");

        bounty.status = BountyStatus.Refunded;
        _transferReward(bounty.token, bounty.poster, bounty.reward);
        emit BountyRefunded(bountyId, bounty.poster, bounty.reward);
    }

    // ── Views ──────────────────────────────────────

    function getSubmissions(uint256 bountyId) external view returns (Submission[] memory) {
        return submissions[bountyId];
    }

    function getBounty(uint256 bountyId) external view returns (Bounty memory) {
        return bounties[bountyId];
    }

    // ── Internal ───────────────────────────────────

    function _transferReward(address token, address to, uint256 amount) internal {
        if (token == address(0)) {
            (bool ok, ) = payable(to).call{value: amount}("");
            require(ok, "ETH transfer failed");
        } else {
            IERC20(token).safeTransfer(to, amount);
        }
    }

    function _categoryToString(BountyCategory cat) internal pure returns (string memory) {
        if (cat == BountyCategory.Code)    return "Code";
        if (cat == BountyCategory.Design)  return "Design";
        if (cat == BountyCategory.Writing) return "Writing";
        return "Other";
    }

    receive() external payable {}
}
