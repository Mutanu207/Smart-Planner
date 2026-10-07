"use client";

import Button from "@mui/material/Button";

interface PrimaryButtonProps {
    children: React.ReactNode;
    size?: "small" | "medium" | "large";
    onClick?: () => void;
    disabled?: boolean;
    background?:string;
    color?:string;
}

function PrimaryButton(props: PrimaryButtonProps) {
    return (
        <Button
            variant="contained"
            size={props.size}
            onClick={props.onClick}
            disabled={props.disabled}
            sx={{
                backgroundColor: props.background,
                borderRadius: "10px",
                color:props.color,
                fontWeight: "bold",
                textTransform: "none",
                "&:hover": {
                    backgroundColor: "#4F46E5",
                },
            }}
        >
            {props.children}
        </Button>
    );
}

export default PrimaryButton;