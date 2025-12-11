// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./AuctionToken.sol";

contract MyModel {

    // --- 5.3: State Variables (Tokens and Pools) ---
    AuctionToken public auctiontokenInstance;

    uint256 public hightestBid_amount;

    // --- 5.3.1: State Variables (from 'variable' scope) ---
    uint256 public auctionStart;
    bool public auctionStarted;
    address public hightestBidder;
    address public previousBidder;

    // --- 5.4: Constructor (Deploying Tokens) ---
    constructor() {
        auctiontokenInstance = new AuctionToken(address(this));
    }

    // --- Start Variable Aliases (Step 7) ---
        // --- 7.1: Aliases for Internal State Accessors ---

/** @dev Alias for msg.sender. */
function Sender() internal view returns (address) { return msg.sender; }


/** @dev Alias for block.number. */
function BlockNumber() internal view returns (uint256) { return block.number; }


/** @dev Alias for AuctionToken.totalSupply(). */
function AuctionToken_TotalSupply() internal view returns (uint256) { return auctiontokenInstance.totalSupply(); }


/** @dev Alias for AuctionToken.balanceOf(address). */
function AuctionToken_balanceOf(address _param) internal view returns (uint256) { return auctiontokenInstance.balanceOf(_param); }

    // --- 7.2: Functions for Constants ---

/** @dev Constant function for 'auctionDuration'. */
function auctionDuration() internal pure returns (uint256) { return 100; }

    // --- End Variable Aliases ---

    // --- Start Type Block Functions (Step 7.5) ---
        // --- 7.5: Functions for Type Block Resolution ---

/** @dev Resolver function for Type Block ID 3 (Value: "initialBid") */
function _type_3(uint256 initialBid) internal pure returns (uint256) {
    return initialBid;
}

/** @dev Resolver function for Type Block ID 5 (Value: "BlockNumber") */
function _type_5() internal view returns (uint256) {
    return BlockNumber();
}

/** @dev Resolver function for Type Block ID 7 (Value: "true") */
function _type_7() internal pure returns (bool) {
    return true;
}

/** @dev Resolver function for Type Block ID 11 (Value: "toBid") */
function _type_11(uint256 toBid) internal pure returns (uint256) {
    return toBid;
}

/** @dev Resolver function for Type Block ID 14 (Value: "toBid > hightestBid_amount && auctionStarted && BlockNumber < auctionStart + auctionDuration") */
function _type_14(uint256 toBid) internal view returns (bool) {
    return toBid > hightestBid_amount && auctionStarted && BlockNumber() < auctionStart + auctionDuration();
}

/** @dev Resolver function for Type Block ID 17 (Value: "hightestBid_amount") */
function _type_17() internal view returns (uint256) {
    return hightestBid_amount;
}

/** @dev Resolver function for Type Block ID 19 (Value: "previousBidder") */
function _type_19() internal view returns (address) {
    return previousBidder;
}

/** @dev Resolver function for Type Block ID 21 (Value: "Sender") */
function _type_21() internal view returns (address) {
    return Sender();
}

/** @dev Resolver function for Type Block ID 25 (Value: "hightestBidder") */
function _type_25() internal view returns (address) {
    return hightestBidder;
}

/** @dev Resolver function for Type Block ID 27 (Value: "Sender") */
function _type_27() internal view returns (address) {
    return Sender();
}

/** @dev Resolver function for Type Block ID 30 (Value: "0") */
function _type_30() internal pure returns (uint256) {
    return 0;
}

/** @dev Resolver function for Type Block ID 32 (Value: "Sender = hightestBidder && BlockNumber >= auctionStart + auctionDuration") */
function _type_32() internal view returns (bool) {
    return Sender() = hightestBidder && BlockNumber() >= auctionStart + auctionDuration();
}

/** @dev Resolver function for Type Block ID 34 (Value: "false") */
function _type_34() internal pure returns (bool) {
    return false;
}

/** @dev Resolver function for Type Block ID 38 (Value: "hightestBid_amount") */
function _type_38() internal view returns (uint256) {
    return hightestBid_amount;
}

/** @dev Resolver function for Type Block ID 41 (Value: "Sender") */
function _type_41() internal view returns (address) {
    return Sender();
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
 * @dev Mint block for FT: AuctionToken.
 * Creates tokens via the AuctionToken contract and assigns them to this contract (MyModel).
 * Returns the original stream (pass-through) and a new stream representing the minted tokens.
 */
function _block_mint_ft_AuctionToken(TokenStream memory stream, uint256 quantity)
    internal returns (TokenStream memory outStream, TokenStream memory mintedStream)
{
    auctiontokenInstance.mint(address(this), quantity);
    mintedStream = TokenStream(address(auctiontokenInstance), quantity, 0, false);
    // --- FIX: Create a copy for pass-through ---
    outStream = TokenStream(stream.tokenAddress, stream.amount, stream.tokenId, stream.isNFT);
}

/**
 * @dev Burn block for FT: AuctionToken.
 * Burns tokens owned by this contract (MyModel) via the AuctionToken contract.
 */
function _block_burn_ft_AuctionToken(TokenStream memory stream) internal {
    require(stream.tokenAddress == address(auctiontokenInstance), "Burn: Incorrect token type for AuctionToken");
    require(!stream.isNFT, "Burn: Expected FT, got NFT");
    auctiontokenInstance.burn(address(this), stream.amount);
}

/**
 * @dev Transfer block for FT: AuctionToken.
 * Transfers tokens from this contract (MyModel) to a recipient via the AuctionToken contract.
 */
function _block_transfer_ft_AuctionToken(TokenStream memory stream, address recipient) internal {
    require(stream.tokenAddress == address(auctiontokenInstance), "Transfer: Incorrect token type for AuctionToken");
    require(!stream.isNFT, "Transfer: Expected FT, got NFT");
    require(recipient != address(0), "Transfer: Recipient cannot be zero address");
    IERC20(auctiontokenInstance).transfer(recipient, stream.amount); // Use IERC20 interface for transfer
}


/**
 * @dev Deposit block for Pool (FT, no keys): hightestBid.
 * Requires the stream token to match the pool's designated token (AuctionToken).
 */
function _block_deposit_hightestBid(TokenStream memory stream) internal {
    require(stream.tokenAddress == address(auctiontokenInstance), "Deposit hightestBid: Incorrect token type for pool");
    require(!stream.isNFT, "Deposit hightestBid: Pool does not support NFTs");
    // Tokens are already held by this contract, just update counters
    hightestBid_amount += stream.amount;
}

/**
 * @dev Withdraw block for Pool (FT, no keys): hightestBid.
 * Returns the original stream and a new stream representing the withdrawn tokens (AuctionToken).
 */
function _block_withdraw_hightestBid(TokenStream memory stream, uint256 amount)
    internal returns (TokenStream memory outStream, TokenStream memory withdrawnStream)
{
    require(hightestBid_amount >= amount, "Withdraw hightestBid: Insufficient funds in pool");

    hightestBid_amount -= amount;

    // Tokens are already held by this contract, create a stream representing them
    withdrawnStream = TokenStream(address(auctiontokenInstance), amount, 0, false);
    // --- FIX: Create a copy for pass-through ---
    outStream = TokenStream(stream.tokenAddress, stream.amount, stream.tokenId, stream.isNFT);
}


/**
 * @dev Set block for variable: auctionStart.
 * Sets the state variable auctionStart to the provided value
 * if the input stream is not empty (tokenAddress != 0).
 * Returns the original stream (pass-through).
 */
function _block_set_auctionStart(TokenStream memory stream, uint256 value)
    internal returns (TokenStream memory outStream)
{
    // --- FIX: Only set if stream is not empty ---
    if (stream.tokenAddress != address(0)) {
        auctionStart = value;
    }
    // --- FIX: Create a copy for pass-through ---
    outStream = TokenStream(stream.tokenAddress, stream.amount, stream.tokenId, stream.isNFT);
}


/**
 * @dev Set block for variable: auctionStarted.
 * Sets the state variable auctionStarted to the provided value
 * if the input stream is not empty (tokenAddress != 0).
 * Returns the original stream (pass-through).
 */
function _block_set_auctionStarted(TokenStream memory stream, bool value)
    internal returns (TokenStream memory outStream)
{
    // --- FIX: Only set if stream is not empty ---
    if (stream.tokenAddress != address(0)) {
        auctionStarted = value;
    }
    // --- FIX: Create a copy for pass-through ---
    outStream = TokenStream(stream.tokenAddress, stream.amount, stream.tokenId, stream.isNFT);
}


/**
 * @dev Set block for variable: hightestBidder.
 * Sets the state variable hightestBidder to the provided value
 * if the input stream is not empty (tokenAddress != 0).
 * Returns the original stream (pass-through).
 */
function _block_set_hightestBidder(TokenStream memory stream, address value)
    internal returns (TokenStream memory outStream)
{
    // --- FIX: Only set if stream is not empty ---
    if (stream.tokenAddress != address(0)) {
        hightestBidder = value;
    }
    // --- FIX: Create a copy for pass-through ---
    outStream = TokenStream(stream.tokenAddress, stream.amount, stream.tokenId, stream.isNFT);
}


/**
 * @dev Set block for variable: previousBidder.
 * Sets the state variable previousBidder to the provided value
 * if the input stream is not empty (tokenAddress != 0).
 * Returns the original stream (pass-through).
 */
function _block_set_previousBidder(TokenStream memory stream, address value)
    internal returns (TokenStream memory outStream)
{
    // --- FIX: Only set if stream is not empty ---
    if (stream.tokenAddress != address(0)) {
        previousBidder = value;
    }
    // --- FIX: Create a copy for pass-through ---
    outStream = TokenStream(stream.tokenAddress, stream.amount, stream.tokenId, stream.isNFT);
}

    // --- End Internal Block Library ---

    // --- Start Public Functions (Step 8 & 10) ---
    
/**
 * @dev Public entry point for the TokenFlow model flow named 'start'.
 * Generated from EntryNode ID: 2.
 */
function start(uint256 initialBid) public {
            // --- Processing Block: entryNode (ID: 2) ---
        // Get amount/ID from Type Block for stream 0
        uint256 val_2_0 = _type_3(initialBid);
        require(IERC20(auctiontokenInstance).allowance(msg.sender, address(this)) >= val_2_0, "Entry 0: Insufficient allowance for AuctionToken");
        IERC20(auctiontokenInstance).transferFrom(msg.sender, address(this), val_2_0);
        TokenStream memory stream_2_0 = TokenStream(address(auctiontokenInstance), val_2_0, 0, false);

        // --- Processing Block: setNode (ID: 4) ---
        TokenStream memory s_4_out = _block_set_auctionStart(stream_2_0, _type_5());

        // --- Processing Block: setNode (ID: 6) ---
        TokenStream memory s_6_out = _block_set_auctionStarted(s_4_out, _type_7());

        // --- Processing Block: setNode (ID: 26) ---
        TokenStream memory s_26_out = _block_set_hightestBidder(s_6_out, _type_27());

        // --- Processing Block: depositNode (ID: 28) ---
        _block_deposit_hightestBid(s_26_out);

}


/**
 * @dev Public entry point for the TokenFlow model flow named 'bid'.
 * Generated from EntryNode ID: 10.
 */
function bid(uint256 toBid) public {
            // --- Processing Block: entryNode (ID: 10) ---
        // Get amount/ID from Type Block for stream 0
        uint256 val_10_0 = _type_11(toBid);
        require(IERC20(auctiontokenInstance).allowance(msg.sender, address(this)) >= val_10_0, "Entry 0: Insufficient allowance for AuctionToken");
        IERC20(auctiontokenInstance).transferFrom(msg.sender, address(this), val_10_0);
        TokenStream memory stream_10_0 = TokenStream(address(auctiontokenInstance), val_10_0, 0, false);

        // --- Processing Block: ifNode (ID: 13) ---
        (TokenStream memory s_13_then, TokenStream memory s_13_else) = _block_if(_type_14(toBid), stream_10_0);

        // --- Processing Block: exceptionNode (ID: 15) ---
        _block_exception(s_13_else);

        // --- Processing Block: setNode (ID: 24) ---
        TokenStream memory s_24_out = _block_set_previousBidder(s_13_then, _type_25());

        // --- Processing Block: withdrawNode (ID: 16) ---
        (TokenStream memory s_16_orig, TokenStream memory s_16_withdrawn) = _block_withdraw_hightestBid(s_24_out, _type_17());

        // --- Processing Block: setNode (ID: 20) ---
        TokenStream memory s_20_out = _block_set_hightestBidder(s_16_orig, _type_21());

        // --- Processing Block: transferNode (ID: 23) ---
        _block_transfer_ft_AuctionToken(s_16_withdrawn, _type_19());

        // --- Processing Block: depositNode (ID: 22) ---
        _block_deposit_hightestBid(s_20_out);

}


/**
 * @dev Public entry point for the TokenFlow model flow named 'withdraw'.
 * Generated from EntryNode ID: 29.
 */
function withdraw() public {
            // --- Processing Block: entryNode (ID: 29) ---
        // Get amount/ID from Type Block for stream 0
        uint256 val_29_0 = _type_30();
        require(IERC20(auctiontokenInstance).allowance(msg.sender, address(this)) >= val_29_0, "Entry 0: Insufficient allowance for AuctionToken");
        IERC20(auctiontokenInstance).transferFrom(msg.sender, address(this), val_29_0);
        TokenStream memory stream_29_0 = TokenStream(address(auctiontokenInstance), val_29_0, 0, false);

        // --- Processing Block: ifNode (ID: 31) ---
        (TokenStream memory s_31_then, TokenStream memory s_31_else) = _block_if(_type_32(), stream_29_0);

        // --- Processing Block: setNode (ID: 35) ---
        TokenStream memory s_35_out = _block_set_auctionStarted(s_31_then, _type_34());

        // --- Processing Block: exceptionNode (ID: 36) ---
        _block_exception(s_31_else);

        // --- Processing Block: withdrawNode (ID: 37) ---
        (TokenStream memory s_37_orig, TokenStream memory s_37_withdrawn) = _block_withdraw_hightestBid(s_35_out, _type_38());

        // --- Processing Block: joinNode (ID: 39) ---
        TokenStream memory s_39_join = _block_join(s_37_orig, s_37_withdrawn);

        // --- Processing Block: transferNode (ID: 40) ---
        _block_transfer_ft_AuctionToken(s_39_join, _type_41());

}

    // --- End Public Functions ---

}
