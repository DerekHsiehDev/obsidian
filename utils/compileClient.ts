"use client";

import { BASE_URL } from "@/lib/constants";
import axios, {AxiosError} from "axios";

const codeCompilationClient = async (code: string) => {
  const data = { code };

  try {
    const response = await axios.post(BASE_URL + "/api/compile", data, {
      responseType: "json",
    });

    return { success: true, data: response.data };
  } catch (error) {
    const axiosError = error as AxiosError;
  
    console.error("ERROR:", axiosError);
  
    return {
      success: false,
      error: {
        message: axiosError.message,
        code: axiosError.code,
        statusCode: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        details: axiosError.response?.data
      }
    };
  }
}

export default codeCompilationClient;
