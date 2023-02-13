const { readdir, open } = require('fs/promises');

function intToHex(int) {
    return "0x" + int.toString(16);
}

(async () => {
    const patchedByte = 0xA;
    const patchedByteBuff = Buffer.from([patchedByte]);

    const files = (await readdir("scripts")).filter(name => name.endsWith(".ysc"));

    await Promise.all(files.map(async file => {
        const path = `scripts/${file}`;
        const handle = await open(path, "r+");

        const { buffer } = await handle.read(Buffer.alloc(1), 0, 1, 4);
        const originalByte = intToHex(buffer[0]);

        await handle.write(patchedByteBuff, 0, 1, 4);

        console.log(`Patched script ${file} ${originalByte} => ${intToHex(patchedByte)}`);
    }));

    console.log(`Patching done. Patched ${files.length} scripts`);
})();
