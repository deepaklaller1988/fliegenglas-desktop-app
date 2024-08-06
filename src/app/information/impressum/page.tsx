"use client";

import React from 'react';
import PageContent from '@components/PageContent';
import useTitle from '@hooks/useTitle';

const FAQPage: React.FC = () => {
  useTitle("Impressum"); 

  return <PageContent slug="impressum" />;
};

export default FAQPage;
