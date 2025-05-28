// screens/AuthScreen.tsx
import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Image, KeyboardAvoidingView,
  Platform, ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors, GlobalStyles } from "../styles/global";
import { Ionicons } from "@expo/vector-icons";
import api from "../util/api";
import { useAuth } from "../context/AuthContext";
import { setAuthToken } from "../util/auth";

const AuthScreen = () => {
  const router = useRouter();
  const { setIsSignedIn } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!email || !password) {
      setError("Email and password are required.");
      return false;
    }
    if (!isLogin && !name) {
      setError("Name is required for signup.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const handleAuth = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const endpoint = isLogin ? "/api/login/" : "/api/signup/";
      const response = await api.post(endpoint, {
        email,
        password,
        ...(isLogin ? {} : { name }),
      });

      if (response.data.success && response.data.token) {
        await setAuthToken(response.data.token); // ✅ Save token
        setIsSignedIn(true);                      // ✅ Update context
        router.replace("/(tabs)");                // ✅ Go to home
      } else {
        setError(response.data.message || "Authentication failed.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[GlobalStyles.container, { backgroundColor: Colors.white }]}
    >
      <View style={styles.header}>
        <Image source={require("../../assets/images/logo.png")} style={styles.logo} />
        <Text style={styles.title}>AASTU GO</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.formTitle}>
          {isLogin ? "Login to your Account" : "Create your Account"}
        </Text>

        {!isLogin && (
          <TextInput
            placeholder="User Name"
            placeholderTextColor={Colors.secondary}
            style={GlobalStyles.input}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        )}

        <TextInput
          placeholder="Email"
          placeholderTextColor={Colors.secondary}
          keyboardType="email-address"
          autoCapitalize="none"
          style={GlobalStyles.input}
          value={email}
          onChangeText={setEmail}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            placeholderTextColor={Colors.secondary}
            secureTextEntry={!showPassword}
            style={GlobalStyles.input}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color={Colors.secondary}
            />
          </TouchableOpacity>
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity
          style={[GlobalStyles.button, styles.authButton]}
          onPress={handleAuth}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={GlobalStyles.buttonText}>
              {isLogin ? "Log in" : "Sign up"}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setError("");
            setIsLogin(!isLogin);
          }}
        >
          <Text style={styles.toggleText}>
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Log in"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.textDark,
  },
  form: {
    width: "80%",
    alignItems: "center",
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textDark,
    marginBottom: 20,
  },
  passwordContainer: {
    position: "relative",
    marginBottom: 15,
    width: "100%",
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 15,
  },
  error: {
    color: Colors.error,
    marginBottom: 15,
    textAlign: "center",
  },
  authButton: {
    backgroundColor: Colors.primary,
    marginTop: 10,
    marginBottom: 20,
  },
  toggleText: {
    color: Colors.secondary,
    textAlign: "center",
  },
});

export default AuthScreen;
