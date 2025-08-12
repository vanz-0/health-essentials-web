import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

export type NewArrival = {
  id: string;
  name: string;
  price: number;
  image: string;
};

export default function NewArrivals({ items }: { items: NewArrival[] }) {
  const { addItem } = useCart();
  return (
    <section className="container mt-16" aria-labelledby="arrivals-heading">
      <div className="flex items-center justify-between">
        <h2 id="arrivals-heading" className="font-serifDisplay text-2xl md:text-3xl font-semibold">New Arrivals</h2>
      </div>
      <div className="relative mt-6">
        <Carousel opts={{ align: "start", loop: true }}>
          <CarouselContent>
            {items.map((item) => (
              <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="rounded-lg border p-3">
                  <img src={item.image} alt={`${item.name} new arrival - 1Health Essentials`} className="h-56 w-full object-cover rounded" loading="lazy" />
                  <div className="mt-3 flex items-start justify-between">
                    <div>
                      <h3 className="font-medium leading-tight">{item.name}</h3>
                      <div className="font-semibold">KES {item.price.toLocaleString()}</div>
                    </div>
                    <Button onClick={() => addItem({ id: item.id, name: item.name, price: item.price, image: item.image })}>Add</Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
