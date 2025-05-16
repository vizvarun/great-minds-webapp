import { useState } from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

interface StudentFee {
  id: number;
  feeType: string;
  amount: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
  paidOn?: string;
}

interface StudentFeesModalProps {
  open: boolean;
  onClose: () => void;
  student: any;
}

// Mock fee data
const mockFees: StudentFee[] = [
  {
    id: 1,
    feeType: "Tuition Fee",
    amount: 25000,
    dueDate: "2023-07-15",
    status: "paid",
    paidOn: "2023-07-10",
  },
  {
    id: 2,
    feeType: "Library Fee",
    amount: 2000,
    dueDate: "2023-08-15",
    status: "paid",
    paidOn: "2023-08-05",
  },
  {
    id: 3,
    feeType: "Lab Fee",
    amount: 5000,
    dueDate: "2023-09-15",
    status: "pending",
  },
  {
    id: 4,
    feeType: "Sports Fee",
    amount: 1500,
    dueDate: "2023-06-15",
    status: "overdue",
  },
];

const StudentFeesModal = ({
  open,
  onClose,
  student,
}: StudentFeesModalProps) => {
  const [fees] = useState<StudentFee[]>(mockFees);

  // Calculate total fees and paid amount
  const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0);
  const paidFees = fees
    .filter((fee) => fee.status === "paid")
    .reduce((sum, fee) => sum + fee.amount, 0);
  const pendingFees = totalFees - paidFees;

  if (!student) {
    return null;
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="student-fees-modal"
      BackdropProps={{
        sx: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
      }}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: 800,
          maxWidth: "95%",
          maxHeight: "95%",
          overflow: "auto",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 0,
          outline: "none",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "primary.light",
            color: "white",
          }}
        >
          <Box>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
              Fee Details
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 0.5, opacity: 0.9 }}>
              {student.enrollmentNo} - {student.firstName} {student.lastName}
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              color: "white",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Fee summary section */}
        <Box sx={{ p: 3, bgcolor: "background.default" }}>
          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexWrap: "wrap",
            }}
          >
            <Box
              sx={{
                flex: 1,
                minWidth: "180px",
                p: 2,
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Total Fees
              </Typography>
              <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>
                ₹{totalFees.toLocaleString()}
              </Typography>
            </Box>

            <Box
              sx={{
                flex: 1,
                minWidth: "180px",
                p: 2,
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Paid Amount
              </Typography>
              <Typography
                variant="h6"
                sx={{ mt: 1, fontWeight: 600, color: "success.main" }}
              >
                ₹{paidFees.toLocaleString()}
              </Typography>
            </Box>

            <Box
              sx={{
                flex: 1,
                minWidth: "180px",
                p: 2,
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Pending Amount
              </Typography>
              <Typography
                variant="h6"
                sx={{ mt: 1, fontWeight: 600, color: "warning.main" }}
              >
                ₹{pendingFees.toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider />

        {/* Fee details table */}
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6">Payment History</Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<FileDownloadIcon />}
              sx={{
                textTransform: "none",
                borderRadius: 0.5,
                outline: "none",
                transition: "none",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              Download Statement
            </Button>
          </Box>

          <TableContainer
            component={Paper}
            elevation={0}
            variant="outlined"
            sx={{ borderRadius: 1 }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "grey.50" }}>
                  <TableCell sx={{ fontWeight: 600 }}>Fee Type</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Amount
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Paid On</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fees.map((fee) => (
                  <TableRow
                    key={fee.id}
                    hover
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.02)",
                      },
                      transition: "none",
                    }}
                  >
                    <TableCell>{fee.feeType}</TableCell>
                    <TableCell align="right">
                      ₹{fee.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {new Date(fee.dueDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={fee.status}
                        size="small"
                        sx={{
                          bgcolor:
                            fee.status === "paid"
                              ? "success.100"
                              : fee.status === "pending"
                              ? "warning.100"
                              : "error.100",
                          color:
                            fee.status === "paid"
                              ? "success.800"
                              : fee.status === "pending"
                              ? "warning.800"
                              : "error.800",
                          fontWeight: 500,
                          textTransform: "capitalize",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {fee.paidOn
                        ? new Date(fee.paidOn).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))}
                {fees.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      No fee records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>
    </Modal>
  );
};

export default StudentFeesModal;
