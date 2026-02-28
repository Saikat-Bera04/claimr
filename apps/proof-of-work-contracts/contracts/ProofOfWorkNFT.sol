// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract ProofOfWorkNFT is ERC721URIStorage, Ownable {
    using Strings for uint256;

    struct Achievement {
        uint256 bountyId;
        string  category;
        uint256 score;
        uint256 timestamp;
        string  submissionIpfsHash;
    }

    uint256 public tokenCount;
    mapping(uint256 => Achievement) public achievements;
    mapping(address => uint256[]) public walletTokens;

    address public bountyEscrow;

    event AchievementMinted(address indexed winner, uint256 indexed tokenId, uint256 bountyId, string category, uint256 score);

    modifier onlyBountyContract() {
        require(msg.sender == bountyEscrow, "Only BountyEscrow");
        _;
    }

    constructor() ERC721("ProofOfWork Achievement", "POWACH") Ownable(msg.sender) {}

    function setBountyEscrow(address _escrow) external onlyOwner {
        bountyEscrow = _escrow;
    }

    // ── Soulbound: block all transfers ─────────────

    function transferFrom(address, address, uint256) public pure override(ERC721, IERC721) {
        revert("Soulbound: non-transferable");
    }

    function safeTransferFrom(address, address, uint256, bytes memory) public pure override(ERC721, IERC721) {
        revert("Soulbound: non-transferable");
    }

    // ── Mint ───────────────────────────────────────

    function mintAchievement(
        address winner,
        uint256 bountyId,
        string calldata category,
        uint256 score,
        string calldata submissionIpfsHash
    ) external onlyBountyContract returns (uint256 tokenId) {
        tokenId = tokenCount++;
        _safeMint(winner, tokenId);

        achievements[tokenId] = Achievement({
            bountyId:            bountyId,
            category:            category,
            score:               score,
            timestamp:           block.timestamp,
            submissionIpfsHash:  submissionIpfsHash
        });

        walletTokens[winner].push(tokenId);

        // Build 100% on-chain metadata
        string memory uri = _buildMetadata(tokenId, bountyId, category, score);
        _setTokenURI(tokenId, uri);

        emit AchievementMinted(winner, tokenId, bountyId, category, score);
    }

    // ── On-chain Metadata ──────────────────────────

    function _buildMetadata(
        uint256 tokenId,
        uint256 bountyId,
        string memory category,
        uint256 score
    ) internal pure returns (string memory) {
        string memory scoreStr = score.toString();
        string memory json = string(abi.encodePacked(
            '{"name":"ProofOfWork #', tokenId.toString(),
            '","description":"Soulbound achievement NFT for winning a ProofOfWork bounty.","attributes":[',
            '{"trait_type":"Category","value":"', category, '"},',
            '{"trait_type":"Score","value":', scoreStr, '},',
            '{"trait_type":"Bounty ID","value":', bountyId.toString(), '},',
            '{"trait_type":"Soulbound","value":"true"}',
            '],"image":"', _buildSVG(category, scoreStr), '"}'
        ));

        return string(abi.encodePacked(
            "data:application/json;base64,",
            Base64.encode(bytes(json))
        ));
    }

    function _buildSVG(string memory category, string memory score) internal pure returns (string memory) {
        string memory svg = string(abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" style="background:#0f0f23">',
            '<text x="200" y="120" font-family="monospace" font-size="18" fill="#00ff88" text-anchor="middle">ProofOfWork</text>',
            '<text x="200" y="170" font-family="monospace" font-size="28" fill="#ffffff" text-anchor="middle" font-weight="bold">', category, '</text>',
            '<text x="200" y="230" font-family="monospace" font-size="16" fill="#888" text-anchor="middle">Score</text>',
            '<text x="200" y="275" font-family="monospace" font-size="48" fill="#00ff88" text-anchor="middle" font-weight="bold">', score, '</text>',
            '<text x="200" y="340" font-family="monospace" font-size="12" fill="#555" text-anchor="middle">Soulbound Achievement</text>',
            '</svg>'
        ));
        return string(abi.encodePacked("data:image/svg+xml;base64,", Base64.encode(bytes(svg))));
    }

    // ── Views ──────────────────────────────────────

    function getWalletTokens(address wallet) external view returns (uint256[] memory) {
        return walletTokens[wallet];
    }

    function getAchievement(uint256 tokenId) external view returns (Achievement memory) {
        return achievements[tokenId];
    }
}
