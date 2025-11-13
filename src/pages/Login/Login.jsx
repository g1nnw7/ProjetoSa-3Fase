import fundo from '../../../public/img/login.jpg'
import LoginForm from "../../components/LoginForm/LoginForm";

export default function Login(){
    return(
        <>
         <div className='flex h-screen bg-gray-100'>
                <div className='flex h-screen bg-gray-100'>
                    <img src={fundo} alt='NutriFit'/>
                </div>
                <div className='flex w-full md:w-1/2 items-center justify-center p-8'>
                    <LoginForm />
                </div>
            </div>
        </>
    )
}