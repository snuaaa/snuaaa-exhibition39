import type { NextPage } from 'next';
import { useState } from 'react';
import Head from 'next/head';
import Home from 'src/components/home';
import Intro from 'src/components/intro';

const Index: NextPage = () => {
  const [skipIntro, setSkipIntro] = useState<boolean>(false);

  return (
    <>
      <Head>
        <title>For The Starved</title>
        <meta name="description" content="서울대학교 아마추어 천문회 제39회 천체사진전" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {
        skipIntro
          ? <Home />
          : <Intro skip={() => setSkipIntro(true)} />
      }
    </>
  );
};

export default Index;
