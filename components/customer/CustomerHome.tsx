import Image from 'next/image'


const CustomerHome = () => {
  return (
    <main className="min-h-screen">
      <section className="relative h-[90vh] w-full">
        <Image
          src="/hero.jpg"
          alt="GearUp hero"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </section>
    </main>
  )
}

export default CustomerHome