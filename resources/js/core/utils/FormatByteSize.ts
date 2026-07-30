const SizeExponents = {
    B: 0,
    KB: 1,
    MB: 2,
    GB: 3,
} as const;

type SizeUnit = keyof typeof SizeExponents;

export function toByteSize(size:number, unit:SizeUnit):number {
    const exponent:number = SizeExponents[unit];
    return size * Math.pow(1024, exponent);
}

export function fromByteSize(size:number, toUnit:SizeUnit):number {
    const exponent:number = SizeExponents[toUnit];
    return (size / Math.pow(1024, exponent));
}

export function formatByteSize(bytes:number, decimals:number = 2):string {

    if(bytes === 0) return 'O B';

    const units = Object.keys(SizeExponents) as SizeUnit[];

    const k = 1024;
    const exponent = Math.floor(Math.log(bytes) / Math.log(k));

    const index = Math.min(exponent, units.length - 1);
    const unit = units[index];

    const value = bytes / Math.pow(k, index);

    return `${parseFloat(value.toFixed(decimals))} ${unit}`;
}


