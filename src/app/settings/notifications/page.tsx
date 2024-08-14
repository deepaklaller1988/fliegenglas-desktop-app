import useRole from '@hooks/useRole';
import { useRouter } from 'next/navigation';
import React from 'react'

export default function Notification() {


  const router = useRouter();
  const [roleLoading, roleData] = useRole();

  if(roleLoading && !roleData.id){
    router.push('/auth/login'); 
    return null;
  }
  return (
    <div>page</div>
  )
}
