"use client";

import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

const ServiceContext = createContext(null);

const AppProvider = ({ children }) => {
  // LMS States
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [studentResult, setStudentResult] = useState([]);

  const BASEURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`;

  const useToken = () => localStorage.getItem("token");

  const register = async (credentials) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${BASEURL}/auth/register`,
        credentials,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(data.message);
      router.push("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const logIn = async (credentials) => {
    try {
      setLoading(true);
      const { data } = await axios.post(`${BASEURL}/auth/login`, credentials, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      toast.success(data.message);
      router.push(`/${data.user.role}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    const token = useToken();

    try {
      setLoading(true);
      const { data } = await axios.get(`${BASEURL}/auth/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      toast.success(data.message);
      router.push("/");
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getAllStudents = async () => {
    const token = useToken();
    try {
      setLoading(true);

      const { data } = await axios.get(`${BASEURL}/students`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStudents(data.students);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStudentsResult = async () => {
    const token = useToken();
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASEURL}/results/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStudentResult(data.results);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getResults = async () => {
    const token = useToken();
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASEURL}/results`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResults(data.results);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createResult = async (result) => {
    const token = useToken();
    try {
      setLoading(true);
      const { data } = await axios.post(`${BASEURL}/results`, result, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setResults([...results, data.result]);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateResult = async (id, result) => {
    const token = useToken();
    try {
      setLoading(true);
      const { data } = await axios.patch(`${BASEURL}/results/${id}`, result, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setResults((prev) =>
        prev.map((item) => (item._id === id ? data.result : item))
      );
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ServiceContext.Provider
      value={{
        logIn,
        logOut,
        loading,
        register,
        results,
        students,
        getResults,
        setStudents,
        studentResult,
        createResult,
        updateResult,
        getAllStudents,
        getStudentsResult,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

// Custom hook
const useStore = () => {
  const service = useContext(ServiceContext);
  if (!service)
    throw new Error("useStore must be used within a ServiceProvider");
  return service;
};

export { useStore };
export default AppProvider;
