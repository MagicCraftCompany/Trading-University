// constant.ts
export const iframeData = [
  { id: 1, src: "https://player.vimeo.com/video/1049228759?h=c837653e33", title: "1 lesson" },
  { id: 2, src: "https://player.vimeo.com/video/1049420658?h=b976a2c1a0", title: "2 lesson" },
  { id: 3, src: "https://player.vimeo.com/video/1049422137?h=1a82bb8e5d", title: "3 lesson" },
  { id: 4, src: "https://player.vimeo.com/video/1049425449?h=ced0db690d", title: "4 lesson" },
  { id: 5, src: "https://player.vimeo.com/video/1049430208?h=f84978cf84", title: "5 lesson" },
  { id: 6, src: "https://player.vimeo.com/video/1050534522?h=7b4a3293cb", title: "6 lesson" },
  { id: 7, src: "https://player.vimeo.com/video/1050539920?h=a5d4efab0e", title: "7 lesson" },
  { id: 8, src: "https://player.vimeo.com/video/1050673812?h=86771e40bb", title: "8 lesson" },
  { id: 9, src: "https://player.vimeo.com/video/1050680144?h=a4d30cb92c", title: "9 lesson" },
  { id: 10, src: "https://player.vimeo.com/video/1050681821?h=c02afb5287", title: "10 lesson" },
  { id: 11, src: "https://player.vimeo.com/video/1050686017?h=6d96e223d2", title: "11 lesson" },
  { id: 12, src: "https://player.vimeo.com/video/1050693214?h=4f8f525142", title: "12 lesson" },
  { id: 13, src: "https://player.vimeo.com/video/1050695189?h=b86614c24f", title: "13 lesson" },
  { id: 14, src: "https://player.vimeo.com/video/1050698497?h=3a77a56ea9", title: "14 lesson" },
  { id: 15, src: "https://player.vimeo.com/video/1050699005?h=d804a0ee54", title: "15 lesson" },
  { id: 16, src: "https://player.vimeo.com/video/1050698136?h=f51d4b3cd0", title: "16 lesson" },
  { id: 17, src: "https://player.vimeo.com/video/1066197190?h=e76d47b4eb", title: "17 lesson" },
  // Add more iframe entries as needed
];




export const getIntroVideo = (id: number): JSX.Element => {
  const video = iframeData.find((video) => video.id === id);
  return video ? (
    <iframe
      key={video.id}
      src={video.src}
      width="100%"
      height="480"
      frameBorder="0"
      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
      title={video.title}
    ></iframe>
  ) : (
    <div>Video not available</div>
  );
};
