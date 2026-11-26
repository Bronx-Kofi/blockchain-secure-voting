
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Container from "@mui/material/Container";
import Fade from "@mui/material/Fade";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const AuthForm = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    studentId: "",
    mobileNumber: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState("sendCode");

  const [forgotPasswordCode, setForgotPasswordCode] = useState("");
  const [forgotPasswordNewPassword, setForgotPasswordNewPassword] = useState("");
  const [forgotPasswordConfirmNewPassword, setForgotPasswordConfirmNewPassword] = useState("");

  const [showMainPassword, setShowMainPassword] = useState(false);
  const [showMainConfirmPassword, setShowMainConfirmPassword] = useState(false);
  const [showFpNewPass, setShowFpNewPass] = useState(false);
  const [showFpConfirmPass, setShowFpConfirmPass] = useState(false);

  const [startAnimation, setStartAnimation] = useState(false);
  const [demoRole, setDemoRole] = useState("student");

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartAnimation(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  const resetFlows = () => {
    setShowForgotPassword(false);
    setForgotPasswordStep("sendCode");
    setForgotPasswordCode("");
    setForgotPasswordNewPassword("");
    setForgotPasswordConfirmNewPassword("");
    setError("");
    setSuccess("");
  };

  // Frontend-only demo account selection
  const handleQuickDemoLogin = (role) => {
    setDemoRole(role);

    if (role === "student") {
      setFormData((prev) => ({
        ...prev,
        email: "student@rcert.edu",
        password: "password123",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        email: "admin@rcert.edu",
        password: "admin123",
      }));
    }

    setError("");
  };

  // Login navigation - no backend authentication
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (isLogin) {
      if (!formData.email || !formData.password) {
        setError("Please enter email and password.");
        return;
      }

      // Demo navigation only. No credentials are verified.
      if (demoRole === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/vote");
      }

      return;
    }

    // Signup form validation
    const {
      email,
      password,
      confirmPassword,
      name,
      studentId,
      mobileNumber,
    } = formData;

    if (!email || !password || !confirmPassword || !name || !studentId || !mobileNumber) {
      setError("Please fill in all fields for signup.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    // Navigate to the confirmation page with the entered email.
    navigate("/confirm", {
      state: { email },
    });
  };

  const handleShowForgotPassword = (e) => {
    e.preventDefault();
    resetFlows();
    setShowForgotPassword(true);
    setIsLogin(true);

    setFormData((prev) => ({
      ...prev,
      password: "",
    }));
  };

  const handleCancelForgotPassword = () => {
    resetFlows();
    setIsLogin(true);
  };

  // Frontend-only demonstration of the forgot-password screens.
  const handleForgotPasswordSendCode = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email) {
      setError("Please enter your email address.");
      return;
    }

    setForgotPasswordStep("setNewPassword");
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (
      !forgotPasswordCode ||
      !forgotPasswordNewPassword ||
      !forgotPasswordConfirmNewPassword
    ) {
      setError("Please fill in code and new password fields.");
      return;
    }

    if (forgotPasswordNewPassword !== forgotPasswordConfirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (forgotPasswordNewPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setError(
      "Password reset is a frontend demonstration. Backend integration is required to complete this action."
    );
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetFlows();

    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      studentId: "",
      mobileNumber: "",
    });

    setDemoRole("student");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        bgcolor: "grey.100",
        py: { xs: 2, sm: 3, md: 4 },
        px: 2,
        overflow: "hidden",
      }}
    >
      <Fade in={startAnimation} timeout={700}>
        <Container
          component="main"
          id="main-content"
          maxWidth="sm"
          disableGutters
          sx={{ boxSizing: "border-box" }}
        >
          <Paper
            elevation={6}
            role="form"
            aria-label="Authentication form"
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              bgcolor: "background.paper",
              p: { xs: 3, sm: 4, md: 5 },
              borderRadius: "16px",
              boxShadow: "0px 12px 30px rgba(0,0,0,0.15)",
              boxSizing: "border-box",
            }}
          >
            {showForgotPassword ? (
              <Box sx={{ width: "100%", boxSizing: "border-box" }}>
                <Typography
                  variant="h5"
                  component="h1"
                  gutterBottom
                  align="center"
                  sx={{
                    mb: 2.5,
                    fontWeight: "bold",
                    color: theme.palette.text.primary,
                  }}
                >
                  Forgot Password
                </Typography>

                {forgotPasswordStep === "sendCode" ? (
                  <form onSubmit={handleForgotPasswordSendCode}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      align="center"
                      sx={{ mb: 2.5 }}
                    >
                      Enter your email to continue.
                    </Typography>

                    <TextField
                      label="Email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                      required
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />

                    {error && (
                      <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{
                        mt: 3,
                        py: 1.5,
                        textTransform: "none",
                        fontSize: "1rem",
                        fontWeight: "bold",
                      }}
                    >
                      Continue
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleForgotPasswordSubmit}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      align="center"
                      sx={{ mb: 2.5 }}
                    >
                      Enter the verification code and your new password.
                    </Typography>

                    <TextField
                      label="Verification Code"
                      value={forgotPasswordCode}
                      onChange={(e) => setForgotPasswordCode(e.target.value)}
                      fullWidth
                      margin="normal"
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <VpnKeyIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      label="New Password"
                      type={showFpNewPass ? "text" : "password"}
                      value={forgotPasswordNewPassword}
                      onChange={(e) => setForgotPasswordNewPassword(e.target.value)}
                      fullWidth
                      margin="normal"
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowFpNewPass(!showFpNewPass)}
                              edge="end"
                              aria-label="toggle password visibility"
                            >
                              {showFpNewPass ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      label="Confirm New Password"
                      type={showFpConfirmPass ? "text" : "password"}
                      value={forgotPasswordConfirmNewPassword}
                      onChange={(e) => setForgotPasswordConfirmNewPassword(e.target.value)}
                      fullWidth
                      margin="normal"
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowFpConfirmPass(!showFpConfirmPass)}
                              edge="end"
                              aria-label="toggle password visibility"
                            >
                              {showFpConfirmPass ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    {error && (
                      <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{
                        mt: 3,
                        py: 1.5,
                        textTransform: "none",
                        fontSize: "1rem",
                        fontWeight: "bold",
                      }}
                    >
                      Reset Password
                    </Button>
                  </form>
                )}

                <Typography variant="body2" align="center" sx={{ mt: 2.5 }}>
                  <Link
                    component="button"
                    onClick={handleCancelForgotPassword}
                    underline="hover"
                    color="text.secondary"
                  >
                    Back to Login
                  </Link>
                </Typography>
              </Box>
            ) : (
              <form onSubmit={handleSubmit} style={{ width: "100%", boxSizing: "border-box" }}>
                <Typography
                  variant="h5"
                  component="h1"
                  gutterBottom
                  align="center"
                  sx={{
                    mb: isLogin ? 1.5 : 3,
                    fontWeight: "bold",
                    color: theme.palette.text.primary,
                  }}
                >
                  {isLogin ? "Welcome Back!" : "Create Account"}
                </Typography>

                {isLogin && (
                  <Box
                    sx={{
                      mb: 2.5,
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: "rgba(21, 101, 192, 0.06)",
                      border: "1px dashed rgba(21, 101, 192, 0.4)",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        fontWeight: 700,
                        color: "primary.main",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        fontSize: "0.72rem",
                        mb: 1,
                      }}
                    >
                      Quick Demo Access (1-Click Fill)
                    </Typography>

                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1}
                      justifyContent="center"
                    >
                      <Chip
                        icon={<HowToVoteIcon fontSize="small" />}
                        label="Demo Voter (Student)"
                        color="primary"
                        variant="outlined"
                        size="small"
                        onClick={() => handleQuickDemoLogin("student")}
                        sx={{
                          cursor: "pointer",
                          fontWeight: 600,
                          "&:hover": {
                            bgcolor: "primary.light",
                            color: "#fff",
                          },
                        }}
                      />

                      <Chip
                        icon={<AdminPanelSettingsIcon fontSize="small" />}
                        label="Demo Admin"
                        color="secondary"
                        variant="outlined"
                        size="small"
                        onClick={() => handleQuickDemoLogin("admin")}
                        sx={{
                          cursor: "pointer",
                          fontWeight: 600,
                          "&:hover": {
                            bgcolor: "secondary.light",
                            color: "#fff",
                          },
                        }}
                      />
                    </Stack>
                  </Box>
                )}

                {!isLogin && (
                  <>
                    <TextField
                      label="Name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                      required
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutlineIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      label="Student ID"
                      type="text"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                      required
                      variant="outlined"
                      helperText="Enter your official Student ID"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BadgeOutlinedIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      label="Mobile Number"
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                      required
                      variant="outlined"
                      helperText="Include country code if applicable"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneOutlinedIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </>
                )}

                <TextField
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Password"
                  type={showMainPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowMainPassword(!showMainPassword)}
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          {showMainPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {!isLogin && (
                  <TextField
                    label="Confirm Password"
                    type={showMainConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowMainConfirmPassword(!showMainConfirmPassword)
                            }
                            edge="end"
                            aria-label="toggle password visibility"
                          >
                            {showMainConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}

                {error && (
                  <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert severity="success" sx={{ mt: 2, width: "100%" }}>
                    {success}
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    mt: 3,
                    py: 1.5,
                    textTransform: "none",
                    fontSize: "1rem",
                    fontWeight: "bold",
                  }}
                >
                  {isLogin ? "Login" : "Signup"}
                </Button>

                <Typography variant="body2" align="center" sx={{ mt: 2.5 }}>
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}

                  <Link
                    component="button"
                    onClick={toggleMode}
                    sx={{ ml: 0.5, fontWeight: "medium" }}
                    underline="hover"
                  >
                    {isLogin ? "Signup" : "Login"}
                  </Link>
                </Typography>

                {isLogin && (
                  <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                    <Link
                      component="button"
                      onClick={handleShowForgotPassword}
                      underline="hover"
                      color="text.secondary"
                    >
                      Forgot Password?
                    </Link>
                  </Typography>
                )}
              </form>
            )}
          </Paper>
        </Container>
      </Fade>
    </Box>
  );
};

export default AuthForm;
