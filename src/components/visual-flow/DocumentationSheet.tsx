
"use client";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { AtSign, Binary, Box, CircleDollarSign, Coins, Diamond, Flame, GitBranch, GitMerge, Hash, LogIn, Send, Spline, Type, ArrowDownToLine, ArrowUpFromLine, AlertTriangle, MousePointerClick, Package, Download, HelpCircle, Pencil, AlertCircle } from "lucide-react";

interface DocumentationSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const slugify = (text: string) => text.toLowerCase().replace(/[\s:]+/g, '-');

const blockDescriptions = [
    {
        category: "Independent Elements",
        blocks: [
            {
                name: "Fungible Token",
                icon: CircleDollarSign,
                color: "text-orange-500",
                content: () => (
                    <>
                        <p className="mb-2"><strong>Purpose:</strong> Defines a fungible token, which is a token whose units are interchangeable (e.g., a currency).</p>
                        <p className="mb-2"><strong>Fields:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>`Name`: The full name of the token (e.g., "My Game Coin"). This name is used to generate state variables.</li>
                            <li>`Symbol`: The symbol or ticker of the token (e.g., "MGC").</li>
                        </ul>
                        <p className="mt-3"><strong>State Variables Created:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>`Name_TotalSupply` (Number): Total amount of this token in circulation.</li>
                            <li>`Name_balanceOf(Address)` (Number): Returns the balance of a given address.</li>
                        </ul>
                        <p className="mt-3"><strong>Example:</strong> For a gaming currency, you could set `Name` to "GoldCoin" and `Symbol` to "GDC".</p>
                    </>
                )
            },
            {
                name: "Non-Fungible Token",
                icon: Diamond,
                color: "text-purple-500",
                content: () => (
                    <>
                        <p className="mb-2"><strong>Purpose:</strong> Defines a non-fungible token (NFT), a unique digital asset that cannot be exchanged on a one-to-one basis.</p>
                        <p className="mb-2"><strong>Fields:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>`Name`: The name of the collection or type of NFT (e.g., "Legendary Swords").</li>
                        </ul>
                        <p className="mt-3"><strong>Example:</strong> For a collection of unique digital art, the `Name` could be "Abstract Dreams".</p>
                    </>
                )
            },
            {
                name: "Pool",
                icon: Box,
                color: "text-cyan-500",
                content: () => (
                    <>
                        <p className="mb-2"><strong>Purpose:</strong> Defines a "container" or common fund where fungible tokens can be deposited or withdrawn. It can be organized using a key-based structure.</p>
                        <p className="mb-2"><strong>Fields:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>`Name`: The unique name of the pool.</li>
                            <li>`Token`: Associates the pool with a previously defined `Fungible Token`.</li>
                            <li>`Keys`: Allows adding or removing keys (of type `String` or `Address`) to structure the funds within the pool.</li>
                        </ul>
                        <p className="mt-3"><strong>State Variables Created:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>`Name_amount` (Number): Returns the total amount of tokens in the pool.</li>
                        </ul>
                        <p className="mt-3"><strong>Example:</strong> To create a rewards pool, you could name it "WeeklyRewards", link it to your "GDC" token, and add a "userId" key of type `Address` to track individual user deposits.</p>
                    </>
                )
            }
        ]
    },
    {
        category: "Flow Blocks",
        blocks: [
            {
                name: "Entry",
                icon: LogIn,
                color: "text-primary",
                content: () => (
                    <>
                        <p className="mb-2"><strong>Purpose:</strong> It is the mandatory starting point for every logic flow. It can define multiple outputs, each for a different token type.</p>
                        <p className="mb-2"><strong>Inputs:</strong> None.</p>
                        <p className="mb-2"><strong>Outputs:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>`Output *`: One or more token streams, depending on the number of tokens defined.</li>
                        </ul>
                        <p className="mt-2 mb-2"><strong>Fields:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>`Name`: A unique name to identify this specific flow.</li>
                            <li>`Token *`: Dropdowns to select the type of token (`Fungible` or `Non-Fungible`) each flow will operate with. Use +/- to add or remove token outputs.</li>
                        </ul>
                        <p className="mt-3"><strong>Example:</strong> To start a flow for distributing an airdrop, you could name it "AirdropFlow", select your "AirdropToken", and use the output stream to continue the logic.</p>
                    </>
                )
            },
            {
                name: "Split",
                icon: Spline,
                color: "text-primary",
                content: () => (
                    <>
                        <p className="mb-2"><strong>Purpose:</strong> Divides a token stream into two output streams, based on numerical proportions.</p>
                        <p className="mb-2"><strong>Inputs:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>`Input Stream`: The token stream to be divided.</li>
                            <li>`Branch 1`: An `Number` value defining the proportion for the first output.</li>
                            <li>`Branch 2`: An `Number` value defining the proportion for the second output.</li>
                        </ul>
                        <p className="mt-2 mb-2"><strong>Outputs:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>`Output 1`: The first resulting stream from the split.</li>
                            <li>`Output 2`: The second resulting stream from the split.</li>
                        </ul>
                        <p className="mt-3"><strong>Example:</strong> To send 70% of a token stream to one path and 30% to another, connect an `Number` block with value `70` to `Branch 1` and another with value `30` to `Branch 2`.</p>
                    </>
                )
            },
            {
                name: "Mint",
                icon: Coins,
                color: "text-primary",
                content: () => (
                    <>
                        <p className="mb-2"><strong>Purpose:</strong> Creates (mints) a specified amount of tokens within a stream.</p>
                        <p className="mb-2"><strong>Inputs:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>`Stream`: The stream where the tokens will be created.</li>
                            <li>`Quantity`: An `Number` value specifying the amount of tokens to create.</li>
                        </ul>
                        <p className="mt-2 mb-2"><strong>Outputs:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>`Stream`: The token stream containing the tokens that were given as input to the block, without alterations.</li>
                            <li>`Minted`: A new stream containing only the newly minted tokens.</li>
                        </ul>
                        <p className="mt-2 mb-2"><strong>Fields:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>`Token`: A dropdown to select which `Fungible Token` or `Non-Fungible Token` to mint.</li>
                        </ul>
                        <p className="mt-3"><strong>Example:</strong> To create 500 new tokens, connect a `Mint` block to a flow, select the desired token, and connect an `Number` block with the value `500` to the `quantity` input.</p>
                    </>
                )
            },
            {
                name: "Burn",
                icon: Flame,
                color: "text-destructive",
                content: () => (
                    <>
                        <p className="mb-2"><strong>Purpose:</strong> Permanently destroys the tokens it receives as input. It is a terminal node (it has no output).</p>
                        <p className="mb-2"><strong>Inputs:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>`To burn`: The token stream to be destroyed.</li>
                        </ul>
                        <p className="mt-2"><strong>Outputs:</strong> None.</p>
                        <p className="mt-3"><strong>Example:</strong> To remove a specific NFT from circulation after it has been used, direct its flow into the `to burn` input of a `Burn` block.</p>
                    </>
                )
            },
            {
                name: "Exception",
                icon: AlertTriangle,
                color: "text-destructive",
                content: () => (
                    <>
                        <p className="mb-2"><strong>Purpose:</strong> Terminates a flow path indicating an error condition or an exception. It is a terminal node.</p>
                        <p className="mb-2"><strong>Inputs:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>`Input stream`: The stream that ends in an exception state.</li>
                        </ul>
                        <p className="mt-2"><strong>Outputs:</strong> None.</p>
                        <p className="mt-3"><strong>Example:</strong> If a condition in an `If` block fails (e.g., a required payment was not made), route the `else` branch to an `Exception` block to halt that flow path.</p>
                    </>
                )
            },
            {
                name: "Join",
                icon: GitMerge,
                color: "text-primary",
                content: () => (
                    <>
                        <p className="mb-2"><strong>Purpose:</strong> Merges two token streams into a single stream. The two input streams must belong to the same original `EntryNode`.</p>
                        <p className="mb-2"><strong>Inputs:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>`Input 1`: The first stream to merge.</li>
                            <li>`Input 2`: The second stream to merge.</li>
                        </ul>
                        <p className="mt-2 mb-2"><strong>Outputs:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>`Output`: The resulting merged stream.</li>
                        </ul>
                        <p className="mt-3"><strong>Example:</strong> After splitting a stream to perform separate actions, use a `Join` block to bring the two resulting paths back into a single flow.</p>
                    </>
                )
            },
            {
                name: "If",
                icon: GitBranch,
                color: "text-primary",
                content: () => (
                    <>
                        <p className="mb-2"><strong>Purpose:</strong> Directs a token stream to one of two paths (`then` or `else`) based on a boolean condition.</p>
                        <p className="mb-2"><strong>Inputs:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>`condition`: A `Boolean` value that determines the path to take.</li>
                            <li>`input stream`: The token stream to be directed.</li>
                        </ul>
                        <p className="mt-2 mb-2"><strong>Outputs:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>`then`: The flow path if the condition is `true`.</li>
                            <li>`else`: The flow path if the condition is `false`.</li>
                        </ul>
                        <p className="mt-3"><strong>Example:</strong> To check if a user is a premium member, connect a `Boolean` block representing this status to the `condition` input. Route the `then` branch for premium rewards and the `else` branch for standard actions.</p>
                    </>
                )
            },
            {
                name: "Deposit",
                icon: ArrowDownToLine,
                color: "text-primary",
                content: () => (
                    <>
                        <p className="mb-2"><strong>Purpose:</strong> Deposits the tokens from a stream into a specified `Pool`.</p>
                        <p className="mb-2"><strong>Inputs:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>`Input stream`: The token stream to be deposited.</li>
                            <li>`key *`: Dynamic inputs (`String` or `Address`) that appear based on the keys defined in the selected `Pool`.</li>
                        </ul>
                        <p className="mt-2 mb-2"><strong>Outputs:</strong> None (it is a terminal action for that stream).</p>
                        <p className="mt-2 mb-2"><strong>Fields:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>`Pool`: A dropdown menu to select the destination `Pool`.</li>
                        </ul>
                        <p className="mt-3"><strong>Example:</strong> To deposit staking rewards into a user-specific account, select the "StakingPool", connect the token stream, and provide the user's `Address` to the corresponding `key` input.</p>
                    </>
                )
            },
            {
                name: "Withdraw",
                icon: ArrowUpFromLine,
                color: "text-primary",
                content: () => (
                    <>
                        <p className="mb-2"><strong>Purpose:</strong> Withdraws a specified amount of tokens from a `Pool`.</p>
                        <p className="mb-2"><strong>Inputs:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>`Stream`: The stream that defines the token type and continues the original flow.</li>
                            <li>`Amount`: An `Number` value specifying the amount to withdraw.</li>
                            <li>`key *`: Dynamic inputs (`String` or `Address`) to identify from which compartment of the `Pool` to withdraw.</li>
                        </ul>
                        <p className="mt-2 mb-2"><strong>Outputs:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>`Stream`: The stream that continues from the input.</li>
                            <li>`Withdrawn stream`: A new stream containing only the withdrawn tokens.</li>
                        </ul>
                        <p className="mt-2 mb-2"><strong>Fields:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>`Pool`: A dropdown menu to select the `Pool` to withdraw from.</li>
                        </ul>
                        <p className="mt-3"><strong>Example:</strong> To allow a user to claim their rewards, select the "StakingPool", provide an `Number` for the `amount`, and connect the user's `Address` to the `key` input. The `withdrawn stream` can then be transferred to the user.</p>
                    </>
                )
            },
            {
                name: "Transfer",
                icon: Send,
                color: "text-primary",
                content: () => (
                    <>
                        <p className="mb-2"><strong>Purpose:</strong> Transfers an amount of tokens from the stream to an external address. It is a terminal node.</p>
                        <p className="mb-2"><strong>Inputs:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>`Input stream`: The stream from which to take the tokens for the transfer.</li>
                            <li>`Recipient`: An `Address` indicating the recipient of the transfer.</li>
                        </ul>
                        <p className="mt-2"><strong>Outputs:</strong> None.</p>
                        <p className="mt-3"><strong>Example:</strong> After minting or withdrawing tokens, connect the token stream to a `Transfer` block and provide the destination `Address` to the `recipient` input to send the tokens.</p>
                    </>
                )
            },
            {
                name: "Set",
                icon: Pencil,
                color: "text-primary",
                content: () => (
                    <>
                        <p className="mb-2"><strong>Purpose:</strong> Conditionally updates the value of a user-defined `Variable`.</p>
                        <p className="mb-2"><strong>Logic:</strong> The block first checks if the incoming token stream has a quantity greater than zero. If it does, the block assigns the value from the `Value` input to the `Variable` selected in the dropdown menu. If the stream quantity is zero, no action is taken.</p>
                        <p className="mb-2"><strong>Inputs:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>`Stream`: The incoming token stream.</li>
                            <li>`Value`: The new value to assign to the variable. The input type (e.g., Number, String) depends on the type of the selected variable.</li>
                        </ul>
                        <p className="mt-2"><strong>Outputs:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>`Stream`: Passes the token stream through to the next block without modification.</li>
                        </ul>
                        <p className="mt-2 mb-2"><strong>Fields:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>`Variable`: A dropdown menu to select which `Variable` to update.</li>
                        </ul>
                        <p className="mt-3"><strong>Example:</strong> To update a `score` variable, select it from the dropdown. Connect a `Number` block with the new score to the `Value` input. When a token flows through the `Set` block, the `score` variable's value will be updated.</p>
                    </>
                )
            },
        ]
    },
    {
        category: "Type Blocks",
        description: "Type Blocks provide a string value that can be a literal constant, a reference to a variable, a state accessor, or a mathematical expression. This allows for dynamic and flexible data inputs into other blocks. The string in the input field is used to pass these values.",
        blocks: [
            {
                name: "Boolean",
                icon: Binary,
                color: "text-yellow-500",
                content: () => (
                    <>
                        <p className="mb-2"><strong>Purpose:</strong> Provides a boolean value (`true` or `false`)</p>
                        <p className="mb-2"><strong>Output:</strong> `boolean`.</p>
                        <p className="mt-3"><strong>Usage:</strong> The input field accepts a string that can be a literal (`'true'`, `'false'`), a reference to a `Boolean` variable (e.g., `my_boolean_variable`), or a state accessor that returns a boolean.</p>
                        <p className="mt-2"><strong>Example:</strong> To dynamically change a flow path, connect this block to an `If` block's `condition` and set its value to a variable like `is_premium_user`.</p>
                    </>
                )
            },
            {
                name: "Number",
                icon: Hash,
                color: "text-red-500",
                content: () => (
                    <>
                        <p className="mb-2"><strong>Purpose:</strong> Provides an Number numerical value.</p>
                        <p className="mb-2"><strong>Output:</strong> `Number`.</p>
                        <p className="mt-3"><strong>Usage:</strong> The input field accepts a string that can be a literal number (e.g., `'100'`), a reference to an `Number` variable (e.g., `mint_amount`), a state accessor like `MyToken_TotalSupply` or `MyToken_balanceOf(owner_address)`, or a mathematical expression (e.g., `my_var * 2`).</p>
                        <p className="mt-2"><strong>Example:</strong> To mint tokens based on a variable quantity, set the value to `mint_amount` and connect the block to the `quantity` input of a `Mint` block.</p>
                    </>
                )
            },
            {
                name: "Address",
                icon: AtSign,
                color: "text-blue-500",
                content: () => (
                    <>
                        <p className="mb-2"><strong>Purpose:</strong> Provides an address-type value (e.g., `'0x...'`).</p>
                        <p className="mb-2"><strong>Output:</strong> `address`.</p>
                        <p className="mt-3"><strong>Usage:</strong> The input field accepts a string that can be a literal address, a reference to an `Address` variable (e.g., `owner_address`), or a state accessor like `Sender`.</p>
                        <p className="mt-2"><strong>Example:</strong> To transfer tokens to the person who initiated the transaction, set the value to `Sender` and connect it to the `recipient` input of a `Transfer` block.</p>
                    </>
                )
            },
            {
                name: "String",
                icon: Type,
                color: "text-green-500",
                content: () => (
                    <>
                        <p className="mb-2"><strong>Purpose:</strong> Provides a text string.</p>
                        <p className="mb-2"><strong>Output:</strong> `string`.</p>
                        <p className="mt-3"><strong>Usage:</strong> The input field accepts a string that can be a literal (e.g., `'hello world'`) or a reference to a `String` variable.</p>
                        <p className="mt-2"><strong>Example:</strong> If a `Pool` is keyed by a user's nickname, you can use this block to provide the nickname string to the `key` input on a `Deposit` or `Withdraw` block.</p>
                    </>
                )
            },
        ]
    }
];


const sections = [
    {
        title: "Getting Started with the Visual Editor",
        content: () => (
            <div className="space-y-4 text-sm">
                <p>Welcome to the visual editor! This guide will walk you through the user interface and the recommended workflow for creating your models.</p>

                <div>
                    <h4 className="font-semibold mb-2 text-md">User Interface Overview</h4>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>The Canvas:</strong> The main area where you build your logic flows. You can pan by clicking and dragging, and zoom using your mouse wheel.</li>
                        <li><strong>Adding Blocks:</strong> <span className="inline-flex items-center"><MousePointerClick className="w-4 h-4 mr-1" /></span><strong>Right-click</strong> anywhere on the canvas to open a context menu. From here, you can select and add different types of blocks to your model.</li>
                        <li><strong>Managing Model State:</strong> Click the <span className="inline-flex items-center"><Package className="w-4 h-4 mx-1" /></span> button in the top-left corner to open the <strong>Model State Panel</strong>. Here you can define constants, and inputs, and inspect the whole model's state.</li>
                        <li><strong>Exporting:</strong> Click the <span className="inline-flex items-center"><Download className="w-4 h-4 mx-1" /></span> button in the top-right to save your current model as an XML file.</li>
                        <li><strong>Error Checking:</strong> Click the <span className="inline-flex items-center"><AlertCircle className="w-4 h-4 mx-1" /></span> button to check your model for common errors.</li>
                        <li><strong>Documentation:</strong> Click the <span className="inline-flex items-center"><HelpCircle className="w-4 h-4 mx-1" /></span> button to open this help panel at any time.</li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-2 text-md">Recommended Workflow</h4>
                    <p>Follow these steps to efficiently build a model:</p>
                    <ol className="list-decimal pl-5 space-y-2 mt-2">
                        <li>
                            <strong>1. Define Independent Elements:</strong> Start by adding your core, non-flow elements to the canvas. These are found under the <Badge variant="secondary">Independent Elements</Badge> category in the context menu. Define your <strong className="text-primary">Fungible Tokens</strong>, <strong className="text-purple-500">Non-Fungible Tokens</strong>, and <strong className="text-cyan-500">Pools</strong>. This step is crucial as it automatically generates the necessary <strong>State</strong> variables for your model.
                        </li>
                        <li>
                            <strong>2. Set Up Variables and Inputs:</strong> Open the <span className="inline-flex items-center"><Package className="w-4 h-4 mr-1" /></span> <strong>Variables Panel</strong> to define any global constants or inputs your logic will need. For example, you might create a `fee_address` constant or a `user_id` input.
                        </li>
                        <li>
                            <strong>3. Build the Logic Flow:</strong> Add an <strong className="text-primary">Entry</strong> block to begin your flow. Then, add other <Badge variant="secondary">Flow Blocks</Badge> like <strong className="text-primary">Mint</strong>, <strong className="text-primary">If</strong>, or <strong className="text-primary">Transfer</strong>. Connect them by dragging from a source handle (right side of a block) to a target handle (left side).
                        </li>
                        <li>
                            <strong>4. Provide Data with Type Blocks:</strong> Use <Badge variant="secondary">Type Blocks</Badge> (e.g., <strong className="text-red-500">Number</strong>, <strong className="text-blue-500">Address</strong>) to feed data into your flow blocks. In the input field of a Type Block, you can enter a literal value (e.g., `'100'`), reference a variable you created (e.g., `mint_amount`), or access a model state property (e.g., `Sender` or `MyToken_balanceOf(recipient_address)`).
                        </li>
                        <li>
                            <strong>5. Validate Your Model:</strong> Periodically click the <span className="inline-flex items-center"><AlertCircle className="w-4 h-4 mx-1" /></span> <strong>Validate</strong> button to check for errors like unconnected blocks, loops, or missing selections. This helps ensure your model is correct and complete.
                        </li>
                    </ol>
                </div>
            </div>
        ),
    },
    {
        title: "Block Categories",
        content: () => (
            <div className="space-y-4 text-sm">
                <div><Badge variant="outline">Independent Elements</Badge>: Define fundamental entities like tokens (fungible and non-fungible) and pools. They do not belong to a direct logic flow but act as global configurations that generate state variables.</div>
                <div><Badge variant="outline" className="text-blue-500 border-blue-500">Type Blocks</Badge>: Provide dynamic string-based values to other blocks. Their input can be a literal value, a reference to a variable, or an accessor for model state.</div>
                <div><Badge variant="outline" className="text-primary border-primary">Flow Blocks</Badge>: Constitute the main logic. They perform actions such as creating (mint), splitting (split), depositing (deposit), or transferring (transfer) tokens.</div>
            </div>
        )
    },
    {
        title: "Using Variables and State",
        content: () => (
            <div className="space-y-4 text-sm">
                <div>The model's data is managed through two primary concepts: <strong>Variables</strong> (user-defined) and <strong>State</strong> (auto-generated).</div>
                <div className="space-y-2">
                    <div><strong>User-Defined Variables:</strong> Created in the <span className="inline-flex items-center"><Package className="w-4 h-4 mr-1" /></span> panel. They can be:
                        <ul className="list-disc pl-6 mt-1 space-y-1">
                            <li><Badge variant="secondary">Constants</Badge>: Fixed values set at design time (e.g., a fee amount).</li>
                            <li><Badge variant="secondary">Inputs</Badge>: Dynamic values provided at execution time (e.g., a user ID).</li>
                            <li><Badge variant="secondary">Global Variables</Badge>: Variables which value is common for every agent (account) interacting with the token-flow.</li>
                            <li><Badge variant="secondary">Local Variables</Badge>: Variables which value is specific for the account executing it.</li>
                        </ul>
                    </div>
                    <div><strong>State:</strong> Read-only properties that reflect the model's condition. They are generated automatically when you create Independent Elements. Examples include `Sender`, `BlockNumber`, `MyToken_TotalSupply`, `MyToken_balanceOf(address)`, and `MyPool_amount`.</div>
                </div>
                <div>To use any of these, place a <Badge variant="secondary">Type Block</Badge> on the canvas, and enter the name of the variable or state accessor into its input field. This field also supports mathematical expressions (e.g., `my_var + 5`). For state accessors that require parameters (like `balanceOf`), use parentheses: `MyToken_balanceOf(owner_address)`.</div>
            </div>
        ),
    },
    {
        title: "Error Checking",
        content: () => (
            <div className="space-y-4 text-sm">
                <p>The visual editor help you find common errors in your models. Click the <span className="inline-flex items-center"><AlertCircle className="w-4 h-4 mx-1" /></span> <strong>Validate</strong> button in the top-right corner to run the checks.</p>
                <p>The validator will check for the following issues:</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Cyclical Dependencies (Loops):</strong> The validator detects if you have created an infinite loop in your token flow, which is not allowed.</li>
                    <li><strong>Unconnected Handles:</strong> It checks for any input or output handles on your blocks that are not connected to another block. All handles must be connected for the logic to be complete.</li>
                    <li><strong>Unselected Dropdown Options:</strong> The validator ensures that you have made a selection in all required dropdown menus, such as choosing a token in an `Entry` or `Mint` block.</li>
                    <li><strong>Undefined Variable References:</strong> It checks all `Type` blocks to make sure that any referenced variables, inputs, or constants actually exist in the model's variable list.</li>
                </ul>
                <p>If any errors are found, they will be displayed in a list. Clicking an error will (in a future update) highlight the problematic block on the canvas, making it easy to find and fix.</p>
            </div>
        ),
    },
    {
        title: "Detailed Block Descriptions",
        content: () => (
            <div className="space-y-8">
                {blockDescriptions.map(category => (
                    <div key={category.category}>
                        <h4 className="text-md font-semibold mb-3 border-b pb-2">{category.category}</h4>
                        {category.description && <p className="text-sm mb-4">{category.description}</p>}
                        <ul className="space-y-6 list-none pl-0">
                            {category.blocks.map(block => {
                                const Icon = block.icon;
                                return (
                                    <li key={block.name} id={slugify(block.name)} className="flex flex-col space-y-2 scroll-mt-20">
                                        <div className="flex items-start">
                                            <Icon className={`w-5 h-5 mr-3 mt-1 ${block.color} shrink-0`} />
                                            <span className="font-semibold">{block.name}</span>
                                        </div>
                                        <div className="pl-8 text-sm">
                                            {block.content()}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </div>
        )
    },
];


const allSections = [
    {
        title: "Index",
        content: () => (
            <ul className="list-disc pl-5 space-y-2">
                {sections.map(section => (
                    <li key={`index-${section.title}`}>
                        <a href={`#${slugify(section.title)}`} className="text-primary hover:underline font-medium">
                            {section.title}
                        </a>
                        {section.title === "Detailed Block Descriptions" && (
                            <ul className="list-['-_'] pl-5 space-y-1 mt-2">
                                {blockDescriptions.map(category => (
                                    <li key={category.category}>
                                        <span className="font-semibold text-sm">{category.category}</span>
                                        <ul className="list-disc pl-5 space-y-1 mt-1">
                                            {category.blocks.map(block => (
                                                <li key={block.name}>
                                                    <a href={`#${slugify(block.name)}`} className="text-primary hover:underline text-sm">
                                                        {block.name}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        )
    },
    ...sections
];


export default function DocumentationSheet({ open, onOpenChange }: DocumentationSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>TATAMI language Documentation</SheetTitle>
                    <SheetDescription>
                        A complete reference guide to the visual editor and its functionalities.
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-8rem)] pr-4 mt-4">
                    <div className="space-y-8">
                        {allSections.map(section => (
                            <section key={section.title} id={slugify(section.title)}>
                                <h3 className="text-lg font-semibold mb-3 scroll-mt-20 border-b pb-2">{section.title}</h3>
                                <div className="text-sm">{section.content()}</div>
                            </section>
                        ))}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}



