import { type TSESLint, type TSESTree } from "@typescript-eslint/utils";
export type CompatContext = {
    sourceCode: Readonly<TSESLint.SourceCode>;
    getSourceCode: undefined;
    getScope: undefined;
    markVariableAsUsed: undefined;
} | {
    sourceCode?: Readonly<TSESLint.SourceCode>;
    getSourceCode: () => Readonly<TSESLint.SourceCode>;
    getScope: () => TSESLint.Scope.Scope;
    markVariableAsUsed: (name: string) => void;
};
export declare function getSourceCode(context: CompatContext): Readonly<TSESLint.SourceCode>;
export declare function getScope(context: CompatContext, node: TSESTree.Node): TSESLint.Scope.Scope;
export declare function findVariable(context: CompatContext, node: TSESTree.Identifier): TSESLint.Scope.Variable | null;
export declare function markVariableAsUsed(context: CompatContext, name: string, node: TSESTree.Node): void;
