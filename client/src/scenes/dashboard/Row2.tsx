import BoxHeader from '@/components/BoxHeader';
import DashboardBox from '@/components/DashboardBox';
import FlexBetween from '@/components/FlexBetween';
import { useGetKpisQuery, useGetProductsQuery } from '@/state/api';
import { Box, Typography, useTheme } from '@mui/material';
import { useMemo } from 'react';
import {
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Scatter,
    ScatterChart,
    Tooltip,
    XAxis,
    YAxis,
    ZAxis
}
    from 'recharts';

const pieData = [
    { name: "Group A", value: 600 },
    { name: "Group B", value: 400 },
]
const Row2 = () => {
    type CustomTooltipProps = {
        payload?: TooltipPayload[];
        label?: string;
    };
    const USD_TO_INR_RATE = 83;

    const { palette } = useTheme();
    const pieColors = [palette.primary[800], palette.primary.main]
    const { data: operationalData } = useGetKpisQuery();
    const { data: productData } = useGetProductsQuery();

    const operationalExpenses = useMemo(() => {
        return (
            operationalData &&
            operationalData[0].monthlyData.map(({ month, operationalExpenses, nonOperationalExpenses }) => {
                return {
                    name: month.substring(0, 3),
                    "Operational Expenses": operationalExpenses,
                    "Non Operational Expenses": nonOperationalExpenses,
                };
            })
        );
    }, [operationalData]);

    const productExpenseData = useMemo(() => {
        return (
            productData &&
            productData.map(({ _id, price, expense }) => {
                return {
                    id: _id,
                    price: price,
                    expense: expense,
                };
            })
        );
    }, [productData]);

    const CustomTooltip: React.FC<CustomTooltipProps> = ({ payload, label }) => {
        if (payload && payload.length) {
            const operationalValue = payload.find(p => p.dataKey === 'Operational Expenses')?.value;
            const nonOperationalValue = payload.find(p => p.dataKey === 'Non Operational Expenses')?.value;
            const price = payload.find(p => p.dataKey === 'price')?.value;
            const expense = payload.find(p => p.dataKey === 'expense')?.value;

            return (
                <div className="custom-tooltip" style={{ backgroundColor: '#F9F2FF', padding: '8px', borderRadius: "10px", boxShadow: '1px 2px 5px black' }}>
                    <p className="label" style={{ textTransform: 'uppercase', margin: '5px' }}>{label}</p>
                    <div style={{ borderTop: '1.5px solid #000' }}></div>
                    {operationalValue !== undefined && (
                        <p style={{ color: 'green', margin: '5px' }}>
                            {`Op Exp: ${operationalValue}`}
                        </p>
                    )}
                    {nonOperationalValue !== undefined && (
                        <p style={{ color: 'red', margin: '5px' }}>
                            {`Non Op Exp: ${nonOperationalValue}`}
                        </p>
                    )}
                    {price !== undefined && (
                        <p style={{ color: 'green', margin: '5px' }}>
                            {`Price: ₹${(price * USD_TO_INR_RATE).toFixed(2)}`}
                        </p>
                    )}
                    {expense !== undefined && (
                        <p style={{ color: 'red', margin: '5px' }}>
                            {`Expense: ₹${(expense * USD_TO_INR_RATE).toFixed(2)}`}
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <>
            <DashboardBox gridArea="d">
                <BoxHeader
                    title='Operational vs Non-Operational Expenses'
                    sideText='+4%'
                />
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={operationalExpenses}
                        margin={{
                            top: 15,
                            right: 0,
                            left: -10,
                            bottom: 24,
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
                            orientation='left'
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
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="Non Operational Expenses"
                            stroke={palette.tertiary[500]}
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="Operational Expenses"
                            stroke={palette.primary.main}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </DashboardBox>

            <DashboardBox gridArea="e">
                <BoxHeader
                    title='Campaigns and Targets'
                    sideText='+4%'
                />
                <FlexBetween mt="0.55rem" gap="1.5rem" pr="1rem">
                    <PieChart
                        width={110}
                        height={100}
                        margin={{
                            top: 0,
                            right: -10,
                            left: 10,
                            bottom: 0,
                        }}
                    >
                        <Pie
                            data={pieData}
                            innerRadius={18}
                            outerRadius={38}
                            dataKey="value"
                            stroke='none'
                        >
                            {pieData.map((_entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={pieColors[index]}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                    <Box ml="-0.7rem" flexBasis="40%" textAlign="center">
                        <Typography variant='h5'>Target Sales</Typography>
                        <Typography m="0.3rem 0.25rem" variant='h3' color={palette.primary.main}>83</Typography>
                        <Typography variant='h6'>
                            Finance goals of the campaign that is desired.
                        </Typography>
                    </Box>
                    <Box flexBasis="40%">
                        <Typography variant='h5'>Losses in Revenue</Typography>
                        <Typography variant='h6'>Losses are down by 25%</Typography>
                        <Typography mt="0.4rem" variant='h5'>
                            Profit Margins
                        </Typography>
                        <Typography variant='h6'>
                            Margins are up by 30% from last month.
                        </Typography>
                    </Box>
                </FlexBetween>
            </DashboardBox>

            <DashboardBox gridArea="f">
                <BoxHeader
                    title='Product Prices and Expenses'
                    sideText='+4%'
                />
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                        margin={{
                            top: 20,
                            right: 35,
                            left: -16,
                            bottom: 32,
                        }}
                    >
                        <CartesianGrid stroke={palette.grey[800]} />
                        <XAxis
                            type="number"
                            dataKey="price"
                            name="price"
                            axisLine={false}
                            tickLine={false}
                            style={{ fontSize: '10px' }}
                            tickFormatter={(v) => `₹${(v * USD_TO_INR_RATE)}`}
                        />
                        <YAxis
                            type="number"
                            dataKey="expense"
                            name="expense"
                            axisLine={false}
                            tickLine={false}
                            style={{ fontSize: '10px' }}
                            tickFormatter={(v) => `₹${(v * USD_TO_INR_RATE)}`}
                        />
                        <ZAxis type="number" range={[20]} />
                        <Tooltip content={<CustomTooltip />} />
                        <Scatter
                            name="Product Expense Ratio"
                            data={productExpenseData}
                            fill={palette.tertiary[500]}
                        />
                    </ScatterChart>
                </ResponsiveContainer>
            </DashboardBox>
        </>
    )
}

export default Row2;