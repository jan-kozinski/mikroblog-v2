import { useRef, useState } from "react";
import useSearch from "../../hooks/useSearch";
import { createUserEndpoint as userEndpoint } from "../../constants/api-endpoints";

function SearchRecipients() {
  const [searchValue, setSearchValue, result] = useSearch({
    url: userEndpoint,
    query: "name",
  });
  const [recipients, setRecipients] = useState([]);
  const fieldRef = useRef(null);
  const inputRef = useRef(null);
  return (
    <div className="flex m-4 p-2">
      <h4 className="mr-4">recipients</h4>
      <div
        className="w-full p-2 bg-gray-200 rounded-lg flex flex-row overflow-x-auto overflow-y-hidden"
        ref={fieldRef}
      >
        <div className="whitespace-nowrap font-bold text-secondary mr-2">
          {recipients.join(", ")}
        </div>
        <input
          type="text"
          ref={inputRef}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !searchValue && recipients.length)
              setRecipients(
                recipients.filter(
                  (r) => r !== recipients[recipients.length - 1]
                )
              );
          }}
          className="w-128 bg-gray-200 outline-none rounded-lg "
        />

        {result && (
          <ul
            className="font-bold text-secondary absolute border-l border-r bg-white transform translate-y-6 -translate-x-2"
            style={{
              width: fieldRef.current.offsetWidth + "px",
            }}
          >
            {result
              .filter((r) => !recipients.includes(r.name))
              .map((r) => (
                <li
                  className="p-2 border-b cursor-pointer hover:bg-gray-300"
                  key={r.id}
                  onClick={(e) => setRecipients([...recipients, r.name])}
                >
                  {r.name}
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SearchRecipients;
