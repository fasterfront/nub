import { type SVGProps } from 'react'

export default function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 1406 444" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient
          id="nub-logo"
          x1="0"
          x2="0"
          y1="0"
          y2="100%"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#da64b0" offset="20%" />
          <stop stopColor="#bb78ed" offset="40%" />
          <stop stopColor="#869cec" offset="60%" />
          <stop stopColor="#28c0e9" offset="80%" />
        </linearGradient>
      </defs>
      <g fill="url(#nub-logo)">
        <circle r="94.58" cy="94.58" cx="165.61" />
        <circle r="72.07" cy="101.59" cx="357.76" />
        <circle r="22.51" cy="184.66" cx="289.71" />
        <circle r="71.54" cy="252.7" cx="71.54" />
        <circle r="57.03" cy="264.21" cx="215.64" />
        <circle r="51.52" cy="263.22" cx="398.79" />
        <circle r="21.01" cy="245.7" cx="316.23" />
        <circle r="63.02" cy="375.8" cx="308.22" />
        <circle r="56.52" cy="387.82" cx="147.1" />
        <path d="M1218.53 366.23c-12 25.77-48.84 26.97-62.24 1.91q-4.82-9.02-4.2-19.26c.72-11.91 8.33-24.66 20.16-29.41q.46-.19.21-.63-16.09-28.65-16.11-59.63-.07-95-.03-190 .01-3.21 1.39-7.63c3.11-9.89 10.36-17.65 20.04-20.83 21.08-6.93 41.04 9.06 41.05 30.96q0 38.73.01 77.46 0 .59.52.31c5.88-3.24 11.91-6.47 17.96-8.72 24.97-9.3 51.15-10.35 76.9-3.49 11.05 2.95 19.69 6.77 29.76 12.64 62.32 36.34 80.79 116.94 41.14 176.85-36.06 54.47-109.35 71.78-165.92 39.27q-.43-.25-.64.2zm125.16-108.61a62.47 62.47 0 00-62.47-62.47 62.47 62.47 0 00-62.47 62.47 62.47 62.47 0 0062.47 62.47 62.47 62.47 0 0062.47-62.47zM657.67 148.94q6.24-2.95 12.56-5.73c31.5-13.89 66.3-13.75 98.55-.22q5.33 2.24 13.79 7.26c37.98 22.53 61.29 62.7 61.37 106.96q.14 74.11.06 94.25c-.08 19.96-18.63 33.94-37.7 30.32q-7.77-1.48-15.04-8.27c-8.46-7.9-9.61-16.88-9.63-29.25q-.06-39.77-.06-79.54 0-13.62-1.3-19.92-4.12-20.01-20.03-34.26c-21.34-19.12-55.65-20.58-78.43-3.04-16.42 12.64-25.02 30.49-25.02 51.21q0 46.62-.04 93.25-.01 2.79-1.2 7.23c-3.76 14.06-17.39 24.1-31.94 23.14-14.48-.97-26.51-12.06-28.76-26.56q-.47-3-.47-7.4-.07-46.08.18-92.16.17-31.67 16.12-60 .08-.14-.07-.21c-12.2-6.23-19.72-17.54-20.19-31.28-.53-15.33 9.97-30.25 24.93-34.48 16.17-4.57 34.41 2.48 41.64 18.45q.21.47.68.25zM1100.94 319.89c27.8 12.71 26.39 52.13-1.38 63.8-17.54 7.37-36.85-.8-45.4-17.34q-.26-.49-.74-.22c-14.4 8.27-30.16 13.7-46.75 15.47q-45.86 4.89-84.79-20.99-6.62-4.4-16.7-13.77-12.37-11.49-22.2-29.43-15.31-27.95-15.36-59.95-.06-46.5-.06-93c0-27.33 31.45-41.37 51.9-23.65 9.34 8.1 10.56 17.55 10.57 30.67q.03 39.36.02 78.73-.01 13.64 1.25 19.92c6.3 31.53 34.67 52.17 66.51 49.65 27.19-2.15 50.16-22.44 55.69-49.17q1.28-6.18 1.3-19.91.07-42.61.05-85.24c-.01-15.1 9.19-28.2 24.11-31.72 17.43-4.12 35.03 7.49 37.87 25.6q.46 2.93.46 7.77.02 40.8-.01 81.6 0 13.95-.54 19.99c-1.63 18.48-7.7 34.85-15.94 50.79a.3.29 26.1 00.14.4z" />
      </g>
    </svg>
  )
}
