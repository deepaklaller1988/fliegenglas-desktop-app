"use client";

import { useRouter } from "next/router";
import React from "react";

const DeleteConfirmation: React.FC = () => {
  const router = useRouter();

  return (
    <div>
      <div className="header">
        <a
          onClick={() => router.push("/auth/login")}
          style={{ cursor: "pointer" }}
        >
          <div className="left-set-arrow"></div>
        </a>
      </div>
      <div className="confirmation">
        <img src="/assets/images/icon-check.svg" alt="Check Icon" />
        <p>Ihr Konto wurde erfolgreich gelöscht.</p>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
