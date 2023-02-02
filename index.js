const { readFile, readdir, writeFile } = require('fs/promises');

function intToHex(int) {
    return "0x" + int.toString(16)
}

(async() => {
    const patchedByte = 0xA
    const files = (await readdir("scripts")).filter(name => name.endsWith(".ysc"));

    for await ( const file of files ) {
        const path = `scripts/${file}`
        const buf = await readFile(path)

        const originalByte = intToHex(buf[4])
        buf[4] = patchedByte

        await writeFile(path, buf)

        console.log(`Patched script ${file} ${originalByte} => ${intToHex(patchedByte)}`)
    }
})()