/** Maximum contract size, in bytes. */
export declare const CONTRACT_MAX_SIZE: number;
/** Maximum number of witnesses. */
export declare const MAX_WITNESSES = 16;
/**
 * Gas Price factor this is used to calculate
 * This is used to calculate the gas fee in Native Coins.
 * Ex.: transactionFee = Math.ceil(<gasUsed> / MAX_GAS_PER_TX);
 */
/** Maximum length of script, in instructions. */
export declare const MAX_SCRIPT_LENGTH: number;
/** Maximum length of script data, in bytes. */
export declare const MAX_SCRIPT_DATA_LENGTH: number;
/** Maximum number of static contracts. */
export declare const MAX_STATIC_CONTRACTS = 255;
/** Maximum length of predicate, in instructions. */
export declare const MAX_PREDICATE_LENGTH: number;
/** Maximum length of predicate data, in bytes. */
export declare const MAX_PREDICATE_DATA_LENGTH: number;
export declare const FAILED_REQUIRE_SIGNAL = "0xffffffffffff0000";
export declare const FAILED_TRANSFER_TO_ADDRESS_SIGNAL = "0xffffffffffff0001";
export declare const FAILED_SEND_MESSAGE_SIGNAL = "0xffffffffffff0002";
export declare const FAILED_ASSERT_EQ_SIGNAL = "0xffffffffffff0003";
export declare const FAILED_ASSERT_SIGNAL = "0xffffffffffff0004";
export declare const FAILED_UNKNOWN_SIGNAL = "0x0";
//# sourceMappingURL=configs.d.ts.map