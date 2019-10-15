/**
 * Created by Riven on 2017/12/6.
 */


const ArgumentType = Scratch.ArgumentType;
const BlockType = Scratch.BlockType;
const formatMessage = Scratch.formatMessage;
const log = Scratch.log;

class DisplayExtension{
    constructor(runtime){
        this.runtime = runtime;
    }
   
    _buildMenuFromArray (ary){
        return ary.map((entry, index) => {
            const obj = {};
            obj.text = entry;
            obj.value = String(entry);
            return obj;
        });
    }

    /**
     * @return {object} This extension's metadata.
     */
    getInfo (){
        return {
            id: 'Display',

            name: formatMessage({
                id: 'Display.categoryName',
                default: 'Display'
            }),
            color1: '#F7C540',
            color2: '#C19932',
            color3: '#C19932',

            blocks: [
                {
                    opcode: 'lcdsetup',
                    blockType: BlockType.COMMAND,

                    text: formatMessage({
                        id: 'display.lcdsetup',
                        default: 'LCD Setup Addr [ADDR]'
                    }),
                    arguments: {
                        ADDR: {
                            type: ArgumentType.STRING,
                            defaultValue: '0x3F'
                        }
                    },
                    func: 'lcdsetup',
                    gen: {
                        arduino: this.lcdSetupGen
                    }
                },
                {
                    opcode: 'lcdprint',
                    blockType: BlockType.COMMAND,

                    text: formatMessage({
                        id: 'display.lcdprint',
                        default: 'LCD Print [LINE]'
                    }),
                    arguments: {
                        LINE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Hello World'
                        }
                    },
                    func: 'lcdprint',
                    gen: {
                        arduino: this.lcdprintGen
                    }
                },
                {
                    opcode: 'lcdbl',
                    blockType: BlockType.COMMAND,

                    text: formatMessage({
                        id: 'display.lcdbl',
                        default: 'LCD Backlight [BL]'
                    }),
                    arguments: {
                        BL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'HIGH',
                            menu: 'onoff'
                        }
                    },
                    func: 'lcdbl',
                    gen: {
                        arduino: this.lcdblGen
                    }
                },
                {
                    opcode: 'lcdcursor',
                    blockType: BlockType.COMMAND,

                    text: formatMessage({
                        id: 'display.lcdcursor',
                        default: 'LCD Cursor Col[COL] Row[ROW]'
                    }),
                    arguments: {
                        COL: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        ROW: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    },
                    func: 'lcdcursor',
                    gen: {
                        arduino: this.lcdcursorGen
                    }
                },
                {
                    opcode: 'lcdclear',
                    blockType: BlockType.COMMAND,

                    text: formatMessage({
                        id: 'display.lcdclear',
                        default: 'LCD Clear'
                    }),
                    func: 'lcdclear',
                    gen: {
                        arduino: this.lcdclearGen
                    }
                },
                '---',
                {
                    opcode: 'rgbsetup',
                    blockType: BlockType.COMMAND,

                    text: formatMessage({
                        id: 'display.rgbsetup',
                        default: 'RGB Setup [PIN] Pixel Num [NUMPIXELS]'
                    }),
                    arguments: {
                        PIN: {
                            type: ArgumentType.STRING,
                            menu: 'digiPin',
                            defaultValue: '4'
                        },
                        NUMPIXELS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 16
                        }
                    },
                    func: 'noop',
                    gen: {
                        arduino: this.rgbsetupGen
                    }
                },
                {
                    opcode: 'rgbshow',
                    blockType: BlockType.COMMAND,

                    text: formatMessage({
                        id: 'display.rgbshow',
                        default: 'RGB Pin [PIN] Pixel [PIX] [COLOR]'
                    }),
                    arguments: {
                        PIN: {
                            type: ArgumentType.STRING,
                            menu: 'digiPin',
                            defaultValue: '4'
                        },
                        PIX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        COLOR: {
                            type: ArgumentType.COLORRGB
                        }
                    },
                    func: 'noop',
                    gen: {
                        arduino: this.rgbshowGen
                    }
                },
                {
                    opcode: 'rgbrefresh',
                    blockType: BlockType.COMMAND,

                    text: formatMessage({
                        id: 'display.rgbrefresh',
                        default: 'RGB [PIN] Refresh'
                    }),
                    arguments: {
                        PIN: {
                            type: ArgumentType.STRING,
                            menu: 'digiPin',
                            defaultValue: '4'
                        }
                    },
                    func: 'noop',
                    gen: {
                        arduino: this.rgbRefreshGen
                    }
                },
                {
                    opcode: 'rgboff',
                    blockType: BlockType.COMMAND,

                    text: formatMessage({
                        id: 'display.rgboff',
                        default: 'RGB Pin [PIN] Off'
                    }),
                    arguments: {
                        PIN: {
                            type: ArgumentType.STRING,
                            menu: 'digiPin',
                            defaultValue: '4'
                        }
                    },
                    func: 'noop',
                    gen: {
                        arduino: this.rgboffGen
                    }
                },
                '---',
                {
                    opcode: 'digitubesetup',
                    blockType: BlockType.COMMAND,

                    text: formatMessage({
                        id: 'display.digitubesetup',
                        default: 'Digital Tube IO [IO] CLK [CLK]'
                    }),
                    arguments: {
                        IO: {
                            type: ArgumentType.STRING,
                            menu: 'digiPin',
                            defaultValue: '7'
                        },
                        CLK: {
                            type: ArgumentType.STRING,
                            menu: 'digiPin',
                            defaultValue: '4'
                        }
                    },
                    func: 'noop',
                    gen: {
                        arduino: this.digitubesetupGen
                    }
                },
                {
                    opcode: 'digitubenumber',
                    blockType: BlockType.COMMAND,

                    text: formatMessage({
                        id: 'display.digitubenumber',
                        default: 'Digital Tube Number [NUM]'
                    }),
                    arguments: {
                        NUM: {
                            type: ArgumentType.STRING,
                            defaultValue: '1234'
                        }
                    },
                    func: 'noop',
                    gen: {
                        arduino: this.digitubenumberGen
                    }
                }
            ],
            menus: {
                digiPin: this._buildMenuFromArray(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13',
                    'A0', 'A1', 'A2', 'A3', 'A4', 'A5']),
                onoff: [{text: 'ON', value: 'HIGH'}, {text: 'OFF', value: 'LOW'}],
                analogPin: this._buildMenuFromArray(['A0', 'A1', 'A2', 'A3', 'A4', 'A5']),
                analogWritePin: this._buildMenuFromArray(['3', '5', '6', '9', '10', '11']),
            }
        };
    }


    noop (){
        return Promise.reject("Unsupport block in online mode")
    }

    lcdsetup (args){
        const addr = parseInt(args.ADDR, 16);
        this.lcd = new five.LCD({
            controller: "PCF8574",
            addr: addr
        });
    }

    lcdSetupGen (gen, block){
        gen.includes_['wire'] = '#include <Wire.h>\n';
        gen.includes_['lcd'] = '#include <LiquidCrystal_I2C.h>\n';
        const addr = gen.valueToCode(block, 'ADDR');
        gen.definitions_['lcd'] = `LiquidCrystal_I2C lcd(${addr}, 16, 2);`;
        return `lcd.begin()`;
    }

    lcdprint (args){
        const line = args.LINE;
        this.lcd && this.lcd.print(line)
    }

    lcdprintGen (gen, block){
        return gen.template2code(block, 'lcd.print');
    }

    lcdbl (args){
        const bl = args.BL === 'HIGH' ? 255 : 0;
        this.lcd && this.lcd.backlight(bl);
    }

    lcdblGen (gen, block){
        return gen.template2code(block, 'lcd.setBacklight');
    }

    lcdcursor (args){
        const col = args.COL;
        const row = args.ROW;
        this.lcd && this.lcd.cursor(row, col);
    }

    lcdcursorGen (gen, block){
        return gen.template2code(block, 'lcd.setCursor');
    }

    lcdclear (args){
        this.lcd && this.lcd.clear();
    }

    lcdclearGen (gen, block){
        return gen.template2code(block, 'lcd.clear');
    }

    rgbsetupGen (gen, block){
        gen.includes_['rgb'] = '#include "Adafruit_NeoPixel.h"';
        const pin = gen.valueToCode(block, 'PIN');
        const num = gen.valueToCode(block, 'NUMPIXELS');

        gen.definitions_['rgb_'+pin] = `Adafruit_NeoPixel neopix_${pin}(${num}, ${pin});`;
        return `neopix_${pin}.begin();`;
    }

    rgbshowGen (gen, block){
        const pin = gen.valueToCode(block, 'PIN');
        const pix = gen.valueToCode(block, 'PIX');
        const color = gen.hexToRgb(gen.valueToCode(block, 'COLOR'));
        if (color){
            return `neopix_${pin}.setPixelColor(${pix}, ${color.r}, ${color.g}, ${color.b})`;
        }
    }

    rgbRefreshGen (gen, block){
        const pin = gen.valueToCode(block, 'PIN');
        return `neopix_${pin}.show()`;
    }

    rgboffGen (gen, block){
        const pin = gen.valueToCode(block, 'PIN');
        return `neopix_${pin}.clear()`;
    }

    digitubesetupGen (gen, block){
        gen.includes_['digitube'] = '#include <TM1637Display.h>';
        const io = gen.valueToCode(block, 'IO');
        const clk = gen.valueToCode(block, 'CLK');
        gen.setupCodes_['digitube_bright'] = `digiTube.setBrightness(0x0f)`;
        gen.definitions_['digitube'] = `TM1637Display digiTube(${clk}, ${io});`;
    }

    digitubenumberGen (gen, block){
        return gen.template2code(block, 'digiTube.showNumberDec');
    }

}

module.exports = DisplayExtension;
