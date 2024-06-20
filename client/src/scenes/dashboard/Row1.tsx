import BoxHeader from '@/components/BoxHeader';
import DashboardBox from '@/components/DashboardBox';
import { useGetKpisQuery } from '@/state/api';
import { useTheme } from '@mui/material';
import { useMemo } from 'react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    Rectangle,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

const Row1 = () => {
    const { palette } = useTheme();
    const { data } = useGetKpisQuery();

    type CustomTooltipProps = {
        payload?: TooltipPayload[];
        label?: string;
    };

    const revenue = useMemo(() => {
        return (
            data &&
            data[0].monthlyData.map(({ month, revenue }) => {
                return {
                    name: month.substring(0, 3),
                    Revenue: revenue,
                };
            })
        );
    }, [data]);

    const revenueExpense = useMemo(() => {
        return (
            data &&
            data[0].monthlyData.map(({ month, revenue, expenses }) => {
                return {
                    name: month.substring(0, 3),
                    Revenue: revenue,
                    Expenses: expenses,
                };
            })
        );
    }, [data]);

    const revenueProfit = useMemo(() => {
        if (!data) return [];

        return data[0].monthlyData.map(({ month, revenue, expenses }) => ({
            name: month.substring(0, 3),
            Revenue: revenue,
            Expenses: expenses,
            Profit: parseFloat((revenue - expenses).toFixed(2)),
        }));
    }, [data]);

    const CustomTooltip: React.FC<CustomTooltipProps> = ({ payload, label }) => {
        if (payload && payload.length) {
            const revenue = payload.find(p => p.dataKey === 'Revenue')?.value;
            const expenses = payload.find(p => p.dataKey === 'Expenses')?.value;
            const profit = payload.find(p => p.dataKey === 'Profit')?.value;

            return (
                <div className="custom-tooltip" style={{ backgroundColor: '#F9F2FF', padding: '8px', borderRadius: "10px", boxShadow: '1px 2px 5px black' }}>
                    <p className="label" style={{ textTransform: 'uppercase', margin: '5px' }}>{label}</p>
                    <div style={{ borderTop: '1.5px solid #000' }}></div>
                    {revenue !== undefined && (
                        <p style={{ color: 'green', margin: '5px' }}>
                            {`Revenue: ${revenue}`}
                        </p>
                    )}
                    {expenses !== undefined && (
                        <p style={{ color: 'red', margin: '5px' }}>
                            {`Expenses: ${expenses}`}
                        </p>
                    )}
                    {profit !== undefined && (
                        <p style={{ color: 'blue', margin: '5px' }}>
                            {`Profit: ${profit}`}
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <>
            <DashboardBox gridArea="a">
                <BoxHeader
                    title='Revenue and Expenses'
                    subtitle="Top line represents revenue, bottom line represents expenses."
                    sideText='+4%'
                />
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        width={500}
                        height={400}
                        data={revenueExpense}
                        margin={{
                            top: 15,
                            right: 25,
                            left: -10,
                            bottom: 40,
                        }}
                    >
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor={palette.primary.main}
                                    stopOpacity={0.3}
                                />
                                <stop
                                    offset="95%"
                                    stopColor={palette.primary.main}
                                    stopOpacity={0}
                                />
                            </linearGradient>
                            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor={palette.primary.main}
                                    stopOpacity={0.3}
                                />
                                <stop
                                    offset="95%"
                                    stopColor={palette.primary.main}
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            style={{ fontSize: '10px' }}
                            tickFormatter={(tick) => tick.toUpperCase()}
                            axisLine={{ stroke: palette.grey[100] }}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={{ strokeWidth: '0' }}
                            style={{ fontSize: '10px' }}
                            domain={[8000, 23000]}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="Revenue"
                            dot={{ stroke: palette.primary.main, strokeWidth: 2, r: 3 }}
                            stroke={palette.primary.main}
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                        />
                        <Area
                            type="monotone"
                            dataKey="Expenses"
                            dot={{ stroke: palette.primary.main, strokeWidth: 2, r: 3 }}
                            stroke={palette.primary.main}
                            fillOpacity={1}
                            fill="url(#colorExpenses)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </DashboardBox>

            <DashboardBox gridArea="b">
                <BoxHeader
                    title='Profit and Revenue'
                    subtitle="Top line represents revenue, bottom line represents expenses."
                    sideText='+4%'
                />
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={revenueProfit}
                        margin={{
                            top: 15,
                            right: 0,
                            left: -10,
                            bottom: 40,
                        }}
                    >
                        <CartesianGrid vertical={false} stroke={palette.grey[800]} />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            style={{ fontSize: '10px' }}
                            tickFormatter={(tick) => tick.toUpperCase()}
                            axisLine={{ stroke: palette.grey[100] }}
                        />
                        <YAxis
                            yAxisId="left"
                            tickLine={false}
                            axisLine={false}
                            style={{ fontSize: '10px' }}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation='right'
                            tickLine={false}
                            axisLine={false}
                            style={{ fontSize: '10px' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend height={20} wrapperStyle={{ margin: "0 0 10px 0" }} />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="Profit"
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="Revenue"
                            stroke={palette.primary.main}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </DashboardBox >

            <DashboardBox gridArea="c">
                <BoxHeader
                    title='Revenue Month by Month'
                    subtitle="Graph representing the revenue month by month."
                    sideText='+4%'
                />
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        width={500}
                        height={300}
                        data={revenue}
                        margin={{
                            top: 15,
                            right: 25,
                            left: -10,
                            bottom: 40,
                        }}
                    >
                        <defs>
                            <linearGradient id="colorRevenueBar" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor={palette.primary.main}
                                    stopOpacity={1}
                                />
                                <stop
                                    offset="95%"
                                    stopColor={palette.primary.main}
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke={palette.grey[800]} />
                        <XAxis
                            dataKey="name"
                            axisLine={{ stroke: palette.grey[100] }}
                            tickLine={false}
                            style={{ fontSize: '10px' }}
                            tickFormatter={(tick) => tick.toUpperCase()}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            style={{ fontSize: '10px' }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#fff' }} />
                        <Bar dataKey="Revenue" fill="url(#colorRevenueBar)" activeBar={<Rectangle fill="rgba(255, 200, 240)" stroke="black" />} />
                    </BarChart>
                </ResponsiveContainer>
            </DashboardBox>
        </>
    );
}

export default Row1;