import React, { useEffect } from 'react';
import * as echarts from 'echarts';

type SkillData = {
    name: string;
    mainSkills: string[];
    otherSkills: string[];
};

const data: SkillData[] = [
    { name: "Финансовый аналитик", mainSkills: ["Excel", "SQL", "VBA", "1С"], otherSkills: ["Power BI", "Python"] },
    { name: "Предприниматель", mainSkills: ["1C", "Excel", "Power BI"], otherSkills: ["Google Analytics", "Яндекс Метрика", "Python", "SQL", "Tilda"] },
    { name: "Продуктовый дизайнер", mainSkills: ["Figma", "Sketch", "Illustrator", "Photoshop", "Principle", "Tilda"], otherSkills: ["Shopify", "Protopie", "Cinema 4D"] },
    { name: "Менеджер проекта", mainSkills: ["Visio", "1C", "Google Analytics", "Яндекс Метрика", "Python", "SQL", "Tilda"], otherSkills: ["Figma", "Sketch", "Shopify"] },
    { name: "Финансовый менеджер", mainSkills: ["1C", "Excel", "Power BI"], otherSkills: ["BPMN"] },
    { name: "Руководитель финансового департамента компании", mainSkills: ["Sketch", "Figma"], otherSkills: ["Shopify", "HQL"] },
    { name: "Продуктовый аналитик", mainSkills: ["Google Analytics", "Яндекс Метрика", "SQL", "Power BI", "Python", "Excel"], otherSkills: ["HQL", "Tableau", "R", "Machine learning"] },
    { name: "Руководитель финансового продукта", mainSkills: ["Visio"], otherSkills: ["Python"] },
    { name: "Менеджер по маркетингу", mainSkills: ["Google Analytics", "Яндекс Метрика", "Google Ads", "Ahrefs", "Главред", "My Target"], otherSkills: ["Tilda", "Photoshop", "Xenu", "Python"] },
    { name: "Менеджер по цифровой трансформации", mainSkills: ["Visio", "Google Analytics", "Яндекс Метрика", "Python", "SQL", "Tilda"], otherSkills: ["Figma", "Sketch", "Shopify"] },
];

const SkillGraph: React.FC = () => {
    useEffect(() => {
        const chartDom = document.getElementById('main')!;
        const chart = echarts.init(chartDom);

        const skillsSet = new Set<string>();
        data.forEach(item => {
            item.mainSkills.forEach(skill => skillsSet.add(skill));
            item.otherSkills.forEach(skill => skillsSet.add(skill));
        });
        const skills = Array.from(skillsSet);

        const formatName = (name: string) => {
            return name.replace(/ /g, '\n');
        };

        const innerRadius = 400;
        const outerRadius = 850;

        const innerNodes = data.map((item, index) => {
            const angle = (index / data.length) * 2 * Math.PI;
            const x = innerRadius * Math.cos(angle);
            const y = innerRadius * Math.sin(angle);

            const rad = Math.atan2(y, x);

            let labelPosition: 'top' | 'bottom' | 'left' | 'right';
            if (rad >= -Math.PI / 4 && rad < Math.PI / 4) {
                labelPosition = 'right';
            } else if (rad >= Math.PI / 4 && rad < (3 * Math.PI) / 4) {
                labelPosition = 'bottom';
            } else if (rad >= (3 * Math.PI) / 4 || rad < -(3 * Math.PI) / 4) {
                labelPosition = 'left';
            } else {
                labelPosition = 'top';
            }

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
                },
            };
        });

        const outerNodes = skills.map((skill, index) => {
            const angle = (index / skills.length) * 2 * Math.PI;
            const x = outerRadius * Math.cos(angle);
            const y = outerRadius * Math.sin(angle);

            const rad = Math.atan2(y, x);

            let labelPosition: 'top' | 'bottom' | 'left' | 'right';
            if (rad >= -Math.PI / 4 && rad < Math.PI / 4) {
                labelPosition = 'right';
            } else if (rad >= Math.PI / 4 && rad < (3 * Math.PI) / 4) {
                labelPosition = 'bottom';
            } else if (rad >= (3 * Math.PI) / 4 || rad < -(3 * Math.PI) / 4) {
                labelPosition = 'left';
            } else {
                labelPosition = 'top';
            }

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
                },
            };
        });

        const nodes = [...innerNodes, ...outerNodes];

        const innerCircleLinks = innerNodes.map((node, index) => {
            const source = node.name;
            const target = innerNodes[(index + 1) % innerNodes.length].name;
            return {
                source,
                target,
                lineStyle: {
                    color: 'gray',
                    width: 1,
                    curveness: 0.2,
                },
            };
        });

        const outerCircleLinks = outerNodes.map((node, index) => {
            const source = node.name;
            const target = outerNodes[(index + 1) % outerNodes.length].name;
            return {
                source,
                target,
                lineStyle: {
                    color: 'gray',
                    width: 1,
                },
            };
        });

        const initialLinks = [...innerCircleLinks, ...outerCircleLinks];

        const allLinks: any[] = [];
        data.forEach(item => {
            const formattedName = formatName(item.name);
            item.mainSkills.forEach(skill => {
                const formattedSkill = formatName(skill);
                allLinks.push({ source: formattedName, target: formattedSkill, lineStyle: { color: 'orange', width: 2 } });
            });
            item.otherSkills.forEach(skill => {
                const formattedSkill = formatName(skill);
                allLinks.push({ source: formattedName, target: formattedSkill, lineStyle: { color: 'purple', width: 1.5 } });
            });
        });

        const option = {
            title: {
                text: 'Компетенции и навыки',
                left: 'center'
            },
            tooltip: {},
            series: [
                {
                    type: 'graph',
                    layout: 'none',
                    data: nodes,
                    links: initialLinks,
                    categories: [
                        { name: 'Компетенции' },
                        { name: 'Навыки' }
                    ],
                    roam: true,
                    label: {
                        show: true,
                        distance: 10,
                        formatter: '{b}',
                    },
                    lineStyle: {
                        opacity: 0.8,
                        curveness: 0.2
                    },
                    emphasis: {
                        focus: 'adjacency',
                        lineStyle: { width: 5 }
                    },
                    animationDurationUpdate: 1500,
                    animationEasingUpdate: 'quinticInOut'
                }
            ]
        };

        chart.setOption(option);

        chart.on('click', function (params) {
            if (params.dataType === 'node' && params.data) {
                const selectedNode = params.data.name;
                const relatedLinks = allLinks.filter(link => link.source === selectedNode || link.target === selectedNode);

                const relatedSkills = new Set<string>();
                relatedLinks.forEach(link => {
                    if (link.source === selectedNode) {
                        relatedSkills.add(link.target);
                    } else {
                        relatedSkills.add(link.source);
                    }
                });

                chart.setOption({
                    series: [
                        {
                            data: nodes.map(node => ({
                                ...node,
                                itemStyle: {
                                    color: node.name === selectedNode
                                        ? 'green'
                                        : relatedSkills.has(node.name)
                                            ? '#FF7A00'
                                            : node.itemStyle.color,
                                },
                            })),
                            links: [...initialLinks, ...relatedLinks.map(link => ({
                                ...link,
                                lineStyle: {
                                    color: link.source === selectedNode ? '#FF7A00' : link.lineStyle.color,
                                },
                            }))],
                        },
                    ],
                });
            } else {
                chart.setOption({
                    series: [{ data: nodes, links: initialLinks }]
                });
            }
        });


        return () => {
            chart.dispose();
        };
    }, []);

    return <div id="main" style={{ width: '100%', height: '100vh' }}></div>;
};

export default SkillGraph;
