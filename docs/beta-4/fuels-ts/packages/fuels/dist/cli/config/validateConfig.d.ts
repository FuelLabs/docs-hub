import * as yup from 'yup';
import type { UserFuelsConfig } from '../types';
export declare function validateConfig(config: UserFuelsConfig): Promise<import("yup/lib/object").AssertsShape<{
    workspace: yup.StringSchema<string | undefined, import("yup/lib/types").AnyObject, string | undefined>;
    contracts: import("yup/lib/array").OptionalArraySchema<yup.StringSchema<string | undefined, import("yup/lib/types").AnyObject, string | undefined>, any, (string | undefined)[] | undefined>;
    scripts: import("yup/lib/array").OptionalArraySchema<yup.StringSchema<string | undefined, import("yup/lib/types").AnyObject, string | undefined>, any, (string | undefined)[] | undefined>;
    predicates: import("yup/lib/array").OptionalArraySchema<yup.StringSchema<string | undefined, import("yup/lib/types").AnyObject, string | undefined>, any, (string | undefined)[] | undefined>;
    output: import("yup/lib/string").RequiredStringSchema<string | undefined, import("yup/lib/types").AnyObject>;
}>>;
//# sourceMappingURL=validateConfig.d.ts.map