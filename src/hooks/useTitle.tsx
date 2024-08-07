import { useEffect } from "react";

export default function useTitle(title: string, ignore: boolean = false) {
  useEffect(() => {
    if (ignore) document.title = title;
    else document.title = "Fliegenglas | " + title;
  }, [title]);

  return <></>;
}