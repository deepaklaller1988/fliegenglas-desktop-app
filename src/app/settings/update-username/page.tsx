
"use client"
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import useTitle from "@hooks/useTitle";
import API from "@lib/API";
import { useUser } from "context/UserContext";
import Form from "@components/Form";
import { toasterSuccess } from "@components/core/Toaster";
import { useRouter } from "next/navigation";
import useRole from "@hooks/useRole";

export default function UpdateUsername() {
  useTitle("Update Profile");
  const { user} : any = useUser();
  const router = useRouter();

  const [name,setName] = useState<string>("");
  const [roleLoading, roleData] = useRole();
  
  const mutation = useMutation({
    mutationFn: async () => {
        if(user){
      const response = await API.post(`changeUsername/?&userid=${user.id}&username=${user.username}&first_name=${name}
      &last_name=${user.last_name}&time=${new Date().toString()}`, {
        username: user.username,
        userid: user.id,
        first_name: name,
        last_name: user.last_name,
        time: new Date().toString()
      });
      return response.data;

    }
    },
    onSuccess: () => {
      toasterSuccess("Update Username SucessFully !",1000,"id")
      setName("");
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });

  const handleSubmit = () => {
    if (name) {
      mutation.mutate();
    } else {
      console.error("Username is required");
    }
  };


  if(roleLoading && !roleData.id){
    router.push('/auth/login'); 
    return null;
  }

  return (
    <Form
      title="Dein Name"
      label="Hast Du einen neuen Namen? Gib ihn hier ein:"
      placeholder="Enter new Name"
      value={name}
      isPending={mutation.isPending}
      onChange={(e:any) => setName(e.target.value)}
      onSubmit={handleSubmit}
      buttonText="Speichern"
      type="email"
      additionalContent={
        <div>
          <h1 className="text-white mb-4">{user?.first_name}</h1>
        </div>
      }
    />
  );
}
