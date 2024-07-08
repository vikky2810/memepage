import React, { useState, useEffect, useCallback, useRef } from 'react';

function MemeList() {
  const [memes, setMemes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastCreated, setLastCreated] = useState(null);
  const loader = useRef(null);

  const fetchMemes = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const url = `https://www.reddit.com/r/ProgrammerHumor/new.json?limit=10${lastCreated ? `&before=t3_${lastCreated}` : ''}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      const data = await response.json();
      const newMemes = data.data.children
        .filter(post => !post.data.over_18 && (post.data.post_hint === 'image' || post.data.post_hint === 'link'))
        .map(post => ({
          id: post.data.id,
          title: post.data.title,
          url: post.data.url,
          author: post.data.author,
          score: post.data.score,
          numComments: post.data.num_comments,
          created: post.data.created_utc
        }));
      
      if (newMemes.length > 0) {
        setMemes(prevMemes => [...prevMemes, ...newMemes]);
        setLastCreated(newMemes[newMemes.length - 1].id);
      }
    } catch (error) {
      setError('An error occurred while fetching programming memes');
    } finally {
      setIsLoading(false);
    }
  }, [lastCreated, isLoading]);

  useEffect(() => {
    fetchMemes();
  }, []);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0
    };

    const observer = new IntersectionObserver(handleObserver, options);
    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, []);

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      fetchMemes();
    }
  }, [fetchMemes]);

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="meme-container">
      <div className="meme-list">
        {memes.map(meme => (
          <div key={meme.id} className="meme-item">
            <div className="meme-content">
              <h2 title={meme.title}>{meme.title}</h2>
              <img src={meme.url} alt={meme.title} />
              <p>Posted by u/{meme.author}</p>
              <p>Score: {meme.score} | Comments: {meme.numComments}</p>
            </div>
          </div>
        ))}
      </div>
      {isLoading && <div className="loading-message">Loading more memes...</div>}
      <div ref={loader} />
    </div>
  );
}

export default MemeList;