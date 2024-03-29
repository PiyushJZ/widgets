import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  useEffect(() => {
    const search = async () => {
      const { data } = await axios.get('https://en.wikipedia.org/w/api.php', {
        params: {
          action: 'query',
          list: 'search',
          origin: '*',
          format: 'json',
          srsearch: debouncedTerm,
        },
      });
      setSearchResult(data.query.search);
    };
    if (debouncedTerm) {
      search();
    } else {
      setSearchResult([]);
    }
  }, [debouncedTerm]);

  // // Cannot use async/await function directly as a parameter for the useEffect
  // useEffect(async () => {
  //   await axios.get("")
  // })
  useEffect(() => {
    // // Method - 1
    // const func = async () => {};
    // func();
    //
    // Method - 2 - No performance improvement
    // (async () => {
    //   await axios.get('');
    // })();
  }, [searchTerm]);

  const renderedResults = searchResult.map((result) => {
    return (
      <div
        key={result.pageid}
        className='item'
      >
        <div className='right floated content'>
          <a
            className='ui button'
            href={`https://en.wikipedia.org?curid=${result.pageid}`}
          >
            Go
          </a>
        </div>
        <div className='content'>
          <div className='header'>{result.title}</div>
          <span dangerouslySetInnerHTML={{ __html: result.snippet }}></span>
        </div>
      </div>
    );
  });

  return (
    <div>
      <div className='ui form'>
        <div className='field'>
          <label>Enter Search Term</label>
          <input
            className='input'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className='ui celled list'>{renderedResults}</div>
    </div>
  );
};

export default Search;
