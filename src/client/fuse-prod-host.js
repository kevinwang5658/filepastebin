const { FuseBox, QuantumPlugin, CSSModulesPlugin, CSSPlugin } = require("fuse-box");
const fuse = FuseBox.init({
    homeDir: "../",
    output: "../../dist/client/javascript/$name.js",
    tsConfig: "./tsconfig.json",
    ensureTsConfig: true,
    useTypescriptCompiler: true,
    plugins: [
        [CSSModulesPlugin(), CSSPlugin()],
        QuantumPlugin({
            bakeApiIntoBundle: true,
            uglify: true,
            treeShake: true
        })
    ]
});

fuse
    .bundle("host")
    .instructions("> client/javascript/host/host.ts");

fuse.run();