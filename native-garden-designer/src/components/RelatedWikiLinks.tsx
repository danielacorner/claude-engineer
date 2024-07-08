import { useEffect, useState } from "react";
import { PlantData } from "../types";

export const RelatedWikiLinks = ({ plant }: { plant: PlantData }) => {
  const [wikiResponse, setWikiResponse] = useState<
    {
      pageid: number;
      ns: number;
      title: string;
      imagerepository: string;
      thumbnail: string;
      imageinfo: {
        url: string;
      }[];
    }[]
  >([]);

  useEffect(() => {
    fetch(
      `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${plant.name}&prop=imageinfo&iiprop=url&format=json&origin=*`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.query && data.query.pages) {
          setWikiResponse(Object.values(data.query.pages));
        } else {
          setWikiResponse([]);
        }
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [plant.name]);

  return (
    <>
      {/* for each result in the wiki api response, render a link to that wiki page */}
      {wikiResponse.map((result) => (
        <a
          key={result.title}
          href={`https://en.wikipedia.org/wiki/${result.title.replace(
            / /g,
            "_"
          )}`}
          target="_blank"
          rel="noreferrer"
        >
          {result.title}
        </a>
      ))}
    </>
  );
};
