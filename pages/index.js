import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Feed from '../components/feed';
import Header from '../components/header';
import ScrollTopButton from '../components/shared/ScrollTopButton';
import useScroll from '../hooks/useScroll';
import Modal from '../components/Modal';

export default function Home() {
  const { elementRef: pageRef, visible, scrollToTop } = useScroll();
  return (
    <div
      className='bg-gray-50 h-screen overflow-y-scroll scrollbar-hide relative'
      ref={pageRef}>
      <Head>
        <title>Social Mixer Inc.</title>
      </Head>
      <Header />
      <Feed />
      <ScrollTopButton visible={visible} scrollToTop={scrollToTop} />
      <Modal />
    </div>
  );
}
