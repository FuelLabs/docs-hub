import { Command } from 'commander';
export declare const onPreAction: (command: Command) => void;
export declare const configureCli: () => Command;
export declare const run: (argv: string[]) => Promise<Command>;
//# sourceMappingURL=cli.d.ts.map