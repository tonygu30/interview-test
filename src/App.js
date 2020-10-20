import React, { useEffect, useState } from "react";
import "./App.scss";
import { CurrentUploadItem } from "./utils/hooks/CurrentUploadItem";
import axios from "axios";
import loading from "./loading.png";

const initRepList = { items: [] };

function App() {
  let timer;

  const [repList, setRepList] = useState(initRepList);
  const [queryParams, setQueryParams] = useState({
    page: 1,
    name: "",
  });
  const [isUpload, getElements] = CurrentUploadItem({});

  useEffect(() => {
    getElements([".repository-container", ".repository-list"]);
  }, []);

  useEffect(() => {
    if (isUpload) {
      getNewSearchItem(queryParams.name, queryParams.page + 1);
    }
  }, [isUpload]);

  const getNewSearchItem = (value, page) => {
    axios
      .get(
        `https://api.github.com/search/repositories?q=${value}+in:name&sort=stars&order=desc&page=${page}`
      )
      .then(function (response) {
        setQueryParams({
          name: value,
          page,
        });
        if (page > 1) {
          setRepList({
            ...response.data,
            items: [...repList.items, ...response.data.items],
          });
          getElements([".repository-container", ".repository-list"]);
        } else {
          document.querySelector(".repository-container").scrollTop = 0;
          setRepList(response.data);
        }
      })
      .catch((error) => {
        if(error.indexOf('403')){
          alert("請求太過頻繁請稍後再試");
        }
      });
  };

  const handleChange = (value) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (value === "") {
        setRepList(initRepList);
        return;
      }
      getNewSearchItem(value, 1);
    }, 1000);
  };

  return (
    <div>
      <div className="input-form">
        <input onChange={(e) => handleChange(e.target.value)} />
      </div>
      <div className="repository-container">
        <ul className="repository-list">
          {repList.items.length > 0 ? (
            repList.items.map((item) => {
              return (
                <li className="repository-item" key={item.id}>
                  <div className="repository-content">
                    <img src="https://fakeimg.pl/35x35/?retina=1&text=User&font=noto" />
                    <p>{item.name}</p>
                    <a
                      rel="noopener noreferrer"
                      target="_blank"
                      href={item.html_url}
                    >
                      Link
                    </a>
                  </div>
                </li>
              );
            })
          ) : (
            <div className="empty-data">目前沒資料請再嘗試</div>
          )}
        </ul>
        {isUpload && <img className="loading" alt="" src={loading} />}
      </div>
    </div>
  );
}

export default App;
