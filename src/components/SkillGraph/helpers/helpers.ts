import type { EChartsOption } from "echarts";

interface Node {
    name: string;
    category: number;
    symbolSize: number;
    itemStyle?: EChartsOption
    label?: EChartsOption;
    emphasis?: EChartsOption;
    select?: EChartsOption;
}
export const getPositionLabel = (x: number, y: number): 'top' | 'bottom' | 'left' | 'right' => {
    const rad = Math.atan2(y, x);
    if (rad >= -Math.PI / 4 && rad < Math.PI / 4) return 'right';
    if (rad >= Math.PI / 4 && rad < (3 * Math.PI) / 4) return 'bottom';
    if (rad >= (3 * Math.PI) / 4 || rad < -(3 * Math.PI) / 4) return 'left';
    return 'top';
};


export const createCircleLinks = (nodes: Node[]): { source: string; target: string; lineStyle: { color: string; width: number; curveness: number } }[] => {
    return nodes.map((node, index) => ({
        source: node.name,
        target: nodes[(index + 1) % nodes.length].name,
        lineStyle: { color: 'gray',  width: 3, curveness: 0.1 }
    }));
};
