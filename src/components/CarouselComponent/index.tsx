 
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import useNavigation from "@/hooks/useNavigation";

type Props = {
  carouselItem: ({
    item,
    index,
    onClick
  }: {
    item: any;
    index: number;
    onClick: (route: string, options: { state: any }) => void;
  }) => React.ReactNode;
  data: any[];
};

export function CarouselComponent({ carouselItem, data }: Props) {
  const { goto } = useNavigation();
  const plugin = React.useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));

  return (
    <Carousel
      opts={{
        align: "center",
        loop: true
      }}
      plugins={[plugin.current]}
      className="w-full "
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent className="">
        {data?.map((item, index) => (
          <CarouselItem key={index}>
            <div className=" mx-auto">{carouselItem({ item, index, onClick: goto })}</div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

export default CarouselComponent;
