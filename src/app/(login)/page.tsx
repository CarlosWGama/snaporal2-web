import { Metadata } from "next";
import Image from "next/image";
import LoginForm from "./_form";

// ===============================================
export const metadata: Metadata = {
  title: 'Login',
};
// ===============================================
export default function Page() {

    return (<div className="flex h-screen">
        {/* ESQUERDA */}
        <div className="flex-1 justify-center items-center bg-(--background-secondary) hidden lg:flex">
            <Image src="/assets/img/logo.png" alt="logo-login" width={300} height={300}/>
        </div>

        {/* DIREITA */}
        <div className="flex flex-1 justify-center items-center bg-(--background-primary) flex-col">
            <LoginForm/>
        </div>    
    </div>)

}