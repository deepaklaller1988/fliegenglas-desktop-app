import { useEffect, useState } from "react";
import User from "./User";

export default function useRole() {
  const [loading, setLoading] = useState(true);
  const [roleData, setRoleData] = useState<any>({});
  let userRole =  User.role();

  useEffect(() => {
    check();
  }, []);

  async function check() {
    if(userRole){ 
      setRoleData(userRole);}
    setLoading(false);
  }

  return [loading, roleData];
}