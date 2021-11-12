// import type { NextPage } from 'next';
// import Head from 'next/head';
import React, { useCallback } from 'react';
import Home from 'src/components/home';
import Intro from 'src/components/intro';
import MVP from 'src/components/mvp';
import Gallery from 'src/components/gallery';
import Canvas from 'src/components/canvas';
import useScene from 'src/hooks/useScene';
import { SCENE } from 'src/recoils/scene';

const Page = () => {
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
