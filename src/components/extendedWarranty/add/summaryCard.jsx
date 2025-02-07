function SummaryCard({ price }) {
  return (
    <div className="my-5 rounded-lg bg-gradient-to-r from-[#002B85] to-[#0040C9] text-white">
      <div className="flex items-center gap-8 p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-white/20 p-4">
            <SvgIcon />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-white/80">egaranti Plus Tutarı</p>
            <p className="text-3xl font-bold">
              {price} <span className="text-base">TL</span>
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm">Bayi Komisyonu: %20</p>
          <p className="text-sm">Personel Komisyonu: %5</p>
        </div>
      </div>
    </div>
  );
}

const SvgIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="76"
    height="76"
    fill="none"
    viewBox="0 0 76 76"
  >
    <rect width="64" height="64" x="6" y="6" fill="#AAC2F7" rx="32"></rect>
    <rect
      width="64"
      height="64"
      x="6"
      y="6"
      stroke="#CCDBFA"
      strokeWidth="10.667"
      rx="32"
    ></rect>
    <path
      stroke="#0040C9"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.667"
      d="M40.04 33.136a4.667 4.667 0 1 1 1.255-6.272M30.001 48.783h3.48c.454 0 .905.054 1.345.162l3.678.893a5.7 5.7 0 0 0 2.435.057l4.066-.791a5.6 5.6 0 0 0 2.837-1.477l2.877-2.798a2.004 2.004 0 0 0 0-2.892c-.74-.72-1.911-.8-2.748-.19l-3.353 2.446c-.48.351-1.064.54-1.665.54h-3.238 2.061c1.162 0 2.102-.915 2.102-2.045v-.41c0-.937-.656-1.755-1.591-1.982l-3.18-.774a6.7 6.7 0 0 0-1.581-.189c-1.287 0-3.616 1.065-3.616 1.065l-3.909 1.635m18.667-11.367a4.667 4.667 0 1 1-9.334 0 4.667 4.667 0 0 1 9.334 0m-24 10.8V49.2c0 .747 0 1.12.145 1.405.128.251.332.455.583.583.285.145.659.145 1.405.145h1.067c.747 0 1.12 0 1.405-.145.251-.128.455-.332.583-.583.145-.285.145-.658.145-1.405v-7.733c0-.747 0-1.12-.145-1.406a1.33 1.33 0 0 0-.583-.583c-.285-.145-.658-.145-1.405-.145h-1.067c-.746 0-1.12 0-1.405.145-.25.128-.455.332-.583.583-.145.285-.145.659-.145 1.406"
    ></path>
  </svg>
);

export default SummaryCard;
