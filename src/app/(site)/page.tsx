import React from 'react'

const page = () => {
  return (
    <section className='p-5'>
      <div className="container mx-auto">
        <h1 className='text-black text-4xl font-semibold'>psymax</h1>
      </div>

      <div className='max-w-lg mx-auto mt-40 font-semibold'>
        <h3 className='text-3xl text-center'>Videosprechstunde</h3>
        <p className='text-xl text-center mt-5 font-semibold'>Falls Sie noch keinen Zugangscode erhalten haben kontaktieren Sie bitte Ihre Behandler:in.</p>

        <form className='mt-8'>
          <input type='text' className='px-3 py-4 border border-gray-300 rounded-md outline-none w-full placeholder:font-normal' placeholder='Wie möchten Sie sich nennen?'/>
          <input type='text' className='px-3 py-4 mt-5 border border-gray-300 rounded-md outline-none w-full placeholder:font-normal' placeholder='Wie lautet Ihr Zugangscode?'/>
          <button className='text-center w-full py-4 px-3 bg-gray-200 text-black rounded-md mt-5'>Beitreten</button>
        </form>
      </div>
    </section>
  )
}

export default page