import Image from "next/image";
import { WATERMARK_CONFIG } from "@/lib/config";

export default function Watermark() {
  return (
    <div
      aria-hidden="true"
      className="watermark-container pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden print:hidden select-none"
      style={{
        opacity: WATERMARK_CONFIG.opacity,
        mixBlendMode: WATERMARK_CONFIG.mixBlendMode || "multiply",
      }}
    >
      <div className="relative w-[85vw] max-w-[720px] aspect-square transform scale-105 transition-transform duration-700">
        <Image
          src={WATERMARK_CONFIG.src}
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 85vw, 720px"
          className="object-contain filter grayscale contrast-125"
        />
      </div>
    </div>
  );
}

