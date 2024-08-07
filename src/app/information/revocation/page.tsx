"use client";

import React from 'react';
import PageContent from '@components/PageContent';
import useTitle from '@hooks/useTitle';

const RevocationPage: React.FC = () => {
  useTitle("Widerrufsrecht"); 
  return <PageContent slug="widerrufsrecht" />;
};

export default RevocationPage;
