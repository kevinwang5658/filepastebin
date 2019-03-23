module.exports = { contents: "'use strict';\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar clientsocketmanager_1 = require(\"./clientsocketmanager\");\nvar io = require(\"socket.io-client\");\nvar client = document.getElementById('download');\nvar progress = document.getElementById('progress');\nvar code = document.getElementById('code');\nvar reveal = document.getElementById('reveal');\nvar slide_down = document.getElementById('text-wrapper');\nvar download_speed = document.getElementById('download-speed');\nvar file_name = document.getElementById('file-name');\nvar file_size = document.getElementById('file-size');\nvar ROOM_ID = code.textContent;\nvar FILE_NAME = file_name.textContent;\nvar FILE_SIZE = Number(file_size.textContent);\nvar socket = io.connect();\nvar socketManager = new clientsocketmanager_1.ClientSocketManager(socket, ROOM_ID);\n//******************************\n// Document events\n//******************************\nclient.addEventListener('click', function () {\n    client.disabled = true;\n    client.style.background = \"#62A4F0\";\n    reveal.style.transform = 'translate(0px, 60px';\n    slide_down.style.transform = 'translate(0px, 200px)';\n    setTimeout(function () {\n        reveal.style.visibility = 'visible';\n    }, 750);\n    socketManager.requestDownload();\n});\nsocketManager.onprogresschanged = function (num) {\n    progress.innerText = num.toFixed(2) + \"%\";\n};\n",
dependencies: ["./clientsocketmanager","socket.io-client"],
sourceMap: {},
headerContent: undefined,
mtime: 1553223799160,
devLibsRequired : undefined,
ac : undefined,
_ : {}
}
