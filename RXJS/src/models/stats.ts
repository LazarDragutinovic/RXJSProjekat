

interface heroStats {
    carry: number,
    mid: number,
    offlaner: number,
    support: number,
    hardSupport: number
}
export {heroStats}
interface stats {
    radientLabels:string[],
    radientData: heroStats[],
    direLabels: string[],
    direData: heroStats[]
}

type heroStatsKeys = keyof heroStats;

interface heroStatsArrays {
    carry: number[],
    mid: number[],
    offlaner: number[],
    support: number[],
    hardSupport: number[]
}

export {heroStatsArrays}
export default stats;