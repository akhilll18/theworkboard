// src/pages/LoginPage.tsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  Google as GoogleIcon,
  Apple as AppleIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot Password Dialog
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  // Create Account Dialog
  const [createAccountOpen, setCreateAccountOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [signUpError, setSignUpError] = useState("");
  const [signUpSuccess, setSignUpSuccess] = useState("");
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const navigate = useNavigate();

  const VALID_EMAIL = "akhil.reddy@onasglobal.com";
  const VALID_PASSWORD = "Ashok2909@";

  // Store users in localStorage (simulate database)
  const getUsers = () => {
    const users = localStorage.getItem("users");
    return users ? JSON.parse(users) : [];
  };

  const saveUsers = (users: any[]) => {
    localStorage.setItem("users", JSON.stringify(users));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (isSignIn) {
      // Check in localStorage first
      const users = getUsers();
      const user = users.find((u: any) => u.email === email && u.password === password);

      if (user) {
        setSuccess("✅ Login successful! Redirecting...");
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userName", user.fullName || email);
        setTimeout(() => {
          navigate("/");
        }, 500);
        setLoading(false);
        return;
      }

      if (email === VALID_EMAIL && password === VALID_PASSWORD) {
        setSuccess("✅ Login successful! Redirecting...");
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userName", "Admin User");
        setTimeout(() => {
          navigate("/");
        }, 500);
        setLoading(false);
        return;
      }

      setError("❌ Invalid email or password.");
      setLoading(false);
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = () => {
    setForgotError("");
    setForgotSuccess("");
    setForgotLoading(true);

    setTimeout(() => {
      const users = getUsers();
      const userExists = users.find((u: any) => u.email === forgotEmail);

      if (!forgotEmail) {
        setForgotError("❌ Please enter your email address.");
        setForgotLoading(false);
        return;
      }

      if (!userExists && forgotEmail !== VALID_EMAIL) {
        setForgotError("❌ No account found with this email.");
        setForgotLoading(false);
        return;
      }

      setForgotSuccess(`✅ Password reset link sent to ${forgotEmail}`);
      setForgotLoading(false);

      setTimeout(() => {
        setForgotPasswordOpen(false);
        setForgotEmail("");
        setForgotSuccess("");
        setForgotError("");
      }, 2000);
    }, 1500);
  };

  // Handle Create Account
  const handleCreateAccount = () => {
    setSignUpError("");
    setSignUpSuccess("");
    setSignUpLoading(true);

    if (!newUser.fullName.trim()) {
      setSignUpError("❌ Please enter your full name.");
      setSignUpLoading(false);
      return;
    }

    if (!newUser.email) {
      setSignUpError("❌ Please enter your email.");
      setSignUpLoading(false);
      return;
    }

    if (!newUser.password) {
      setSignUpError("❌ Please enter a password.");
      setSignUpLoading(false);
      return;
    }

    if (newUser.password.length < 6) {
      setSignUpError("❌ Password must be at least 6 characters.");
      setSignUpLoading(false);
      return;
    }

    if (newUser.password !== newUser.confirmPassword) {
      setSignUpError("❌ Passwords do not match.");
      setSignUpLoading(false);
      return;
    }

    const users = getUsers();
    const existingUser = users.find((u: any) => u.email === newUser.email);

    if (existingUser) {
      setSignUpError("❌ An account with this email already exists.");
      setSignUpLoading(false);
      return;
    }

    const newUserData = {
      fullName: newUser.fullName,
      email: newUser.email,
      password: newUser.password,
      createdAt: new Date().toISOString(),
    };

    users.push(newUserData);
    saveUsers(users);

    setSignUpSuccess("✅ Account created successfully!");

    setTimeout(() => {
      setSignUpLoading(false);
      setCreateAccountOpen(false);
      setNewUser({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setSignUpSuccess("");
      setSignUpError("");
      setActiveStep(0);
      setEmail(newUser.email);
      setIsSignIn(true);
      setSuccess("✅ Account created! Please login.");
    }, 1500);
  };

  // Handle social login
  const handleSocialLogin = (provider: string) => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", `user@${provider}.com`);
      localStorage.setItem("userName", `${provider} User`);
      navigate("/");
      setLoading(false);
    }, 1000);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f9fafb 0%, #ffffff 50%, #f3f4f6 100%)",
        padding: "16px",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: "480px" }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: "24px",
            padding: "28px 32px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)",
            border: "1px solid #f3f4f6",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              textAlign: "center",
              color: "#111827",
              marginBottom: "4px",
              fontFamily: "Poppins, sans-serif !important",
            }}
          >
            {isSignIn ? "Sign In" : "Create Account"}
          </Typography>

          <Typography
            sx={{
              textAlign: "center",
              color: "#6b7280",
              marginBottom: "20px",
              fontSize: "15px",
              fontFamily: "Poppins, sans-serif !important",
            }}
          >
            {isSignIn ? "Hey friend, welcome back!" : "Just one more step!"}
          </Typography>

          {error && (
            <Box
              sx={{
                padding: "10px",
                background: "#fef2f2",
                border: "1px solid #fca5a5",
                borderRadius: "12px",
                color: "#dc2626",
                fontSize: "13px",
                textAlign: "center",
                marginBottom: "12px",
                fontFamily: "Poppins, sans-serif !important",
              }}
            >
              {error}
            </Box>
          )}

          {success && (
            <Box
              sx={{
                padding: "10px",
                background: "#f0fdf4",
                border: "1px solid #86efac",
                borderRadius: "12px",
                color: "#16a34a",
                fontSize: "13px",
                textAlign: "center",
                marginBottom: "12px",
                fontFamily: "Poppins, sans-serif !important",
              }}
            >
              {success}
            </Box>
          )}

          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginBottom: "16px",
              }}
            >
              <Button
                variant="outlined"
                fullWidth
                startIcon={<GoogleIcon />}
                onClick={() => handleSocialLogin("google")}
                sx={{
                  padding: "10px 16px",
                  borderRadius: "12px",
                  color: "#374151",
                  fontWeight: 500,
                  fontSize: "14px",
                  borderColor: "#e5e7eb",
                  textTransform: "none",
                  fontFamily: "Poppins, sans-serif !important",
                  "&:hover": {
                    background: "#f9fafb",
                    borderColor: "#e5e7eb",
                  },
                }}
              >
                Continue with Google
              </Button>

              <Button
                variant="outlined"
                fullWidth
                startIcon={<AppleIcon />}
                onClick={() => handleSocialLogin("apple")}
                sx={{
                  padding: "10px 16px",
                  borderRadius: "12px",
                  color: "#374151",
                  fontWeight: 500,
                  fontSize: "14px",
                  borderColor: "#e5e7eb",
                  textTransform: "none",
                  fontFamily: "Poppins, sans-serif !important",
                  "&:hover": {
                    background: "#f9fafb",
                    borderColor: "#e5e7eb",
                  },
                }}
              >
                Continue with Apple
              </Button>
            </Box>

            <Divider sx={{ margin: "16px 0" }}>
              <Typography sx={{ color: "#9ca3af", fontSize: "12px", fontFamily: "Poppins, sans-serif !important" }}>
                OR
              </Typography>
            </Divider>

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              variant="outlined"
              sx={{
                marginBottom: "14px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
                "& .MuiInputLabel-root": {
                  fontFamily: "Poppins, sans-serif !important",
                },
                "& .MuiOutlinedInput-input": {
                  fontFamily: "Poppins, sans-serif !important",
                },
              }}
              required
            />

            {isSignIn && (
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                variant="outlined"
                sx={{
                  marginBottom: "14px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                  "& .MuiInputLabel-root": {
                    fontFamily: "Poppins, sans-serif !important",
                  },
                  "& .MuiOutlinedInput-input": {
                    fontFamily: "Poppins, sans-serif !important",
                  },
                }}
                required
              />
            )}

            {isSignIn && (
              <Box sx={{ textAlign: "right", marginBottom: "14px" }}>
                <Button
                  variant="text"
                  onClick={() => setForgotPasswordOpen(true)}
                  sx={{
                    fontSize: "13px",
                    color: "#3b82f6",
                    textTransform: "none",
                    fontFamily: "Poppins, sans-serif !important",
                    "&:hover": {
                      background: "transparent",
                      textDecoration: "underline",
                    },
                  }}
                >
                  Forgot password?
                </Button>
              </Box>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                padding: "12px",
                background: "#111827",
                borderRadius: "12px",
                fontWeight: 600,
                fontSize: "15px",
                textTransform: "none",
                fontFamily: "Poppins, sans-serif !important",
                boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
                "&:hover": {
                  background: "#111827",
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : (isSignIn ? "Get Sign In Code" : "Create Account")}
            </Button>
          </form>

          <Box
            sx={{
              padding: "12px 0 0 0",
              marginTop: "14px",
              borderTop: "1px solid #f3f4f6",
              textAlign: "center",
              color: "#6b7280",
              fontSize: "13px",
              fontFamily: "Poppins, sans-serif !important",
            }}
          >
            <span>
              {isSignIn ? "Don't have an account?" : "Already have an account?"}
            </span>
            <Button
              variant="text"
              onClick={() => {
                if (!isSignIn) {
                  setIsSignIn(true);
                  setError("");
                  setSuccess("");
                  setEmail("");
                  setPassword("");
                } else {
                  setCreateAccountOpen(true);
                }
              }}
              sx={{
                fontWeight: 600,
                color: "#111827",
                textTransform: "none",
                marginLeft: "4px",
                minWidth: "auto",
                fontFamily: "Poppins, sans-serif !important",
              }}
            >
              {isSignIn ? "Create Account" : "Sign In"}
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Forgot Password Dialog */}
      <Dialog
        open={forgotPasswordOpen}
        onClose={() => {
          setForgotPasswordOpen(false);
          setForgotEmail("");
          setForgotError("");
          setForgotSuccess("");
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 0,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 3,
            pb: 1,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontFamily: "Poppins, sans-serif !important",
            }}
          >
            Reset Password
          </Typography>
          <IconButton
            onClick={() => {
              setForgotPasswordOpen(false);
              setForgotEmail("");
              setForgotError("");
              setForgotSuccess("");
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3, pt: 2 }}>
          <Typography
            sx={{
              color: "#6b7280",
              fontSize: "14px",
              mb: 2,
              fontFamily: "Poppins, sans-serif !important",
            }}
          >
            Enter your email address and we'll send you a link to reset your password.
          </Typography>

          {forgotError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {forgotError}
            </Alert>
          )}

          {forgotSuccess && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
              {forgotSuccess}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            placeholder="Enter your email"
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
              "& .MuiInputLabel-root": {
                fontFamily: "Poppins, sans-serif !important",
              },
              "& .MuiOutlinedInput-input": {
                fontFamily: "Poppins, sans-serif !important",
              },
            }}
            disabled={!!forgotSuccess}
          />
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0, gap: 1 }}>
          <Button
            onClick={() => {
              setForgotPasswordOpen(false);
              setForgotEmail("");
              setForgotError("");
              setForgotSuccess("");
            }}
            sx={{
              fontFamily: "Poppins, sans-serif !important",
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleForgotPassword}
            variant="contained"
            disabled={!forgotEmail || !!forgotSuccess || forgotLoading}
            sx={{
              fontFamily: "Poppins, sans-serif !important",
              textTransform: "none",
              borderRadius: 2,
              px: 4,
              background: "#111827",
              "&:hover": {
                background: "#111827",
              },
            }}
          >
            {forgotLoading ? <CircularProgress size={24} color="inherit" /> : "Send Reset Link"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Account Dialog */}
      <Dialog
        open={createAccountOpen}
        onClose={() => {
          setCreateAccountOpen(false);
          setNewUser({
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
          setSignUpError("");
          setSignUpSuccess("");
          setActiveStep(0);
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 0,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 3,
            pb: 1,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontFamily: "Poppins, sans-serif !important",
            }}
          >
            Create Account
          </Typography>
          <IconButton
            onClick={() => {
              setCreateAccountOpen(false);
              setNewUser({
                fullName: "",
                email: "",
                password: "",
                confirmPassword: "",
              });
              setSignUpError("");
              setSignUpSuccess("");
              setActiveStep(0);
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3, pt: 2 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
            <Step>
              <StepLabel StepIconProps={{ sx: { fontFamily: "Poppins, sans-serif !important" } }}>
                Details
              </StepLabel>
            </Step>
            <Step>
              <StepLabel StepIconProps={{ sx: { fontFamily: "Poppins, sans-serif !important" } }}>
                Password
              </StepLabel>
            </Step>
          </Stepper>

          {signUpError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {signUpError}
            </Alert>
          )}

          {signUpSuccess && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
              {signUpSuccess}
            </Alert>
          )}

          {activeStep === 0 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                fullWidth
                label="Full Name"
                value={newUser.fullName}
                onChange={(e) =>
                  setNewUser({ ...newUser, fullName: e.target.value })
                }
                placeholder="John Doe"
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                  "& .MuiInputLabel-root": {
                    fontFamily: "Poppins, sans-serif !important",
                  },
                  "& .MuiOutlinedInput-input": {
                    fontFamily: "Poppins, sans-serif !important",
                  },
                }}
                disabled={!!signUpSuccess}
              />

              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                placeholder="name@example.com"
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                  "& .MuiInputLabel-root": {
                    fontFamily: "Poppins, sans-serif !important",
                  },
                  "& .MuiOutlinedInput-input": {
                    fontFamily: "Poppins, sans-serif !important",
                  },
                }}
                disabled={!!signUpSuccess}
              />

              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  if (!newUser.fullName.trim() || !newUser.email) {
                    setSignUpError("❌ Please fill in all fields.");
                    return;
                  }
                  setSignUpError("");
                  setActiveStep(1);
                }}
                sx={{
                  padding: "12px",
                  background: "#111827",
                  borderRadius: "12px",
                  fontWeight: 600,
                  textTransform: "none",
                  fontFamily: "Poppins, sans-serif !important",
                  "&:hover": {
                    background: "#111827",
                  },
                }}
                disabled={!!signUpSuccess}
              >
                Next Step
              </Button>
            </Box>
          )}

          {activeStep === 1 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="body2" sx={{ color: "#6b7280", fontFamily: "Poppins, sans-serif !important" }}>
                Create a password for {newUser.email}
              </Typography>

              <TextField
                fullWidth
                label="Password"
                type="password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                placeholder="Minimum 6 characters"
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                  "& .MuiInputLabel-root": {
                    fontFamily: "Poppins, sans-serif !important",
                  },
                  "& .MuiOutlinedInput-input": {
                    fontFamily: "Poppins, sans-serif !important",
                  },
                }}
                disabled={!!signUpSuccess}
              />

              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                value={newUser.confirmPassword}
                onChange={(e) =>
                  setNewUser({ ...newUser, confirmPassword: e.target.value })
                }
                placeholder="Re-enter your password"
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                  "& .MuiInputLabel-root": {
                    fontFamily: "Poppins, sans-serif !important",
                  },
                  "& .MuiOutlinedInput-input": {
                    fontFamily: "Poppins, sans-serif !important",
                  },
                }}
                disabled={!!signUpSuccess}
              />

              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setActiveStep(0);
                    setSignUpError("");
                  }}
                  sx={{
                    flex: 1,
                    borderRadius: "12px",
                    textTransform: "none",
                    fontFamily: "Poppins, sans-serif !important",
                  }}
                  disabled={!!signUpSuccess}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCreateAccount}
                  disabled={signUpLoading || !!signUpSuccess}
                  sx={{
                    flex: 2,
                    padding: "12px",
                    background: "#111827",
                    borderRadius: "12px",
                    fontWeight: 600,
                    textTransform: "none",
                    fontFamily: "Poppins, sans-serif !important",
                    "&:hover": {
                      background: "#111827",
                    },
                  }}
                >
                  {signUpLoading ? <CircularProgress size={24} color="inherit" /> : "Create Account"}
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Login;