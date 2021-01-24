import React, { useEffect, useState } from 'react';
import './App.css';
import { ACCESS_KEY } from './config';
import InfiniteScroll from 'react-infinite-scroll-component';
import RequestLoading from './Loader';
import Loader from 'react-loader-spinner';

export default function App() {
    const [images, setImages] = useState([]);
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPhotos();
    }, [page]);

    if (!ACCESS_KEY)
        return (
            <a href="https://unsplash.com/developers" className="error">
                Required: Get Your Unsplash Access Key
            </a>
        );

    const getPhotos = async () => {
        let apiURL = `https://api.unsplash.com/photos?`;
        if (query)
            apiURL = `https://api.unsplash.com/search/photos?query=${query}`;
        apiURL += `&page=${page}`;
        apiURL += `&client_id=${ACCESS_KEY}`;

        const res = await (await fetch(apiURL)).json();
        const imagesFromAPI = res.results ?? res;

        // if page is 1, then return a whole new array of images
        // otherwise only append the results to the images array
        if (page === 1) {
            setImages([]);
            setImages(imagesFromAPI);
        } else setImages(images => [...images, ...imagesFromAPI]);

        setLoading(false);
    };

    const handleFormSubmit = async e => {
        e.preventDefault();
        await setLoading(true);
        await setPage(1);
        getPhotos().then().catch();
    };

    return (
        <div className="app">
            <h1>Welcome To infinit-im!</h1>
            <form onSubmit={handleFormSubmit}>
                <input
                    type="text"
                    placeholder="Search Unsplash..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                />
                <button>Search</button>
            </form>

            {loading ? (
                <RequestLoading />
            ) : (
                <InfiniteScroll
                    dataLength={images.length}
                    next={() => setPage(page => page + 1)}
                    hasMore={true}
                    loader={
                        <Loader
                            type="Puff"
                            color="#00BFFF"
                            height={100}
                            width={100}
                        />
                    }
                >
                    <div className="image-flex">
                        {images.map((image, index) => (
                            <a
                                href={image.links?.html}
                                key={index}
                                className="image"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img
                                    src={image.urls.regular}
                                    alt={image.alt_description}
                                />
                            </a>
                        ))}
                    </div>
                </InfiniteScroll>
            )}
        </div>
    );
}
