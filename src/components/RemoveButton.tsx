"use client";
import { IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <Tooltip title="Remove from meal">
      <IconButton onClick={onClick} size="small" color="error" sx={{ ml: 1 }}>
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
