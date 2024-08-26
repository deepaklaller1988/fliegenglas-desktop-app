"use client";
import React from 'react';
import PageContent from '@components/PageContent';
import useTitle from '@hooks/useTitle';

const AboutUsPage: React.FC = () => {
  useTitle("Uber uns");
  return (
    <PageContent slug="uber-uns" />
  );
};

export default AboutUsPage;
