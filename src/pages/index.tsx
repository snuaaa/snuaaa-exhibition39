import React, { useCallback } from 'react';
import Home from 'src/components/home';
import Intro from 'src/components/intro';
import MVP from 'src/components/mvp';
import Gallery from 'src/components/gallery';
import Guestbook from 'src/components/guestbook';
import NewbieProject from 'src/components/newbieProject';
import Canvas from 'src/components/canvas';
import useScene from 'src/hooks/useScene';
import { SCENE } from 'src/recoils/scene';

const Page: React.FC = () => {
  const { scene, setScene } = useScene();

  const switchScene = useCallback(() => {
    switch (scene) {
      case SCENE.INTRO:
        return <Intro skip={() => setScene(SCENE.HOME)} />;
      case SCENE.HOME:
        return <Home />;
      case SCENE.MVP:
        return <MVP />;
      case SCENE.GALLERY:
        return <Gallery />;
      case SCENE.GUESTBOOK:
        return <Guestbook />;
      case SCENE.NEWBIE_PROJECT:
        return <NewbieProject />;
      default:
        return <Home />;
    }
  }, [scene, setScene]);

  return (
    <>
      <Canvas />
      {switchScene()}
    </>
  );
};

export default Page;
