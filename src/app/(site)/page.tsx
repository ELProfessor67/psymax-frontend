'use client'
import { useRouter } from 'next/navigation';
import React, { useCallback, useState } from 'react'
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

  const part1 = 'u' + getRandomPart(2);  // Starts with 'u' followed by 2 random digits/letters
  const part2 = getRandomPart(3);        // 3 random digits/letters
  const part3 = getRandomPart(3);        // 3 random digits/letters

  return `${part1}-${part2}-${part3}`;
}

const page = () => {
  const [room_id, setRoom_id] = useState('');
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
        <h1 className='text-black text-4xl font-semibold'>psymax</h1>
      </div>

      <div className='max-w-lg mx-auto mt-40 font-semibold'>
        <h3 className='text-3xl text-center'>Videosprechstunde</h3>
        <p className='text-xl text-center mt-5 font-semibold'>Falls Sie noch keinen Zugangscode erhalten haben kontaktieren Sie bitte Ihre Behandler:in.</p>

        <form className='mt-8' onSubmit={handleJoin}>

          <input type='text' className='px-3 py-4 border border-gray-300 rounded-md outline-none w-full placeholder:font-normal' placeholder='Wie möchten Sie sich nennen?' required value={name} onChange={(e) => setName(e.target.value)} />


          <div className='px-3 py-4 border border-gray-300 rounded-md flex items-center mt-5 '>
            <input type='text' className='outline-none w-full placeholder:font-normal' value={room_id} onChange={(e) => setRoom_id(e.target.value)} placeholder='Wie lautet Ihr Zugangscode?' required />
            <button className='text-black/80 ml-2' type='button' onClick={handleGenerate}><GrPowerReset /></button>
          </div>


          <button className='text-center w-full py-4 px-3 bg-gray-200 text-black rounded-md mt-5' type='submit'>Beitreten</button>
        </form>
      </div>
    </section>
  )
}

export default page