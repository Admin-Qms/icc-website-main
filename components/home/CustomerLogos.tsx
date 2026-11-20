import Image from "next/image";

// Customer logos as supplied by the owner, cut out to transparent, trimmed PNGs.
const CUSTOMERS: { name: string; file: string; width: number; height: number }[] = [
  { name: "Innovative Testing Solutions Inc.", file: "innovative-testing-solutions.png", width: 296, height: 74 },
  { name: "Innovue", file: "innovue.png", width: 295, height: 89 },
  { name: "T Engineering", file: "t-engineering.png", width: 390, height: 63 },
  { name: "Axios Research", file: "axios-research.png", width: 187, height: 82 },
  { name: "Forge Automation", file: "forge-automation.png", width: 461, height: 63 },
  { name: "Fortran", file: "fortran.png", width: 369, height: 56 },
  { name: "PMC Welding and Fabricating Inc.", file: "pmc-welding-fabricating.png", width: 463, height: 80 },
  { name: "Accelerated Services Auto Transporters", file: "accelerated-services.png", width: 243, height: 160 },
  { name: "Unitiwall", file: "unitiwall.png", width: 226, height: 65 },
  { name: "White Cap", file: "white-cap.png", width: 527, height: 90 },
  { name: "Maverick Machine & Hydraulics", file: "maverick-machine-hydraulics.png", width: 233, height: 70 },
  { name: "Rebel Automated Systems", file: "rebel-automated-systems.png", width: 294, height: 160 },
  { name: "Körber", file: "korber.png", width: 273, height: 160 },
  { name: "NOX Metals", file: "nox-metals.png", width: 161, height: 94 },
  { name: "SST", file: "sst.png", width: 510, height: 160 },
  { name: "Langford", file: "langford.png", width: 640, height: 139 },
  { name: "Plumage", file: "plumage.png", width: 393, height: 122 },
];

// Give every logo about the same area, so a wide wordmark and a stacked mark carry
// equal weight in the row: height falls as the logo gets wider.
function displayHeight(width: number, height: number) {
  return Math.round(Math.min(56, Math.max(24, 68 / Math.sqrt(width / height))));
}

function Track({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-14 pr-14 sm:gap-20 sm:pr-20">
      {CUSTOMERS.map((c) => {
        const h = displayHeight(c.width, c.height);
        return (
          <li key={c.file} className="shrink-0">
            <Image
              src={`/images/customers/${c.file}`}
              alt={hidden ? "" : c.name}
              width={c.width}
              height={c.height}
              sizes="200px"
              style={{ height: h, width: Math.round((h * c.width) / c.height) }}            />
          </li>
        );
      })}
    </ul>
  );
}

/** Scrolling row of customer logos. The second track is a silent copy for a seamless loop. */
export function CustomerLogos() {
  return (
    <section aria-labelledby="customers-heading" className="border-b border-slate-200 bg-white py-12 lg:py-14">
      <h2 id="customers-heading" className="container-page text-center text-sm font-medium text-slate-500">
        Trusted by quality teams at
      </h2>
      <div className="mask-fade-x mt-8 overflow-hidden motion-reduce:overflow-x-auto">
        <div className="flex w-max animate-marquee items-center hover:[animation-play-state:paused]">
          <Track />
          <Track hidden />
        </div>
      </div>
    </section>
  );
}
