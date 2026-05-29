// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./CommunityTokens.sol";
import "./Beneficiary.sol";
import "./Coupon.sol";

contract MyModel {

    // --- 5.3: State Variables (Tokens and Pools) ---
    CommunityTokens public communitytokensInstance;
    Beneficiary public beneficiaryInstance;
    Coupon public couponInstance;

    uint256 public CCT_Pool_amount;
    uint256 public CouponPool_amount;
    mapping(uint256 => bool) public CouponPool_contains;

    // --- 5.3.1: State Variables (from 'variable' scope) ---

    // --- 5.4: Constructor (Deploying Tokens) ---
    constructor() {
        communitytokensInstance = new CommunityTokens(address(this));
        beneficiaryInstance = new Beneficiary(address(this));
        couponInstance = new Coupon(address(this));
    }

    // --- Start Variable Aliases (Step 7) ---
        // --- 7.1: Aliases for Internal State Accessors ---

/** @dev Alias for msg.sender. */
function Sender() internal view returns (address) { return msg.sender; }


/** @dev Alias for block.number. */
function BlockNumber() internal view returns (uint256) { return block.number; }


/** @dev Alias for CommunityTokens.totalSupply(). */
function CommunityTokens_TotalSupply() internal view returns (uint256) { return communitytokensInstance.totalSupply(); }


/** @dev Alias for CommunityTokens.balanceOf(address). */
function CommunityTokens_balanceOf(address _param) internal view returns (uint256) { return communitytokensInstance.balanceOf(_param); }


/** @dev Alias for Beneficiary.totalSupply(). */
function Beneficiary_TotalSupply() internal view returns (uint256) { return beneficiaryInstance.totalSupply(); }


/** @dev Alias for Beneficiary.balanceOf(address). */
function Beneficiary_balanceOf(address _param) internal view returns (uint256) { return beneficiaryInstance.balanceOf(_param); }


/** @dev Alias for Coupon.getAttribute_name(tokenId). */
function Coupon_name(uint256 _tokenId) internal view returns (string memory) { 
    return couponInstance.getAttribute_name(_tokenId); 
}


/** @dev Alias for Coupon.getAttribute_price(tokenId). */
function Coupon_price(uint256 _tokenId) internal view returns (uint256) { 
    return couponInstance.getAttribute_price(_tokenId); 
}

    // --- 7.2: Functions for Constants ---
    // --- End Variable Aliases ---

    // --- Start Type Block Functions (Step 7.5) ---
        // --- 7.5: Functions for Type Block Resolution ---

/** @dev Resolver function for Type Block ID 4 (Value: "toMint") */
function _type_4(uint256 toMint) internal pure returns (uint256) {
    return toMint;
}

/** @dev Resolver function for Type Block ID 13 (Value: "sendBeneficiary") */
function _type_13(address sendBeneficiary) internal pure returns (address) {
    return sendBeneficiary;
}

/** @dev Resolver function for Type Block ID 16 (Value: "CCT_Pool_amount / Beneficiary_TotalSupply") */
function _type_16() internal view returns (uint256) {
    return CCT_Pool_amount / Beneficiary_TotalSupply();
}

/** @dev Resolver function for Type Block ID 18 (Value: "1") */
function _type_18() internal pure returns (uint256) {
    return 1;
}

/** @dev Resolver function for Type Block ID 20 (Value: "Beneficiary_TotalSupply(Sender) >= 1") */
function _type_20() internal view returns (bool) {
    return Beneficiary_TotalSupply(Sender()) >= 1;
}

/** @dev Resolver function for Type Block ID 24 (Value: "Sender") */
function _type_24() internal view returns (address) {
    return Sender();
}

/** @dev Resolver function for Type Block ID 29 (Value: "0") */
function _type_29() internal pure returns (uint256) {
    return 0;
}

/** @dev Resolver function for Type Block ID 30 (Value: "0") */
function _type_30() internal pure returns (uint256) {
    return 0;
}

/** @dev Resolver function for Type Block ID 31 (Value: "1") */
function _type_31() internal pure returns (uint256) {
    return 1;
}

/** @dev Resolver function for Type Block ID 37 (Value: "0") */
function _type_37() internal pure returns (uint256) {
    return 0;
}

/** @dev Resolver function for Type Block ID 39 (Value: "couponName") */
function _type_39(string memory couponName) internal pure returns (string memory) {
    return couponName;
}

/** @dev Resolver function for Type Block ID 40 (Value: "couponPrice") */
function _type_40(uint256 couponPrice) internal pure returns (uint256) {
    return couponPrice;
}

/** @dev Resolver function for Type Block ID 43 (Value: "CCTtoSend") */
function _type_43(uint256 CCTtoSend) internal pure returns (uint256) {
    return CCTtoSend;
}

/** @dev Resolver function for Type Block ID 45 (Value: "CCTtoSend == Coupon_price(couponId)") */
function _type_45(uint256 CCTtoSend, uint256 couponId) internal view returns (bool) {
    return CCTtoSend == Coupon_price(couponId);
}

/** @dev Resolver function for Type Block ID 51 (Value: "Sender") */
function _type_51() internal view returns (address) {
    return Sender();
}

/** @dev Resolver function for Type Block ID 52 (Value: "couponId") */
function _type_52(uint256 couponId) internal pure returns (uint256) {
    return couponId;
}
    // --- End Type Block Functions ---

    // --- Start Internal Block Library (Step 6) ---
    
// --- 6.1: TokenStream Struct and Constants ---
/**
 * @dev Represents a stream of tokens flowing between blocks.
 * Contains information about the token type, address, and amount/ID.
 */
struct TokenStream {
    address tokenAddress; // Address of the token contract
    uint256 amount;       // Quantity for FT
    uint256 tokenId;      // ID for NFT
    bool isNFT;
}

// Represents an empty stream, used in conditional flows (If block) and as default.
TokenStream internal EMPTY_STREAM = TokenStream(address(0), 0, 0, false);


// --- 6.2: View/Pure Functions ---

/**
 * @dev Internal function for the 'If' block. Reads EMPTY_STREAM.
 */
function _block_if(bool condition, TokenStream memory inputStream)
    internal view returns (TokenStream memory thenStream, TokenStream memory elseStream) { 
    if (condition) {
        // --- FIX: Create a copy, not a reference ---
        thenStream = TokenStream(inputStream.tokenAddress, inputStream.amount, inputStream.tokenId, inputStream.isNFT);
        elseStream = EMPTY_STREAM; // Reads state
    } else {
        thenStream = EMPTY_STREAM; // Reads state
        // --- FIX: Create a copy, not a reference ---
        elseStream = TokenStream(inputStream.tokenAddress, inputStream.amount, inputStream.tokenId, inputStream.isNFT);
    }
}

/**
 * @dev Internal function for the 'Join' block. Pure logic.
 */
function _block_join(TokenStream memory stream1, TokenStream memory stream2)
    internal pure returns (TokenStream memory outStream) { // Still pure

    // --- NEW FIX: Revert if either stream is an NFT ---
    require(!stream1.isNFT && !stream2.isNFT, "Join: Cannot join NFT streams");

    // If both streams are active (and we know they are FTs), they MUST match
    if (stream1.tokenAddress != address(0) && stream2.tokenAddress != address(0)) {
        require(stream1.tokenAddress == stream2.tokenAddress, "Join: Token addresses do not match");
        // No need to check isNFT anymore, we did it above
    }

    // Prioritize the first non-empty stream
    if (stream1.tokenAddress != address(0)) {
        // --- FIX: Create a copy, not a reference ---
        outStream = TokenStream(stream1.tokenAddress, stream1.amount, stream1.tokenId, stream1.isNFT);
        // Add amount from second stream (we know both are FTs)
        if (stream1.tokenAddress == stream2.tokenAddress) {
             outStream.amount += stream2.amount;
        }
    } else {
        // If stream1 is empty, just take stream2 (create copy)
        // --- FIX: Create a copy, not a reference ---
        outStream = TokenStream(stream2.tokenAddress, stream2.amount, stream2.tokenId, stream2.isNFT);
    }
}

/**
 * @dev Internal function for the 'Split' block. Pure logic.
 */
function _block_split(TokenStream memory stream, uint256 branch1_ratio, uint256 branch2_ratio)
    internal pure returns (TokenStream memory out1, TokenStream memory out2) { // Still pure
    uint256 total = branch1_ratio + branch2_ratio;
    require(total > 0, "Split: Total ratio cannot be zero");

    // --- FIX: Add require check for NFT ---
    require(!stream.isNFT, "Split: Cannot split an NFT stream");

    // --- FIX: Create copies, not references ---
    out1 = TokenStream(stream.tokenAddress, stream.amount, stream.tokenId, stream.isNFT);
    out2 = TokenStream(stream.tokenAddress, stream.amount, stream.tokenId, stream.isNFT);

    if (stream.amount > 0) { // No need to check isNFT again
         out1.amount = (stream.amount * branch1_ratio) / total;
        out2.amount = stream.amount - out1.amount;
    }
}

/**
 * @dev Internal function for the 'Exception' block. Pure logic (revert is control flow).
 */
function _block_exception(TokenStream memory stream) internal pure { // Still pure
    if (stream.tokenAddress != address(0)) {
         if (stream.isNFT) {
               revert("TokenFlow: Flow terminated with NFT exception");
         } else if (stream.amount > 0) {
               revert("TokenFlow: Flow terminated with FT exception");
         }
    }
}


/**
 * @dev Mint block for FT: CommunityTokens.
 * Creates tokens via the CommunityTokens contract and assigns them to this contract (MyModel).
 * Returns the original stream (pass-through) and a new stream representing the minted tokens.
 */
function _block_mint_ft_CommunityTokens(TokenStream memory stream, uint256 quantity)
    internal returns (TokenStream memory outStream, TokenStream memory mintedStream)
{
    communitytokensInstance.mint(address(this), quantity);
    mintedStream = TokenStream(address(communitytokensInstance), quantity, 0, false);
    // --- FIX: Create a copy for pass-through ---
    outStream = TokenStream(stream.tokenAddress, stream.amount, stream.tokenId, stream.isNFT);
}

/**
 * @dev Burn block for FT: CommunityTokens.
 * Burns tokens owned by this contract (MyModel) via the CommunityTokens contract.
 */
function _block_burn_ft_CommunityTokens(TokenStream memory stream) internal {
    require(stream.tokenAddress == address(communitytokensInstance), "Burn: Incorrect token type for CommunityTokens");
    require(!stream.isNFT, "Burn: Expected FT, got NFT");
    communitytokensInstance.burn(address(this), stream.amount);
}

/**
 * @dev Transfer block for FT: CommunityTokens.
 * Transfers tokens from this contract (MyModel) to a recipient via the CommunityTokens contract.
 */
function _block_transfer_ft_CommunityTokens(TokenStream memory stream, address recipient) internal {
    require(stream.tokenAddress == address(communitytokensInstance), "Transfer: Incorrect token type for CommunityTokens");
    require(!stream.isNFT, "Transfer: Expected FT, got NFT");
    require(recipient != address(0), "Transfer: Recipient cannot be zero address");
    IERC20(communitytokensInstance).transfer(recipient, stream.amount); // Use IERC20 interface for transfer
}


/**
 * @dev Mint block for FT: Beneficiary.
 * Creates tokens via the Beneficiary contract and assigns them to this contract (MyModel).
 * Returns the original stream (pass-through) and a new stream representing the minted tokens.
 */
function _block_mint_ft_Beneficiary(TokenStream memory stream, uint256 quantity)
    internal returns (TokenStream memory outStream, TokenStream memory mintedStream)
{
    beneficiaryInstance.mint(address(this), quantity);
    mintedStream = TokenStream(address(beneficiaryInstance), quantity, 0, false);
    // --- FIX: Create a copy for pass-through ---
    outStream = TokenStream(stream.tokenAddress, stream.amount, stream.tokenId, stream.isNFT);
}

/**
 * @dev Burn block for FT: Beneficiary.
 * Burns tokens owned by this contract (MyModel) via the Beneficiary contract.
 */
function _block_burn_ft_Beneficiary(TokenStream memory stream) internal {
    require(stream.tokenAddress == address(beneficiaryInstance), "Burn: Incorrect token type for Beneficiary");
    require(!stream.isNFT, "Burn: Expected FT, got NFT");
    beneficiaryInstance.burn(address(this), stream.amount);
}

/**
 * @dev Transfer block for FT: Beneficiary.
 * Transfers tokens from this contract (MyModel) to a recipient via the Beneficiary contract.
 */
function _block_transfer_ft_Beneficiary(TokenStream memory stream, address recipient) internal {
    require(stream.tokenAddress == address(beneficiaryInstance), "Transfer: Incorrect token type for Beneficiary");
    require(!stream.isNFT, "Transfer: Expected FT, got NFT");
    require(recipient != address(0), "Transfer: Recipient cannot be zero address");
    IERC20(beneficiaryInstance).transfer(recipient, stream.amount); // Use IERC20 interface for transfer
}


/**
 * @dev Mint block for NFT: Coupon.
 * Creates an NFT with specified attributes via the Coupon contract and assigns it to this contract (MyModel).
 * Returns the original stream and a new stream representing the minted token.
 */
function _block_mint_nft_Coupon(TokenStream memory stream, string memory _name, uint256 _price)
    internal returns (TokenStream memory outStream, TokenStream memory mintedStream)
{
    uint256 tokenId = couponInstance.mint(address(this), _name, _price);
    mintedStream = TokenStream(address(couponInstance), 0, tokenId, true);
    // --- FIX: Create a copy for pass-through ---
    outStream = TokenStream(stream.tokenAddress, stream.amount, stream.tokenId, stream.isNFT);
}

/**
 * @dev Burn block for NFT: Coupon. Burns the specified NFT owned by this contract.
 */
function _block_burn_nft_Coupon(TokenStream memory stream) internal {
    require(stream.tokenAddress == address(couponInstance) && stream.isNFT, "Burn: Incorrect NFT type for Coupon");
    couponInstance.burn(stream.tokenId);
}

/**
 * @dev Transfer block for NFT: Coupon. Transfers the NFT from this contract to a recipient.
 */
function _block_transfer_nft_Coupon(TokenStream memory stream, address recipient) internal {
    require(stream.tokenAddress == address(couponInstance) && stream.isNFT, "Transfer: Incorrect NFT type for Coupon");
    require(recipient != address(0), "Transfer: Recipient cannot be zero address");
    // Use safeTransferFrom(from, to, tokenId)
    IERC721(couponInstance).safeTransferFrom(address(this), recipient, stream.tokenId); // Use IERC721 interface
}


/**
 * @dev Deposit block for Pool (FT, no keys): CCT_Pool.
 * Requires the stream token to match the pool's designated token (CommunityTokens).
 */
function _block_deposit_CCT_Pool(TokenStream memory stream) internal {
    require(stream.tokenAddress == address(communitytokensInstance), "Deposit CCT_Pool: Incorrect token type for pool");
    require(!stream.isNFT, "Deposit CCT_Pool: Pool does not support NFTs");
    // Tokens are already held by this contract, just update counters
    CCT_Pool_amount += stream.amount;
}

/**
 * @dev Withdraw block for Pool (FT, no keys): CCT_Pool.
 * Returns the original stream and a new stream representing the withdrawn tokens (CommunityTokens).
 */
function _block_withdraw_CCT_Pool(TokenStream memory stream, uint256 amount)
    internal returns (TokenStream memory outStream, TokenStream memory withdrawnStream)
{
    require(CCT_Pool_amount >= amount, "Withdraw CCT_Pool: Insufficient funds in pool");

    CCT_Pool_amount -= amount;

    // Tokens are already held by this contract, create a stream representing them
    withdrawnStream = TokenStream(address(communitytokensInstance), amount, 0, false);
    // --- FIX: Create a copy for pass-through ---
    outStream = TokenStream(stream.tokenAddress, stream.amount, stream.tokenId, stream.isNFT);
}


/**
 * @dev Deposit block for Pool (NFT, no keys): CouponPool.
 * Requires the stream token to match the pool's designated token (Coupon).
 */
function _block_deposit_CouponPool(TokenStream memory stream) internal {
    require(stream.tokenAddress == address(couponInstance), "Deposit CouponPool: Incorrect token type for pool");
    require(stream.isNFT, "Deposit CouponPool: Pool does not support FTs");
    require(!CouponPool_contains[stream.tokenId], "Deposit CouponPool: NFT already in pool");

    CouponPool_contains[stream.tokenId] = true;
    CouponPool_amount += 1;
}

/**
 * @dev Withdraw block for Pool (NFT, no keys): CouponPool.
 * Returns the original stream and a new stream representing the withdrawn NFT (Coupon).
 */
function _block_withdraw_CouponPool(TokenStream memory stream, uint256 tokenId)
    internal returns (TokenStream memory outStream, TokenStream memory withdrawnStream)
{
    require(CouponPool_contains[tokenId], "Withdraw CouponPool: NFT not in pool");

    CouponPool_contains[tokenId] = false;
    CouponPool_amount -= 1; // Decrement NFT count

    // Create a stream representing the withdrawn NFT
    withdrawnStream = TokenStream(address(couponInstance), 0, tokenId, true);
    // --- FIX: Create a copy for pass-through ---
    outStream = TokenStream(stream.tokenAddress, stream.amount, stream.tokenId, stream.isNFT);
}

    // --- End Internal Block Library ---

    // --- Start Public Functions (Step 8 & 10) ---
    
/**
 * @dev Public entry point for the TokenFlow model flow named 'assignBeneficiary'.
 * Generated from EntryNode ID: 9.
 */
function assignBeneficiary(address sendBeneficiary) public {
            // --- Processing Block: entryNode (ID: 9) ---
        // Get amount/ID from Type Block for stream 0
        uint256 val_9_0 = _type_29();
        require(IERC20(beneficiaryInstance).allowance(msg.sender, address(this)) >= val_9_0, "Entry 0: Insufficient allowance for Beneficiary");
        IERC20(beneficiaryInstance).transferFrom(msg.sender, address(this), val_9_0);
        TokenStream memory stream_9_0 = TokenStream(address(beneficiaryInstance), val_9_0, 0, false);

        // --- Processing Block: ifNode (ID: 19) ---
        (TokenStream memory s_19_then, TokenStream memory s_19_else) = _block_if(_type_20(), stream_9_0);

        // --- Processing Block: mintNode (ID: 10) ---
        (TokenStream memory s_10_orig, TokenStream memory s_10_minted) = _block_mint_ft_Beneficiary(s_19_else, _type_18());

        // --- Processing Block: exceptionNode (ID: 21) ---
        _block_exception(s_19_then);

        // --- Processing Block: joinNode (ID: 11) ---
        TokenStream memory s_11_join = _block_join(s_10_orig, s_10_minted);

        // --- Processing Block: transferNode (ID: 12) ---
        _block_transfer_ft_Beneficiary(s_11_join, _type_13(sendBeneficiary));

}


/**
 * @dev Public entry point for the TokenFlow model flow named 'withdrawCCT'.
 * Generated from EntryNode ID: 14.
 */
function withdrawCCT() public {
            // --- Processing Block: entryNode (ID: 14) ---
        // Get amount/ID from Type Block for stream 0
        uint256 val_14_0 = _type_31();
        require(IERC20(beneficiaryInstance).allowance(msg.sender, address(this)) >= val_14_0, "Entry 0: Insufficient allowance for Beneficiary");
        IERC20(beneficiaryInstance).transferFrom(msg.sender, address(this), val_14_0);
        TokenStream memory stream_14_0 = TokenStream(address(beneficiaryInstance), val_14_0, 0, false);

        // --- Processing Block: withdrawNode (ID: 15) ---
        (TokenStream memory s_15_orig, TokenStream memory s_15_withdrawn) = _block_withdraw_CCT_Pool(stream_14_0, _type_16());

        // --- Processing Block: burnNode (ID: 22) ---
        _block_burn_ft_Beneficiary(s_15_orig);

        // --- Processing Block: transferNode (ID: 23) ---
        _block_transfer_ft_CommunityTokens(s_15_withdrawn, _type_24());

}


/**
 * @dev Public entry point for the TokenFlow model flow named 'mintCCT'.
 * Generated from EntryNode ID: 25.
 */
function mintCCT(uint256 toMint) public {
            // --- Processing Block: entryNode (ID: 25) ---
        // Get amount/ID from Type Block for stream 0
        uint256 val_25_0 = _type_30();
        require(IERC20(communitytokensInstance).allowance(msg.sender, address(this)) >= val_25_0, "Entry 0: Insufficient allowance for CommunityTokens");
        IERC20(communitytokensInstance).transferFrom(msg.sender, address(this), val_25_0);
        TokenStream memory stream_25_0 = TokenStream(address(communitytokensInstance), val_25_0, 0, false);

        // --- Processing Block: mintNode (ID: 3) ---
        (TokenStream memory s_3_orig, TokenStream memory s_3_minted) = _block_mint_ft_CommunityTokens(stream_25_0, _type_4(toMint));

        // --- Processing Block: joinNode (ID: 6) ---
        TokenStream memory s_6_join = _block_join(s_3_orig, s_3_minted);

        // --- Processing Block: depositNode (ID: 7) ---
        _block_deposit_CCT_Pool(s_6_join);

}


/**
 * @dev Public entry point for the TokenFlow model flow named 'mintCoupon'.
 * Generated from EntryNode ID: 33.
 */
function mintCoupon(string memory couponName, uint256 couponPrice) public {
            // --- Processing Block: entryNode (ID: 33) ---
        // Get amount/ID from Type Block for stream 0
        uint256 val_33_0 = _type_37();
        require(IERC20(communitytokensInstance).allowance(msg.sender, address(this)) >= val_33_0, "Entry 0: Insufficient allowance for CommunityTokens");
        IERC20(communitytokensInstance).transferFrom(msg.sender, address(this), val_33_0);
        TokenStream memory stream_33_0 = TokenStream(address(communitytokensInstance), val_33_0, 0, false);

        // --- Processing Block: mintNode (ID: 38) ---
        (TokenStream memory s_38_orig, TokenStream memory s_38_minted) = _block_mint_nft_Coupon(stream_33_0, _type_39(couponName), _type_40(couponPrice));

        // --- Processing Block: burnNode (ID: 41) ---
        _block_burn_ft_CommunityTokens(s_38_orig);

        // --- Processing Block: depositNode (ID: 42) ---
        _block_deposit_CouponPool(s_38_minted);

}


/**
 * @dev Public entry point for the TokenFlow model flow named 'buyCoupon'.
 * Generated from EntryNode ID: 35.
 */
function buyCoupon(uint256 CCTtoSend, uint256 couponId) public {
            // --- Processing Block: entryNode (ID: 35) ---
        // Get amount/ID from Type Block for stream 0
        uint256 val_35_0 = _type_43(CCTtoSend);
        require(IERC20(communitytokensInstance).allowance(msg.sender, address(this)) >= val_35_0, "Entry 0: Insufficient allowance for CommunityTokens");
        IERC20(communitytokensInstance).transferFrom(msg.sender, address(this), val_35_0);
        TokenStream memory stream_35_0 = TokenStream(address(communitytokensInstance), val_35_0, 0, false);

        // --- Processing Block: ifNode (ID: 44) ---
        (TokenStream memory s_44_then, TokenStream memory s_44_else) = _block_if(_type_45(CCTtoSend, couponId), stream_35_0);

        // --- Processing Block: exceptionNode (ID: 46) ---
        _block_exception(s_44_else);

        // --- Processing Block: withdrawNode (ID: 47) ---
        (TokenStream memory s_47_orig, TokenStream memory s_47_withdrawn) = _block_withdraw_CouponPool(s_44_then, _type_52(couponId));

        // --- Processing Block: burnNode (ID: 49) ---
        _block_burn_ft_CommunityTokens(s_47_orig);

        // --- Processing Block: transferNode (ID: 50) ---
        _block_transfer_nft_Coupon(s_47_withdrawn, _type_51());

}

    // --- End Public Functions ---

}
