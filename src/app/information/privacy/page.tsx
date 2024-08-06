"use client";

import React from 'react';
import PageContent from '@components/PageContent';
import useTitle from '@hooks/useTitle';

const PrivacyPage: React.FC = () => {
  useTitle("Datenschutzerklärung"); 

  return <PageContent slug="datenschutzerklarung" />;
};

export default PrivacyPage;
