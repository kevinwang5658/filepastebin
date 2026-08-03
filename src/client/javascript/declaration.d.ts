declare module "*.css" {
    const mapping: Record<string, string>;
    export default mapping;
}

declare const __SERVER_URL__: string;
