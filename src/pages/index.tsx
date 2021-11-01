// import type { NextPage } from 'next';
// import Head from 'next/head';
import React from 'react';
import Home from 'src/components/home';
import Intro from 'src/components/intro';
import useScene from 'src/hooks/useScene';
import { SCENE } from 'src/recoils/scene';

const Page = () => {
  const { scene, setScene } = useScene();

  return (
    <>
      {/* <Head>
        <title>For The Starved</title>
        <meta name="description" content="서울대학교 아마추어 천문회 제39회 천체사진전" />
        <link rel="icon" href="/favicon.ico" />
      </Head> */}
      {
        scene === SCENE.INTRO && <Intro skip={() => setScene(SCENE.HOME)} />
      }
      <Home />
    </>
  );
};

export default Page;
