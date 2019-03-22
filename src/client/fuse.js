const { FuseBox, WebIndexPlugin } = require("fuse-box");
const fuse = FuseBox.init({
    target: "browser@es6",
    homeDir: "../",
    output: "../../dist/client/javascript/$name.js",
});

fuse
    .bundle("host")
    .shim({
        adapter: {
            source: "libs/adapter.js"
        }
    })
    .instructions("> client/javascript/host/host.ts");

fuse
    .bundle("client")
    .shim({
        adapter: {
            source: "libs/adapter.js"
        }
    })
    .instructions("> client/javascript/client/client.ts");

fuse.run();