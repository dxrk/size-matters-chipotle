import L from "leaflet";

const GreenIcon = L.icon({
  iconUrl:
    "https://upload.wikimedia.org/wikipedia/commons/2/2d/Basic_green_dot.png",
  iconSize: [15, 15],
});

const GreyIcon = L.icon({
  iconUrl:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Location_dot_grey.svg/1200px-Location_dot_grey.svg.png",
  iconSize: [15, 15],
});

const RedIcon = L.icon({
  iconUrl:
    "https://upload.wikimedia.org/wikipedia/commons/9/92/Location_dot_red.svg",
  iconSize: [15, 15],
});

const YellowIcon = L.icon({
  iconUrl:
    "https://upload.wikimedia.org/wikipedia/commons/7/7c/GAudit_YellowDot.png",
  iconSize: [15, 15],
});

const BlueIcon = L.icon({
  iconUrl:
    "https://upload.wikimedia.org/wikipedia/commons/3/35/Location_dot_blue.svg",
  iconSize: [15, 15],
});

const LocationMarkerIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/75/75519.png",
  iconSize: [15, 15],
});

const LocateSVG = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={800}
    height={800}
    viewBox="0 0 24 24"
    fill="white"
    {...props}
  >
    <circle cx={12} cy={12} r={4} />
    <path d="M13 4.069V2h-2v2.069A8.01 8.01 0 0 0 4.069 11H2v2h2.069A8.008 8.008 0 0 0 11 19.931V22h2v-2.069A8.007 8.007 0 0 0 19.931 13H22v-2h-2.069A8.008 8.008 0 0 0 13 4.069zM12 18c-3.309 0-6-2.691-6-6s2.691-6 6-6 6 2.691 6 6-2.691 6-6 6z" />
  </svg>
);

const DownArrow = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={800}
    height={800}
    viewBox="0 0 330 330"
    {...props}
  >
    <path d="M325.607 79.393c-5.857-5.857-15.355-5.858-21.213.001l-139.39 139.393L25.607 79.393c-5.857-5.857-15.355-5.858-21.213.001-5.858 5.858-5.858 15.355 0 21.213l150.004 150a14.999 14.999 0 0 0 21.212-.001l149.996-150c5.859-5.857 5.859-15.355.001-21.213z" />
  </svg>
);

const UpArrow = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={800}
    height={800}
    viewBox="0 0 330 330"
    {...props}
  >
    <path d="m325.606 229.393-150.004-150a14.997 14.997 0 0 0-21.213.001l-149.996 150c-5.858 5.858-5.858 15.355 0 21.213 5.857 5.857 15.355 5.858 21.213 0l139.39-139.393 139.397 139.393A14.953 14.953 0 0 0 315 255a14.95 14.95 0 0 0 10.607-4.394c5.857-5.858 5.857-15.355-.001-21.213z" />
  </svg>
);

export {
  GreenIcon as greenIcon,
  GreyIcon as greyIcon,
  RedIcon as redIcon,
  YellowIcon as yellowIcon,
  BlueIcon as blueIcon,
  LocationMarkerIcon as currentLocationIcon,
  LocateSVG,
  DownArrow,
  UpArrow,
};
