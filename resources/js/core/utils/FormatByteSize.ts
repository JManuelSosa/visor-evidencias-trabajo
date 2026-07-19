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
