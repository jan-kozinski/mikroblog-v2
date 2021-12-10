import axios from "axios";
import { useEffect, useRef, useState } from "react";

export default function useSearch({ url, query, options = {} }) {
  const [searchValue, setSearchValue] = useState("");
  const [result, setResult] = useState(null);
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  const isHandlingReq = useRef(false);
  useEffect(() => {
    let timeout;
    const searchApi = async () => {
      if (!searchValue) return setResult(null);
      if (!isHandlingReq.current) {
        const {
          data: { payload },
        } = await axios.get(`${url}?${query}=${searchValue}`, {
          cancelToken: source.token,
        });
        setResult(payload);
      }
      source.cancel();
      isHandlingReq.current = true;
    };

    searchApi();
    return () => {
      source.cancel();
      if (timeout) clearTimeout(timeout);
      isHandlingReq.current = false;
    };
  }, [searchValue]);

  return [searchValue, setSearchValue, result];
}
