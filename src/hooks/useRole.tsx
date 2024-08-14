import { useUser } from "context/UserContext";
import { useEffect, useState } from "react";

export default function useRole() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [roleData, setRoleData] = useState<any>({});

  console.log(roleData);

  useEffect(() => {
    async function check() {
      if (user) {
        setRoleData(user);
      }
      setLoading(false);
    }

    check();
  }, [user]);

  return [loading, roleData];
}
