import Head from 'next/head';
import axios from 'axios';
import {useEffect, useState, useCallback} from 'react';

// // Store current index of posts
// const [startIndex, setStartIndex] = React.useState(0);

// const LoadMorePosts = () => {
//   // Load 10 more
//   setStartIndex(prev => prev + 10);
// };

// React.useEffect(() => {
//   (async () => {
//     // Add search range to url
//     const url = `?start=${startIndex}&end=${startIndex + 10}`;
//     const posts = await mockApi(url);
//     // Append new posts to end of old ones
//     setPosts(prev => [...prev, ...posts]);
//   })();
// }, [startIndex]); // Run this effect when startIndex changes

/* alternatively use this - https://codesandbox.io/s/52xz76v5wn?file=/src/messagemanager.js */

/**
 * @return {object} JSX
 */
export default function Home() {
  let currentOffset = 0;
  const [listing, setListing] = useState([]);

  // load our data here?
  const loadTenListing = useCallback(() => {
    const tenListing = [];
    axios
      .get(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=${currentOffset}`)
      .then(({data}) => {
        data.results.forEach((p) => tenListing.push(p.name));
        setListing((listing) => [...listing, ...tenListing]);
      });
    currentOffset += 10;
  });

  const handleScroll = useCallback((e) => {
    const scrollHeight = e.target.documentElement.scrollHeight;
    const currentHeight = Math.ceil(
      e.target.documentElement.scrollTop + window.innerHeight,
    );
    if (currentHeight + 1 >= scrollHeight) {
      loadTenListing();
    }
  });

  useEffect(() => {
    loadTenListing();
    window.addEventListener('scroll', handleScroll);
  }, [handleScroll, loadTenListing]);

  return (
    <div
      className="flex
      flex-col items-center
      justify-center min-h-screen py-2
    bg-gray-900 text-gray-200"
    >
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col text-4xl font-bold
        items-center justify-center w-full px-20 text-center">
        {listing.map((p, i) => {
          return (
            <div
              key={i}
              className="border w-80 h-40
                flex justify-around place-items-center"
            >
              <div>{i + 1}.</div>
              <div>{p}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
