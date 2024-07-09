import { useState, useEffect } from "react";

function WikiImage({
  imageTitle,
  style,
}: {
  imageTitle: string;
  style?: React.CSSProperties;
}) {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    fetch(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=images&titles=${encodeURIComponent(
        imageTitle
      )}&origin=*`
    )
      .then((response) => response.json())
      .then((data) => {
        const pages = data?.query?.pages ?? {};
        const pageId = Object.keys(pages)?.[0];
        const imageFileName = pages[pageId]?.images?.[0]?.title?.replace(
          "File:",
          ""
        );
        const baseUrl = "https://commons.wikimedia.org/wiki/Special:FilePath/";
        setImageUrl(baseUrl + encodeURIComponent(imageFileName));
      })
      .catch((error) => console.error("Error:", error));
  }, [imageTitle]);

  return (
    <div>
      {imageUrl && (
        <img src={imageUrl} alt="Wikipedia image" style={style ?? {}} />
      )}
    </div>
  );
}

export default WikiImage;
