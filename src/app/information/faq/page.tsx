"use client";
import PageContent from '@components/PageContent';
import useTitle from '@hooks/useTitle';
import React from 'react';

const FAQPage: React.FC = () => {
  useTitle("FAQ");
  return <PageContent slug="faq" />;
};

export default FAQPage;
