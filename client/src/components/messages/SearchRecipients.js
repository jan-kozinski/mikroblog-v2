import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import useSearch from "../../hooks/useSearch";
import { createUserEndpoint as userEndpoint } from "../../constants/api-endpoints";

function SearchRecipients({ recipientsIds }) {
  const [searchValue, setSearchValue, result] = useSearch({
    url: userEndpoint,
    query: "name",
  });
  const [recipients, setRecipients] = useState([]);
  const [selectedRes, setSelectedRes] = useState(null);
  const loggedUser = useSelector((state) => state.auth.user);
  const fieldRef = useRef(null);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const resultToSelect = useRef(0);
  return (
    <div className="flex m-4 p-2">
      <h4 id="recipients-label" className="mr-4">
        recipients
      </h4>
      <div
        className="w-full p-2 bg-gray-200 rounded-lg flex flex-row overflow-x-auto overflow-y-hidden"
        ref={fieldRef}
      >
        <div className="whitespace-nowrap font-bold text-secondary mr-2">
          {recipients.join(", ")}
        </div>
        <input
          type="text"
          aria-labelledby="recipients-label"
          ref={inputRef}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={controlSearch}
          className="w-128 bg-gray-200 outline-none rounded-lg "
        />

        {result && (
          <ul
            className="font-bold text-secondary absolute border-l border-r bg-white transform translate-y-6 -translate-x-2"
            ref={resultsRef}
            style={{
              width: fieldRef.current.offsetWidth + "px",
            }}
          >
            {result

              .filter(
                (r) =>
                  !recipients.includes(r.name) && r.name !== loggedUser.name
              )
              .map((r) => (
                <li
                  className={`p-2 border-b cursor-pointer hover:bg-gray-300 ${
                    selectedRes && r.name === selectedRes.innerHTML
                      ? "bg-gray-300"
                      : "bg-white"
                  }`}
                  key={r.id}
                  onClick={(e) => {
                    setRecipients([...recipients, r.name]);
                    recipientsIds.current.push(r.id);
                  }}
                  onMouseEnter={(e) => {
                    resultToSelect.current = 0;
                    setSelectedRes(null);
                  }}
                >
                  {r.name}
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );

  function controlSearch(e) {
    switch (e.key) {
      case "Backspace": {
        if (!searchValue && recipients.length) {
          e.preventDefault();
          recipientsIds.current.pop();
          setRecipients(
            recipients.filter((r) => r !== recipients[recipients.length - 1])
          );
        }
        break;
      }
      case "ArrowDown": {
        if (resultsRef.current && resultsRef.current.children) {
          e.preventDefault();
          const { children: results } = resultsRef.current;
          setSelectedRes(results[resultToSelect.current]);
          resultToSelect.current < results.length - 1
            ? resultToSelect.current++
            : (resultToSelect.current = 0);
        }
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        if (resultsRef.current && resultsRef.current.children) {
          const { children: results } = resultsRef.current;
          setSelectedRes(results[resultToSelect.current]);
          resultToSelect.current > 0
            ? resultToSelect.current--
            : (resultToSelect.current = results.length - 1);
        }
        break;
      }
      case "Enter": {
        e.preventDefault();
        if (selectedRes) {
          selectedRes.click();
          setSearchValue("");
        }
        break;
      }
      default: {
        resultToSelect.current = 0;
        setSelectedRes(null);
        break;
      }
    }
  }
}

export default SearchRecipients;
