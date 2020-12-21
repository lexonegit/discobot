export function GetHMS(ms: number) 
{
    let h : string = Math.floor((ms / (1000 * 60 * 60)) % 24).toString();
    let m : string = Math.floor((ms / (1000 * 60)) % 60).toString();
    let s : string = Math.floor((ms / 1000) % 60).toString();

    return [h, m, s];
}