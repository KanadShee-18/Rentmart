import { Footer } from "@/components/common/footer";
import { Category } from "@/components/features/landing/category";
import { RecentItems } from "@/components/features/landing/recent-items";
import { TopPicks } from "@/components/features/landing/top-picks";
import Image from "next/image";

export default function Page() {
  return (
    <div className='w-full min-h-screen max-w-7xl mx-auto flex px-5 md:px-10 flex-col gap-y-6 pt-20 lg:pt-32 justify-center'>
      <h1 className='text-4xl md:text-5xl lg:text-6xl text-shadow-2xs max-w-xl font-bold tracking-tight text-neutral-800 dark:text-neutral-200'>
        Give what you have. <br /> Get what you need.
      </h1>
      <p className='text-muted-foreground text-sm font-medium text-shadow-2xs'>
        We make renting simple, secure, and stress-free—for everyone.
      </p>
      <div className='pb-20 border-b'>
        <Image
          src={"/core/rentmart-hero.png"}
          alt='Renting'
          width={500}
          height={200}
          className='aspect-video mx-auto max-w-5xl w-full h-auto dark:mask-t-from-0% mask-t-from-50%'
          unoptimized
        />
      </div>
      <Category />
      <RecentItems />
      <TopPicks />
      <Footer />
    </div>
  );
}
