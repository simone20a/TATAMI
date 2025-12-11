// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./MyToken1.sol";
import "./MyToken2.sol";
import "./LiquidityPoolToken.sol";

contract MyModel {

    // --- 5.3: State Variables (Tokens and Pools) ---
    MyToken1 public mytoken1Instance;
    MyToken2 public mytoken2Instance;
    LiquidityPoolToken public liquiditypooltokenInstance;

    uint256 public t1_pool_amount;
    uint256 public t2_pool_amount;

    // --- 5.3.1: State Variables (from 'variable' scope) ---
    bool public ever_deposited;
    uint256 public to_mint;

    // --- 5.4: Constructor (Deploying Tokens) ---
    constructor() {
        mytoken1Instance = new MyToken1(address(this));
        mytoken2Instance = new MyToken2(address(this));
        liquiditypooltokenInstance = new LiquidityPoolToken(address(this));
    }

    // --- Start Variable Aliases (Step 7) ---
        // --- 7.1: Aliases for Internal State Accessors ---

/** @dev Alias for msg.sender. */
function Sender() internal view returns (address) { return msg.sender; }


/** @dev Alias for block.number. */
function BlockNumber() internal view returns (uint256) { return block.number; }


/** @dev Alias for MyToken1.totalSupply(). */
function MyToken1_TotalSupply() internal view returns (uint256) { return mytoken1Instance.totalSupply(); }


/** @dev Alias for MyToken1.balanceOf(address). */
function MyToken1_balanceOf(address _param) internal view returns (uint256) { return mytoken1Instance.balanceOf(_param); }


/** @dev Alias for MyToken2.totalSupply(). */
function MyToken2_TotalSupply() internal view returns (uint256) { return mytoken2Instance.totalSupply(); }


/** @dev Alias for MyToken2.balanceOf(address). */
function MyToken2_balanceOf(address _param) internal view returns (uint256) { return mytoken2Instance.balanceOf(_param); }


/** @dev Alias for LiquidityPoolToken.totalSupply(). */
function LiquidityPoolToken_TotalSupply() internal view returns (uint256) { return liquiditypooltokenInstance.totalSupply(); }


/** @dev Alias for LiquidityPoolToken.balanceOf(address). */
function LiquidityPoolToken_balanceOf(address _param) internal view returns (uint256) { return liquiditypooltokenInstance.balanceOf(_param); }

    // --- 7.2: Functions for Constants ---
    // --- End Variable Aliases ---

    // --- Start Type Block Functions (Step 7.5) ---
        // --- 7.5: Functions for Type Block Resolution ---

/** @dev Resolver function for Type Block ID 4 (Value: "t1_amount") */
function _type_4(uint256 t1_amount) internal pure returns (uint256) {
    return t1_amount;
}

/** @dev Resolver function for Type Block ID 5 (Value: "t2_amount") */
function _type_5(uint256 t2_amount) internal pure returns (uint256) {
    return t2_amount;
}

/** @dev Resolver function for Type Block ID 11 (Value: "ever_deposited") */
function _type_11() internal view returns (bool) {
    return ever_deposited;
}

/** @dev Resolver function for Type Block ID 13 (Value: "( t1_amount * LiquidityPoolToken_TotalSupply ) / t1_pool_amount") */
function _type_13(uint256 t1_amount) internal view returns (uint256) {
    return ( t1_amount * LiquidityPoolToken_TotalSupply() ) / t1_pool_amount;
}

/** @dev Resolver function for Type Block ID 17 (Value: "to_mint") */
function _type_17() internal view returns (uint256) {
    return to_mint;
}

/** @dev Resolver function for Type Block ID 20 (Value: "Sender") */
function _type_20() internal view returns (address) {
    return Sender();
}

/** @dev Resolver function for Type Block ID 22 (Value: "t1_amount") */
function _type_22(uint256 t1_amount) internal pure returns (uint256) {
    return t1_amount;
}

/** @dev Resolver function for Type Block ID 24 (Value: "true") */
function _type_24() internal pure returns (bool) {
    return true;
}

/** @dev Resolver function for Type Block ID 28 (Value: "to_redeem") */
function _type_28(uint256 to_redeem) internal pure returns (uint256) {
    return to_redeem;
}

/** @dev Resolver function for Type Block ID 30 (Value: "( to_redeem * t1_pool_amount ) / LiquidityPoolToken_TotalSupply") */
function _type_30(uint256 to_redeem) internal view returns (uint256) {
    return ( to_redeem * t1_pool_amount ) / LiquidityPoolToken_TotalSupply();
}

/** @dev Resolver function for Type Block ID 32 (Value: "( to_redeem * t2_pool_amount ) / LiquidityPoolToken_TotalSupply") */
function _type_32(uint256 to_redeem) internal view returns (uint256) {
    return ( to_redeem * t2_pool_amount ) / LiquidityPoolToken_TotalSupply();
}

/** @dev Resolver function for Type Block ID 34 (Value: "Sender") */
function _type_34() internal view returns (address) {
    return Sender();
}

/** @dev Resolver function for Type Block ID 36 (Value: "Sender") */
function _type_36() internal view returns (address) {
    return Sender();
}

/** @dev Resolver function for Type Block ID 39 (Value: "t1_amount") */
function _type_39(uint256 t1_amount) internal pure returns (uint256) {
    return t1_amount;
}

/** @dev Resolver function for Type Block ID 41 (Value: "t1_amount * t2_pool_amount / ( t1_pool_amount + t1_amount )") */
function _type_41(uint256 t1_amount) internal view returns (uint256) {
    return t1_amount * t2_pool_amount / ( t1_pool_amount + t1_amount );
}

/** @dev Resolver function for Type Block ID 43 (Value: "Sender") */
function _type_43() internal view returns (address) {
    return Sender();
}

/** @dev Resolver function for Type Block ID 46 (Value: "t2_amount") */
function _type_46(uint256 t2_amount) internal pure returns (uint256) {
    return t2_amount;
}

/** @dev Resolver function for Type Block ID 48 (Value: "t2_amount * t1_pool_amount / ( t2_pool_amount + t2_amount )") */
function _type_48(uint256 t2_amount) internal view returns (uint256) {
    return t2_amount * t1_pool_amount / ( t2_pool_amount + t2_amount );
}

/** @dev Resolver function for Type Block ID 50 (Value: "Sender") */
function _type_50() internal view returns (address) {
    return Sender();
}

/** @dev Resolver function for Type Block ID 53 (Value: "0") */
function _type_53() internal pure returns (uint256) {
    return 0;
}

/** @dev Resolver function for Type Block ID 55 (Value: "mint_amount") */
function _type_55(uint256 mint_amount) internal pure returns (uint256) {
    return mint_amount;
}

/** @dev Resolver function for Type Block ID 58 (Value: "send_to") */
function _type_58(address send_to) internal pure returns (address) {
    return send_to;
}

/** @dev Resolver function for Type Block ID 60 (Value: "0") */
function _type_60() internal pure returns (uint256) {
    return 0;
}

/** @dev Resolver function for Type Block ID 62 (Value: "mint_amount") */
function _type_62(uint256 mint_amount) internal pure returns (uint256) {
    return mint_amount;
}

/** @dev Resolver function for Type Block ID 65 (Value: "send_to") */
function _type_65(address send_to) internal pure returns (address) {
    return send_to;
}

/** @dev Resolver function for Type Block ID 67 (Value: "t1_pool_amount * t2_amount == t2_pool_amount * t1_amount") */
function _type_67(uint256 t1_amount, uint256 t2_amount) internal view returns (bool) {
    return t1_pool_amount * t2_amount == t2_pool_amount * t1_amount;
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
 * @dev Mint block for FT: MyToken1.
 * Creates tokens via the MyToken1 contract and assigns them to this contract (MyModel).
 * Returns the original stream (pass-through) and a new stream representing the minted tokens.
 */
function _block_mint_ft_MyToken1(TokenStream memory stream, uint256 quantity)
    internal returns (TokenStream memory outStream, TokenStream memory mintedStream)
{
    mytoken1Instance.mint(address(this), quantity);
    mintedStream = TokenStream(address(mytoken1Instance), quantity, 0, false);
    // --- FIX: Create a copy for pass-through ---
    outStream = TokenStream(stream.tokenAddress, stream.amount, stream.tokenId, stream.isNFT);
}

/**
 * @dev Burn block for FT: MyToken1.
 * Burns tokens owned by this contract (MyModel) via the MyToken1 contract.
 */
function _block_burn_ft_MyToken1(TokenStream memory stream) internal {
    require(stream.tokenAddress == address(mytoken1Instance), "Burn: Incorrect token type for MyToken1");
    require(!stream.isNFT, "Burn: Expected FT, got NFT");
    mytoken1Instance.burn(address(this), stream.amount);
}

/**
 * @dev Transfer block for FT: MyToken1.
 * Transfers tokens from this contract (MyModel) to a recipient via the MyToken1 contract.
 */
function _block_transfer_ft_MyToken1(TokenStream memory stream, address recipient) internal {
    require(stream.tokenAddress == address(mytoken1Instance), "Transfer: Incorrect token type for MyToken1");
    require(!stream.isNFT, "Transfer: Expected FT, got NFT");
    require(recipient != address(0), "Transfer: Recipient cannot be zero address");
    IERC20(mytoken1Instance).transfer(recipient, stream.amount); // Use IERC20 interface for transfer
}


/**
 * @dev Mint block for FT: MyToken2.
 * Creates tokens via the MyToken2 contract and assigns them to this contract (MyModel).
 * Returns the original stream (pass-through) and a new stream representing the minted tokens.
 */
function _block_mint_ft_MyToken2(TokenStream memory stream, uint256 quantity)
    internal returns (TokenStream memory outStream, TokenStream memory mintedStream)
{
    mytoken2Instance.mint(address(this), quantity);
    mintedStream = TokenStream(address(mytoken2Instance), quantity, 0, false);
    // --- FIX: Create a copy for pass-through ---
    outStream = TokenStream(stream.tokenAddress, stream.amount, stream.tokenId, stream.isNFT);
}

/**
 * @dev Burn block for FT: MyToken2.
 * Burns tokens owned by this contract (MyModel) via the MyToken2 contract.
 */
function _block_burn_ft_MyToken2(TokenStream memory stream) internal {
    require(stream.tokenAddress == address(mytoken2Instance), "Burn: Incorrect token type for MyToken2");
    require(!stream.isNFT, "Burn: Expected FT, got NFT");
    mytoken2Instance.burn(address(this), stream.amount);
}

/**
 * @dev Transfer block for FT: MyToken2.
 * Transfers tokens from this contract (MyModel) to a recipient via the MyToken2 contract.
 */
function _block_transfer_ft_MyToken2(TokenStream memory stream, address recipient) internal {
    require(stream.tokenAddress == address(mytoken2Instance), "Transfer: Incorrect token type for MyToken2");
    require(!stream.isNFT, "Transfer: Expected FT, got NFT");
    require(recipient != address(0), "Transfer: Recipient cannot be zero address");
    IERC20(mytoken2Instance).transfer(recipient, stream.amount); // Use IERC20 interface for transfer
}


/**
 * @dev Mint block for FT: LiquidityPoolToken.
 * Creates tokens via the LiquidityPoolToken contract and assigns them to this contract (MyModel).
 * Returns the original stream (pass-through) and a new stream representing the minted tokens.
 */
function _block_mint_ft_LiquidityPoolToken(TokenStream memory stream, uint256 quantity)
    internal returns (TokenStream memory outStream, TokenStream memory mintedStream)
{
    liquiditypooltokenInstance.mint(address(this), quantity);
    mintedStream = TokenStream(address(liquiditypooltokenInstance), quantity, 0, false);
    // --- FIX: Create a copy for pass-through ---
    outStream = TokenStream(stream.tokenAddress, stream.amount, stream.tokenId, stream.isNFT);
}

/**
 * @dev Burn block for FT: LiquidityPoolToken.
 * Burns tokens owned by this contract (MyModel) via the LiquidityPoolToken contract.
 */
function _block_burn_ft_LiquidityPoolToken(TokenStream memory stream) internal {
    require(stream.tokenAddress == address(liquiditypooltokenInstance), "Burn: Incorrect token type for LiquidityPoolToken");
    require(!stream.isNFT, "Burn: Expected FT, got NFT");
    liquiditypooltokenInstance.burn(address(this), stream.amount);
}

/**
 * @dev Transfer block for FT: LiquidityPoolToken.
 * Transfers tokens from this contract (MyModel) to a recipient via the LiquidityPoolToken contract.
 */
function _block_transfer_ft_LiquidityPoolToken(TokenStream memory stream, address recipient) internal {
    require(stream.tokenAddress == address(liquiditypooltokenInstance), "Transfer: Incorrect token type for LiquidityPoolToken");
    require(!stream.isNFT, "Transfer: Expected FT, got NFT");
    require(recipient != address(0), "Transfer: Recipient cannot be zero address");
    IERC20(liquiditypooltokenInstance).transfer(recipient, stream.amount); // Use IERC20 interface for transfer
}


/**
 * @dev Deposit block for Pool (FT, no keys): t1_pool.
 * Requires the stream token to match the pool's designated token (MyToken1).
 */
function _block_deposit_t1_pool(TokenStream memory stream) internal {
    require(stream.tokenAddress == address(mytoken1Instance), "Deposit t1_pool: Incorrect token type for pool");
    require(!stream.isNFT, "Deposit t1_pool: Pool does not support NFTs");
    // Tokens are already held by this contract, just update counters
    t1_pool_amount += stream.amount;
}

/**
 * @dev Withdraw block for Pool (FT, no keys): t1_pool.
 * Returns the original stream and a new stream representing the withdrawn tokens (MyToken1).
 */
function _block_withdraw_t1_pool(TokenStream memory stream, uint256 amount)
    internal returns (TokenStream memory outStream, TokenStream memory withdrawnStream)
{
    require(t1_pool_amount >= amount, "Withdraw t1_pool: Insufficient funds in pool");

    t1_pool_amount -= amount;

    // Tokens are already held by this contract, create a stream representing them
    withdrawnStream = TokenStream(address(mytoken1Instance), amount, 0, false);
    // --- FIX: Create a copy for pass-through ---
    outStream = TokenStream(stream.tokenAddress, stream.amount, stream.tokenId, stream.isNFT);
}


/**
 * @dev Deposit block for Pool (FT, no keys): t2_pool.
 * Requires the stream token to match the pool's designated token (MyToken2).
 */
function _block_deposit_t2_pool(TokenStream memory stream) internal {
    require(stream.tokenAddress == address(mytoken2Instance), "Deposit t2_pool: Incorrect token type for pool");
    require(!stream.isNFT, "Deposit t2_pool: Pool does not support NFTs");
    // Tokens are already held by this contract, just update counters
    t2_pool_amount += stream.amount;
}

/**
 * @dev Withdraw block for Pool (FT, no keys): t2_pool.
 * Returns the original stream and a new stream representing the withdrawn tokens (MyToken2).
 */
function _block_withdraw_t2_pool(TokenStream memory stream, uint256 amount)
    internal returns (TokenStream memory outStream, TokenStream memory withdrawnStream)
{
    require(t2_pool_amount >= amount, "Withdraw t2_pool: Insufficient funds in pool");

    t2_pool_amount -= amount;

    // Tokens are already held by this contract, create a stream representing them
    withdrawnStream = TokenStream(address(mytoken2Instance), amount, 0, false);
    // --- FIX: Create a copy for pass-through ---
    outStream = TokenStream(stream.tokenAddress, stream.amount, stream.tokenId, stream.isNFT);
}


/**
 * @dev Set block for variable: ever_deposited.
 * Sets the state variable ever_deposited to the provided value
 * if the input stream is not empty (tokenAddress != 0).
 * Returns the original stream (pass-through).
 */
function _block_set_ever_deposited(TokenStream memory stream, bool value)
    internal returns (TokenStream memory outStream)
{
    // --- FIX: Only set if stream is not empty ---
    if (stream.tokenAddress != address(0)) {
        ever_deposited = value;
    }
    // --- FIX: Create a copy for pass-through ---
    outStream = TokenStream(stream.tokenAddress, stream.amount, stream.tokenId, stream.isNFT);
}


/**
 * @dev Set block for variable: to_mint.
 * Sets the state variable to_mint to the provided value
 * if the input stream is not empty (tokenAddress != 0).
 * Returns the original stream (pass-through).
 */
function _block_set_to_mint(TokenStream memory stream, uint256 value)
    internal returns (TokenStream memory outStream)
{
    // --- FIX: Only set if stream is not empty ---
    if (stream.tokenAddress != address(0)) {
        to_mint = value;
    }
    // --- FIX: Create a copy for pass-through ---
    outStream = TokenStream(stream.tokenAddress, stream.amount, stream.tokenId, stream.isNFT);
}

    // --- End Internal Block Library ---

    // --- Start Public Functions (Step 8 & 10) ---
    
/**
 * @dev Public entry point for the TokenFlow model flow named 'deposit'.
 * Generated from EntryNode ID: 3.
 */
function deposit(uint256 t1_amount, uint256 t2_amount) public {
            // --- Processing Block: entryNode (ID: 3) ---
        // Get amount/ID from Type Block for stream 0
        uint256 val_3_0 = _type_4(t1_amount);
        require(IERC20(mytoken1Instance).allowance(msg.sender, address(this)) >= val_3_0, "Entry 0: Insufficient allowance for MyToken1");
        IERC20(mytoken1Instance).transferFrom(msg.sender, address(this), val_3_0);
        TokenStream memory stream_3_0 = TokenStream(address(mytoken1Instance), val_3_0, 0, false);
        // Get amount/ID from Type Block for stream 1
        uint256 val_3_1 = _type_5(t2_amount);
        require(IERC20(mytoken2Instance).allowance(msg.sender, address(this)) >= val_3_1, "Entry 1: Insufficient allowance for MyToken2");
        IERC20(mytoken2Instance).transferFrom(msg.sender, address(this), val_3_1);
        TokenStream memory stream_3_1 = TokenStream(address(mytoken2Instance), val_3_1, 0, false);

        // --- Processing Block: ifNode (ID: 10) ---
        (TokenStream memory s_10_then, TokenStream memory s_10_else) = _block_if(_type_11(), stream_3_0);

        // --- Processing Block: depositNode (ID: 26) ---
        _block_deposit_t2_pool(stream_3_1);

        // --- Processing Block: ifNode (ID: 66) ---
        (TokenStream memory s_66_then, TokenStream memory s_66_else) = _block_if(_type_67(t1_amount, t2_amount), s_10_then);

        // --- Processing Block: setNode (ID: 21) ---
        TokenStream memory s_21_out = _block_set_to_mint(s_10_else, _type_22(t1_amount));

        // --- Processing Block: setNode (ID: 12) ---
        TokenStream memory s_12_out = _block_set_to_mint(s_66_then, _type_13(t1_amount));

        // --- Processing Block: exceptionNode (ID: 68) ---
        _block_exception(s_66_else);

        // --- Processing Block: setNode (ID: 23) ---
        TokenStream memory s_23_out = _block_set_ever_deposited(s_21_out, _type_24());

        // --- Processing Block: joinNode (ID: 69) ---
        TokenStream memory s_69_join = _block_join(s_12_out, s_23_out);

        // --- Processing Block: mintNode (ID: 16) ---
        (TokenStream memory s_16_orig, TokenStream memory s_16_minted) = _block_mint_ft_LiquidityPoolToken(s_69_join, _type_17());

        // --- Processing Block: depositNode (ID: 18) ---
        _block_deposit_t1_pool(s_16_orig);

        // --- Processing Block: transferNode (ID: 19) ---
        _block_transfer_ft_LiquidityPoolToken(s_16_minted, _type_20());

}


/**
 * @dev Public entry point for the TokenFlow model flow named 'redeem'.
 * Generated from EntryNode ID: 27.
 */
function redeem(uint256 to_redeem) public {
            // --- Processing Block: entryNode (ID: 27) ---
        // Get amount/ID from Type Block for stream 0
        uint256 val_27_0 = _type_28(to_redeem);
        require(IERC20(liquiditypooltokenInstance).allowance(msg.sender, address(this)) >= val_27_0, "Entry 0: Insufficient allowance for LiquidityPoolToken");
        IERC20(liquiditypooltokenInstance).transferFrom(msg.sender, address(this), val_27_0);
        TokenStream memory stream_27_0 = TokenStream(address(liquiditypooltokenInstance), val_27_0, 0, false);

        // --- Processing Block: withdrawNode (ID: 29) ---
        (TokenStream memory s_29_orig, TokenStream memory s_29_withdrawn) = _block_withdraw_t1_pool(stream_27_0, _type_30(to_redeem));

        // --- Processing Block: withdrawNode (ID: 31) ---
        (TokenStream memory s_31_orig, TokenStream memory s_31_withdrawn) = _block_withdraw_t2_pool(s_29_orig, _type_32(to_redeem));

        // --- Processing Block: transferNode (ID: 33) ---
        _block_transfer_ft_MyToken1(s_29_withdrawn, _type_34());

        // --- Processing Block: transferNode (ID: 35) ---
        _block_transfer_ft_MyToken2(s_31_withdrawn, _type_36());

        // --- Processing Block: burnNode (ID: 37) ---
        _block_burn_ft_LiquidityPoolToken(s_31_orig);

}


/**
 * @dev Public entry point for the TokenFlow model flow named 'swap_t1_t2'.
 * Generated from EntryNode ID: 38.
 */
function swap_t1_t2(uint256 t1_amount) public {
            // --- Processing Block: entryNode (ID: 38) ---
        // Get amount/ID from Type Block for stream 0
        uint256 val_38_0 = _type_39(t1_amount);
        require(IERC20(mytoken1Instance).allowance(msg.sender, address(this)) >= val_38_0, "Entry 0: Insufficient allowance for MyToken1");
        IERC20(mytoken1Instance).transferFrom(msg.sender, address(this), val_38_0);
        TokenStream memory stream_38_0 = TokenStream(address(mytoken1Instance), val_38_0, 0, false);

        // --- Processing Block: withdrawNode (ID: 40) ---
        (TokenStream memory s_40_orig, TokenStream memory s_40_withdrawn) = _block_withdraw_t2_pool(stream_38_0, _type_41(t1_amount));

        // --- Processing Block: transferNode (ID: 42) ---
        _block_transfer_ft_MyToken2(s_40_withdrawn, _type_43());

        // --- Processing Block: depositNode (ID: 44) ---
        _block_deposit_t1_pool(s_40_orig);

}


/**
 * @dev Public entry point for the TokenFlow model flow named 'swap_t2_t1'.
 * Generated from EntryNode ID: 45.
 */
function swap_t2_t1(uint256 t2_amount) public {
            // --- Processing Block: entryNode (ID: 45) ---
        // Get amount/ID from Type Block for stream 0
        uint256 val_45_0 = _type_46(t2_amount);
        require(IERC20(mytoken2Instance).allowance(msg.sender, address(this)) >= val_45_0, "Entry 0: Insufficient allowance for MyToken2");
        IERC20(mytoken2Instance).transferFrom(msg.sender, address(this), val_45_0);
        TokenStream memory stream_45_0 = TokenStream(address(mytoken2Instance), val_45_0, 0, false);

        // --- Processing Block: withdrawNode (ID: 47) ---
        (TokenStream memory s_47_orig, TokenStream memory s_47_withdrawn) = _block_withdraw_t1_pool(stream_45_0, _type_48(t2_amount));

        // --- Processing Block: transferNode (ID: 49) ---
        _block_transfer_ft_MyToken1(s_47_withdrawn, _type_50());

        // --- Processing Block: depositNode (ID: 51) ---
        _block_deposit_t2_pool(s_47_orig);

}


/**
 * @dev Public entry point for the TokenFlow model flow named 'mint_t1'.
 * Generated from EntryNode ID: 52.
 */
function mint_t1(uint256 mint_amount, address send_to) public {
            // --- Processing Block: entryNode (ID: 52) ---
        // Get amount/ID from Type Block for stream 0
        uint256 val_52_0 = _type_53();
        require(IERC20(mytoken1Instance).allowance(msg.sender, address(this)) >= val_52_0, "Entry 0: Insufficient allowance for MyToken1");
        IERC20(mytoken1Instance).transferFrom(msg.sender, address(this), val_52_0);
        TokenStream memory stream_52_0 = TokenStream(address(mytoken1Instance), val_52_0, 0, false);

        // --- Processing Block: mintNode (ID: 54) ---
        (TokenStream memory s_54_orig, TokenStream memory s_54_minted) = _block_mint_ft_MyToken1(stream_52_0, _type_55(mint_amount));

        // --- Processing Block: joinNode (ID: 56) ---
        TokenStream memory s_56_join = _block_join(s_54_orig, s_54_minted);

        // --- Processing Block: transferNode (ID: 57) ---
        _block_transfer_ft_MyToken1(s_56_join, _type_58(send_to));

}


/**
 * @dev Public entry point for the TokenFlow model flow named 'mint_t2'.
 * Generated from EntryNode ID: 59.
 */
function mint_t2(uint256 mint_amount, address send_to) public {
            // --- Processing Block: entryNode (ID: 59) ---
        // Get amount/ID from Type Block for stream 0
        uint256 val_59_0 = _type_60();
        require(IERC20(mytoken2Instance).allowance(msg.sender, address(this)) >= val_59_0, "Entry 0: Insufficient allowance for MyToken2");
        IERC20(mytoken2Instance).transferFrom(msg.sender, address(this), val_59_0);
        TokenStream memory stream_59_0 = TokenStream(address(mytoken2Instance), val_59_0, 0, false);

        // --- Processing Block: mintNode (ID: 61) ---
        (TokenStream memory s_61_orig, TokenStream memory s_61_minted) = _block_mint_ft_MyToken2(stream_59_0, _type_62(mint_amount));

        // --- Processing Block: joinNode (ID: 63) ---
        TokenStream memory s_63_join = _block_join(s_61_orig, s_61_minted);

        // --- Processing Block: transferNode (ID: 64) ---
        _block_transfer_ft_MyToken2(s_63_join, _type_65(send_to));

}

    // --- End Public Functions ---

}
