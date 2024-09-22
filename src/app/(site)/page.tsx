'use client'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { FC, useCallback, useState } from 'react'
import { GrPowerReset } from "react-icons/gr";

function generateRandomString() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';

  // Function to generate a random part with specified length
  function getRandomPart(length: number) {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  const part2 = getRandomPart(3).toUpperCase();        
  const part3 = getRandomPart(3).toUpperCase(); 

  return `${part2}${part3}`;
}

interface Iprops 
{
  searchParams: {
  room: string
  }
}

const page:FC<Iprops> = ({searchParams}) => {
  const {room} = searchParams
  const [room_id, setRoom_id] = useState(room);
  const [name, setName] = useState('');

  const router = useRouter();
  




  const handleGenerate = useCallback(() => {
    const randomString = generateRandomString();
    setRoom_id(randomString);
  }, [])

  const handleJoin = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/f/${room_id}?name=${name}`)
  }, [router,room_id,name])

  return (
    <section className='p-5'>
      <div className="container mx-auto">
        <img src='/logo.png'/>
      </div>

      <div className='max-w-lg mx-auto mt-40 font-semibold'>
        <h3 className='text-[32px] text-center font-semibold text-black'>Videosprechstunde</h3>
        <p className='text-[18px] text-center mt-5 font-medium'>Falls Sie noch keinen Zugangscode erhalten haben kontaktieren Sie bitte Ihre Behandler:in.</p>

        <form className='mt-8' onSubmit={handleJoin}>

          <input type='text' className='px-3 py-4 border border-gray-300 text-[16px] font-normal rounded-md outline-none w-full placeholder:font-normal placeholder:text-[16px]' placeholder='Wie möchten Sie sich nennen?' required value={name} onChange={(e) => setName(e.target.value)} />


          <div className='px-3 py-4 border border-gray-300 rounded-md flex items-center mt-5 '>
            <input type='text' className='outline-none w-full font-normal text-black placeholder:font-normal text-[16px]  placeholder:text-[16px]' maxLength={6} value={room_id} onChange={(e) => setRoom_id(e.target.value)} placeholder='Wie lautet Ihr Zugangscode?' required />
            <button className='text-black/80 ml-2' type='button' onClick={handleGenerate}><GrPowerReset /></button>
          </div>


          <button className='text-center w-full py-4 px-3 bg-gray-200 text-black text-[16px] font-medium rounded-md mt-5' type='submit'>Beitreten</button>
        </form>
      </div>
    </section>
  )
}

export default page