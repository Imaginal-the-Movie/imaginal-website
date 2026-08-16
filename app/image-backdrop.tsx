import Image from "next/image";

export function ImageBackdrop() {
  return (
    <div className="imageBackdrop" aria-hidden="true">
      <Image
        src="/imaginal-background.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
      />
    </div>
  );
}
