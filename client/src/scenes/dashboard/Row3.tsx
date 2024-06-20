import BoxHeader from '@/components/BoxHeader';
import DashboardBox from '@/components/DashboardBox';
import FlexBetween from '@/components/FlexBetween';
import {
    useGetKpisQuery,
    useGetProductsQuery,
    useGetTransactionsQuery
} from '@/state/api';
import { Box, Typography, useTheme } from '@mui/material';
import { DataGrid, GridCellParams } from '@mui/x-data-grid';
import { useMemo } from 'react';
import { Cell, Pie, PieChart } from 'recharts';

const Row3 = () => {
    const { palette } = useTheme();
    const pieColors = [palette.primary[800], palette.primary.main];

    const { data: kpiData } = useGetKpisQuery();
    const { data: productData } = useGetProductsQuery();
    const { data: transactionData } = useGetTransactionsQuery();

    const USD_TO_INR_RATE = 83;

    const pieChartData = useMemo(() => {
        if (kpiData) {
            const totalExpenses = kpiData[0].totalExpenses;
            return Object.entries(kpiData[0].expensesByCategory).map(
                ([key, value]) => {
                    return [
                        {
                            name: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
                            value: value,
                        },
                        {
                            name: `${key} of Total`,
                            value: totalExpenses - value,
                        },
                    ];
                }
            );
        }
    }, [kpiData]);

    const productColumns = [
        {
            field: "_id",
            headerName: "id",
            flex: 1,
        },
        {
            field: "expense",
            headerName: "Expense",
            flex: 0.5,
            renderCell: (params: GridCellParams) => `₹${(params.value as number * USD_TO_INR_RATE).toFixed(2)}`,
        },
        {
            field: "price",
            headerName: "Price",
            flex: 0.5,
            renderCell: (params: GridCellParams) => `₹${(params.value as number * USD_TO_INR_RATE).toFixed(2)}`,
        },
    ]

    const transactionColumns = [
        {
            field: "_id",
            headerName: "id",
            flex: 0.80,
        },
        {
            field: "buyer",
            headerName: "Buyer",
            flex: 0.65,
        },
        {
            field: "amount",
            headerName: "Amount",
            flex: 0.40,
            renderCell: (params: GridCellParams) => `₹${((params.value as number) * USD_TO_INR_RATE).toFixed(2)}`,
        },
        {
            field: "productIds",
            headerName: "Count",
            flex: 0.1,
            renderCell: (params: GridCellParams) => (params.value as Array<string>).length,
        },
    ]

    return (
        <>
            <DashboardBox gridArea="g">
                <BoxHeader
                    title='List of products'
                    sideText={`${productData?.length} products`}
                />
                <Box
                    mt="0.5rem"
                    p="0 0.5rem"
                    height="78%"
                    sx={{
                        "& .css-yrdy0g-MuiDataGrid-columnHeaderRow": {
                            background: `#2d2d34 !important`,
                        },
                        "& .MuiDataGrid-root, .MuiButtonBase-root": {
                            color: palette.grey[300],
                            border: `none !important`,
                        },
                        "& .MuiDataGrid-cell": {
                            borderBottom: `1px solid ${palette.grey[800]} !important`,
                            '&:hover': {
                                backgroundColor: "#3c3c44",
                            },
                        },
                        "& .MuiDataGrid-columnHeaders": {
                            borderBottom: `1px solid ${palette.grey[800]} !important`,
                        },
                        "& .MuiDataGrid-columnSeparator": {
                            visibility: "hidden",
                        },
                    }}
                >
                    <DataGrid
                        columnHeaderHeight={25}
                        rowHeight={35}
                        hideFooter={true}
                        rows={productData || []}
                        columns={productColumns}
                    />
                </Box>
            </DashboardBox>

            <DashboardBox gridArea="h">
                <BoxHeader
                    title='Recent Orders'
                    sideText={`${transactionData?.length} latest transactions`}
                />
                <Box
                    mt="1rem"
                    p="0 0.5rem"
                    height="81.3%"
                    sx={{
                        "& .css-yrdy0g-MuiDataGrid-columnHeaderRow": {
                            background: `#2d2d34 !important`,
                        },
                        "& .MuiDataGrid-root, .MuiButtonBase-root": {
                            color: palette.grey[300],
                            border: `none !important`,
                        },
                        "& .MuiDataGrid-cell": {
                            borderBottom: `1px solid ${palette.grey[800]} !important`,
                            '&:hover': {
                                backgroundColor: "#3c3c44",
                            },
                        },
                        "& .MuiDataGrid-columnHeaders": {
                            borderBottom: `1px solid ${palette.grey[800]} !important`,
                        },
                        "& .MuiDataGrid-columnSeparator": {
                            visibility: "hidden",
                        },
                    }}
                >
                    <DataGrid
                        columnHeaderHeight={25}
                        rowHeight={35}
                        hideFooter={true}
                        rows={transactionData || []}
                        columns={transactionColumns}
                    />
                </Box>
            </DashboardBox>

            <DashboardBox gridArea="i"
                sx={{
                    "& .css-1qyot8p": {
                        m: `0.5rem 0rem 0rem 0rem !important`,
                        justifyContent: `space-around !important`
                    }
                }}
            >
                <BoxHeader
                    title="Expense Breakdown By Category"
                    sideText="+4%"
                />
                <FlexBetween
                    mt="0.4rem"
                    textAlign="center"
                >
                    {pieChartData?.map((data, i) => (
                        <Box key={`${data[0].name}-${i}`}>
                            <PieChart
                                width={140}
                                height={85}
                            >
                                <Pie
                                    stroke='none'
                                    data={data}
                                    innerRadius={18}
                                    outerRadius={35}
                                    dataKey="value"
                                >
                                    {data.map((_entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={pieColors[index]}
                                        />
                                    ))}
                                </Pie>
                            </PieChart>
                            <Typography variant='h5'>{data[0].name}</Typography>
                        </Box>
                    ))}
                </FlexBetween>
            </DashboardBox>

            <DashboardBox gridArea="j">
                <BoxHeader
                    title="Overall Summary and Explanation Data"
                    sideText="+15%"
                />
                <Box
                    height="15px"
                    width="93%"
                    margin="1.25rem 1rem 0.4rem 1rem"
                    bgcolor={palette.primary[800]}
                    borderRadius="1rem"
                >
                    <Box
                        height="15px"
                        width="40%"
                        bgcolor={palette.primary[600]}
                        borderRadius="1rem"
                    >
                    </Box>
                    <Typography margin="0.5rem 0.3rem" variant="h6">
                        The progress bar indicates a 15% increase, demonstrating positive growth. The accompanying text describes a detailed summary and explanation of data, highlighting key points and providing insights into the performance metrics.
                    </Typography>
                </Box>
            </DashboardBox>
        </>
    )
}

export default Row3;