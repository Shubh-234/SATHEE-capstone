"use client"
import ElderlyPage from "@/screen/ElderlyPage";
import { useSearchParams } from "next/navigation";

export default function Page() {

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  
    return (
     
      <ElderlyPage id={id}/>
    );
  }