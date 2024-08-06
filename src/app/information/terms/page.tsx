"use client";

import React from 'react';
import PageContent from '@components/PageContent';
import useTitle from '@hooks/useTitle';

const TermsPage: React.FC = () => {
  useTitle("Nutzungsbedingungen"); 

  return <PageContent slug="nutzungsbedingungen-agb" />;
};

export default TermsPage;
