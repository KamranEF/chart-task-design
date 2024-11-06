import { useEffect } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { mockData } from './mockData/mockData'
import { getPositionLabel, createCircleLinks } from './helpers/helpers'

export interface ALLSkills {
    lineStyle: {
        color: string
        width: number
        curveness: number
    }
    source: string
    target: string
}

const SkillGraph  = () => {
     useEffect(() => {
        const chartDom = document.getElementById('main')!;
        const chart = echarts.init(chartDom);

        const skillsSet = new Set<string>();
         mockData.forEach(item => {
            item.mainSkills.forEach(skill => skillsSet.add(skill));
            item.otherSkills.forEach(skill => skillsSet.add(skill));
        });
        const skills = Array.from(skillsSet);

        const formatName = (name: string) => name.replace(/ /g, '\n');

        const innerRadius = 400;
        const outerRadius = 850;


        const innerNodes = mockData.map((item, index) => {
            const angle = (index / mockData.length) * 2 * Math.PI;
            const x = innerRadius * Math.cos(angle);
            const y = innerRadius * Math.sin(angle);
            const labelPosition = getPositionLabel(x, y);

            return {
                name: formatName(item.name),
                originalName: item.name,
                category: 0,
                symbolSize: 24,
                x,
                y,
                itemStyle: { color: '#8c8c8c' },
                label: {
                    position: labelPosition,
                    fontSize: 10,
                    fontWeight: 700,
                    color: '#3A3A3A',
                },
                emphasis: {
                    itemStyle: {
                        borderColor: '#ffffff',
                        borderWidth: 3,
                        color: '#00A372',
                        shadowColor: '#00A372',
                        shadowBlur: 10,
                    }
                },
                select: {
                    itemStyle: {
                        color: '#00A372',
                        borderColor: '#00A372',
                        borderWidth: 2,
                    }
                }
            };
        });



        // Внешние узлы (Навыки)
        const outerNodes = skills.map((skill, index) => {
            const angle = (index / skills.length) * 2 * Math.PI;
            const x = outerRadius * Math.cos(angle);
            const y = outerRadius * Math.sin(angle);
            const labelPosition = getPositionLabel(x, y);

            return {
                name: formatName(skill),
                originalName: skill,
                category: 1,
                symbolSize: 27,
                x,
                y,
                itemStyle: { color: '#FFD4AD' },
                label: {
                    position: labelPosition,
                    fontSize: 10,
                    fontWeight: 700,
                    color: '#ADADAD',
                },
                emphasis: {
                    itemStyle: {
                        borderColor: '#ffffff',
                        borderWidth: 3,
                        color: '#FFD4AD',
                        shadowColor: '#FF7A00',
                        shadowBlur: 10,
                    }
                },
                select: {
                    itemStyle: {
                        color: '#FF7A00',
                        borderColor: '#FF7A00',
                        borderWidth: 2,
                    }
                }
            };
        });


        const nodes = [...innerNodes, ...outerNodes];


        const initialLinks = [
            ...createCircleLinks(innerNodes),
            ...createCircleLinks(outerNodes),
        ];

        const allLinks: ALLSkills[] = [];
         mockData.forEach(item => {
            const formattedName = formatName(item.name);
            item.mainSkills.forEach(skill => {
                const formattedSkill = formatName(skill);
                allLinks.push({ source: formattedName, target: formattedSkill, lineStyle: { color: '#FF7A00', width: 3, curveness: 0.3 } });
            });
            item.otherSkills.forEach(skill => {
                const formattedSkill = formatName(skill);
                allLinks.push({ source: formattedName, target: formattedSkill, lineStyle: { color: '#8F59B9', width: 3, curveness: 0.3 } });
            });
        });

        const option: EChartsOption = {
            title: {  left: 'center', top: '10%', },
            tooltip: { trigger: 'item' },
            grid: {
                left: '5%',
                right: '5%',
                top: '5%',
                bottom: '5%',
                containLabel: true,
            },
            series: [
                {
                    type: 'graph',
                    layout: 'none',
                    data: nodes,
                    links: initialLinks,
                    categories: [{ name: 'Компетенции' }, { name: 'Навыки' }],
                    roam: true,
                    label: {
                        show: true,
                        distance: 10,
                        formatter: '{b}',
                    },
                    lineStyle: { opacity: 0.8, curveness: 0.3 },
                    emphasis: { focus: 'adjacency', lineStyle: { width: 10 } },
                    select: {
                        itemStyle: {
                            color: '#00A372',
                            borderColor: '#00A372',
                            borderWidth: 2,
                        },
                    },
                    selectedMode: 'single',
                }
            ]
        };

        chart.setOption(option);

         chart.on('click', function (params) {
             if (params.dataType === 'node' && params.data) {
                 const selectedNode =params.data;
                 if (typeof selectedNode === 'object' && 'name' in selectedNode && 'category' in selectedNode) {
                     const selectedNodeName = selectedNode.name;
                     const selectedNodeCategory = selectedNode.category;

                     const relatedLinks = allLinks.filter(
                         (link) => link.source === selectedNodeName || link.target === selectedNodeName
                     );

                     const updatedNodes = nodes.map((node) => ({
                         ...node,
                         itemStyle: {...node.itemStyle},
                         label: { ...node.label },
                     }));


                     const selectedNodeToUpdate = updatedNodes.find((node) => node.name === selectedNodeName);
                     if (selectedNodeToUpdate) {
                         if (selectedNodeCategory === 0) {
                             selectedNodeToUpdate.itemStyle.color = '#00A372';
                             selectedNodeToUpdate.label.color = '#3A3A3A';
                         } else if (selectedNodeCategory === 1) {
                             selectedNodeToUpdate.itemStyle.color = '#FF7A00';
                             selectedNodeToUpdate.label.color = '#3A3A3A';
                         }
                     }

                     relatedLinks.forEach((link) => {
                         let connectedNodeName;
                         if (link.source === selectedNodeName) {
                             connectedNodeName = link.target;
                         } else {
                             connectedNodeName = link.source;
                         }

                         const nodeToUpdate = updatedNodes.find((node) => node.name === connectedNodeName);
                         if (nodeToUpdate) {
                             if (nodeToUpdate.category === 0) {
                                 nodeToUpdate.itemStyle.color = '#00A372';
                                 nodeToUpdate.label.color = '#3A3A3A';
                             } else if (nodeToUpdate.category === 1) {
                                 nodeToUpdate.itemStyle.color = '#FF7A00';
                                 nodeToUpdate.label.color = '#3A3A3A';
                             }
                         }
                     });

                     chart.setOption({
                         series: [
                             {
                                 data: updatedNodes,
                                 links: [...initialLinks, ...relatedLinks],
                             },
                         ],
                     });
                 }
             } else {
                 chart.setOption({ series: [{ data: nodes, links: initialLinks }] });
             }
         });



         return () => chart.dispose();
    }, []);

    return <div id="main" style={{ width: '100%', height: '100vh' }}></div>;
};

export default SkillGraph;
