import { Box, Typography, useTheme } from "@mui/material";
import FlexBetween from "./FlexBetween";

type Props = {
    title: string;
    sideText: string;
    subtitle?: string;
    icon?: React.ReactNode;
};

const BoxHeader = ({ icon, title, subtitle, sideText }: Props) => {
    const { palette } = useTheme();
    return (
        <FlexBetween color={palette.grey[400]} margin="0.7rem 1rem 0rem 0.7rem">
            <FlexBetween>
                {icon}
                <Box width="100%">
                    <Typography variant="h4" mb="-0.1rem">
                        {title}
                    </Typography>
                    <Typography variant="h6">{subtitle}</Typography>
                </Box>
            </FlexBetween>
            <Typography variant="h5" fontWeight="700" color={palette.secondary.main}>
                {sideText}
            </Typography>
        </FlexBetween>
    )
};

export default BoxHeader;