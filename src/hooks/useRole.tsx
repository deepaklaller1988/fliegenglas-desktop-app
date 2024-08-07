import { useEffect, useState } from "react";
import User from "./User";

export default function useRole() {
  const [loading, setLoading] = useState(true);
  const [roleData, setRoleData] = useState<any>({});

  useEffect(() => {
    check();
  }, []);

  async function check() {
    let userRole = await User.role();
    if(userRole){ setRoleData(userRole);}
    setLoading(false);
  }

  return [loading, roleData];
}