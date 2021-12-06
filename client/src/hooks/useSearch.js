import axios from "axios";
import { useEffect, useRef, useState } from "react";

export default function useSearch({ url, query, options = {} }) {
  const [searchValue, setSearchValue] = useState("");
  const [result, setResult] = useState(null);
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  const isHandlingReq = useRef(false);
  useEffect(() => {
    source.cancel();
    isHandlingReq.current = true;
    const timeout = setTimeout(() => {
      isHandlingReq = false;
    }, 100);
    if (!isHandlingReq) {
      const {
        data: { payload },
      } = await axios.get(`${url}?${query}=${searchValue}`, {
        cancelToken: source.token,
      });
      setResult(payload);
    }
    return () => {
      source.cancel();
      clearTimeout(timeout);
      isHandlingReq.current = false;
    };
  }, [searchValue]);
  return [searchValue, setSearchValue, result];
}
