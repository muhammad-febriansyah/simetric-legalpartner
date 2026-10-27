import { useEffect, useState, type ComponentType } from "react";
import type { ApexAxisChartSeries, ApexNonAxisChartSeries, ApexOptions } from "apexcharts";

type ChartSeries = ApexAxisChartSeries | ApexNonAxisChartSeries;

type ApexChartProps = {
    type: "area" | "donut";
    height: number;
    options: ApexOptions;
    series: ChartSeries;
};

type DashboardChartsProps = {
    activity: {
        labels: string[];
        series: ApexAxisChartSeries;
    };
    composition: {
        labels: string[];
        series: number[];
    };
};

export function ActivityChart({ labels, series }: DashboardChartsProps["activity"]) {
    const Chart = useApexChart();
    const options: ApexOptions = {
        chart: {
            type: "area",
            fontFamily: "inherit",
            foreColor: "#718096",
            toolbar: { show: false },
            zoom: { enabled: false },
            parentHeightOffset: 0,
        },
        colors: ["#2547F9", "#10B981", "#F59E0B"],
        dataLabels: { enabled: false },
        stroke: { curve: "smooth", width: 2.5 },
        fill: {
            type: "gradient",
            gradient: { opacityFrom: 0.2, opacityTo: 0.01, stops: [0, 90, 100] },
        },
        grid: {
            borderColor: "#E8ECF4",
            strokeDashArray: 4,
            padding: { left: 10, right: 12, top: 4, bottom: 0 },
        },
        xaxis: {
            categories: labels,
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            min: 0,
            forceNiceScale: true,
            decimalsInFloat: 0,
            labels: { formatter: (value) => String(Math.round(value)) },
        },
        legend: {
            position: "bottom",
            horizontalAlign: "left",
            fontSize: "12px",
            markers: { size: 5 },
            itemMargin: { horizontal: 14, vertical: 8 },
        },
        tooltip: { shared: true, intersect: false },
        noData: {
            text: "Belum ada aktivitas konten pada periode ini",
            align: "center",
            verticalAlign: "middle",
        },
    };

    return <Chart type="area" height={300} options={options} series={series} />;
}

export function ContentCompositionChart({ labels, series }: DashboardChartsProps["composition"]) {
    const Chart = useApexChart();
    const total = series.reduce((sum, value) => sum + value, 0);
    const options: ApexOptions = {
        chart: {
            type: "donut",
            fontFamily: "inherit",
            foreColor: "#718096",
            toolbar: { show: false },
        },
        labels,
        colors: ["#2547F9", "#0EA5E9", "#8B5CF6", "#10B981", "#F59E0B", "#64748B"],
        dataLabels: { enabled: false },
        stroke: { width: 3, colors: ["#FFFFFF"] },
        legend: {
            position: "bottom",
            horizontalAlign: "center",
            fontSize: "12px",
            markers: { size: 5 },
            itemMargin: { horizontal: 10, vertical: 6 },
        },
        plotOptions: {
            pie: {
                donut: {
                    size: "70%",
                    labels: {
                        show: true,
                        name: { show: true, offsetY: 20, fontSize: "12px" },
                        value: { show: true, offsetY: -8, fontSize: "24px", fontWeight: 600 },
                        total: {
                            show: true,
                            showAlways: true,
                            label: "Total konten",
                            fontSize: "12px",
                            formatter: () => String(total),
                        },
                    },
                },
            },
        },
        responsive: [
            {
                breakpoint: 520,
                options: { chart: { height: 320 }, legend: { itemMargin: { horizontal: 6 } } },
            },
        ],
        noData: { text: "Belum ada konten" },
    };

    return <Chart type="donut" height={320} options={options} series={series} />;
}

function useApexChart(): ComponentType<ApexChartProps> {
    const [Chart, setChart] = useState<ComponentType<ApexChartProps> | null>(null);

    useEffect(() => {
        let isMounted = true;

        void import("react-apexcharts").then(({ default: ApexChart }) => {
            if (isMounted) {
                setChart(() => ApexChart as ComponentType<ApexChartProps>);
            }
        });

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        Chart ?? (() => <div className="h-[300px]" aria-busy="true" aria-label="Memuat grafik" />)
    );
}
