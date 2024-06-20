import DashboardBox from "@/components/DashboardBox";
import FlexBetween from "@/components/FlexBetween";
import { useGetKpisQuery } from "@/state/api";
import { useMemo, useState } from "react";
import regression, { DataPoint } from 'regression';
import {
    Box,
    Button,
    Typography,
    useTheme
} from "@mui/material";
import {
    CartesianGrid,
    Label,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip as RechartsTooltip,
} from "recharts";

const Predictions = () => {
    type CustomTooltipProps = {
        payload?: TooltipPayload[];
        label?: string;
    };
    const USD_TO_INR_RATE = 83;

    const { palette } = useTheme();
    const [isPredictions, setIsPredictions] = useState(false);
    const { data: kpiData } = useGetKpisQuery();

    const formattedData = useMemo(() => {
        if (!kpiData) return [];
        const monthData = kpiData[0].monthlyData;

        const formatted: Array<DataPoint> = monthData.map(
            ({ revenue }, i: number) => {
                return [i, revenue];
            }
        );
        const regressionLine = regression.linear(formatted);

        return monthData.map(({ month, revenue }, i: number) => {
            return {
                name: month,
                "Actual Revenue": revenue,
                "Regression Line": regressionLine.points[i][1],
                "Predicted Revenue": regressionLine.predict(i + 12)[1],
            }
        })
    }, [kpiData]);

    const CustomTooltip: React.FC<CustomTooltipProps> = ({ payload, label }) => {
        if (payload && payload.length) {
            const actualRevenue = payload.find(p => p.dataKey === 'Actual Revenue')?.value;
            const regressionLine = payload.find(p => p.dataKey === 'Regression Line')?.value;
            const predictedRevenue = payload.find(p => p.dataKey === 'Predicted Revenue')?.value;

            return (
                <div className="custom-tooltip" style={{ backgroundColor: '#F9F2FF', padding: '8px', borderRadius: "10px", boxShadow: '1px 2px 5px black' }}>
                    <p className="label" style={{ textTransform: 'uppercase', margin: '5px' }}>{label}</p>
                    <div style={{ borderTop: '1.5px solid #000' }}></div>
                    {actualRevenue !== undefined && (
                        <p style={{ color: 'green', margin: '5px' }}>
                            {`Actual Revenue: ₹${(actualRevenue * USD_TO_INR_RATE).toFixed(2)}`}
                        </p>
                    )}
                    {regressionLine !== undefined && (
                        <p style={{ color: 'blue', margin: '5px' }}>
                            {`Regression Line: ₹${(regressionLine * USD_TO_INR_RATE).toFixed(2)}`}
                        </p>
                    )}
                    {predictedRevenue !== undefined && (
                        <p style={{ color: '#FF9D00', margin: '5px' }}>
                            {`Predicted Revenue: ₹${(predictedRevenue * USD_TO_INR_RATE).toFixed(2)}`}
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <DashboardBox
            height="100%"
            width="100%"
            p="1rem"
            overflow="hidden"
        >
            <FlexBetween m="1rem">
                <Box>
                    <Typography variant="h3">Revenue and Predictions</Typography>
                    <Typography variant="h6">
                        Charted revenue and predicted revenue based on a simple linear
                        regression model.
                    </Typography>
                </Box>
                <Button
                    onClick={() => setIsPredictions(!isPredictions)}
                    sx={{
                        color: palette.grey[900],
                        bgcolor: palette.grey[700],
                        boxShadow: "0.1rem 0.1rem 0.2rem rgba(0,0,0,0.4)",
                        fontWeight: "bold",
                        '&:hover': {
                            bgcolor: palette.grey[500],
                            boxShadow: "0.2rem 0.2rem 0.4rem rgba(0,0,0,0.7)",
                        },
                    }}
                >
                    Show Predicted Revenue For Next Year
                </Button>
            </FlexBetween>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={formattedData}
                    margin={{
                        top: 10,
                        right: 25,
                        left: 60,
                        bottom: 80,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke={palette.grey[800]} />
                    <XAxis
                        dataKey="name"
                        tickLine={false}
                        style={{ fontSize: '12px' }}
                        tickFormatter={(tick) => tick.toUpperCase()}
                        axisLine={{ stroke: palette.grey[100] }}
                    >
                        <Label value="Month" offset={-10} position="insideBottom" />
                    </XAxis>
                    <YAxis
                        domain={[12000, 26000]}
                        style={{ fontSize: '12px' }}
                        tickFormatter={(v) => `₹${(v * USD_TO_INR_RATE)}`}
                        axisLine={{ stroke: palette.grey[100] }}
                    >
                        <Label
                            value="Revenue in INR"
                            angle={-90} offset={-35}
                            position="insideLeft"
                        />
                    </YAxis>
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="top" />
                    <Line
                        type="monotone"
                        dataKey="Actual Revenue"
                        stroke={palette.primary.main}
                        strokeWidth={0}
                        dot={{ strokeWidth: 5 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="Regression Line"
                        stroke="#8884d8"
                        dot={false}
                    />
                    {isPredictions && (
                        <Line
                            strokeDasharray="5 5"
                            dataKey="Predicted Revenue"
                            stroke={palette.secondary.main}
                        />
                    )}
                </LineChart>
            </ResponsiveContainer>
        </DashboardBox>
    )
}
export default Predictions;
