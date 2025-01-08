import {type MetaFunction} from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
};

export default function Homepage() {
  return (
    // <div className="home">
    //   <FeaturedCollection collection={data.featuredCollection} />
    //   <RecommendedProducts products={data.recommendedProducts} />
    // </div>
    <div>
      <h1>Welcome to Remix</h1>
      <ul>
        <li className="bg-green-400">
          <a
            target="_blank"
            href="https://flowbite.com/getting-started/remix/"
            rel="noreferrer"
            className="text-lg text-red-600 hover:underline"
          >
            Flowbite + Remix + Tailwind CSS Tutorial
          </a>
        </li>
      </ul>
    </div>
  );
}