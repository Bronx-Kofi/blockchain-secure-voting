
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import HowToVoteIcon from "@mui/icons-material/HowToVote";
import LogoutIcon from "@mui/icons-material/Logout";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import CandidateCard from "./CandidateCard";
import VoteProgressStepper from "./VoteProgressStepper";
import ConfettiCelebration from "./ConfettiCelebration";

// --------------------------------------------------
// Demo candidates
// Replace these with real data when backend is added.
// --------------------------------------------------

const demoCandidates = [
  {
    candidate_id: "president-1",
    name: "John Mensah",
    role: "President",
  },
  {
    candidate_id: "president-2",
    name: "Kwame Asante",
    role: "President",
  },
  {
    candidate_id: "secretary-1",
    name: "Ama Boateng",
    role: "Secretary",
  },
  {
    candidate_id: "secretary-2",
    name: "Akosua Owusu",
    role: "Secretary",
  },
  {
    candidate_id: "treasurer-1",
    name: "Daniel Osei",
    role: "Treasurer",
  },
  {
    candidate_id: "treasurer-2",
    name: "Michael Appiah",
    role: "Treasurer",
  },
  {
    candidate_id: "vice-1",
    name: "Sarah Addo",
    role: "VicePresident",
  },
  {
    candidate_id: "vice-2",
    name: "Emmanuel Kofi",
    role: "VicePresident",
  },
];

// --------------------------------------------------
// Message display component
// --------------------------------------------------

const MessageDisplay = ({
  title,
  message,
  severity = "info",
  showLogout = true,
  icon,
  onLogout,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        textAlign: "center",
        width: "100%",
        maxWidth: "600px",
        mx: "auto",
        borderRadius: 3,
        boxSizing: "border-box",
      }}
    >
      {icon && (
        <Box
          sx={{
            fontSize: { xs: "2.5rem", sm: "3rem" },
            color: `${severity}.main`,
            mb: 1.5,
          }}
        >
          {icon}
        </Box>
      )}

      <Typography
        variant="h5"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 700,
          color:
            severity === "error"
              ? "error.main"
              : severity === "warning"
              ? "warning.main"
              : "primary.main",
          wordBreak: "break-word",
          fontSize: { xs: "1.3rem", sm: "1.75rem" },
        }}
      >
        {title}
      </Typography>

      <Alert
        severity={severity}
        sx={{
          textAlign: "left",
          mb: 3,
          wordBreak: "break-word",
          fontSize: { xs: "0.9rem", sm: "1rem" },
        }}
        icon={false}
      >
        {message}
      </Alert>

      {showLogout && (
        <Button
          variant="contained"
          color="secondary"
          onClick={onLogout}
          startIcon={<LogoutIcon />}
        >
          Logout
        </Button>
      )}
    </Paper>
  </motion.div>
);

// --------------------------------------------------
// Main voting component
// --------------------------------------------------

const VoteForm = ({ studentId = "DEMO-STUDENT-001" }) => {
  const navigate = useNavigate();

  const [allCandidates] = useState(demoCandidates);

  const [selectedCandidates, setSelectedCandidates] = useState({});

  const [voteState, setVoteState] = useState({
    error: null,
    successMessage: null,
    hasVoted: false,
  });

  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Demo election status. No API request is required.
  const [electionSystemStatus] = useState("RUNNING");

  // Group candidates according to their positions.
  const roles = useMemo(
    () => [...new Set(allCandidates.map((candidate) => candidate.role))],
    [allCandidates]
  );

  const candidatesByRole = useMemo(() => {
    const map = {};

    roles.forEach((role) => {
      map[role] = allCandidates.filter(
        (candidate) => candidate.role === role
      );
    });

    return map;
  }, [allCandidates, roles]);

  // Update voting progress.
  useEffect(() => {
    const allSelected =
      roles.length > 0 &&
      roles.every((role) => selectedCandidates[role]);

    const someSelected = Object.keys(selectedCandidates).length > 0;

    if (voteState.hasVoted) {
      setCurrentStep(3);
    } else if (allSelected) {
      setCurrentStep(1);
    } else if (someSelected) {
      setCurrentStep(0);
    } else {
      setCurrentStep(0);
    }
  }, [selectedCandidates, roles, voteState.hasVoted]);

  // Frontend-only logout navigation.
  const handleLogout = useCallback(() => {
    navigate("/auth");
  }, [navigate]);

  // Select a candidate.
  const handleSelectCandidate = useCallback((role, candidateId) => {
    setSelectedCandidates((prev) => ({
      ...prev,
      [role]: candidateId,
    }));

    setVoteState((prev) => ({
      ...prev,
      error: null,
    }));
  }, []);

  // Open vote review dialog.
  const handleInitiateVoteSubmit = useCallback(() => {
    const missingRoles = roles.filter(
      (role) => !selectedCandidates[role]
    );

    if (missingRoles.length > 0) {
      setVoteState((prev) => ({
        ...prev,
        error: `Please select a candidate for: ${missingRoles.join(", ")}.`,
      }));
      return;
    }

    setVoteState((prev) => ({
      ...prev,
      error: null,
    }));

    setCurrentStep(2);
    setOpenReviewDialog(true);
  }, [roles, selectedCandidates]);

  // Confirm demo vote.
  // This does NOT submit anything to a server.
  const handleConfirmVoteSubmit = useCallback(() => {
    setOpenReviewDialog(false);

    setVoteState({
      error: null,
      successMessage:
        "Your demo vote has been recorded successfully. Thank you for participating!",
      hasVoted: true,
    });

    setSelectedCandidates({});
    setCurrentStep(3);
  }, []);

  // Find candidate name using candidate ID.
  const getCandidateNameById = useCallback(
    (id, role) => {
      const list = candidatesByRole[role] || [];

      const candidate = list.find(
        (candidate) => candidate.candidate_id === id
      );

      return candidate ? candidate.name : "N/A";
    },
    [candidatesByRole]
  );

  // Position colors.
  const roleColors = {
    President: {
      main: "#1565C0",
      light: "#E3F2FD",
      dark: "#0D47A1",
    },
    Secretary: {
      main: "#C2185B",
      light: "#FCE4EC",
      dark: "#880E4F",
    },
    Treasurer: {
      main: "#2E7D32",
      light: "#E8F5E9",
      dark: "#1B5E20",
    },
    VicePresident: {
      main: "#ED6C02",
      light: "#FFF3E0",
      dark: "#E65100",
    },
  };

  const getRoleColor = (role) => {
    if (roleColors[role]) {
      return roleColors[role];
    }

    const hash = role
      .split("")
      .reduce((a, c) => a + c.charCodeAt(0), 0);

    const hue = hash % 360;

    return {
      main: `hsl(${hue}, 60%, 45%)`,
      light: `hsl(${hue}, 60%, 92%)`,
      dark: `hsl(${hue}, 60%, 30%)`,
    };
  };

  // --------------------------------------------------
  // Main content
  // --------------------------------------------------

  const renderMainContent = () => {
    if (electionSystemStatus === "RUNNING") {
      return (
        <Container
          component="main"
          maxWidth="md"
          disableGutters
          sx={{ width: "100%" }}
        >
          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              width: "100%",
              maxWidth: "700px",
              mx: "auto",
              borderRadius: 3,
            }}
          >
            {/* Header */}

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <HowToVoteIcon
                  color="primary"
                  sx={{
                    fontSize: { xs: "1.8rem", sm: "2.2rem" },
                    mr: 1,
                  }}
                />

                <Typography
                  variant="h5"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "1.3rem", sm: "1.75rem" },
                  }}
                >
                  Cast Your Votes
                </Typography>
              </Box>

              <Button
                variant="outlined"
                color="secondary"
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
              >
                Logout
              </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Progress Stepper */}

            {!voteState.hasVoted && (
              <VoteProgressStepper currentStep={currentStep} />
            )}

            {/* Student ID */}

            <Typography
              variant="body1"
              gutterBottom
              sx={{
                mb: 3,
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              Student ID: <strong>{studentId}</strong>
            </Typography>

            {/* Vote success message */}

            {voteState.hasVoted && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Alert
                  severity="success"
                  iconMapping={{
                    success: (
                      <CheckCircleOutlineIcon fontSize="inherit" />
                    ),
                  }}
                  sx={{ mb: 3 }}
                >
                  <AlertTitle sx={{ fontWeight: "bold" }}>
                    Vote Confirmed!
                  </AlertTitle>

                  {voteState.successMessage}
                </Alert>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                  sx={{ mb: 2 }}
                >
                  This is a frontend demonstration. No actual vote was
                  submitted.
                </Typography>
              </motion.div>
            )}

            {/* Candidate selection */}

            {!voteState.hasVoted && (
              <Box>
                {roles.map((role) => {
                  const roleCandidates = candidatesByRole[role] || [];
                  const color = getRoleColor(role);

                  if (roleCandidates.length === 0) return null;

                  return (
                    <Box key={role} sx={{ mb: 3 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 2,
                          color: color.main,
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: color.main,
                          }}
                        />

                        {role === "VicePresident"
                          ? "Vice President"
                          : role}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        {roleCandidates.map((candidate) => (
                          <CandidateCard
                            key={candidate.candidate_id}
                            candidate={candidate}
                            role={role}
                            isSelected={
                              selectedCandidates[role] ===
                              candidate.candidate_id
                            }
                            onSelect={() =>
                              handleSelectCandidate(
                                role,
                                candidate.candidate_id
                              )
                            }
                          />
                        ))}
                      </Box>
                    </Box>
                  );
                })}

                {/* Submit button */}

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    onClick={handleInitiateVoteSubmit}
                    disabled={roles.some(
                      (role) => !selectedCandidates[role]
                    )}
                    sx={{
                      mt: 2,
                      py: 1.75,
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      borderRadius: 3,
                      boxShadow: "0 4px 16px rgba(21, 101, 192, 0.3)",
                      "&:hover": {
                        boxShadow: "0 6px 24px rgba(21, 101, 192, 0.4)",
                      },
                    }}
                  >
                    Review & Submit Vote
                  </Button>
                </motion.div>

                {voteState.error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {voteState.error}
                  </Alert>
                )}
              </Box>
            )}
          </Paper>

          {/* Review dialog */}

          <Dialog
            open={openReviewDialog}
            onClose={() => {
              setOpenReviewDialog(false);
              setCurrentStep(1);
            }}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle
              sx={{
                fontWeight: 700,
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Review Your Vote
            </DialogTitle>

            <DialogContent>
              <DialogContentText sx={{ mb: 2 }}>
                Please confirm your selections below. This is a demo
                voting exercise.
              </DialogContentText>

              {roles.map((role) => {
                const color = getRoleColor(role);

                return (
                  <Paper
                    key={role}
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: 2,
                      bgcolor: `${color.main}08`,
                      border: "1px solid",
                      borderColor: `${color.main}20`,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: color.main,
                        fontWeight: 600,
                        mb: 0.5,
                        textTransform: "uppercase",
                        fontSize: "0.75rem",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {role === "VicePresident"
                        ? "Vice President"
                        : role}
                    </Typography>

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: color.dark,
                      }}
                    >
                      {getCandidateNameById(
                        selectedCandidates[role],
                        role
                      )}
                    </Typography>
                  </Paper>
                );
              })}
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <Button
                onClick={() => {
                  setOpenReviewDialog(false);
                  setCurrentStep(1);
                }}
                variant="outlined"
              >
                Go Back
              </Button>

              <Button
                onClick={handleConfirmVoteSubmit}
                variant="contained"
                color="primary"
                autoFocus
              >
                Confirm & Submit
              </Button>
            </DialogActions>
          </Dialog>

          {/* Confetti celebration */}

          <ConfettiCelebration
            active={
              voteState.hasVoted &&
              !!voteState.successMessage
            }
            duration={4000}
          />
        </Container>
      );
    }

    if (electionSystemStatus === "NOT_STARTED") {
      return (
        <MessageDisplay
          title="Voting Not Started"
          message="The election voting period has not yet begun. Please check back later."
          severity="info"
          icon={<InfoOutlinedIcon />}
          onLogout={handleLogout}
        />
      );
    }

    if (electionSystemStatus === "STOPPED") {
      return (
        <MessageDisplay
          title="Voting Closed"
          message="The election period has ended. Results will be announced soon."
          severity="info"
          icon={<InfoOutlinedIcon />}
          onLogout={handleLogout}
        />
      );
    }

    return (
      <MessageDisplay
        title="Election Status"
        message="Please wait or refresh the page for current election details."
        severity="info"
        showLogout={false}
      />
    );
  };

  return (
    <Box
      component="main"
      id="main-content"
      role="main"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        bgcolor: "background.default",
        py: { xs: 2, sm: 3 },
        px: { xs: 1, sm: 1.5 },
        boxSizing: "border-box",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={electionSystemStatus}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {renderMainContent()}
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default VoteForm;
