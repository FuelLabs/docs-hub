/**
 * This is the `privateKey` of the `consensus.PoA.signing_key` below.
 * This key is responsible for validating the transactions.
 */
export declare const defaultConsensusKey = "0xa449b1ffee0e2205fa924c6740cc48b3b473aa28587df6dab12abc245d1f5298";
export declare const defaultChainConfig: {
    chain_name: string;
    block_gas_limit: number;
    initial_state: {
        coins: {
            owner: string;
            amount: string;
            asset_id: string;
        }[];
        messages: {
            sender: string;
            recipient: string;
            nonce: string;
            amount: string;
            data: string;
            da_height: string;
        }[];
    };
    consensus_parameters: {
        tx_params: {
            max_inputs: number;
            max_outputs: number;
            max_witnesses: number;
            max_gas_per_tx: number;
            max_size: number;
        };
        predicate_params: {
            max_predicate_length: number;
            max_predicate_data_length: number;
            max_gas_per_predicate: number;
            max_message_data_length: number;
        };
        script_params: {
            max_script_length: number;
            max_script_data_length: number;
        };
        contract_params: {
            contract_max_size: number;
            max_storage_slots: number;
        };
        fee_params: {
            gas_price_factor: number;
            gas_per_byte: number;
        };
    };
    gas_costs: {
        add: number;
        addi: number;
        aloc: number;
        and: number;
        andi: number;
        bal: number;
        bhei: number;
        bhsh: number;
        burn: number;
        cb: number;
        cfei: number;
        cfsi: number;
        croo: number;
        div: number;
        divi: number;
        ecr1: number;
        eck1: number;
        ed19: number;
        eq: number;
        exp: number;
        expi: number;
        flag: number;
        gm: number;
        gt: number;
        gtf: number;
        ji: number;
        jmp: number;
        jne: number;
        jnei: number;
        jnzi: number;
        jmpf: number;
        jmpb: number;
        jnzf: number;
        jnzb: number;
        jnef: number;
        jneb: number;
        lb: number;
        log: number;
        lt: number;
        lw: number;
        mint: number;
        mlog: number;
        modOp: number;
        modi: number;
        moveOp: number;
        movi: number;
        mroo: number;
        mul: number;
        muli: number;
        mldv: number;
        noop: number;
        not: number;
        or: number;
        ori: number;
        poph: number;
        popl: number;
        pshh: number;
        pshl: number;
        ret: number;
        rvrt: number;
        sb: number;
        sll: number;
        slli: number;
        srl: number;
        srli: number;
        srw: number;
        sub: number;
        subi: number;
        sw: number;
        sww: number;
        time: number;
        tr: number;
        tro: number;
        wdcm: number;
        wqcm: number;
        wdop: number;
        wqop: number;
        wdml: number;
        wqml: number;
        wddv: number;
        wqdv: number;
        wdmd: number;
        wqmd: number;
        wdam: number;
        wqam: number;
        wdmm: number;
        wqmm: number;
        xor: number;
        xori: number;
        call: {
            LightOperation: {
                base: number;
                units_per_gas: number;
            };
        };
        ccp: {
            LightOperation: {
                base: number;
                units_per_gas: number;
            };
        };
        csiz: {
            LightOperation: {
                base: number;
                units_per_gas: number;
            };
        };
        k256: {
            LightOperation: {
                base: number;
                units_per_gas: number;
            };
        };
        ldc: {
            LightOperation: {
                base: number;
                units_per_gas: number;
            };
        };
        logd: {
            LightOperation: {
                base: number;
                units_per_gas: number;
            };
        };
        mcl: {
            LightOperation: {
                base: number;
                units_per_gas: number;
            };
        };
        mcli: {
            LightOperation: {
                base: number;
                units_per_gas: number;
            };
        };
        mcp: {
            LightOperation: {
                base: number;
                units_per_gas: number;
            };
        };
        mcpi: {
            LightOperation: {
                base: number;
                units_per_gas: number;
            };
        };
        meq: {
            LightOperation: {
                base: number;
                units_per_gas: number;
            };
        };
        retd: {
            LightOperation: {
                base: number;
                units_per_gas: number;
            };
        };
        s256: {
            LightOperation: {
                base: number;
                units_per_gas: number;
            };
        };
        scwq: {
            LightOperation: {
                base: number;
                units_per_gas: number;
            };
        };
        smo: {
            LightOperation: {
                base: number;
                units_per_gas: number;
            };
        };
        srwq: {
            LightOperation: {
                base: number;
                units_per_gas: number;
            };
        };
        swwq: {
            LightOperation: {
                base: number;
                units_per_gas: number;
            };
        };
        contract_root: {
            LightOperation: {
                base: number;
                units_per_gas: number;
            };
        };
        state_root: {
            LightOperation: {
                base: number;
                units_per_gas: number;
            };
        };
        vm_initialization: {
            HeavyOperation: {
                base: number;
                gas_per_unit: number;
            };
        };
        new_storage_per_byte: number;
    };
    consensus: {
        PoA: {
            signing_key: string;
        };
    };
};
//# sourceMappingURL=defaultChainConfig.d.ts.map