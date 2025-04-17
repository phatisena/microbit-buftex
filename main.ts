
//% color="#7C9BDE" icon="\uf187"
namespace buftex {

    function bitcalc(nv: number, bl: number ) {
        const sv = bl ** 2 * 4, iv = Math.ceil(Math.log(nv) / Math.log(sv))
        return iv 
    }

    /**
     * convert your text to buffer string
     * @param text input to encode
     * @returns after convert your text to buffer string
     */
    //% blockid=buftex_encode
    //% block="get $txtv convert to buffer"
    //% group="main"
    //% weight=10
    export function encode(txtv: string) {
        let numarrv: number[] = []
        for (let i = 0; i < txtv.length; i++) {
            let numv = txtv.charCodeAt(i)
            const bytelen = bitcalc(numv, 8), bytemax = 8 ** 2 * 4
            numarrv.push(bytelen)
            for (let j = 0; j < bytelen; j++) {
                numarrv.push(numv % bytemax)
                numv = Math.floor(numv / bytemax)
            }
        }
        numarrv.push(0)
        return pins.createBufferFromArray(numarrv)
    }

    /**
     * convert your buffer string to text
     * @param your buffer string to decode
     * @returns after convert your buffer to text
     */
    //% blockid=buftex_decode
    //% block="get $bufv convert to string"
    //% bufv.shadow=variables_get bufv.defl=buffer
    //% group="main"
    //% weight=5
    export function decode(bufv: Buffer) {
        let strtxt: string = ""
        let bytelen = bufv[0], bytesum = 0, byteval = 0, bytemax = 8 ** 2 * 4
        for (let i = 1; i < bufv.length; i++) {
            if (bytelen > 0) {
                if (bytesum > 0) byteval += bufv[i] * bytesum
                else byteval += bufv[i]
                bytesum = (bytesum > 0) ? bytesum * bytemax : bytemax
                bytelen--
            } else {
                bytelen = bufv[i]
                bytesum = 0
                strtxt += String.fromCharCode(byteval)
                byteval = 0
            }
        }
        return strtxt
    }
}
